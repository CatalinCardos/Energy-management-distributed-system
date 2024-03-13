import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { AppService } from './app.service';
import { EnergyDto } from './dtos/energy.dto';

const FREQUENCY = process.env.FREQUENCY;
const DEVICE_ID = process.env.DEVICE_ID;

async function bootstrap() {
const app = await NestFactory.createApplicationContext(AppModule);
const appService = app.get(AppService);

const csvFilePath = path.join(__dirname, '..\\sensor.csv');
const headers = ['value'];
let currentLine = 0;
let minutesAhead: number = 0;
let lastValue = 0;

console.log(csvFilePath)

const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

const sendDataToQueue = () =>{
  const timeStamp: Date = new Date();
  timeStamp.setMinutes(timeStamp.getMinutes() + minutesAhead);
  minutesAhead+=10;
  timeStamp.setHours(timeStamp.getHours() + 2);
  console.log(timeStamp);

  parse(fileContent, { columns: headers, skip_empty_lines: true }, (err, records) => {

      const value = records[currentLine].value - lastValue;
      lastValue = records[currentLine].value;
      currentLine++;
      const message : EnergyDto = {
          deviceId: +DEVICE_ID,
          consumption: value,
          timestamp: timeStamp
      };
      appService.createEnergy(message);
  });
}

setInterval(sendDataToQueue, +FREQUENCY);

}
bootstrap();
