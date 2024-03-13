import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";

const socket = io("http://localhost:3003");

export function  AlertDeviceConsumptionComponent() {
    const idUser = sessionStorage.getItem("id");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [devices, setDevices] = useState([]);
    const [alertMessage, setAlertMessage] = useState([]);
    const [token, setToken] = useState(sessionStorage.getItem("token") || "");

    useEffect(() => {
      axios.get(`http://localhost:3001/devices/user/${idUser}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const devicesFromApi = response.data.map((device) => ({
        id: device.id,
        energyConsumption: device.energyConsumption,
        }));
        setDevices(devicesFromApi);
        }).catch(() => {
        alert("No devices found")
      });
    }, [socket]);

    useEffect(() => {
      socket.on('connect', () => {
        setIsConnected(true);
      });
  
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
  
      socket.on('alert', async msg => {
        const device = devices.find((device) => +device.id === +msg.deviceId);

        if(device){
          const message = "- device " + msg.deviceId + " has consumed " + (msg.hourlyConsumption - device.energyConsumption) + "kw plus in the last hour!";
          setAlertMessage([...alertMessage, message]);
        }
        
      });
    }, [socket, alertMessage, devices]);
    return (
      <div className="message-alert-log">
          {alertMessage.map((message, index) => (
              <div key={index} className="message-alert">
                {message}
              </div>
          ))}
      </div>
    );
}