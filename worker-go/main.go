package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherMessage struct {
	Timestamp     string  `json:"timestamp"`
	Temperature   float64 `json:"temperature"`
	Windspeed     float64 `json:"windspeed"`
	Winddirection float64 `json:"winddirection"`
	City          string  `json:"city"`
}

func main() {
	rabbitURL := getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
	apiBase := getenv("API_BASE_URL", "http://api:3000")

	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		log.Fatalf("Erro ao conectar no RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather.raw", true, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("Erro ao declarar fila: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name, "", false, false, false, false, nil,
	)
	if err != nil {
		log.Fatalf("Erro ao consumir fila: %v", err)
	}

	log.Println("Worker Go iniciado, aguardando mensagens...")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Mensagem recebida: %s", d.Body)

			var msg WeatherMessage
			if err := json.Unmarshal(d.Body, &msg); err != nil {
				log.Println("Erro ao parsear JSON, NACK:", err)
				d.Nack(false, false)
				continue
			}

			// Enviar para API NestJS
			if err := sendToAPI(apiBase, msg); err != nil {
				log.Println("Erro ao enviar pra API, requeue:", err)
				d.Nack(false, true)
			} else {
				d.Ack(false)
			}
		}
	}()

	<-forever
}

func sendToAPI(apiBase string, msg WeatherMessage) error {
	body, _ := json.Marshal(msg)
	url := apiBase + "/weather/logs"

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return err
	}

	log.Println("Enviado para API com sucesso")
	return nil
}

func getenv(key, def string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}
	return def
}
