// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --------------------
// Config
// --------------------
const isCI = process.env.CI === 'true';
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'sense-telecso';
const MONGO_URI = process.env.MONGO_URI;
// --------------------
// MongoDB Connection
// --------------------
const connectDB = async () => {
  if (isCI) {
    console.log('CI mode: skipping MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// --------------------
// Mongoose Models
// --------------------
const { Schema } = mongoose;

const SensorDataSchema = new Schema({
  id: String, // deviceId
  packet_number: Number,
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  humidity: Number,
  door_status: Number,
  power_status: Number,
  time_received: { type: Date, default: Date.now },
});
const SensorData = mongoose.models.SensorData || mongoose.model('SensorData', SensorDataSchema);

const OrganizationSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
const Organization = mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member',
  },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const DeviceSchema = new Schema({
  deviceId: { type: String, required: true },
  deviceName: { type: String },
  location: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  createdAt: { type: Date, default: Date.now },
});
const Device = mongoose.models.Device || mongoose.model('Device', DeviceSchema);

// --------------------
// Auth Middleware
// --------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token not provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --------------------
// Express App
// --------------------
const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to Mongo
connectDB();

// ======================================================
// SENSOR INGEST ENDPOINT (AUTO-CREATE DEVICES)
// ======================================================
app.post('/api/sensors', async (req, res) => {
  try {
    const raw = req.body;

    // Normalize fields from ESP32
    const data = {
      deviceId: raw.id?.toString(),
      packet_number: raw.packet_number,
      temperature: raw.temperatura ?? raw.temperature,
      humidity: raw.humedad ?? raw.humidity,
      door_status: raw.puerta ?? raw.door,
      power_status: raw.voltage ?? raw.power_status,
      timestamp: raw.timestamp ? new Date(raw.timestamp * 1000) : new Date(),
      time_received: new Date(),
    };

    if (!data.deviceId) {
      return res.status(400).json({ error: "Missing deviceId" });
    }

    // AUTO-CREATE DEVICE IF NOT FOUND
    let device = await Device.findOne({ deviceId: data.deviceId });

    if (!device) {
      device = await Device.create({
        deviceId: data.deviceId,
        deviceName: `Device ${data.deviceId}`,
        location: "Unassigned",
        owner: null,
        organization: null,
      });
    }

    // Store sensor reading
    await SensorData.create({
      id: data.deviceId,
      packet_number: data.packet_number,
      timestamp: data.timestamp,
      temperature: data.temperature,
      humidity: data.humidity,
      door_status: data.door_status,
      power_status: data.power_status,
      time_received: data.time_received,
    });

    res.status(201).json({ message: "Sensor data stored" });

  } catch (err) {
    console.error("Sensor ingest error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// SENSOR HISTORY ENDPOINTS
// ======================================================

// History for ONE device
app.get('/api/sensors/:deviceId/history', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    const query = { id: deviceId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const history = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// History for ALL devices
app.get('/api/sensors/history/all', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const history = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// AUTH ROUTES
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await User.findById(req.user.userId).select('-password');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// ORGANIZATION ROUTES
// ======================================================
app.post('/api/orgs', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: 'Organization name required' });

    const user = await User.findById(req.user.userId);

    if (user.organization) {
      return res.status(400).json({ error: 'User already in organization' });
    }

    const org = await Organization.create({
      name: name.trim(),
      createdBy: user._id,
    });

    user.organization = org._id;
    user.role = 'owner';
    await user.save();

    res.status(201).json({ message: 'Organization created', organization: org });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orgs/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('organization')
      .select('-password');

    if (!user.organization) {
      return res.status(404).json({ error: 'User not in an organization' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      organization: user.organization,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// DEVICE ROUTES
// ======================================================

// Create device manually
app.post('/api/devices', authenticateToken, async (req, res) => {
  try {
    const { deviceId, deviceName, location } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId required' });
    }

    const user = await User.findById(req.user.userId);

    const device = await Device.create({
      deviceId,
      deviceName: deviceName || "",
      location: location || "",
      owner: user._id,
      organization: user.organization || null,
    });

    res.status(201).json({ message: "Device created", device });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Device ID already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET devices (now with latest sensor reading)
app.get('/api/devices', authenticateToken, async (req, res) => {
  try {
    const devices = await Device.find().lean();

    const enriched = await Promise.all(
      devices.map(async (dev) => {
        const latest = await SensorData.findOne({ id: dev.deviceId })
          .sort({ timestamp: -1 })
          .lean();

        const online = latest
          ? (Date.now() - new Date(latest.timestamp).getTime()) < 60_000
          : false;

        return {
          _id: dev._id,
          id: dev.deviceId,
          deviceName: dev.deviceName,
          location: dev.location,
          temperature: latest?.temperature ?? null,
          humidity: latest?.humidity ?? null,
          door: latest?.door_status ?? null,
          voltage: latest?.power_status ?? null,
          packet_number: latest?.packet_number ?? null,
          timestamp: latest?.timestamp ?? null,
          online,
        };
      })
    );

    res.json(enriched);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single device
app.get('/api/devices/:id', authenticateToken, async (req, res) => {
  try {
    const dev = await Device.findById(req.params.id).lean();
    if (!dev) return res.status(404).json({ error: "Device not found" });
    res.json(dev);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update device config
app.put('/api/devices/:id/config', authenticateToken, async (req, res) => {
  try {
    const { deviceName, location } = req.body;

    const updated = await Device.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...(deviceName !== undefined && { deviceName }),
        ...(location !== undefined && { location }),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Configuration updated', device: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// FRONTEND FALLBACK
// ======================================================
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  } else {
    next();
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Data + Web server online' });
});

// --------------------
// Start Server
// --------------------
if (isCI) {
  console.log('CI mode: backend startup successful');
  process.exit(0);
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
