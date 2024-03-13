import axios from 'axios';

export const getDevices = async (idUser, token) => {
    axios.get(`http://localhost:3001/devices/user/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        return response.data;
        }).catch(() => {
        alert("No devices found")
    });
}