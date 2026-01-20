# Server Setup Documentation

## 1. Update and Upgrade the Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

---

## 2. Add SSH Keys

### a. SSH Key for GitHub Repository Access

1. **Generate SSH key**

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

2. **Start SSH agent and add your key**

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

*(add to `~/.bashrc` for persistence)*

3. **Copy the key to GitHub**

```bash
cat ~/.ssh/id_ed25519.pub
```

* Add the output to **GitHub → Settings → SSH and GPG keys**

### b. SSH Key for Server Login

* Add your public key to `~/.ssh/authorized_keys` on the server.

### c. SSH Key for GitHub Actions Runner (Optional)

* Generate a new SSH key for the runner.
* Add the private key to GitHub repository secrets or runner configuration.
* Add the public key to `authorized_keys`.

---

## 3. Install Node.js and npm

```bash
sudo apt install -y npm
node -v
npm -v
```

---

## 4. Install PM2 Globally

```bash
npm install -g pm2
pm2 --version
```

---

## 5. Clone Repository

```bash
git clone git@github.com:ethankanyid/Smart-Rack-Monitoring-Platform.git
cd Smart-Rack-Monitoring-Platform
```

---

## 6. Move to Dev/Prod Repository

1. Rename `main` branch → `dev`
2. Add `prod` branch
3. Add GitHub workflow for `prod` branch
4. Create ruleset to require review to merge into `prod`

---

## 7. Install MongoDB (Official Repository)

```bash
# 1. Remove any old MongoDB repo
sudo rm -f /etc/apt/sources.list.d/mongodb-org-6.0.list

# 2. Download and save the MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg

# 3. Add the MongoDB repository (using Ubuntu 22.04 Jammy repo as a workaround)
echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 4. Update package lists
sudo apt update

# 5. Install MongoDB
sudo apt install -y mongodb-org

# 6. Start MongoDB service
sudo systemctl start mongod

# 7. Enable MongoDB to start on boot
sudo systemctl enable mongod

# 8. Check MongoDB status
sudo systemctl status mongod
```

# Reverse Proxy and Firewall
--- 

nano /etc/nginx/nginx.conf
- add include statement for root/nginx/*.conf

sudo apt update
sudo apt install nginx -y
sudo apt install certbot python3-certbot-nginx -y

sudo certbot --nginx -d sense.telecso.co
- this registers a cert

after the cert was registered, delete that conf
add the real conf to serve traffic on 443 and forward to express backend

sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
