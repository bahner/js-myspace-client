.PHONY: install build start

default: build

install:
	npm install

build: install
	docker-compose build

start: build
	docker-compose up
