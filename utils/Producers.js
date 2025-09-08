const { producer } = require("../config/kafka");

const sendMessageToKafka = async (message) => {
  try {
    await producer.send({
      topic: "chat-messages",
      messages: [{ value: JSON.stringify(message) }],
    });
    // console.log("Message sent to Kafka:", message);
  } catch (error) {
    console.error("Error sending message to Kafka:", error);
  }
};

module.exports = { sendMessageToKafka };
