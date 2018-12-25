const SerialPort = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");
const ByteLength = require("@serialport/parser-byte-length");
const Readline = require("@serialport/parser-readline");
const Ready = require("@serialport/parser-ready");
const CCTalk = require("@serialport/parser-cctalk");
const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3003 });

const port = new SerialPort("COM2");

const parser = port.pipe(new ByteLength({ length: 1023 }));
// const parser = port.pipe(new Delimiter({ delimiter: "\n" }));
// const parser = port.pipe(new Readline({ delimiter: "\r\n" }));
// const parser = port.pipe(new Ready({ delimiter: "READY" }));
// const parser = port.pipe(new CCTalk());
let comData = "";
let webSocket = null;

// parser.on("data", data => {
//   comData = data;
// });
const sendData = data => {
  if (webSocket && webSocket.readyState === 1) {
    webSocket.send(JSON.stringify(data));
  }
};

server.on("connection", ws => {
  //   port.write(Buffer.from("001 005 110"), function(err) {
  //     if (err) {
  //       return console.log("Error on write: ", err.message);
  //     }
  //     console.log("message written");
  //   });

  webSocket = ws;
  ws.on("message", message => {
    let parseMessage;

    try {
      parseMessage = JSON.parse(message);
    } catch (e) {
      console.log("catch", e);
    }

    const { command } = parseMessage;
    if (command && command === "send") {
      port.write("Hi Mom!");
    }
  });
  parser.on("data", data => {
    // sendData(data);
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  });
  ws.on("close", (code, reason) => {
    webSocket = null;
    ws.terminate();
  });
});

server.on("error", error => {
  console.log("error", error);
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
