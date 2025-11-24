/**
 * Mapeamento de Weather Codes OpenWeather para Probabilidade de Chuva
 * Basado em: https://openweathermap.org/weather-conditions
 */

export interface RainInfo {
  probability: number
  description: string
  intensity: 'none' | 'light' | 'moderate' | 'heavy'
}

const WEATHER_CODE_MAP: Record<number, RainInfo> = {
  // Clear
  800: { probability: 0, description: 'Céu limpo', intensity: 'none' },
  
  // Nuvens
  801: { probability: 10, description: 'Poucas nuvens', intensity: 'none' },
  802: { probability: 25, description: 'Nuvens dispersas', intensity: 'none' },
  803: { probability: 40, description: 'Nublado', intensity: 'none' },
  804: { probability: 60, description: 'Muito nublado', intensity: 'light' },
  
  // Chuva leve
  500: { probability: 30, description: 'Chuva leve', intensity: 'light' },
  501: { probability: 50, description: 'Chuva moderada', intensity: 'moderate' },
  502: { probability: 70, description: 'Chuva forte', intensity: 'heavy' },
  503: { probability: 85, description: 'Chuva muito forte', intensity: 'heavy' },
  504: { probability: 95, description: 'Chuva extrema', intensity: 'heavy' },
  
  // Chuva congelante
  511: { probability: 80, description: 'Chuva congelante', intensity: 'heavy' },
  
  // Garoa
  300: { probability: 20, description: 'Garoa leve', intensity: 'light' },
  301: { probability: 35, description: 'Garoa', intensity: 'light' },
  302: { probability: 55, description: 'Garoa intensa', intensity: 'moderate' },
  
  // Chuva com garoa
  310: { probability: 30, description: 'Garoa e chuva leve', intensity: 'light' },
  311: { probability: 45, description: 'Chuva com garoa', intensity: 'moderate' },
  312: { probability: 65, description: 'Chuva com garoa intensa', intensity: 'heavy' },
  313: { probability: 70, description: 'Garoa e chuva', intensity: 'heavy' },
  314: { probability: 85, description: 'Garoa e chuva forte', intensity: 'heavy' },
  
  // Chuva com granizo
  320: { probability: 60, description: 'Chuva com granizo leve', intensity: 'moderate' },
  321: { probability: 75, description: 'Chuva com granizo', intensity: 'heavy' },
  
  // Tempestade
  200: { probability: 80, description: 'Tempestade com chuva leve', intensity: 'heavy' },
  201: { probability: 90, description: 'Tempestade com chuva', intensity: 'heavy' },
  202: { probability: 95, description: 'Tempestade com chuva forte', intensity: 'heavy' },
  210: { probability: 70, description: 'Tempestade leve', intensity: 'moderate' },
  211: { probability: 80, description: 'Tempestade', intensity: 'heavy' },
  212: { probability: 95, description: 'Tempestade forte', intensity: 'heavy' },
  221: { probability: 85, description: 'Tempestade irregular', intensity: 'heavy' },
  230: { probability: 75, description: 'Tempestade com garoa leve', intensity: 'heavy' },
  231: { probability: 85, description: 'Tempestade com garoa', intensity: 'heavy' },
  232: { probability: 95, description: 'Tempestade com garoa forte', intensity: 'heavy' },
  
  // Neve
  600: { probability: 30, description: 'Neve leve', intensity: 'light' },
  601: { probability: 50, description: 'Neve', intensity: 'moderate' },
  602: { probability: 70, description: 'Nevasca', intensity: 'heavy' },
  611: { probability: 40, description: 'Chuva e neve', intensity: 'moderate' },
  612: { probability: 60, description: 'Chuva e neve leve', intensity: 'moderate' },
  613: { probability: 80, description: 'Chuva e nevasca', intensity: 'heavy' },
  615: { probability: 35, description: 'Chuva leve e neve', intensity: 'light' },
  616: { probability: 50, description: 'Chuva e neve', intensity: 'moderate' },
  620: { probability: 20, description: 'Neve leve', intensity: 'light' },
  621: { probability: 40, description: 'Neve', intensity: 'moderate' },
  622: { probability: 60, description: 'Nevasca', intensity: 'heavy' },
  
  // Névoa/Bruma
  701: { probability: 5, description: 'Névoa', intensity: 'none' },
  711: { probability: 10, description: 'Fumaça', intensity: 'none' },
  721: { probability: 5, description: 'Bruma', intensity: 'none' },
  731: { probability: 5, description: 'Pó/areia', intensity: 'none' },
  741: { probability: 15, description: 'Neblina', intensity: 'light' },
  751: { probability: 10, description: 'Pó', intensity: 'none' },
  761: { probability: 5, description: 'Areia', intensity: 'none' },
  762: { probability: 20, description: 'Cinzas vulcânicas', intensity: 'light' },
  771: { probability: 40, description: 'Redemoinhos', intensity: 'moderate' },
  781: { probability: 85, description: 'Tornado', intensity: 'heavy' },
}

export function calculateRainProbability(weatherCode?: number, description?: string): RainInfo {
  // Se temos weather code, usar mapeamento
  if (weatherCode && WEATHER_CODE_MAP[weatherCode]) {
    return WEATHER_CODE_MAP[weatherCode]
  }

  // Fallback para descrição de texto
  if (description) {
    const desc = description.toLowerCase()
    
    if (desc.includes('tornado') || desc.includes('tempestade forte')) {
      return { probability: 95, description: 'Tornado/Tempestade Forte', intensity: 'heavy' }
    }
    if (desc.includes('tempestade') || desc.includes('thunderstorm')) {
      return { probability: 80, description: 'Tempestade', intensity: 'heavy' }
    }
    if (desc.includes('chuva') || desc.includes('rain')) {
      if (desc.includes('forte') || desc.includes('heavy')) {
        return { probability: 70, description: 'Chuva Forte', intensity: 'heavy' }
      }
      if (desc.includes('moderada') || desc.includes('moderate')) {
        return { probability: 50, description: 'Chuva Moderada', intensity: 'moderate' }
      }
      return { probability: 35, description: 'Chuva', intensity: 'light' }
    }
    if (desc.includes('neve') || desc.includes('snow')) {
      return { probability: 50, description: 'Neve', intensity: 'moderate' }
    }
    if (desc.includes('nublado') || desc.includes('cloud') || desc.includes('cloudy')) {
      return { probability: 40, description: 'Nublado', intensity: 'light' }
    }
    if (desc.includes('ensolarado') || desc.includes('clear') || desc.includes('sunny')) {
      return { probability: 0, description: 'Ensolarado', intensity: 'none' }
    }
  }

  // Default
  return { probability: 20, description: 'Clima variável', intensity: 'light' }
}

export function getRainEmoji(probability: number): string {
  if (probability === 0) return '☀️'
  if (probability < 20) return '🌤️'
  if (probability < 40) return '⛅'
  if (probability < 60) return '🌥️'
  if (probability < 80) return '🌧️'
  return '⛈️'
}

export function getIntensityLabel(intensity: 'none' | 'light' | 'moderate' | 'heavy'): string {
  const labels = {
    none: 'Nenhuma',
    light: 'Leve',
    moderate: 'Moderada',
    heavy: 'Forte'
  }
  return labels[intensity]
}
