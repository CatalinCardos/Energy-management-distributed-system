import "./Chat.css";
import { useEffect, useState } from "react";

export function Chat(props) {
  const [state, setState] = useState("down");
  const socket = props.socket;
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [notified, setNotified] = useState(false);
  const [seen, setSeen] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");
  const username =
    sessionStorage.getItem("role") === "0"
      ? "admin"
      : sessionStorage.getItem("username");

  const handleChatMessages = () => {
    if (messageToSend === "") {
      return;
    }

    const data = {
      fromUser: username,
      toUser: props.toUser,
      roomId: props.roomId,
      message: messageToSend,
    };

    setMessages([...messages, data]);
    setMessageToSend("");
    socket.emit(`send-message`, data);
  };

  socket.on(`messageToUser/user/${props.roomId}${username}`, (data) => {
    setMessages([...messages, data]);
    setTyping(false);
    setSeen(false);
    if (state === "up") {
      socket.emit(`seen-message`, {
        roomId: props.roomId,
        fromUser: username,
        toUser: props.toUser,
      });
      setNotified(false);
      return;
    }

    setNotified(true);
    socket.emit(`unseen-message`, {
      roomId: props.roomId,
      fromUser: username,
      toUser: props.toUser,
    });
  });

  socket.on(`seen-message/user/${props.roomId}${username}`, (data) => {
    setSeen(true);
  });

  socket.on(`unseen-message/user/${props.roomId}${username}`, (data) => {
    setSeen(false);
  });

  useEffect(() => {
    if (state === "up") {
      socket.emit(`seen-message`, {
        roomId: props.roomId,
        fromUser: username,
        toUser: props.toUser,
      });
      setNotified(false);
      return;
    }
  }, [state]);

  socket.on(`typing/user/${props.roomId}${username}`, (data) => {
    setTyping(true);
  });

  const handleTyping = () => {
    socket.emit(`typing`, {
      roomId: props.roomId,
      fromUser: username,
      toUser: props.toUser,
    });
  };

  return (
    <div className="chat">
      {state === "down" ? (
        <div className="chat-down">
          <button
            style={notified ? { backgroundColor: "green" } : {}}
            className="chat-open btn-edit-line"
            onClick={() => setState("up")}
          >
            Chat with {props.toUser}
          </button>
        </div>
      ) : (
        <div className="chat-up">
          <div className="chat-up-header">
            <h3>Chat with {props.toUser}</h3>
            <button
              className="close-button-chat"
              onClick={() => setState("down")}
            >
              X
            </button>
          </div>
          <div className="chat-up-body">
            <div className="chat-up-body-messages">
              {messages ? (
                messages.map((message, index) => {
                  return (
                    <div key={index} className="chat-up-body-message">
                      <p>
                        {message.fromUser}: {message.message}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="chat-up-body-message">
                  <p>No messages</p>
                </div>
              )}
            </div>
            {seen && messages.length > 0 ? (
              <div className="chat-up-body-seen">
                <p>Seen</p>
              </div>
            ) : (
              <div className="chat-up-body-seen">
                <p></p>
              </div>
            )}
            {typing ? (
              <div className="chat-up-body-typing">
                <p>{props.toUser} is typing...</p>
              </div>
            ) : (
              <div className="chat-up-body-typing">
                <p></p>
              </div>
            )}
          </div>
          <div className="chat-up-footer">
            <input
              type="text"
              value={messageToSend}
              placeholder="Type a message"
              onChange={(e) => {
                setMessageToSend(e.target.value);
                handleTyping();
              }}
            />
            <button className="btn-edit-line" onClick={handleChatMessages}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
