const { message } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  async listMessagesByRoom(roomId) {
    try {
      const messages = await message.findAll({
        where: {
          roomId,
        },
      });
      console.log(messages);
      return messages.map((message) => message.toJSON());
    } catch (err) {
      console.error(err);
    }
  },

  async createMessage(roomId, sender, message) {
    try {
      const newMessage = await message.create({
        roomId,
        sender,
        message,
      });
      return newMessage.toJSON();
    } catch (err) {
      console.error(err);
    }
  },
};
