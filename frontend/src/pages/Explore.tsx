import { useEffect, useState } from 'react'
import { weatherAPI } from '../lib/api'
import Sidebar from '../components/layout/Sidebar'
import TemperatureChart from '../components/charts/TemperatureChart'
import CityCard from '../components/weather/CityCard'

export default function Explore() {
  const [weather, setWeather] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await weatherAPI.getAll()
        // Limitar a 6 registros mais recentes
        setWeather(response.data.slice(0, 6))
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  // Calcular estatísticas
  const stats = {
    avgTemp: weather.length > 0 ? Math.round(weather.reduce((acc, w) => acc + w.temperature, 0) / weather.length) : 0,
    maxTemp: weather.length > 0 ? Math.max(...weather.map(w => w.temperature)) : 0,
    minTemp: weather.length > 0 ? Math.min(...weather.map(w => w.temperature)) : 0,
    avgRain: weather.length > 0 ? Math.round(weather.reduce((acc, w) => acc + (w.rainProbability || 0), 0) / weather.length) : 0,
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Explorar
          </h1>
          <p className="text-gray-600 dark:text-slate-400">Análise e visualização de dados climáticos</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              <p className="mt-6 text-gray-600 dark:text-slate-400 text-lg">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            {weather.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-600 dark:to-orange-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-semibold text-orange-200">Temperatura Média</p>
                  <p className="text-3xl font-bold mt-2">{stats.avgTemp}°C</p>
                </div>
                <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-600 dark:to-red-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-semibold text-red-200">Máxima</p>
                  <p className="text-3xl font-bold mt-2">{stats.maxTemp}°C</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-semibold text-blue-200">Mínima</p>
                  <p className="text-3xl font-bold mt-2">{stats.minTemp}°C</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 dark:from-cyan-600 dark:to-cyan-700 rounded-lg p-6 text-white">
                  <p className="text-sm font-semibold text-cyan-200">Chuva Média</p>
                  <p className="text-3xl font-bold mt-2">{stats.avgRain}%</p>
                </div>
              </div>
            )}

            {/* Temperature Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Gráfico de Temperatura</h2>
              {weather.length > 0 ? (
                <TemperatureChart data={weather} />
              ) : (
                <div className="text-center py-12 text-gray-600 dark:text-slate-400">
                  <p>Nenhum dado disponível para gráfico</p>
                </div>
              )}
            </div>

            {/* All Cities Grid */}
            {weather.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Todas as Cidades
                  <span className="text-gray-600 dark:text-slate-400 text-lg ml-2">({weather.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {weather.map((item: any) => (
                    <CityCard
                      key={item._id}
                      city={item.city}
                      temperature={item.temperature}
                      description={item.description || 'Clima variável'}
                      humidity={item.humidity || 0}
                      windspeed={item.windspeed || 0}
                      pressure={item.pressure || 0}
                      rainProbability={item.rainProbability || 0}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
