import React, { useEffect } from 'react'
import { useState } from "react";
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const options = {
  scales:{
    y:{
      beginAtZero: true,
      ticks: {
        color: '#ffffff',
      },
    },
    x:{
      ticks: {
        color: '#ffffff',
      },
    },
    }
  };

export function HistoricComponent(props) {
  const {setPopup, trigger, idDevice} = props;
  const [energy, setEnergy] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [chart, setChart] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");


  const newTheme = (theme) => createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        main: '#ffffff',
        
      },
    },
  })

  useEffect(() => {
      axios.get(`http://localhost:3003/energy/byDevice/${idDevice}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const energyFromApi = response.data;
        const filteredEnergy = energyFromApi.filter((energy) => {

          const dateEnergy = new Date(energy.timestamp);
          dateEnergy.setHours(dateEnergy.getHours() - 2);
          
          const dateSelected = new Date(date);
          dateSelected.setHours(dateEnergy.getHours() - 2);

          if (dateEnergy.getDate() === dateSelected.getDate() && dateEnergy.getMonth() === dateSelected.getMonth() && dateEnergy.getFullYear() === dateSelected.getFullYear()) {
            return energy;
          }
          return null;
        });        

        if (filteredEnergy.length > 0) {

          filteredEnergy.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateA - dateB;
          });

          const promises = filteredEnergy.map((energyItem) => {
            const dateEnergy = new Date(energyItem.timestamp);
            dateEnergy.setHours(dateEnergy.getHours() - 2);
            const timestamp = `${dateEnergy.getHours()}`;
            return timestamp;
          });

          const data= {
          labels: promises,
          datasets: [
            {
              label: 'Energy',
              data: filteredEnergy.map((energyItem) => energyItem.consumption),
              backgroundColor: '#1e6bb8',
            },
          ],
          };

          setChart(data ? <div className='energy-chart'> <Bar data={data} options={options} /> </div> : "");
          setEnergy(filteredEnergy);
    
        } else {
          setChart("");
        } 
      }).catch(() => {
        alert("No energy found")
      });
  }, [idDevice, date]);



  return (trigger) ? (
    <div className='Historic'>
      <button className='close-button' onClick={() => setPopup(false)}>X</button>
      <div className='date-picker'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <ThemeProvider theme={newTheme}>
              <DatePicker   
                label="Pick a date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </ThemeProvider>
          </DemoContainer>
        </LocalizationProvider>
      </div>
        {chart}
    </div>
  ) : "";
}

