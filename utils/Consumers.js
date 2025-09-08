const { consumer } = require("../config/kafka");

const startMessageConsumer = async (io) => {
  try {
    await consumer.subscribe({ topic: "chat-messages", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let receivedMessage = message.value.toString();

        console.log(
          `Message received from Kafka [topic: ${topic}, partition: ${partition}]: ${receivedMessage}`
        );

        receivedMessage = JSON.parse(receivedMessage);
        io.to(receivedMessage.chatId).emit("newMessage", receivedMessage);
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
};

module.exports = { startMessageConsumer };
