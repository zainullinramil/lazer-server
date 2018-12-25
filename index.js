const SerialPort = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");
const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3003 });

// const port = new SerialPort("/dev/cu.Bluetooth-Incoming-Port", {
//   baudRate: 28800
// });

// const parser = port.pipe(new Delimiter({ delimiter: "\n" }));

server.on("connection", ws => {
    ws.on('message', message => {
        let parseMessage;
        try {
            parseMessage = JSON.parse(message);
        } catch (e) {
            console.log('catch', e)
        }
        const { command } = parseMessage;
        if (command && command === 'up') {
            ws.send('{"data": "' + Date.now() + '"}');
        }
    });
//   parser.on("data", data => (console.log(data), ws.send(data))); // emits data after every '\n'
});

// port.open(function(err) {
//   if (err) {
//     return console.log("Error opening port: ", err.message);
//   }

//   // Because there's no callback to write, write errors will be emitted on the port:
//   port.write("main screen turn on");
// });

// // The open event is always emitted
// port.on("open", function() {
//   // open logic
//   console.log("open");
// });

// Read data that is available but keep the stream in "paused mode"
// port.on("readable", function() {
//   console.log("read Data:", port.read());
// });

// Switches the port into "flowing mode"
// port.on("data", function(data) {
//   console.log(data);
//   //   console.log("Data:", data);
// });

// const parser = port.pipe(new Readline());
// parser.on("data", console.log);
// port.write("ROBOT PLEASE RESPOND\n");

// const parser = port.pipe(new ByteLength({ length: 16 }));
// parser.on("data", console.log); // will have 8 bytes per data event
