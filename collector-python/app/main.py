import json
import time
import schedule
import requests
import pika
from datetime import datetime

from config import RABBITMQ_URL, QUEUE_NAME, LATITUDE, LONGITUDE, INTERVAL_MINUTES, OPENWEATHER_API_KEY

def get_weather():
  url = (
    "https://api.openweathermap.org/data/2.5/weather"
    f"?lat={LATITUDE}&lon={LONGITUDE}"
    f"&units=metric&appid={OPENWEATHER_API_KEY}"
  )
  resp = requests.get(url, timeout=10)
  resp.raise_for_status()
  data = resp.json()

  payload = {
    "timestamp": datetime.fromtimestamp(data.get("dt", 0)).isoformat(),
    "temperature": data.get("main", {}).get("temp"),
    "humidity": data.get("main", {}).get("humidity"),
    "pressure": data.get("main", {}).get("pressure"),
    "windspeed": data.get("wind", {}).get("speed"),
    "winddirection": data.get("wind", {}).get("deg", 0),
    "description": data.get("weather", [{}])[0].get("description", "N/A"),
    "city": "São Paulo",
  }
  print("Coletado:", payload)
  send_to_queue(payload)

def send_to_queue(payload):
  params = pika.URLParameters(RABBITMQ_URL)
  connection = pika.BlockingConnection(params)
  channel = connection.channel()
  channel.queue_declare(queue=QUEUE_NAME, durable=True)
  channel.basic_publish(
    exchange="",
    routing_key=QUEUE_NAME,
    body=json.dumps(payload),
    properties=pika.BasicProperties(delivery_mode=2),
  )
  print("Enviado para fila")
  connection.close()

def job():
  try:
    get_weather()
  except Exception as e:
    print("Erro na coleta:", e)

def main():
  print("Iniciando collector com OpenWeather...")
  schedule.every(INTERVAL_MINUTES).minutes.do(job)
  job()
  while True:
    schedule.run_pending()
    time.sleep(1)

if __name__ == "__main__":
  main()

