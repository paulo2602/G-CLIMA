import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from './weather.schema';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { calculateRainProbability } from './weather-utils';

@Injectable()
export class WeatherService {
  private openWeatherApiKey: string;

  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private configService: ConfigService,
  ) {
    this.openWeatherApiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
  }

  async create(data: Partial<Weather>) {
    const created = new this.weatherModel(data);
    return created.save();
  }

  async triggerWeatherCollection() {
    try {
      // Collect weather data from OpenWeather API for São Paulo
      const url =
        'https://api.openweathermap.org/data/2.5/weather?lat=-23.5505&lon=-46.6333&units=metric&appid=' +
        this.openWeatherApiKey;

      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      const weatherLog = {
        timestamp: new Date(data.dt * 1000).toISOString(),
        temperature: data.main.temp,
        windspeed: data.wind.speed,
        winddirection: data.wind.deg || 0,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather?.[0]?.description || 'N/A',
        city: 'São Paulo',
      };

      const created = await this.create(weatherLog);
      return {
        success: true,
        message: 'Weather data collected successfully',
        data: created,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error collecting weather data',
        error: error?.message || 'Unknown error',
      };
    }
  }

  async collectWeatherByCity(city: string, latitude: number, longitude: number) {
    try {
      // Collect weather data from OpenWeather API
      const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=` +
        this.openWeatherApiKey;

      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      // Calcular probabilidade de chuva baseado no weather code
      const rainInfo = calculateRainProbability(data.weather?.[0]?.id, data.weather?.[0]?.description);

      const weatherLog = {
        timestamp: new Date(data.dt * 1000).toISOString(),
        temperature: data.main.temp,
        windspeed: data.wind.speed,
        winddirection: data.wind.deg || 0,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather?.[0]?.description || 'N/A',
        city: city,
        rainProbability: rainInfo.probability,
        weatherCode: data.weather?.[0]?.id,
      };

      const created = await this.create(weatherLog);
      return {
        success: true,
        message: `Weather data for ${city} collected successfully`,
        data: created,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error collecting weather data for ${city}`,
        error: error?.message || 'Unknown error',
      };
    }
  }

  async findAll() {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(200);
  }

  async exportCSV() {
    const data = await this.weatherModel.find().lean();
    const parser = new Parser();
    return parser.parse(data);
  }

  async exportXLSX(): Promise<Buffer> {
    const data = await this.weatherModel.find().lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather');

    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
      data.forEach((row) => sheet.addRow(row));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getInsights() {
    const data = await this.weatherModel
      .find()
      .sort({ createdAt: -1 })
      .limit(48)
      .lean();

    if (!data.length) return { message: 'Sem dados suficientes' };

    const avgTemp =
      data.reduce((sum, d) => sum + (d.temperature || 0), 0) / data.length;

    let label = 'clima agradável';
    if (avgTemp >= 30) label = 'calor intenso';
    else if (avgTemp <= 18) label = 'frio';

    return {
      averageTemperature: avgTemp.toFixed(1),
      label,
      summary: `Nos últimos ${data.length} registros, a temperatura média foi de ${avgTemp.toFixed(
        1,
      )}°C, indicando ${label}.`,
    };
  }
}
