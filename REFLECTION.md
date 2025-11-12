# Individual Reflection - PG3402 Microservices

**Student:** Mathias Alsos Paulsen
**Project:** PKMN/OP Binder - Digital TCG Collection Manager
**Date:** November 2025

---

## Project Overview

For this exam, I built Pokemon Binder - a microservices-based web app for managing Pokémon TCG collections. The project includes four main services (API Gateway, Catalog, Collection, and Media) that communicate both synchronously through REST and asynchronously via RabbitMQ. The goal was to demonstrate core microservices principles while building something actually useful for TCG collectors like myself.

## What I Built and Why

### The Core Architecture

I decided to go with an event-driven architecture where the Collection Service (write model) and Catalog Service (read model) communicate through RabbitMQ. This was inspired by CQRS patterns we discussed in class, though I simplified it quite a bit for the scope of this project. When a user adds or removes a card, the Collection Service publishes an event that the Catalog Service picks up. This keeps the services loosely coupled and makes the system more scalable.

Each service got its own PostgreSQL database. At first, I was tempted to just use one shared database since it seemed simpler, but after thinking about it, the separate databases really enforce the microservices principle of service independence. Sure, it means I can't do easy JOINs across services anymore, but that's where the event-driven stuff comes in handy.

### Technology Choices

**Spring Boot** was an obvious choice since we used it throughout the course, and honestly, it just makes building REST APIs really quick. The Spring ecosystem has pretty much everything you need - Spring Cloud Gateway for the API Gateway, Spring AMQP for RabbitMQ, Spring Actuator for health checks, etc.

For the Media Service, I went with **Python Flask** instead of another Spring Boot service. This was partly to show that microservices can use different tech stacks (polyglot architecture), but also because serving static image files with Python is just way simpler than setting up a whole Java service for it. It's lightweight and does exactly what it needs to do.

**RabbitMQ** over Kafka was mainly because we covered it more in class and I felt more comfortable with it. For this project's scale (one producer, one consumer), RabbitMQ is more than enough. Kafka would probably be overkill.

For the frontend, I just used vanilla JavaScript instead of React or Vue. The app isn't that complex UI-wise, and I wanted to keep the focus on the backend microservices architecture rather than getting caught up in frontend framework stuff.

## Biggest Challenges

### RabbitMQ Integration - The Real Struggle

Getting RabbitMQ working properly was honestly the hardest part of this whole project. The theory makes sense - publish an event here, consume it there - but actually implementing it was a different story.

My first major issue was with **message serialization**. I kept getting `InvalidDefinitionException` whenever I tried to send events that included Java 8 `Instant` fields (like timestamps). Turns out Jackson doesn't handle `java.time` types by default. After a bunch of Stack Overflow searching and reading docs, I had to configure a custom `MessageConverter` bean with the `JavaTimeModule`:

```java
@Bean
public MessageConverter messageConverter() {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    return new Jackson2JsonMessageConverter(objectMapper);
}
```

Once I got that sorted, everything started working. But man, that took way longer to figure out than it should have.

The second challenge was understanding **Docker networking** for container-to-container communication. In development, you can just use `localhost` for everything, but in Docker, services need to talk to each other using container names (like `rabbitmq:5672` or `catalog-db:5432`). This was confusing at first because the same code that worked locally wouldn't work in Docker until I switched the connection strings.

### Database Migrations with Flyway

Setting up Flyway was actually pretty smooth, but figuring out the best way to seed 258 Pokemon cards into the database took some thought. I ended up creating a V3 migration with all the INSERT statements. It's not the most elegant solution (the SQL file is huge), but it works and it's version controlled. Every time you start fresh, the cards are automatically loaded.

## Decisions I Made and Why

### Event-Driven but Not Full CQRS

I wanted to implement a CQRS-inspired design where Collection Service handles writes and Catalog Service handles reads. However, I didn't go full CQRS with event sourcing - that seemed like way too much complexity for this project. Instead, both services have their own databases with their own schemas, and they stay in sync through events.

The benefit here is that each service is optimized for what it needs to do. Collection Service focuses on data consistency and validation when users add/update cards. Catalog Service can be super aggressive with caching since card data is essentially read-only.

**Trade-off:** The system is eventually consistent, not immediately consistent. When you add a card to your collection, there's a tiny delay before Catalog Service knows about it (milliseconds, but still). For this app, that's totally fine. For something like a payment system, you'd need to think harder about consistency.

### API Gateway as Single Entry Point

Using Spring Cloud Gateway as the single entry point was a no-brainer. It centralizes all the cross-cutting concerns - CORS, rate limiting, routing - in one place instead of duplicating that logic across every service.

I set up **Redis-based rate limiting** (100 requests per minute per IP) to prevent abuse. In production, you'd want more sophisticated rate limiting per user, but for a demo, this shows I understand the concept.

One mistake I made early on was configuring CORS in both the Gateway *and* the individual services. That caused some weird behavior until I realized the Gateway should handle it and the services shouldn't care.

### Database per Service - Worth the Pain?

