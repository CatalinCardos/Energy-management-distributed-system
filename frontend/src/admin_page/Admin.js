import "./Admin.css";
import { Navigate } from "react-router-dom";
import { UsersComponent } from "./components/Users.component";
import { DevicesComponent } from "./components/Devices.component";
import { useState } from "react";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { Chat } from "../common/components/ChatManager";

const socket = io("http://localhost:3004");

export function Admin() {
  const loggedInUser = sessionStorage.getItem("authenticated") || false;
  const roleUser = sessionStorage.getItem("role");
  const [componentState, setComponentState] = useState("devices");
  const idUser = sessionStorage.getItem("id");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chats, setChats] = useState([]);

  socket.on("join-chat/admin", async (data) => {
    const newChats = await chats.filter(
      (chat) => chat.clientID !== data.clientID
    );
    setChats([...newChats, data]);
  });

  socket.on("leave-chat/admin", async (data) => {
    const newChats = await chats.filter(
      (chat) => chat.clientID !== data.clientID
    );
    setChats([...newChats]);
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-chat/admin");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket]);

  if (!loggedInUser || +roleUser === 1) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="admin-page">
        <div className="admin">
          {componentState === "devices" ? (
            <DevicesComponent />
          ) : (
            <UsersComponent idUser={idUser} />
          )}
          <div className="admin-buttons">
            <button
              className="admin-button"
              onClick={() => setComponentState("devices")}
            >
              Devices
            </button>
            <button
              className="admin-button"
              onClick={() => setComponentState("users")}
            >
              Users
            </button>
          </div>
        </div>
        <div className="admin-chats">
          {chats.map((chat) => {
            return (
              <Chat
                socket={socket}
                key={chat.roomId}
                roomId={chat.clientID}
                toUser={chat.fromUser}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
