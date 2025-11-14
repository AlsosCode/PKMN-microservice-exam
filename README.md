# Pokemon Binder - Digital TCG Collection Manager

A microservices-based Pokemon TCG collection manager demonstrating event-driven architecture, service discovery, and API Gateway patterns.

**Student:** Mathias Alsos Paulsen
**Course:** PG3402 Microservices
**Date:** November 2025

![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?logo=springboot)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Events-FF6600?logo=rabbitmq)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

---

## 🚀 Quick Start

See **[SETUP.md](SETUP.md)** for complete setup instructions.

```bash
# Quick start
mvn clean package -DskipTests
docker compose up -d
```

Visit: http://localhost:8888 (frontend served via Python HTTP server)

## 🏗️ Architecture

### Services
- **API Gateway** (8080) - Spring Cloud Gateway with rate limiting
- **Catalog Service** (8081) - Card metadata (read model)
- **Collection Service** (8082) - User collections (write model)
- **Media Service** (8084) - Python Flask image server
- **Consul** (8500) - Service discovery and centralized config
- **PostgreSQL** (5432/5433) - Database per service
- **RabbitMQ** (5672) - Asynchronous events

### Communication
- **Synchronous**: REST/HTTP via API Gateway
- **Asynchronous**: RabbitMQ events (CardAdded, CardUpdated, CardRemoved)

## 🛠️ Technologies

- Spring Boot 3.2.0, Spring Cloud Gateway, Spring AMQP
- PostgreSQL 15, RabbitMQ 3.13, Redis, Consul
- Docker, Prometheus, Grafana
- Python Flask (media service)
- Vanilla JavaScript frontend

See **[SETUP.md](SETUP.md)** for detailed testing and verification instructions.

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup and testing instructions
- **[REFLECTION.md](REFLECTION.md)** - Individual reflection and lessons learned

## 📞 Contact

Mathias Alsos Paulsen | [GitHub](https://github.com/AlsosCode) | Mathias.Alsos03@gmail.com
