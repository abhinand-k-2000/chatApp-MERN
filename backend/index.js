import express from "express";
import cors from "cors";
const app = express();
import dbConnect from "./config/dbConnect.js";
import userRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3001 || process.env.PORT;

app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server listening to port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,            
  cors: {
    origin: "http://localhost:5173",
  },
});



io.on("connection", (socket) => { 
  console.log("socket.io connected", socket.id);

  socket.on("setup", (userData) => {
    console.log("userroom: ", userData._id);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"))
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))



  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if(!chat.users) {
        return console.log("chat.users not defined")
    }

    chat.users.forEach((user) => {
        if(user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })

  socket.off('setup', () => {
    console.log("User disconnected");
    socket.leave(userData._id)
  })

});
