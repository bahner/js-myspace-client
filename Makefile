.PHONY: install build start stop browserify

default: build

install:
	npm install

browserify:
	npm run build

build: install browserify
	docker-compose build

stop:
	docker-compose down

start: stop build
	docker-compose up
