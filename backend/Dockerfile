# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy all source code
COPY . .

# Download dependencies and build
RUN go mod download && go mod tidy && \
    CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/server && \
    CGO_ENABLED=0 GOOS=linux go build -o /app/bin/seed ./cmd/seed

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Copy binaries from builder
COPY --from=builder /app/bin/server .
COPY --from=builder /app/bin/seed .

# Copy .env file (optional, better to use env variables)
COPY .env* ./

EXPOSE 8080

CMD ["./server"]
