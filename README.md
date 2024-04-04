# Backend Santex Challenge

## Introduction

The goal of this challenge is to build a simple API using Node and GraphQL that fetches data from a third-party API and returns it to the client.

## Technologies

- TypeScript
- ExpressJs
- Mongo
- Mongoose
- nodemon
- Docker
- eslint
- eslint - airbnb style

## Requirements

- Depending on how you choose to run the project, you need to have either Docker or Node installed on your machine

- You need to have a free API key from  [Football-Data.org](https://www.football-data.org/)

- If you choose to run the project using Node, you need to have a MongoDB instance running on your machine
  
- If you choose to run the application using `Docker` or run the application on your local machine, you need to create an `.env` file with some variables. In the project, there is an `example.env` file that you can use as a reference for the environment keys you need to add.
-
  - MONGODB_URL="<Your mongoDB url>"
  - API_URL="<https://api.football-data.org/v4/>"
  - API_TOKEN="<YOUR_API_TOKEN>"
  - PORT=4000

## Running the project

There are two ways to run the project:

### Using Docker

- Run  `docker-compose up`  on the root folder of the project
- The API will be available on  `http://localhost:4000/graphql`

### Using Node

- Navigate to the  `root`  folder where the  `package.json`  file is located
- Run  `npm ci`  on the root folder of the project
- Run  `npm run dev`  to start the server
- API will be available on  `http://localhost:4000/graphql`
