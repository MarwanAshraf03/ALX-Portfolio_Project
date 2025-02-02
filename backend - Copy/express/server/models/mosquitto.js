import mqtt from "mqtt";
export default class Mosquitto {
  static client = null;

  static getClient() {
    if (!this.client) {
      this.client = mqtt.connect("mqtt://localhost:1883");
      this.client.on("connect", () => console.log("Connected to broker"));
      this.client.on("error", (err) => console.error("MQTT error:", err));
    }
    return this.client;
  }

  static publish_auction(auction_name, start_price) {
    const client = this.getClient();
    const message = String(start_price);

    client.publish(auction_name, message, { retain: true }, (err) => {
      if (err) {
        console.error("Failed to publish message:", err);
      } else {
        console.log(`Published message to "${auction_name}": ${message}`);
      }
    });
  }
}
