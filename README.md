# AutoLock

AutoLock is a Node.js-based automation tool that monitors device/network activity and performs automatic actions like login/logout based on connectivity or inactivity.

---

## Features

* Detects device/network presence using ping
* Automates login/logout actions
* Supports inactivity-based triggers (extendable)
* Lightweight and runs locally
* Easy to customize for different workflows

---

## Tech Stack

* Node.js
* JavaScript
* `ping` module
* `child_process` (for system commands)

---

## Project Structure

```
AutoLock/
│── index.js        # Main script
│── package.json    # Dependencies
│── .gitignore
│── README.md
```

---

## ⚙️ Installation

1. Clone the repository:

```
git clone https://github.com/<your-username>/AutoLock.git
cd AutoLock
```

2. Install dependencies:

```
npm install
```

---

## Usage

Run the script:

```
node index.js
```

The script will:

* Continuously monitor network/device status
* Trigger actions based on conditions (e.g., disconnect → logout)

---

## Example Logic

```js
const res = await ping.promise.probe(ip);

if (res.alive) {
    // Device is present → stay logged in
} else {
    // Device not found → trigger logout
}
```


## Future Improvements

* Add GUI dashboard
* Add inactivity timer logic
* Multi-device tracking
* Notification system

---

## 👨‍💻 Author

Garv Saxena

---
