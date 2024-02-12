# How to run local:

        1. Create .env file
        2. Install docker-compose
        3. Build docker-compose:
        docker compose -f "docker.compose.yml" up -d --build
        4. Install dependency
        yarn install
        5. Up migrations:
        yarn migration:run
        6. Run command:
        yarn api:local

# Endpoints:

1. Get much changes address
   http://localhost:{API_PORT}/transaction/largest-change
