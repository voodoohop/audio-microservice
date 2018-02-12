const abletonlink = require("abletonlink")
const link = new abletonlink()
const amqp = require("amqplib")
module.exports = () => 'Welcome to Mic2ro'


const amqpServer = 'amqp://guest:guest@localhost'


// const context = require('rabbit.js').createContext(amqpServer);
const q = "link"

async function start() {
    // const conf = {
    //     "connection": {
    //         "host": "localhost",
    //         "login": "guest",
    //         "password": "guest"
    //     },
    //     "logLevel": "debug",
    //     "local": false,
    //     "rpc": {
    //         "timeout": 2000
    //     }
    // }
    // const pub = context.socket('PUBLISH');


    const conn = await amqp.connect(amqpServer);
    const channel  = await conn.createChannel();
    channel.assertQueue(q);
    console.log(channel)
    
    link.startUpdate(20, (beat, phase, bpm) => {
        channel.sendToQueue(q, new Buffer(JSON.stringify({beat,phase,bpm})))
        console.log("updated: ", beat, phase, bpm)
    })
}

start()