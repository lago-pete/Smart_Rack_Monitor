# Smart Rack Monitoring Platform
***A hardware/software solution to monitor a server rack with an integrated dashboard and metrics***

---
# ToDo

## Infrastructure
- [x] Reverse Proxy
- [x] Firewall
- [x] Certbot for TLS
- [ ] Database
   - [ ] cleanup DB
   - [x] deploy DB
- [ ] provsion access
   - [ ] CI/CD access account
- [ ] automatic server updates
   - keep npm packages up to date
- [ ] test a reboot
- [ ] zero downtime deploy
- [ ] mockup containerization
  - database configurable with external storage
  - server URLs
  - credentials



## backend
- use .env file on server for port and JWT secret
- add authenticaation on any device API
  - devices need to authenticate to post data
  - there needs to be a table to associate devices with organizations/accounts
  - there needs to be authentication to pull sensor data
- endpoints to retrieve sensor data
- endpoint to update device config
- endpoint to OTA update the device firmware
- endpoint to modify/delete account
- table for orginizations and user accounts
- emails?

## frontend
- ensure there are no unnecessary dependencies (config files, functions, pages, packages)
- coordinate with backend for more endpoints
- ensure english consistency (seems like some code is still in spanish?)

## IoT-device
- [ ] over-the-air (OTA) updates using non blocking loop, that blocks once the update is started
- coordinate with frontend or backend to implement check for latest firmware

# Uncategorized Items

- Optimize by recording only on significant changes rather than constant intervals.

- Demo account with dummy data and dummy alert examples

- Give the user the option whether or not to receive multiple consecutive alerts for the threshold being reached (intervals, max number of alerts, alert for each type of threshold being reached or altogether if in the same reading)

- When sending data to the server, server response tells the device if it needs to update the send rate (keep minimum of x seconds or greater to avoid overwhelming the device)

- When devices are loaded onto the page, automatically sort them by the highest temperature but give options for sorting by other highest variables

- Sort alphabetically and then put any devices with critical readings at the top

- an access key is tied to all the devices sent to a company (output the id for the device that is burned into the hardware and add it to the pool of devices under the access key) and each access key can only be connected to one company account (prevents leaking the key) if the key does get leaked before the access key is added to the company account a new one can be generated sent to the company and the old one deleted
   - ensure that access keys are unique (two sets of devices cannot have the same access key)
   - a company can have multiple access keys connected to their account
   - access keys have a one time use, so when a company account is deleted or an access key is removed from an account, the access key(s) become expired to avoid other company accounts from connecting them and seeing the associated data (access key states are new/connected/expired)
   - keep a separate database of all the device IDs and which access key they are associated with

- Add status on website only that displays a device as connected or offline based on whether it is actively receiving packets from that device within the last x seconds

- Ensure that the server can accept JSON arrays (a set of 10 packets at once) from the backlog

- Get the sensors working and collecting the data

- Measure both device and server time

- Think about adding ntp_time_synced and device_connected_to_internet

- Add backtracking of timing to ensure that it is always accurate

- Update the website to display the other fields sent in the packets (and remove the deviceName and location from each packet, the account should have a nickname (or device ID as the default name possibly) and group name (which is equivalent to location) for each device or set of devices)

- Allow company account to manage which devices are visible to the employee accounts

- Calculate the amount of data (at which rate) each company can have before we need to delete it for space

