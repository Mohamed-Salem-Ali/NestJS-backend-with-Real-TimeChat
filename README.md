# **Backend Project: NestJS with PostgreSQL**

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)
  - [4. Run the Project Locally](#4-run-the-project-locally)
  - [5. Run Tests](#5-run-tests)
- [Endpoints](#endpoints)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## **Project Overview**

This backend project is built using **NestJS** and **PostgreSQL**. It provides a robust API to manage users, posts, and authentication with JWT and Google OAuth. The project is containerized using Docker and is CI/CD ready with Bitbucket Pipelines.

---

## **Features**

- **User Management**: CRUD operations for users.
- **Authentication**: JWT-based authentication and Google OAuth integration.
- **Post Management**: CRUD operations for posts.
- **Database**: Integrated with PostgreSQL using Prisma ORM.
- **API Documentation**: Swagger-based API documentation.
- **Testing**: Unit tests for services and controllers.
- **Deployment**: Ready for deployment on AWS ECS.

---

## **Technology Stack**

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, Google OAuth
- **Testing**: Jest
- **Containerization**: Docker
- **CI/CD**: Bitbucket Pipelines

---

## **Prerequisites**

- Node.js (v16+)
- npm or yarn
- PostgreSQL
- Docker and Docker Compose (optional for containerized setup)

---

## **Getting Started**

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-repository-url.git
cd backend-project
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the project root and add the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=8000
```

### 4. **Run the Project Locally**

- **Development Mode**:
  ```bash
  npm run start:dev
  ```
- **Production Mode**:
  ```bash
  npm run build
  npm run start:prod
  ```

### 5. **Run Tests**

```bash
npm run test
```

---

## **Endpoints**

Base URL: `http://localhost:8000`

| Method | Endpoint         | Description         | Authentication |
| ------ | ---------------- | ------------------- | -------------- |
| POST   | `/auth/register` | Register a new user | No             |
| POST   | `/auth/login`    | Login and get a JWT | No             |
| GET    | `/users`         | Get all users       | Yes            |
| GET    | `/users/:id`     | Get user by ID      | Yes            |
| POST   | `/posts`         | Create a new post   | Yes            |
| GET    | `/posts`         | Get all posts       | Yes            |
| GET    | `/posts/:id`     | Get post by ID      | Yes            |
| PUT    | `/posts/:id`     | Update post by ID   | Yes            |
| DELETE | `/posts/:id`     | Delete post by ID   | Yes            |

---

## **Folder Structure**

```
src/
├── auth/               # Authentication logic
├── users/              # User module
├── posts/              # Post module
├── prisma/             # Prisma ORM configuration
├── main.ts             # Application entry point
├── app.module.ts       # Root module
tests/                  # Unit tests for controllers and services
docker/                 # Docker configurations
.env                    # Environment variables
```

---

## **Future Enhancements**

- Add chat functionality using Socket.IO.
- Integrate a comment system for posts.
- Improve API performance with caching (e.g., Redis).
- Add more comprehensive unit and e2e tests.

---

---

---

## **Acknowledgments**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs/)

---
