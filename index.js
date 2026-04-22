const ping = require("ping");
const iohook = require("@tkomde/iohook");
const { exec } = require("child_process");

console.log("Script starting");

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

    if (idleTime > 30000) {
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

    if (failcount >= 4 && isIdle && !locked) {
        locked = true;
        console.log("Locking system...");
        exec("rundll32.exe user32.dll,LockWorkStation");
    }

}, 2000);