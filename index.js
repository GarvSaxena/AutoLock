const ping = require("ping");
const iohook = require("@tkomde/iohook");
const {exec} = require("child_process"); //This module lets your program run system commands (like CMD/Terminal commands)
// {exec} means that we are only taking the exec function from child_process

const phoneip = "10.23.1.39";
let failcount = 0;
let locked = false;
let isIdle = false;

let activitytime = Date.now();
iohook.on("mousemove", () => activitytime = Date.now());
iohook.on("keydown", () => activitytime = Date.now());
iohook.on("keyup", () => activitytime = Date.now());
iohook.on("mousedown", () => activitytime = Date.now());

iohook.start();
console.log("Script starting");

setInterval(() => {
    let idletime = Date.now() - activitytime;
    console.log("Active")
    if (idletime > 30000) {
        isIdle = true;
        console.log("Not active")
    } else {
        isIdle = false;
    }

}, 2000);

    setInterval(async() => {
    const res = await ping.promise.probe(phoneip);
    console.log("ping result: " , res.alive);
    
    if(!res.alive){
        failcount++;
        console.log(`Phone not detected: count: ${failcount}`);
    }
    else{
        failcount = 0; // reset when phone comes back
        locked = false;
    }

    if(failcount >=3 && !locked && isIdle){
        locked = true;
        console.log("Phone not detected..Locking..");
        exec("rundll32.exe user32.dll,LockWorkStation");
    }
    
},2000);







