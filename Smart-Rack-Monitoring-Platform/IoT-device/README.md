# ESP32-P4-ETH Monitoring Device

## Project Description

This project implements a monitoring system using ESP32-P4-ETH Arduino devices to collect temperature, humidity, door status, and power status data.

## Features

- Temperature monitoring using DHT11 sensor (Add DHT22 support?)
- Humidity monitoring using DHT11 sensor
- Door status detection (open/closed)
- Power status detection (on/off)
- Data sent to a remote server every 4 seconds
- Ethernet connection for data transmission

## Required Components

- ESP32-P4-ETH Arduino
- DHT11 sensor (temperature and humidity)
- Door sensor
- Power sensor
- Ethernet connection

## Pin Configuration

Pins are configured depending on the ESP32 version. By default, we have:  

- DHT11 Pin: 13 (sometimes 17)  
- Door Sensor Pin: 23 (sometimes 10)  

Pin definition depends entirely on how the user chooses to connect them.  

## Libraries

- ETH.h
- HTTPClient.h
- Preferences.h
- LittleFS.h
- ArduinoJson.h
- time.h
- esp_task_wdt.h  
- DHT.h

## Configuration

Before uploading the code, check the specific code version being used and review which parameters must be modified for each device. Parameters to configure may include:  

- `server_url`: Server URL for receiving data
- `prtg_server_url`: PRTG server URL for receiving data
- `output_format`: Determines whether to use server_url or prtg_server_url

Ensure that the output_format value matches which URL you want to use.

## Operation

1. Connects to the Internet using an Ethernet connetion
2. Reads temperature and humidity data
3. Checks door status
4. Checks power status
5. Sends data to the server every 4 seconds (configurable) in JSON format  
6. When connected to a computer, shows information via serial port for verification during upload  

## Considerations

- Ensure a stable Ethernet connection
- Verify network settings before deployment  
- Check sensor wiring on each device

### File Descriptions

#### 1. devices.ino

Connects to the cloud server to store sensor data in a database, which is viewable in the web application.
