import "./Home.css";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { HistoricComponent } from "./components/Historic.component";
import { AlertDeviceConsumptionComponent } from "./components/AlertDeviceConsumption.component";
import { io } from "socket.io-client";
import { Chat } from "../common/components/ChatManager";

function showPopup(props) {
  const { setDevices, devices, index, setPopup } = props;
  devices[index].popup = true;
  setDevices(devices);
  setPopup({ popup: true, idDevice: devices[index].id });
}

const socket = io("http://localhost:3004");

export function Home() {
  const [devices, setDevices] = useState([]);
  const loggedInUser = sessionStorage.getItem("authenticated") || false;
  const roleUser = sessionStorage.getItem("role");
  const idUser = sessionStorage.getItem("id");
  const [{ popup, idDevice }, setPopup] = useState({
    popup: false,
    idDevice: 0,
  });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("connected: " + socket.id);
    });

    if(loggedInUser){
      socket.emit("join-chat/user", {
        fromUser: sessionStorage.getItem("username"),
        toUser: "admin",
        roomId: idUser,
        clientID: socket.id,
      });
    }

    socket.on("join-chat/admin/to-users", () => {
      socket.emit("join-chat/user", {
        fromUser: sessionStorage.getItem("username"),
        toUser: "admin",
        roomId: idUser,
        clientID: socket.id,
      });
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket, loggedInUser]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/devices/user/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const devicesFromApi = response.data.map((device) => ({
          id: device.id,
          description: device.description,
          address: device.address,
          energyConsumption: device.energyConsumption,
          popup: false,
        }));
        setDevices(devicesFromApi);
      })
      .catch(() => {
        alert("No devices found");
      });
  }, [idUser, token]);

  if (!loggedInUser || +roleUser === 0) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="home-page">
        <div className="device-tables">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Description</th>
                <th scope="col">Address</th>
                <th scope="col">Energy Consumption</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{device.description}</td>
                  <td>{device.address}</td>
                  <td>{device.energyConsumption}</td>
                  <td>
                    <button
                      className="btn-edit-line"
                      onClick={() =>
                        showPopup({ setDevices, devices, index, setPopup })
                      }
                    >
                      Show historic
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {popup ? (
            <HistoricComponent
              setPopup={setPopup}
              trigger={popup}
              idDevice={idDevice}
            />
          ) : (
            ""
          )}
          <AlertDeviceConsumptionComponent />
        </div>
        {loggedInUser ? (
          <Chat
            key={idUser}
            roomId={socket.id}
            socket={socket}
            toUser={"admin"}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
