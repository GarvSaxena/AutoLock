const ping = require("ping");
const {exec} = require("child_process"); //This module lets your program run system commands (like CMD/Terminal commands)
// {exec} means that we are only taking the exec function from child_process
console.log("Script starting");
const phoneip = "<enter ypur wifi IP address>";
// async function logout(){
//     const res = await ping.promise.probe(phoneip);
//     if(!res.alive) {
//         console.log("Phone not detected");
//         exec("shutdown -l");
//     }
// }
// const rescount = await ping.promise.probe(phoneip);

let failcount = 0;
let locked = false;
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

    if(failcount >=5 && !locked){
        locked = true;
        console.log("Phone not detected..Locking..");
        exec("rundll32.exe user32.dll,LockWorkStation");
    }
    
},2000);
