import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Thermometer, Droplets, DoorOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDevices } from "../lib/api";
import { SensorData } from "../types";

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const lng = location.pathname.split("/")[1] || "en";
  const [devices, setDevices] = useState<SensorData[]>([]);
  const USE_MOCK_DATA = true;

// to do 

// sort cards via quest


  const mockDevices: SensorData[] = [
    {
      _id: "mock1",
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
      _id: "mock2",
      id: "device2",
      deviceName: "Lab Sensor B",
      location: "Room 202",
      packet_number: 2,
      timestamp: new Date().toISOString(),
      temperature: 32, 
      humidity: 65, 
      door: 1, 
      voltage: 5.0,
    },
    {
      _id: "mock3",
      id: "device3",
      deviceName: "Storage Monitor",
      location: "Warehouse A",
      packet_number: 3,
      timestamp: new Date().toISOString(),
      temperature: 18.2,
      humidity: 45,
      door: 0,
      voltage: 5.0,
    },
  ];

  useEffect(() => {
    const fetchDevices = async () => {
      if (USE_MOCK_DATA) {
        setDevices(mockDevices);
      } else {
        try {
          const response = await getDevices();
          console.log("Fetched devices:", response.data);
          setDevices(response.data);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      }
    };

    fetchDevices();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device, index) => (
        <Link
          key={`${device._id}-${index}`}
          to={`/${lng}/info/${device._id}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full"
        >
          <div className="h-full">
            <h2 className="text-xl font-semibold mb-2">{device.deviceName}</h2>
            <p className="text-gray-600 mb-4">{device.location}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm">{device.temperature}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm">{device.humidity}%</span>
              </div>
              <div className="flex items-center">
                <DoorOpen className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm">
                  {device.door
                    ? t("dashboard.doorOpen")
                    : t("dashboard.doorClosed")}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-y-auto">
              {device.temperature > 30 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2">
                  <span className="block sm:inline">
                    {t("home.alertHighTemp")}
                  </span>
                </div>
              )}
              {device.humidity > 60 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-2">
                  <span className="block sm:inline">
                    {t("home.alertHighHumidity")}
                  </span>
                </div>
              )}
              {device.door === 1 && (
                <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative mb-2">
                  <span className="block sm:inline">
                    {t("home.alertDoorOpen")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