Having separate databases (catalog_db, collection_db) is definitely more work than a shared database. You can't just write a SQL JOIN to get data from both. You have to either:
1. Make multiple HTTP calls and combine data in the application
2. Use events to keep denormalized copies of data
3. Accept that some queries just can't be done efficiently

For this project, option 2 (events) made the most sense. When a card is added to a collection, the Catalog Service gets notified and could update its own records (though currently it just logs the event).

**Would I do it again?** Yes, because it forces you to think about service boundaries and data ownership. In a real company with multiple teams, each team owning their service's database makes total sense. But for a solo project, I'll admit it's extra complexity.

## What I'd Do Differently

### Start with RabbitMQ Earlier

If I could do this project again, I'd set up RabbitMQ integration in the first week, not the last. It took way longer than expected to debug the serialization issues and Docker networking stuff. By the time I got it working, I was scrambling to finish other features.

Starting with the hardest part first would've given me more time to polish other things and maybe implement the Share Service (which I had to cut).

### More Comprehensive Testing

I have some unit tests, but I'm missing a lot of integration tests. Specifically:
- Testing the full event flow from Collection Service → RabbitMQ → Catalog Service
- Integration tests with actual PostgreSQL and RabbitMQ containers (using Testcontainers)
- End-to-end tests of the entire system with Docker Compose

With more time, I'd definitely add these. Testing distributed systems is tricky, but it's super important.

### Better Observability from Day One

I added Prometheus and Grafana near the end, but I should've had them running from the start. When you're debugging issues in a distributed system with multiple services, good observability is critical. Things like:
- Distributed tracing (Zipkin or Jaeger) to see request flows across services
- Custom metrics for business logic (cards added, collection size, etc.)
- Structured logging with correlation IDs to track requests

## Key Takeaways

### Microservices Are Complex (But Powerful)

The biggest thing I learned is that microservices introduce a *lot* of complexity compared to a monolith:
- Network calls can fail - you need to handle retries, timeouts, circuit breakers
- Debugging is harder when logic is spread across services
- You need way more infrastructure (message brokers, service discovery, config servers)
- Data consistency is challenging without a shared database

**But**, you get some real benefits:
- Services can be deployed and scaled independently
- You can use different technologies for different services (Java, Python, etc.)
- Teams can work on different services without stepping on each other
- If one service crashes, the others keep running (resilience)

For this project's scale, a monolith would've been simpler. But the point was to learn microservices patterns, and I definitely did.

### Event-Driven Architecture is Powerful but Tricky

Using RabbitMQ for async communication taught me a lot about loose coupling. Collection Service doesn't need to know anything about Catalog Service - it just publishes events. If I added a Notification Service later, it could just start consuming the same events without changing Collection Service at all.

The tricky part is dealing with eventual consistency and making sure events don't get lost. In production, you'd want:
- Dead letter queues for failed messages
- Retry logic with exponential backoff
- Event versioning so you can evolve events without breaking consumers

### Infrastructure is a First-Class Citizen

In a monolith, you mostly just care about your application code and maybe a database. In microservices, understanding Docker, RabbitMQ, Redis, Prometheus, and how they all fit together is just as important as the Java code.

A lot of my time on this project wasn't spent writing business logic - it was spent configuring Docker Compose, debugging network issues, setting up health checks, etc. That's just the reality of microservices.

### Documentation Matters Way More

With multiple services, APIs, databases, and communication patterns, good documentation isn't optional. The README needs architecture diagrams, API examples, setup instructions, and troubleshooting tips. Otherwise, nobody (including future you) will understand how everything fits together.

I spent a lot of time on the README for this project, and I think it paid off. It's way easier to explain the architecture when you have clear diagrams and examples.

## What I Didn't Implement (and Why)

**Share Service:** This was the lowest priority of the three user stories. The core functionality (tracking cards and collections) was more important to get solid. The Share Service can be added later without major refactoring since it would just consume events from Collection Service.

**OAuth2/OIDC Enforcement:** I have the dependencies and configuration in place, but I disabled security to make testing easier. In production, this would obviously need to be enabled. For a demo project, though, I wanted to keep it simple.

**Load Balancing Demonstration:** The infrastructure is ready (API Gateway uses `lb://` URIs), but I didn't implement Consul service discovery or demonstrate scaling with multiple instances. This was a time trade-off - I prioritized getting the core requirements solid over the Grade A extras.

## Conclusion

Building PKMN/OP Binder taught me way more about microservices than any lecture could. The theory makes sense when you read about it, but actually implementing event-driven communication, dealing with eventual consistency, and debugging distributed systems is a completely different experience.

The biggest lesson: microservices are a powerful architectural pattern, but they come with real costs. Use them when you need independent deployment, team autonomy, or polyglot tech stacks. Don't use them just because they're trendy - a well-built monolith is often the better choice for smaller projects.

For this exam, though, I'm happy with what I built. All the critical requirements are solid, the architecture is clean, and the project demonstrates understanding of API Gateways, event-driven communication, database-per-service, and Docker orchestration. If I had another week, I'd add the Share Service, implement proper load balancing, and write more comprehensive tests. But for a month-long project while juggling other classes, I'm pretty satisfied with the result.

---

