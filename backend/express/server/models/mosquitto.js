import mqtt from "mqtt";

export default class Mosquitto {
  //   static connect(request, response) {
  static connect() {
    // const client = mqtt.connect("mqtt://mosquitto:1883"); // when running containerized server
    const client = mqtt.connect("mqtt://localhost:1883"); // when running local server

    // Connect to the broker
    client.on("connect", () => {
      console.log("Connected to Mosquitto Broker");
    });
    client.on("error", (err) => {
      console.log("Error:", err);
      //   response.status(500).send("Failed to connect to Mosquitto Broker");
    });
    return client;
  }

  static get_auction_list(auction_name) {
    client = Mosquitto.connect();
    client.subscribe("auction_list", { qos: 1 });
  }
  static publish_at_auction_list(auction_name) {
    client = Mosquitto.connect();
    client.publish("auction_list", auction_name, { retain: true });
  }
  static publish_auction(auction_name, start_price) {
    client = Mosquitto.connect();
    client.publish(auction_name, start_price);
  }
  static sub(request, response) {
    // Subscribe to the "test" topic
    client.subscribe("test", (err) => {
      if (err) {
        console.log("Subscription failed", err);
        response.status(500).send("Failed to subscribe to topic 'test'");
      } else {
        console.log("Successfully subscribed to 'test'");
      }
    });
    // });

    // Listen for messages on the "test" topic
    client.on("message", (topic, message) => {
      if (topic === "test") {
        // Send the received message as the response
        response.send(
          `Got message "${message.toString()}" from topic "${topic}"`
        );

        // Optionally, end the connection after receiving the message
        client.end();
      }
    });

    // Handle connection errors
  }
}

// // import mqtt from "mqtt";

// // export default class Mosquitto {
// //   static async connect(request, response) {
// //     console.log("hello from mosquitto.js");
// //     const client = mqtt.connect("mqtt://mosquitto:1883"); // Broker URL
// //     console.log("hello from mosquitto.js line 7");

// //     try {
// //       await new Promise((resolve, reject) => {
// //         console.log("hello from mosquitto.js line 11");
// //         client.on("connect", () => {
// //           console.log("Connected to Mosquitto Broker");
// //           resolve();
// //         });

// //         client.on("error", (err) => {
// //           console.log("Error:", err);
// //           reject(new Error("Failed to connect to Mosquitto Broker"));
// //         });
// //       });
// //       console.log("hello from mosquitto.js line 22");
// //       // Send a response back once connected
// //       response.send("Successfully connected to Mosquitto Broker");
// //     } catch (err) {
// //       // Send an error response if connection fails
// //       response.status(500).send("Failed to connect to Mosquitto Broker");
// //     }
// //   }
// // }

// import mqtt, { Client } from "mqtt";

// export default class Mosquitto {
//   static connect(request, response) {
//     const client = mqtt.connect("mqtt://mosquitto:1883"); // Broker URL
//     client.on("message", ("test", message)=>{
//         response.send(`got ${message} from topic test`);
//     });}}

//     // console.log("hello from mosquitto.js");
//     // const client = mqtt.connect("mqtt://mosquitto:1883"); // Broker URL
//     // return client.on("connect", () => {
//     //   console.log("Connected to Mosquitto Broker");
//     //   // Send a response back once connected
//     //   response.send("Successfully connected to Mosquitto Broker");
//     // });

//     // client.on("error", (err) => {
//     //   console.log("Error:", err);
//     //   // Send an error response if connection fails
//     //   response.status(500).send("Failed to connect to Mosquitto Broker");
//     // });
// //   }
// // }
