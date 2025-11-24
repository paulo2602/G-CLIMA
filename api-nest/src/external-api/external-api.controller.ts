import { Controller, Get, Query } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';

@Controller('api/external')
export class ExternalApiController {
  constructor(private readonly externalApiService: ExternalApiService) {}

  @Get('pokemon')
  async getPokemon(@Query('name') name: string) {
    return this.externalApiService.getPokemon(name);
  }

  @Get('swapi')
  async getStarWarsCharacter(@Query('search') search: string) {
    return this.externalApiService.getStarWarsCharacter(search);
  }

  @Get('marvel')
  async getMarvelCharacter(@Query('search') search: string) {
    return this.externalApiService.getMarvelCharacter(search);
  }
}
