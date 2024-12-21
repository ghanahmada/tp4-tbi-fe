# Usage:
#   make build   -> Build images
#   make up      -> Start containers in background
#   make rebuild -> Rebuild & restart containers
#   make stop    -> Stop running containers
#   make down    -> Stop and remove containers, networks, images, and volumes

DOCKER_COMPOSE := docker-compose

build:
    $(DOCKER_COMPOSE) build

up:
    $(DOCKER_COMPOSE) up -d

rebuild:
    $(DOCKER_COMPOSE) down
    $(DOCKER_COMPOSE) build
    $(DOCKER_COMPOSE) up -d

stop:
    $(DOCKER_COMPOSE) stop

down:
    $(DOCKER_COMPOSE) down