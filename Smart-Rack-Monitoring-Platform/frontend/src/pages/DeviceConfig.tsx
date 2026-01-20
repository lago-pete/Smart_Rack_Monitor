import { useEffect, useState } from 'react';
import { Settings, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDevices, getDeviceById, updateDeviceConfig } from '../lib/api';
import { SensorData } from '../types';

// ============ MOCK DATA ============
const USE_MOCK_DATA = true; // ← Change to false when API is ready

const mockDevices: SensorData[] = [
  {
    _id: "config-mock1",
    id: "device1",
    deviceName: "Lab Sensor A",
    location: "Room 101",
    packet_number: 1,
    timestamp: new Date().toISOString(),
    temperature: 25.5,
    humidity: 55,
    door: 0,
    voltage: 5.0,
  },
  {
    _id: "config-mock2",
    id: "device2",
    deviceName: "Lab Sensor B",
    location: "Room 202",
    packet_number: 2,
    timestamp: new Date().toISOString(),
    temperature: 28,
    humidity: 60,
    door: 0,
    voltage: 5.0,
  },
  {
    _id: "config-mock3",
    id: "device3",
    deviceName: "Storage Monitor",
    location: "Warehouse A",
    packet_number: 3,
    timestamp: new Date().toISOString(),
    temperature: 22,
    humidity: 50,
    door: 1,
    voltage: 5.0,
  },
];

export default function DeviceConfig() {
  const { t } = useTranslation();
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [firmware, setFirmware] = useState<File | null>(null);
  const [devices, setDevices] = useState<SensorData[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch all devices on page load
  useEffect(() => {
    const fetchDevices = async () => {
      if (USE_MOCK_DATA) {
        // Mock data version
        setDevices(mockDevices);
      } else {
        // Real API version
        try {
          const response = await getDevices();
          setDevices(response.data);
        } catch (error) {
          console.error('Error fetching devices:', error);
          setDevices([]);
        }
      }
    };

    fetchDevices();
  }, []);

  // Fetch device config when user selects a device
  useEffect(() => {
    if (!selectedDevice) return;

    const fetchDeviceConfig = async () => {
      setLoading(true);
      
      if (USE_MOCK_DATA) {
        // Mock data version
        const device = mockDevices.find(d => d._id === selectedDevice);
        if (device) {
          setDeviceId(device.id);
          setDeviceName(device.deviceName);
          setLocation(device.location);
        }
        setLoading(false);
      } else {
        // Real API version
        try {
          const response = await getDeviceById(selectedDevice);
          const data = response.data;
          
          setDeviceId(data.deviceId || data.id || '');
          setDeviceName(data.deviceName || '');
          setLocation(data.location || '');
        } catch (error) {
          console.error('Error fetching device config:', error);
          setMessage('Failed to load device configuration');
          setIsSuccess(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDeviceConfig();
  }, [selectedDevice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDevice) {
      setMessage('Please select a device');
      setIsSuccess(false);
      return;
    }

    if (USE_MOCK_DATA) {
      // Mock data version - simulate save
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Update mock device in the array
        const deviceIndex = mockDevices.findIndex(d => d._id === selectedDevice);
        if (deviceIndex !== -1) {
          mockDevices[deviceIndex].deviceName = deviceName;
          mockDevices[deviceIndex].location = location;
        }
        
        setMessage('Configuration updated successfully! (Mock data)');
        setIsSuccess(true);
        setLoading(false);
        
        console.log('Mock device updated:', {
          deviceId: selectedDevice,
          deviceName,
          location,
        });
      }, 500);
    } else {
      // Real API version
      try {
        const response = await updateDeviceConfig(selectedDevice, {
          deviceName,
          location,
        });
        
        setMessage(response.data.message || 'Configuration has been updated.');
        setIsSuccess(true);
      } catch (error) {
        console.error('Error updating device config:', error);
        setMessage('Error saving configuration.');
        setIsSuccess(false);
      }
    }
  };

  const handleFirmwareUpload = () => {
    if (!firmware) {
      setMessage('Please select a firmware file first');
      setIsSuccess(false);
      return;
    }

    if (USE_MOCK_DATA) {
      // Mock firmware upload
      setMessage(`Firmware upload simulated: ${firmware.name} (Mock mode - no actual upload)`);
      setIsSuccess(true);
      console.log('Mock firmware upload:', firmware.name);
    } else {
      // Real firmware upload would go here
      setMessage('Firmware upload feature coming soon!');
      setIsSuccess(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('deviceConfig.title')}</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Device Selection Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Device
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => {
              setSelectedDevice(e.target.value);
              setMessage('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          >
            <option value="">Select a device...</option>
            {devices.map((device) => (
              <option key={device._id} value={device._id}>
                {device.deviceName} - {device.location}
              </option>
            ))}
          </select>
          {USE_MOCK_DATA && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Using mock data - switch USE_MOCK_DATA to false when API is ready
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-100 p-3 rounded-full">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t('deviceConfig.deviceParams')}</h2>
            <p className="text-gray-600">{t('deviceConfig.configureParams')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('deviceConfig.deviceId')}
            </label>
            <input
              type="text"
              value={deviceId}
              readOnly
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed px-3 py-2 border"
            />
            <p className="text-xs text-gray-500 mt-1">Hardware ID (read-only)</p>
          </div>

          {/* Device Name (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('deviceConfig.deviceName')}
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              disabled={!selectedDevice || loading}
              placeholder="e.g., Lab Sensor A"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Location (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('deviceConfig.location')}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={!selectedDevice || loading}
              placeholder="e.g., Room 101"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Firmware Upload Section */}
          <div className="pt-6 border-t">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{t('deviceConfig.otaUpdate')}</h3>
                <p className="text-gray-600">{t('deviceConfig.updateFirmware')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('deviceConfig.firmwareFile')}
              </label>
              <input
                type="file"
                onChange={(e) => setFirmware(e.target.files?.[0] || null)}
                disabled={!selectedDevice}
                accept=".bin,.hex,.elf"
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: .bin, .hex, .elf {firmware && `(Selected: ${firmware.name})`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              disabled={!selectedDevice || !firmware}
              onClick={handleFirmwareUpload}
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('deviceConfig.updateFirmwareButton')}
            </button>
            <button
              type="submit"
              disabled={!selectedDevice || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : t('deviceConfig.saveConfig')}
            </button>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-3 rounded-md ${
                isSuccess
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}