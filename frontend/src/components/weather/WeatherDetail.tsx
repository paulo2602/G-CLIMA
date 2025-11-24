import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface WeatherDetailProps {
  city: string
  temperature: number
  description: string
  humidity: number
  windspeed: number
  pressure: number
  timestamp: string
  rainProbability?: number
}

export default function WeatherDetail({ 
  city, 
  temperature, 
  description, 
  humidity, 
  windspeed, 
  pressure,
  timestamp,
  rainProbability = 0
}: WeatherDetailProps) {
  // Dados simulados de temperatura por hora (próximas 24h)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temp: Math.round(temperature + Math.sin(i / 4) * 5 + Math.random() * 2),
  }))

  // Dados simulados de previsão para os próximos 7 dias
  const weeklyData = [
    { day: 'Hoje', description: description, high: Math.round(temperature + 3), low: Math.round(temperature - 5), rain: rainProbability },
    { day: 'Amanhã', description: 'Nublado', high: Math.round(temperature + 2), low: Math.round(temperature - 4), rain: 25 },
    { day: 'Ter', description: 'Chuva', high: Math.round(temperature + 1), low: Math.round(temperature - 6), rain: 70 },
    { day: 'Qua', description: 'Ensolarado', high: Math.round(temperature + 4), low: Math.round(temperature - 3), rain: 5 },
    { day: 'Qui', description: 'Ensolarado', high: Math.round(temperature + 5), low: Math.round(temperature - 2), rain: 0 },
    { day: 'Sex', description: 'Ensolarado', high: Math.round(temperature + 6), low: Math.round(temperature - 1), rain: 10 },
    { day: 'Sab', description: 'Parcial ensolarado', high: Math.round(temperature + 7), low: Math.round(temperature), rain: 30 },
  ]

  const getWeatherIcon = (desc: string) => {
    const lower = desc.toLowerCase()
    if (lower.includes('nublado')) return '☁️'
    if (lower.includes('chuva')) return '🌧️'
    if (lower.includes('ensolarado') || lower.includes('claro')) return '☀️'
    if (lower.includes('tempestade')) return '⛈️'
    if (lower.includes('neve')) return '❄️'
    return '🌤️'
  }

  const getBackgroundGradient = (desc: string) => {
    const lower = desc.toLowerCase()
    if (lower.includes('nublado')) return 'from-slate-400 to-slate-600'
    if (lower.includes('chuva')) return 'from-blue-400 to-blue-600'
    if (lower.includes('ensolarado') || lower.includes('claro')) return 'from-yellow-400 to-orange-500'
    if (lower.includes('tempestade')) return 'from-gray-600 to-gray-800'
    return 'from-cyan-400 to-blue-500'
  }

  const getRainEmoji = (prob: number) => {
    if (prob < 20) return '☀️'
    if (prob < 40) return '🌤️'
    if (prob < 60) return '⛅'
    if (prob < 80) return '🌧️'
    return '⛈️'
  }

  return (
    <div className="mb-8 space-y-6">
      {/* Card Principal com Gradient */}
      <div className={`bg-gradient-to-br ${getBackgroundGradient(description)} text-white rounded-3xl shadow-2xl p-8`}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">{city}</h2>
            <p className="text-lg opacity-90">
              {new Date(timestamp).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="text-7xl">{getWeatherIcon(description)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-6xl font-bold mb-2">{Math.round(temperature)}°C</div>
            <p className="text-2xl capitalize opacity-90">{description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-75">Umidade</p>
              <p className="text-3xl font-bold">{humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-75">Vento</p>
              <p className="text-3xl font-bold">{Math.round(windspeed * 3.6)} km/h</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-75">Pressão</p>
              <p className="text-3xl font-bold">{pressure} hPa</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-75">Chuva</p>
              <p className="text-3xl font-bold">{rainProbability}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Probabilidade de Chuva - Card shadcn/ui */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRainEmoji(rainProbability)} Probabilidade de Chuva
          </CardTitle>
          <CardDescription>Previsão baseada em dados meteorológicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      rainProbability < 30 ? 'bg-green-500' :
                      rainProbability < 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${rainProbability}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold min-w-12 text-right">{rainProbability}%</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {rainProbability < 20 && <Badge>Céu Limpo</Badge>}
              {rainProbability >= 20 && rainProbability < 40 && <Badge variant="secondary">Possível Chuva</Badge>}
              {rainProbability >= 40 && rainProbability < 70 && <Badge variant="secondary">Provável Chuva</Badge>}
              {rainProbability >= 70 && <Badge variant="destructive">Chuva Esperada</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Temperatura por Hora */}
      <Card>
        <CardHeader>
          <CardTitle>Temperatura - Próximas 24h</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                }}
                formatter={(value) => `${value}°C`}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Previsão para 7 Dias */}
      <Card>
        <CardHeader>
          <CardTitle>Previsão para 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-800 mb-2">{day.day}</p>
                <p className="text-3xl mb-2">{getWeatherIcon(day.description)}</p>
                <p className="text-xs text-gray-600 mb-3 capitalize h-8 line-clamp-2">{day.description}</p>
                <div className="flex justify-center gap-2 text-sm font-bold mb-2">
                  <span className="text-red-500">{day.high}°</span>
                  <span className="text-blue-500">{day.low}°</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <span>{getRainEmoji(day.rain)}</span>
                  <span className="text-gray-600">{day.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
