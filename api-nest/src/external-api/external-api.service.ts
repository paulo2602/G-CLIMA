import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalApiService {
  private marvelPublicKey: string;

  constructor(private configService: ConfigService) {
    this.marvelPublicKey = this.configService.get<string>('MARVEL_PUBLIC_KEY') || '';
  }

  async getPokemon(name: string) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
        timeout: 5000,
      });

      return {
        success: true,
        data: {
          name: response.data.name,
          id: response.data.id,
          height: response.data.height,
          weight: response.data.weight,
          types: response.data.types.map((t: any) => t.type.name),
          abilities: response.data.abilities.map((a: any) => a.ability.name),
          sprite: response.data.sprites.other['official-artwork'].front_default,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Pokémon "${name}" não encontrado`,
        error: error.message,
      };
    }
  }

  async getStarWarsCharacter(search: string) {
    try {
      const response = await axios.get(
        `https://swapi.dev/api/people/?search=${encodeURIComponent(search)}`,
        { timeout: 5000 }
      );

      if (response.data.results.length === 0) {
        return {
          success: false,
          message: `Personagem "${search}" não encontrado`,
        };
      }

      const character = response.data.results[0];

      return {
        success: true,
        data: {
          name: character.name,
          height: character.height,
          mass: character.mass,
          hairColor: character.hair_color,
          skinColor: character.skin_color,
          eyeColor: character.eye_color,
          birthYear: character.birth_year,
          gender: character.gender,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao buscar personagem Star Wars',
        error: error.message,
      };
    }
  }

  async getMarvelCharacter(search: string) {
    try {
      if (!this.marvelPublicKey) {
        return {
          success: false,
          message: 'Marvel API key não configurada',
        };
      }

      // Nota: Marvel API requer hash (MD5 de timestamp + privateKey + publicKey)
      // Para simplificar, estamos usando apenas o public key
      // Em produção, implementar autenticação correta

      const response = await axios.get(
        `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${encodeURIComponent(
          search
        )}&limit=1&apikey=${this.marvelPublicKey}`,
        { timeout: 5000 }
      );

      if (response.data.data.results.length === 0) {
        return {
          success: false,
          message: `Personagem Marvel "${search}" não encontrado`,
        };
      }

      const character = response.data.data.results[0];

      return {
        success: true,
        data: {
          id: character.id,
          name: character.name,
          description: character.description || 'Sem descrição',
          resourceURI: character.resourceURI,
          urls: character.urls,
          thumbnail: character.thumbnail,
          comics: character.comics.available,
          series: character.series.available,
          stories: character.stories.available,
          events: character.events.available,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao buscar personagem Marvel',
        error: error.message,
      };
    }
  }
}
