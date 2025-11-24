import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE_NAME = os.getenv("QUEUE_NAME", "weather.raw")

# OpenWeather API
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "0d0c8b1c2c8b1c0d0c8b1c2c8b1c0d0d")

# São Paulo coordinates
LATITUDE = os.getenv("LATITUDE", "-23.5505")
LONGITUDE = os.getenv("LONGITUDE", "-46.6333")
INTERVAL_MINUTES = int(os.getenv("INTERVAL_MINUTES", "60"))

