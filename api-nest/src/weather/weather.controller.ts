import { Controller, Get, Post, Body, Response } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Post('logs')
  async createLog(@Body() body: any) {
    return this.weatherService.create(body);
  }

  @Post('collect')
  async triggerCollection() {
    return this.weatherService.triggerWeatherCollection();
  }

  @Post('collect-city')
  async collectByCity(@Body() body: { city: string; latitude: number; longitude: number }) {
    return this.weatherService.collectWeatherByCity(body.city, body.latitude, body.longitude);
  }

  @Get('logs')
  async getLogs() {
    return this.weatherService.findAll();
  }

  @Get('export.csv')
  async exportCSV(@Response() res: any) {
    const csv = await this.weatherService.exportCSV();
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="weather.csv"');
    res.send(csv);
  }

  @Get('export.xlsx')
  async exportXLSX(@Response() res: any) {
    const xlsx = await this.weatherService.exportXLSX();
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.header('Content-Disposition', 'attachment; filename="weather.xlsx"');
    res.send(xlsx);
  }

  @Get('insights')
  async getInsights() {
    return this.weatherService.getInsights();
  }
}
