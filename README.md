# Quiz Game API

## Overview

This is a robust Quiz Game API built with NestJS, designed to manage and serve quiz content efficiently. The system supports multiple seasons of quizzes, question management, user authentication, and real-time scoring.

## Features

- **Authentication System**

  - Secure JWT-based authentication
  - User registration and login
  - Role-based access control

- **Quiz Management**

  - Season-based quiz organization
  - Multiple question types support
  - Question attempt tracking
  - Real-time scoring system

- **PDF Processing**

  - Automated question extraction from PDF files
  - OCR capabilities using Tesseract.js

- **Real-time Features**
  - WebSocket integration for live updates
  - Real-time score tracking
  - Live participant management

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport JWT
- **Queue System**: Bull for background processing
- **WebSockets**: Socket.io for real-time features
- **Documentation**: Swagger/OpenAPI
- **PDF Processing**: Tesseract.js

## Project Structure

```
src/
├── auth/           # Authentication related modules
├── config/         # Configuration modules
├── pdf-processor/  # PDF processing service
├── prisma/         # Database service and migrations
├── questions/      # Question management
├── seasons/        # Season management
└── main.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis (for Bull queue)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
$ npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/quiz_db"
JWT_SECRET="your-secret-key"
REDIS_HOST="localhost"
REDIS_PORT=6379
```

4. Run database migrations:

```bash
$ npx prisma migrate dev
```

### Running the Application

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3000/docs`

### Main Endpoints

- **Authentication**

  - POST `/auth/register` - Register new user
  - POST `/auth/login` - User login

- **Seasons**

  - GET `/seasons` - List all seasons
  - POST `/seasons` - Create new season
  - GET `/seasons/:id` - Get season details

- **Questions**
  - GET `/questions` - List questions
  - POST `/questions` - Create new question
  - POST `/questions/upload` - Upload PDF for question extraction

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database Schema

The application uses Prisma as ORM with the following main models:

- **User**: Authentication and user management
- **Season**: Quiz seasons organization
- **Question**: Quiz questions with options
- **QuestionAttempt**: User attempts and scoring

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
