# AutoLock

**AutoLock** is a smart, automated security utility for Windows. It monitors your smartphone's Wi-Fi proximity and your PC's activity (keyboard & mouse movement) to automatically lock your workstation when you step away with your phone. It also features full remote control and status notifications via a Telegram Bot.

---

## How It Works

AutoLock operates using three main mechanisms:

1. **Phone Proximity Detection (Ping):**
   * AutoLock periodically pings your phone's Wi-Fi IP address.
   * If your phone disconnects or goes out of Wi-Fi range, failed ping count increases.

2. **User Inactivity Tracking (`iohook`):**
   * Listens for global mouse movement and key presses to accurately measure idle time.
   * If no activity is detected for 15+ seconds, the system is marked as **Idle**.

3. **Automated System Lock & Notifications:**
   * **Warning:** If your phone is missing and you are idle for 3 intervals (~6 seconds), AutoLock sends a Telegram notification: `"Laptop will lock soon"`.
   * **Locking:** If your phone remains unreachable (4 failed pings) and you are idle, AutoLock locks Windows using `rundll32.exe user32.dll,LockWorkStation` and notifies your Telegram: `"laptop Locked"`.
   * **Auto Reset:** When your phone returns and user activity resumes, the lock state automatically resets.

4. **Telegram Remote Control:**
   * Send **`Lock`** to your Telegram Bot to immediately lock your laptop from anywhere.
   * Send **`status`** to check whether your laptop is currently locked or unlocked.

---

## Tech Stack & Dependencies

* **Node.js** (JavaScript Runtime)
* **`ping`**: ICMP ping probing for local network phone detection
* **`@tkomde/iohook`**: Global keyboard and mouse event listener
* **`axios`**: Telegram Bot API integration for notifications and remote polling
* **`child_process`**: Native Windows workstation locking via system commands

---

## Project Structure

```
AutoLock/
│── index.js          # Main monitoring script & Telegram bot loop
│── keys.js           # Private credentials (Git-ignored)
│── keys.example.js   # Template file for setting up keys.js
│── package.json      # Project metadata & dependencies
│── .gitignore        # Excludes node_modules & keys.js
└── README.md         # Project documentation
```

---

## Installation & Configuration

### 1. Clone the Repository
```bash
git clone https://github.com/GarvSaxena/AutoLock.git
cd AutoLock
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Telegram Bot Credentials
1. Copy `keys.example.js` to create `keys.js`:
   ```bash
   cp keys.example.js keys.js
   ```
2. Open `keys.js` and enter your Telegram Bot Token and Chat ID:
   ```javascript
   module.exports = {
       token: "YOUR_TELEGRAM_BOT_TOKEN",
       chat_id: "YOUR_TELEGRAM_CHAT_ID"
   };
   ```

### 4. Configure Phone IP Address
Open `index.js` and set your smartphone's static/reserved Wi-Fi IP address:
```javascript
const phoneip = "192.168.1.50"; // Replace with your phone's IP
```

---

## How to Run

### Manual Run:
```bash
npm start
# OR
node index.js
```

---

## Running AutoLock Automatically on Windows Startup

To make AutoLock start automatically when you log into Windows, choose one of the following methods:

### Method 1: Windows Startup Folder (Silent / Background Run) (Recommended)

1. Press `Win + R`, type `shell:startup`, and press **Enter**. This opens your Windows Startup folder.
2. Create a new file named `autolock.vbs` in that folder.
3. Paste the following script into `autolock.vbs` (replace the path with your actual AutoLock folder path):

   ```vbs
   Set WshShell = CreateObject("WScript.Shell")
   WshShell.Run "node ""C:\Users\YOUR_USERNAME\Desktop\AutoLock\index.js""", 0, False
   ```
4. Save the file. AutoLock will now run silently in the background every time Windows starts.

---

### Method 2: Using PM2 (Process Manager)

1. Install PM2 globally and `pm2-windows-startup`:
   ```bash
   npm install -g pm2
   npm install -g pm2-windows-startup
   pm2-startup install
   ```
2. Start AutoLock with PM2:
   ```bash
   pm2 start index.js --name "autolock"
   pm2 save
   ```

---

### Method 3: Windows Task Scheduler

1. Open **Task Scheduler** from the Windows Start menu.
2. Click **Create Task...** on the right panel.
3. Under the **General** tab:
   * Name: `AutoLock`
   * Check *"Run only when user is logged on"*
4. Under the **Triggers** tab:
   * Click **New...** -> Select **At log on** -> Click **OK**.
5. Under the **Actions** tab:
   * Click **New...** -> Program/script: `node`
   * Add arguments: `index.js`
   * Start in: `C:\Users\YOUR_USERNAME\Desktop\AutoLock`
6. Click **OK** to save.

---

## Author

**Garv Saxena**

---
