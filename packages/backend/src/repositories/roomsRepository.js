const { room } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  async getRoomByName(roomName) {
    console.log("Repository:" + roomName);
    try {
      const room = await room.findOne({
        where: {
          name: roomName,
        },
      });

      if (!room) return null;

      return room.toJSON();
    } catch (err) {
      console.error(err);
    }
  },
  async createRoom(roomName) {
    try {
      const newRoom = await room.create({ roomName });
      return newRoom.toJSON();
    } catch (err) {
      console.error(err);
    }
  },
};
