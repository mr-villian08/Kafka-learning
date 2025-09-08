const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "chat-group" });

const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log("Connected to Kafka successfully!");
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
};

module.exports = { producer, consumer, kafka, connectKafka };
