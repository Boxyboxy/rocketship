const roomsRepository = require("../repositories/roomsRepository");
const messagesRepository = require("../repositories/messagesRepository");
module.exports = {
  initializeSockets: (io) => {
    const arraysOfRooms = [];

    io.on("connection", async (socket) => {
      console.log(" A user has connected to the server");
      console.log("Socket ID: ", socket.id);

      socket.on("subscribe", async (roomName) => {
        console.log("roomname:" + roomName);
        let room = await roomsRepository.getRoomByName(roomName);
        console.log({ room });
        if (!room) {
          room = await roomsRepository.createRoom(roomName);
        }

        const messages = await messagesRepository.listMessagesByRoom(room.id);

        socket.join(roomName);
        console.log("A user has joined the chat: ", roomName);

        arraysOfRooms.push(roomName);
        io.to(roomName).emit("joinRoom", { room, messages });
      });

      socket.on("chatMessage", async ({ message, username, currentRoom }) => {
        console.log(username, " says: ", message);
        await messagesRepository.createMessage(
          currentRoom.id,
          username,
          message
        );
        io.to(currentRoom.name).emit("chatMessage", {
          message,
          userName,
          currentRoom,
        });
      });
    });
  },
};
