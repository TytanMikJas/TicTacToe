# Tic-Tac-Toe Online Game
![image](https://github.com/TytanMikJas/TicTacToe/assets/126624787/7c12cc24-8ab3-4b5f-b01a-6e1924a77860)

## Overview
This project is an implementation of the classic Tic-Tac-Toe game (3x3 grid) as a web application. The application allows users to play against a random opponent without the need for authentication. The game state is managed on the client-side, eliminating the need for a database. This application is split into two separate modules: backend and frontend, each containerized with Docker for easy development and deployment.

## Technologies Used
- **Programming Language**: TypeScript
- **Backend Framework**: NestJS
- **Frontend Library**: React with Vite
- **CSS Framework**: Tailwind CSS
- **Real-time Communication**: socket.io
- **Code Quality Tools**: ESLint, Prettier
- **ORM**: Prisma ORM
- **Containerization**: Docker, docker-compose

## Project Features
- **User Interaction**: Users can enter their username to participate in the game.
- **Matchmaking**: The game matches a player with a random opponent for a Tic-Tac-Toe match.
- **Module Architecture**: The application is divided into frontend and backend modules, each with its own Docker configuration.
- **Development Environment**: A `docker-compose` file is provided to run both services (backend and frontend) in a local environment seamlessly.

## Running the Project
To run this project locally, you must have Docker and docker-compose installed. After cloning the repository, navigate to the project's root directory and run:

```bash
docker network create chmura_ext
```
```bash
docker-compose up --build
```

