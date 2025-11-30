.PHONY: help setup run build test clean docker-build docker-up docker-down migrate seed reset swagger-install swagger swagger-fmt

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Complete setup (install deps, swagger, docker up, seed)
	@echo "🚀 Starting complete setup..."
	@echo ""
	@echo "📦 Step 1/5: Installing Go dependencies..."
	@$(MAKE) install
	@echo ""
	@echo "🔧 Step 2/5: Installing Swagger CLI..."
	@$(MAKE) swagger-install
	@echo ""
	@echo "📝 Step 3/5: Generating Swagger documentation..."
	@$(MAKE) swagger
	@echo ""
	@echo "🐳 Step 4/5: Starting Docker containers..."
	@docker-compose up -d --build
	@echo ""
	@echo "⏳ Waiting for containers to be ready..."
	@sleep 10
	@echo ""
	@echo "🌱 Step 5/5: Seeding database..."
	@$(MAKE) seed
	@echo ""
	@echo "✅ Setup completed successfully!"
	@echo ""
	@echo "🎉 Application is ready!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "API:     http://localhost:8080"
	@echo "Swagger: http://localhost:8080/docs/index.html"
	@echo ""
	@echo "Login credentials:"
	@echo "  Admin:     admin@recruitment.com / admin123"
	@echo "  Candidate: joao.silva@email.com / candidate123"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run: ## Run the application
	go run cmd/server/main.go

build: ## Build the application
	go build -o bin/server cmd/server/main.go

test: ## Run tests
	go test -v ./...

clean: ## Clean build artifacts
	rm -rf bin/

install: ## Install dependencies
	go mod download
	go mod tidy

swagger-install: ## Install swagger CLI
	go install github.com/swaggo/swag/cmd/swag@latest
	@echo "Swagger CLI instalado em: $$(go env GOPATH)/bin/swag"

swagger: ## Generate swagger documentation
	@if [ ! -f "$$(go env GOPATH)/bin/swag" ]; then \
		echo "❌ Swagger CLI não encontrado. Execute: make swagger-install"; \
		exit 1; \
	fi
	$$(go env GOPATH)/bin/swag init -g cmd/server/main.go -o docs

swagger-fmt: ## Format swagger comments
	$$(go env GOPATH)/bin/swag fmt

docker-build: ## Build Docker image
	docker build -t recruitment-backend .

docker-up: ## Start Docker Compose services
	docker-compose up -d

docker-down: ## Stop Docker Compose services
	docker-compose down

docker-down-clean: ## Stop Docker and remove volumes (clean database)
	docker-compose down -v
	@echo "⚠️  Database cleaned. Run 'make setup' or 'make seed' to restore data."

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-restart: ## Restart Docker Compose services
	docker-compose restart

docker-rebuild: ## Rebuild and restart Docker Compose services
	docker-compose down
	docker-compose up -d --build
	@echo "⏳ Waiting for containers to be ready..."
	@sleep 5
	@echo "✅ Containers rebuilt and started"

migrate: ## Run database migrations (requires running server)
	@echo "Migrations run automatically on server start"

seed: ## Seed database with sample data (Docker)
	docker exec recruitment_backend ./seed

reset: ## Reset everything (clean + setup from scratch)
	@echo "🔄 Resetting everything..."
	@echo ""
	@echo "⚠️  This will:"
	@echo "   - Stop all containers"
	@echo "   - Delete all data (volumes)"
	@echo "   - Rebuild and restart everything"
	@echo ""
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(MAKE) docker-down-clean && \
		$(MAKE) setup; \
	else \
		echo "❌ Reset cancelled"; \
	fi
