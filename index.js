const ping = require("ping");
const iohook = require("@tkomde/iohook");
const { exec } = require("child_process");
const axios = require("axios");

const { token , chat_id } = require("./keys");

const TOKEN = token;  
const CHAT_ID = chat_id;
async function sendMessage(msg) {
    try {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: msg
        });
    } catch (err) {
        console.log("Telegram error:", err.message);
    }
}
console.log("Script starting");
sendMessage("Script Started")

const phoneip = "10.23.1.39";

let failcount = 0;
let locked = false;
let isIdle = false;

let lastActivityTime = Date.now();

function updateActivity() {
    const now = Date.now();

    // prevent spam/jitter updates
    if (now - lastActivityTime > 200) {
        lastActivityTime = now;
    }
}

iohook.on("mousemove", updateActivity);
iohook.on("keydown", updateActivity);
iohook.on("keyup", updateActivity);
iohook.on("mousedown", updateActivity);

iohook.start();

setInterval(() => {
    const idleTime = Date.now() - lastActivityTime;

    console.log("Idle time:", idleTime);

    if (idleTime > 15000) {
        isIdle = true;
        console.log("User inactive");
    } else {
        isIdle = false;
        
    }

}, 3000);

setInterval(async () => {
    const res = await ping.promise.probe(phoneip);
    console.log("ping:", res.alive);

    if (!res.alive) {
        failcount++;
        console.log(`Phone not detected: ${failcount}`);
        
    } else {
        failcount = 0;
        
       
        if (!isIdle) {
            locked = false; //reset lock only when user is active again
        }
    }
    if(failcount >= 3 && isIdle && !locked) sendMessage("Laptop will lock soon");
    if (failcount >= 4 && isIdle && !locked) {
        locked = true;
        console.log("Locking system...");
        exec("rundll32.exe user32.dll,LockWorkStation");
        sendMessage("laptop Locked");
        locked = true;
    }

}, 2000);

let lastUpdateId = 0;

setInterval(async () => {
    try {
        const res = await axios.get(
            `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId + 1}`
        );

        const updates = res.data.result;

        for (let update of updates) {
            lastUpdateId = update.update_id;

            const message = update.message?.text;
            const chatId = update.message?.chat?.id;

            if (!message) continue;

            console.log("Received:", message);

            // LOCK COMMAND
            if (message === "Lock") {
                exec("rundll32.exe user32.dll,LockWorkStation");
                sendMessage("Laptop Locked");
            }

            // 📊 STATUS COMMAND
            if (message === "status") {
                if (locked) {
                    sendMessage("Locked");
                } else {
                    sendMessage("Not locked");
                }
            }
        }

    } catch (err) {
        console.log("Error:", err.message);
    }
}, 2000);
