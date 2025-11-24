import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TemperatureChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperatura (°C)" />
        <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Umidade (%)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
