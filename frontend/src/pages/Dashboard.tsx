import { useEffect, useState } from 'react'
import { weatherAPI } from '../lib/api'
import Sidebar from '../components/layout/Sidebar'
import WeatherDetail from '../components/weather/WeatherDetail'
import CityWeatherSearch from '../components/weather/CityWeatherSearch'
import CityCard from '../components/weather/CityCard'

export default function Dashboard() {
  const [weather, setWeather] = useState([])
  const [selectedWeather, setSelectedWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const response = await weatherAPI.getAll()
      // Limitar a 6 registros mais recentes para o grid
      setWeather(response.data.slice(0, 6))
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Apenas carregar dados existentes, sem coleta inicial
    fetchWeather()
  }, [])

  const handleCityClick = (weatherData: any) => {
    setSelectedWeather(weatherData)
  }

  const handleCollectSuccess = (weatherData: any) => {
    // Atualizar tabela com novos dados
    fetchWeather()
    // Exibir detalhes do primeiro resultado (mais recente)
    if (weatherData) {
      setSelectedWeather(weatherData)
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-slate-400">Acompanhe o clima em tempo real</p>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <CityWeatherSearch onCollect={handleCollectSuccess} />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              <p className="mt-6 text-slate-400 text-lg">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Exibir detalhes da cidade selecionada */}
            {selectedWeather && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Detalhes da Cidade</h2>
                <WeatherDetail
                  city={selectedWeather.city}
                  temperature={selectedWeather.temperature}
                  description={selectedWeather.description || 'Clima variável'}
                  humidity={selectedWeather.humidity || 0}
                  windspeed={selectedWeather.windspeed}
                  pressure={selectedWeather.pressure || 0}
                  timestamp={selectedWeather.createdAt}
                  rainProbability={selectedWeather.rainProbability || 0}
                />
              </div>
            )}

            {/* Grid de Cidades */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Cidades Monitoradas
                <span className="text-gray-600 dark:text-slate-400 text-lg ml-2">({weather.length})</span>
              </h2>

              {weather.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      onClick={() => handleCityClick(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-100 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-gray-600 dark:text-slate-400 text-lg">Nenhuma cidade monitorada</p>
                  <p className="text-gray-500 dark:text-slate-500 text-sm mt-2">Pesquise uma cidade acima para começar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
