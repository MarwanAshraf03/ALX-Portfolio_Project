import express from "express";
import router from "./server/routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log("started");
});

export default app;

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// import express from "express";
// import mqtt from "mqtt";

// const app = express();
// app.use(express.json()); // <-- Add this line to parse JSON payloads

// console.log("line 19");
// const client = mqtt.connect("mqtt://mosquitto:1883");
// console.log("line 21");

// // Publish to MQTT via HTTP POST
// app.post("/publish", (req, res) => {
//   const { topic, message } = req.body;
//   if (!topic || !message) {
//     return res.status(400).send("Topic and message are required");
//   }
//   client.publish(topic, message, (err) => {
//     if (err) {
//       res.status(500).send("Failed to publish");
//     } else {
//       res.send("Message published to MQTT");
//     }
//   });
// });

// // Subscribe to MQTT and return message via HTTP
// app.get("/subscribe/:topic", (req, res) => {
//   const topic = req.params.topic;
//   client.subscribe(topic, (err) => {
//     if (err) {
//       res.status(500).send("Failed to subscribe");
//     } else {
//       client.once("message", (topic, message) => {
//         res.send(`Received message: ${message.toString()}`);
//       });
//     }
//   });
// });

// app.get("/", (req, res) => {
//   res.send("working!");
// });

// app.listen(3000, () => {
//   console.log("HTTP server running on port 3000");
// });

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// var express = require("express");
// var bodyParser = require("body-parser");
// var app = express();
// var mqttHandler = require("./mqtt_handler");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var mqttClient = new mqttHandler();
// mqttClient.connect();

// // Routes
// app.post("/send-mqtt", function (req, res) {
//   mqttClient.sendMessage(req.body.message);
//   res.status(200).send("Message sent to mqtt");
// });

// app.post("/send-mqtt", function (req, res) {
//   mqttClient.sendMessage(req.body.message);
//   res.status(200).send("Message sent to mqtt");
// });

// var server = app.listen(3000, function () {
//   console.log("app running on port.", server.address().port);
// });
