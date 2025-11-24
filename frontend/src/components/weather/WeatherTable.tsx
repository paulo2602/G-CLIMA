import React from 'react'

interface WeatherData {
  _id: string
  city: string
  temperature: number
  humidity?: number
  pressure?: number
  description?: string
  windspeed: number
  winddirection?: number
  timestamp: string
  createdAt: string
}

export default function WeatherTable({ data }: { data: WeatherData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <th className="border p-3 text-left font-semibold">Cidade</th>
            <th className="border p-3 text-left font-semibold">Temperatura</th>
            <th className="border p-3 text-left font-semibold">Umidade</th>
            <th className="border p-3 text-left font-semibold">Pressão</th>
            <th className="border p-3 text-left font-semibold">Descrição</th>
            <th className="border p-3 text-left font-semibold">Vento (m/s)</th>
            <th className="border p-3 text-left font-semibold">Direção</th>
            <th className="border p-3 text-left font-semibold">Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="border p-6 text-center text-gray-500">
                Nenhum dado disponível
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50 transition">
                <td className="border p-3 font-medium text-blue-600">{item.city}</td>
                <td className="border p-3">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {item.temperature}°C
                  </span>
                </td>
                <td className="border p-3">{item.humidity ? `${item.humidity}%` : 'N/A'}</td>
                <td className="border p-3">{item.pressure ? `${item.pressure} hPa` : 'N/A'}</td>
                <td className="border p-3 capitalize">{item.description || 'N/A'}</td>
                <td className="border p-3">{item.windspeed?.toFixed(2) || 'N/A'} m/s</td>
                <td className="border p-3">{item.winddirection ? `${item.winddirection}°` : 'N/A'}</td>
                <td className="border p-3 text-xs text-gray-600">
                  {new Date(item.createdAt).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
