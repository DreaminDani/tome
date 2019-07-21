#! /bin/bash

docker-compose down && docker-compose build db-migrate && docker-compose up