let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
      console.log("user online", socket.id);
      socket.on("disconnect", () => {
        console.log("user offline", socket.id);
      });
    });
  
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("something is wrong with socket");
    }
    return io;
  },
};
