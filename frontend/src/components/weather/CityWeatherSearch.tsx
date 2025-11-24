import { useState } from 'react'
import { weatherAPI } from '../../lib/api'
import { useToast } from '../../hooks/useToast'

interface City {
  name: string
  latitude: number
  longitude: number
}

const POPULAR_CITIES: City[] = [
  { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333 },
  { name: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Belo Horizonte', latitude: -19.9191, longitude: -43.9386 },
  { name: 'Salvador', latitude: -12.9714, longitude: -38.5014 },
  { name: 'Brasília', latitude: -15.7794, longitude: -47.8822 },
  { name: 'Curitiba', latitude: -25.4284, longitude: -49.2733 },
  { name: 'Manaus', latitude: -3.1119, longitude: -60.0217 },
  { name: 'Fortaleza', latitude: -3.7319, longitude: -38.5267 },
  { name: 'Recife', latitude: -8.0476, longitude: -34.8770 },
  { name: 'Porto Alegre', latitude: -30.0344, longitude: -51.2170 },
]

export default function CityWeatherSearch({ onCollect }: { onCollect: (weatherData: any) => void }) {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const toast = useToast()

  const handleSearch = (value: string) => {
    setSearch(value)
    if (value.trim()) {
      const filtered = POPULAR_CITIES.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleCollectCity = async (city: City) => {
    setLoading(true)
    try {
      const response = await weatherAPI.collectByCity(city.name, city.latitude, city.longitude)
      if (response.data.success) {
        setSearch('')
        setShowSuggestions(false)
        toast.success(`Dados de ${city.name} coletados com sucesso!`)
        onCollect(response.data.data)
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || `Erro ao coletar dados de ${city.name}`
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pesquisar Clima por Cidade</h3>
      
      <div className="relative mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search.trim() && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Digite o nome de uma cidade..."
            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={loading}
          />
        </div>

        {showSuggestions && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCollectCity(city)}
                disabled={loading}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 border-b border-gray-200 dark:border-slate-700 last:border-b-0 transition text-gray-800 dark:text-white"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-gray-600 dark:text-slate-400 text-sm ml-2">
                  ({city.latitude.toFixed(2)}, {city.longitude.toFixed(2)})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 font-semibold">Cidades populares:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCollectCity(city)}
              disabled={loading}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-400 dark:disabled:from-slate-600 disabled:to-gray-400 dark:disabled:to-slate-600 text-white text-sm font-medium rounded transition transform hover:scale-105 active:scale-95"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
