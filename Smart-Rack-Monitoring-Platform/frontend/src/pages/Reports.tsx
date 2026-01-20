import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { SensorData } from "../types";
import { getDevices } from "../lib/api";

// ============ MOCK DATA ============
const USE_MOCK_DATA = true; // ← Change to false when API is ready

const mockDevices: SensorData[] = [
  {
    _id: "report-mock1",
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
    _id: "report-mock2",
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
    _id: "report-mock3",
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

const mockHistoricalData: SensorData[] = [
  {
    _id: "history-1",
    id: "device1",
    deviceName: "Lab Sensor A",
    location: "Room 101",
    packet_number: 1,
    timestamp: "2025-11-20T08:00:00.000Z",
    temperature: 23.5,
    humidity: 52,
    door: 0,
  },
  {
    _id: "history-2",
    id: "device1",
    deviceName: "Lab Sensor A",
    location: "Room 101",
    packet_number: 2,
    timestamp: "2025-11-21T10:30:00.000Z",
    temperature: 24.2,
    humidity: 55,
    door: 0,
  },
  {
    _id: "history-3",
    id: "device1",
    deviceName: "Lab Sensor A",
    location: "Room 101",
    packet_number: 3,
    timestamp: "2025-11-22T14:15:00.000Z",
    temperature: 25.8,
    humidity: 58,
    door: 1,
  },
  {
    _id: "history-4",
    id: "device2",
    deviceName: "Lab Sensor B",
    location: "Room 202",
    packet_number: 1,
    timestamp: "2025-11-20T09:00:00.000Z",
    temperature: 27.5,
    humidity: 60,
    door: 0,
  },
  {
    _id: "history-5",
    id: "device2",
    deviceName: "Lab Sensor B",
    location: "Room 202",
    packet_number: 2,
    timestamp: "2025-11-21T11:00:00.000Z",
    temperature: 28.1,
    humidity: 62,
    door: 1,
  },
  {
    _id: "history-6",
    id: "device3",
    deviceName: "Storage Monitor",
    location: "Warehouse A",
    packet_number: 1,
    timestamp: "2025-11-20T07:30:00.000Z",
    temperature: 21.5,
    humidity: 48,
    door: 0,
  },
  {
    _id: "history-7",
    id: "device3",
    deviceName: "Storage Monitor",
    location: "Warehouse A",
    packet_number: 2,
    timestamp: "2025-11-23T16:00:00.000Z",
    temperature: 22.3,
    humidity: 50,
    door: 0,
  },
];

export default function Reports() {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [devices, setDevices] = useState<SensorData[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("all");
  const [reportData, setReportData] = useState<SensorData[]>([]);

  // Load devices on mount
  useEffect(() => {
    const fetchDevices = async () => {
      if (USE_MOCK_DATA) {
        setDevices(mockDevices);
      } else {
        try {
          const response = await getDevices();
          setDevices(response.data);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      }
    };

    fetchDevices();
  }, []);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    // Check if end date is before start date
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be after start date");
      return;
    }

    if (USE_MOCK_DATA) {
      // ========== MOCK DATA VERSION ==========
      const start = new Date(startDate);
      const end = new Date(endDate);

      let filtered = mockHistoricalData.filter((reading) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= start && readingDate <= end;
      });

      if (selectedDeviceId !== "all") {
        const selectedDevice = devices.find((d) => d._id === selectedDeviceId);
        if (selectedDevice) {
          filtered = filtered.filter(
            (reading) => reading.id === selectedDevice.id
          );
        }
      }

      setReportData(filtered);

      // Alert if no data found
      if (filtered.length === 0) {
        alert(
          `No data found for the selected date range.\n\n` +
            `Test data available from: 2025-11-20 to 2025-11-23\n` +
            `You selected: ${startDate} to ${endDate}\n\n` +
            `Try selecting dates within the available range!`
        );
      } else {
        console.log(`Found ${filtered.length} records (MOCK DATA)`);
      }
    } else {
      // ========== REAL API VERSION ==========
      try {
       

        
        // const response = selectedDeviceId === "all"
        //   ? await getSensorHistoryAll(startDate, endDate)
        //   : await getSensorHistory(selectedDeviceId, startDate, endDate);
        //
        // setReportData(response.data.data);

        console.log("API version not implemented yet - waiting for backend");
        alert(
          "API endpoints not ready yet. Ask Austin about /api/sensors/:id/history"
        );
      } catch (error) {
        console.error("Error fetching report:", error);
        alert("Failed to generate report");
      }
    }
  };

  const calculateStatistics = () => {
    if (reportData.length === 0) return null;

    const temps = reportData.map((reading) => reading.temperature);
    const humids = reportData.map((reading) => reading.humidity);

    const avgTemp = (
      temps.reduce((sum, temp) => sum + temp, 0) / temps.length
    ).toFixed(1);
    const avgHumidity = (
      humids.reduce((sum, humid) => sum + humid, 0) / humids.length
    ).toFixed(1);
    const doorOpenCount = reportData.filter(
      (reading) => reading.door === 1 || reading.door === true
    ).length;

    return {
      avgTemp,
      avgHumidity,
      doorOpenCount,
    };
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Create CSV header
    const headers = [
      "Timestamp",
      "Device Name",
      "Location",
      "Temperature (°C)",
      "Humidity (%)",
      "Door Status",
    ];

    // Create CSV rows
    const rows = reportData.map((data) => [
      format(new Date(data.timestamp), "yyyy-MM-dd HH:mm:ss"),
      data.deviceName,
      data.location,
      data.temperature,
      data.humidity,
      data.door ? "Open" : "Closed",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${selectedDeviceId}_${startDate}_to_${endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    console.log(`Exported ${reportData.length} records to CSV`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("reports.title")}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Device
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="all">All Devices</option>
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.deviceName} - {device.location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("reports.startDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("reports.endDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleGenerateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {t("reports.generate")}
              </button>

              {reportData.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {reportData.length > 0 ? (
            <>
              <div className="border rounded-lg p-4 bg-green-50">
                <p className="text-green-700 font-medium">
                  ✓ Found {reportData.length} records for{" "}
                  {selectedDeviceId === "all"
                    ? "all devices"
                    : devices.find((d) => d._id === selectedDeviceId)
                        ?.deviceName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Date range: {startDate} to {endDate}
                </p>
                {USE_MOCK_DATA && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Using mock data - switch USE_MOCK_DATA to false when API
                    is ready
                  </p>
                )}
              </div>

              {/* Summary Statistics */}
              {(() => {
                const stats = calculateStatistics();
                return stats ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">
                      Summary Statistics
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <p className="text-sm text-gray-600">Avg Temperature</p>
                        <p className="text-2xl font-bold">{stats.avgTemp}°C</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-600">Avg Humidity</p>
                        <p className="text-2xl font-bold">
                          {stats.avgHumidity}%
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-600">Door Opened</p>
                        <p className="text-2xl font-bold">
                          {stats.doorOpenCount} times
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Temperature Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">
                  Temperature Over Time
                </h2>
                <LineChart width={800} height={300} data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) =>
                      format(new Date(time), "MM/dd HH:mm")
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    name="Temperature (°C)"
                  />
                </LineChart>
              </div>

              {/* Humidity Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Humidity Over Time</h2>
                <LineChart width={800} height={300} data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) =>
                      format(new Date(time), "MM/dd HH:mm")
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    name="Humidity (%)"
                  />
                </LineChart>
              </div>

              {/* Data Table */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Detailed Data</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Device
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Temperature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Humidity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Door
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.map((data, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(
                              new Date(data.timestamp),
                              "yyyy-MM-dd HH:mm:ss"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.deviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.temperature}°C
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.humidity}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.door ? "Open" : "Closed"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="border rounded-lg p-4 text-center text-gray-500">
              Select a device and date range, then click Generate Report
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
