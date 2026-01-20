import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { Thermometer, Droplets, DoorOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSensorData, getSensorHistory } from "../lib/api";
import { SensorData } from "../types";

export default function Dashboard() {
  const { deviceName } = useParams();
  const { t } = useTranslation();
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);

  ////////////This is Test Data//////////////////////
  const USE_MOCK_DATA = true; // Set to false when API is ready

  const mockCurrentData: SensorData = {
    _id: "mock123",
    id: "device1",
    deviceName: "Lab Sensor A",
    location: "Room 101",
    packet_number: 1,
    timestamp: new Date().toISOString(),
    temperature: 23.5,
    humidity: 55,
    door: 0,
    voltage: 5.0,
  };

  const mockHistoricalData: SensorData[] = Array.from(
    { length: 20 },
    (_, i) => ({
      _id: `mock${i}`,
      id: "device1",
      deviceName: "Lab Sensor A",
      location: "Room 101",
      packet_number: i + 1,
      timestamp: new Date(Date.now() - (20 - i) * 300000).toISOString(), // Every 5 min
      temperature: 22 + Math.random() * 4, // Random between 22-26
      humidity: 50 + Math.random() * 20, // Random between 50-70
      door: Math.random() > 0.8 ? 1 : 0, // 20% chance door is open
      voltage: 5.0,
    })
  );
  ////////////This is Test Data//////////////////////

  useEffect(() => {
    if (!deviceName) return;

    const fetchData = async () => {
      if (USE_MOCK_DATA) {
        //Remmeber to change back to False
        setCurrentData(mockCurrentData);
        setHistoricalData(mockHistoricalData);
      } else {
        const [current, history] = await Promise.all([
          getSensorData(deviceName),
          getSensorHistory(deviceName),
        ]);
        setCurrentData(current.data);
        setHistoricalData(history.data);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [deviceName]);

  const handleFilterData = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = historicalData.filter((data) => {
      const dataDate = new Date(data.timestamp);
      return dataDate >= start && dataDate <= end;
    });

    setFilteredData(filtered);
    console.log(
      `Filtered ${filtered.length} records between ${startDate} and ${endDate}`
    );
  };

  const handleExportCSV = () => {
    const dataToExport =
      filteredData.length > 0 ? filteredData : historicalData;

    if (dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    // Create CSV header
    const headers = [
      "Timestamp",
      "Temperature (°C)",
      "Humidity (%)",
      "Door Status",
    ];

    // Create CSV rows
    const rows = dataToExport.map((data) => [
      format(new Date(data.timestamp), "yyyy-MM-dd HH:mm:ss"),
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
    link.download = `${currentData?.deviceName || "device"}_data_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    console.log(`Exported ${dataToExport.length} records to CSV`);
  };

  const calculateStatistics = () => {
    const dataToAnalyze =
      filteredData.length > 0 ? filteredData : historicalData;

    if (dataToAnalyze.length === 0) return null;

    const temps = dataToAnalyze.map((d) => d.temperature);
    const humids = dataToAnalyze.map((d) => d.humidity);

    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      minTemp: Math.min(...temps).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      avgHumidity: (humids.reduce((a, b) => a + b, 0) / humids.length).toFixed(
        1
      ),
      minHumidity: Math.min(...humids).toFixed(1),
      maxHumidity: Math.max(...humids).toFixed(1),
    };
  };

  if (!currentData) return <div>{t("dashboard.loading")}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{currentData.deviceName}</h1>
        <p className="text-gray-600">{currentData.location}</p>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFilterData}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Filter
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium">
                {t("dashboard.temperature")}
              </h3>
            </div>
            <span className="text-2xl font-bold">
              {currentData.temperature}°C
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplets className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">{t("dashboard.humidity")}</h3>
            </div>
            <span className="text-2xl font-bold">{currentData.humidity}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DoorOpen className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium">{t("dashboard.door")}</h3>
            </div>
            <span className="text-2xl font-bold">
              {currentData.door
                ? t("dashboard.doorOpen")
                : t("dashboard.doorClosed")}
            </span>
          </div>
        </div>
      </div>

      {(() => {
        const stats = calculateStatistics();
        return stats ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-sm text-gray-600">Avg Temperature</p>
                <p className="text-2xl font-bold">{stats.avgTemp}°C</p>
              </div>
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-gray-600">Min Temperature</p>
                <p className="text-2xl font-bold">{stats.minTemp}°C</p>
              </div>
              <div className="border-l-4 border-red-700 pl-4">
                <p className="text-sm text-gray-600">Max Temperature</p>
                <p className="text-2xl font-bold">{stats.maxTemp}°C</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Avg Humidity</p>
                <p className="text-2xl font-bold">{stats.avgHumidity}%</p>
              </div>
              <div className="border-l-4 border-blue-300 pl-4">
                <p className="text-sm text-gray-600">Min Humidity</p>
                <p className="text-2xl font-bold">{stats.minHumidity}%</p>
              </div>
              <div className="border-l-4 border-blue-700 pl-4">
                <p className="text-sm text-gray-600">Max Humidity</p>
                <p className="text-2xl font-bold">{stats.maxHumidity}%</p>
              </div>
            </div>
          </div>
        ) : null;
      })()}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">
          {t("dashboard.temperatureHistory")}
        </h2>
        <LineChart width={800} height={400} data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(new Date(time), "HH:mm")}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            name={`${t("dashboard.temperature")} (°C)`}
          />
        </LineChart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">
          {t("dashboard.humidityHistory")}
        </h2>
        <LineChart width={800} height={400} data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(new Date(time), "HH:mm")}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            name={`${t("dashboard.humidity")} (%)`}
          />
        </LineChart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">{t("dashboard.recentData")}</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">{t("dashboard.timestamp")}</th>
              <th className="py-2">{t("dashboard.temperature")} (°C)</th>
              <th className="py-2">{t("dashboard.humidity")} (%)</th>
              <th className="py-2">{t("dashboard.doorStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {historicalData.slice(-10).map((data, index) => (
              <tr key={index}>
                <td className="py-2">
                  {format(new Date(data.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </td>
                <td className="py-2">{data.temperature}</td>
                <td className="py-2">{data.humidity}</td>
                <td className="py-2">
                  {data.door
                    ? t("dashboard.doorOpen")
                    : t("dashboard.doorClosed")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
