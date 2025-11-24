import { Cloud, CloudRain, Wind, Droplets, Eye, Gauge } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface CityCardProps {
  city: string
  temperature: number
  description: string
  humidity: number
  windspeed: number
  pressure: number
  rainProbability: number
  icon?: string
  onClick?: () => void
}

export default function CityCard({
  city,
  temperature,
  description,
  humidity,
  windspeed,
  pressure,
  rainProbability,
  onClick,
}: CityCardProps) {
  const getWeatherIcon = () => {
    if (rainProbability > 60) {
      return <CloudRain className="w-12 h-12 text-blue-400" />
    }
    return <Cloud className="w-12 h-12 text-gray-400" />
  }

  const getRainIntensity = (prob: number) => {
    if (prob < 20) return { label: 'Sem chuva', color: 'bg-green-100 text-green-800' }
    if (prob < 50) return { label: 'Risco baixo', color: 'bg-yellow-100 text-yellow-800' }
    if (prob < 80) return { label: 'Risco alto', color: 'bg-orange-100 text-orange-800' }
    return { label: 'Muito provável', color: 'bg-red-100 text-red-800' }
  }

  const rainIntensity = getRainIntensity(rainProbability)

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 border-gray-200 dark:border-slate-700"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-800 dark:text-white">{city}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400 capitalize">{description}</CardDescription>
          </div>
          {getWeatherIcon()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Temperatura Grande */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-400">{Math.round(temperature)}°</span>
          <span className="text-gray-600 dark:text-slate-400">C</span>
        </div>

        {/* Badges de Chuva */}
        <div className="flex flex-wrap gap-2">
          <Badge className={`${rainIntensity.color} border-0`}>
            {rainProbability}% chuva
          </Badge>
          {rainProbability > 60 && (
            <Badge className="bg-blue-100 text-blue-800 border-0">
              ⚠️ Alerta
            </Badge>
          )}
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
            <Droplets size={18} className="text-blue-400" />
            <div className="text-sm">
              <p className="text-xs text-gray-600 dark:text-slate-400">Umidade</p>
              <p className="font-semibold">{humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
            <Wind size={18} className="text-cyan-400" />
            <div className="text-sm">
              <p className="text-xs text-gray-600 dark:text-slate-400">Vento</p>
              <p className="font-semibold">{windspeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
            <Gauge size={18} className="text-amber-400" />
            <div className="text-sm">
              <p className="text-xs text-gray-600 dark:text-slate-400">Pressão</p>
              <p className="font-semibold">{pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
            <Eye size={18} className="text-purple-400" />
            <div className="text-sm">
              <p className="text-xs text-gray-600 dark:text-slate-400">Chance</p>
              <p className="font-semibold">{rainProbability}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
