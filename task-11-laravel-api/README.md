# Task 11 - Backend Foundations with PHP & Laravel

## Project Name and Task Objective

**Project Name:** Task 11 - Laravel API

The objective of this task is to establish a clean Laravel backend project, understand the Laravel framework structure and request lifecycle, and implement structured JSON API endpoints using routes and controllers.

The focus of this task is on backend foundations before database CRUD operations, authentication, and full-stack integration are introduced in future tasks.

---

## PHP and Laravel Versions Used

- PHP 8.2.12
- Laravel 12
- Composer 2.10.2

---

## Installation and Local Run Instructions

Navigate to the project folder:

```bash
cd task-11-laravel-api
```

Install the required dependencies:

```bash
composer install
```

Generate the application key:

```bash
php artisan key:generate
```

Run the local development server:

```bash
php artisan serve
```

The application runs locally at:

```text
http://127.0.0.1:8000
```

---

## Laravel Project Structure

### app/

Contains the main application logic.

### app/Http/Controllers/

Contains controller classes that process requests and return responses.

Controllers used in this project:

- HealthController
- TrainingController

### routes/

Contains the application's route definitions.

The API routes for this task are located in:

```text
routes/api.php
```

### config/

Contains the Laravel configuration files.

### database/

Contains database-related files such as migrations, factories, and seeders.

### public/

Contains publicly accessible files and Laravel's entry point.

### storage/

Contains application logs, cache files, compiled views, and other generated files.

### tests/

Contains automated tests.

### .env

Contains local environment configuration and sensitive values.

The `.env` file should never be uploaded to GitHub.

### .env.example

Contains an example of the required environment variables.

### Artisan

Laravel's command-line interface.

Examples:

```bash
php artisan serve
php artisan key:generate
php artisan migrate
```

### Composer

Composer is the PHP dependency manager.

Example:

```bash
composer install
```

---

## Implemented API Endpoints

| Method | Endpoint                 | Description                                                         |
| ------ | ------------------------ | ------------------------------------------------------------------- |
| GET    | /api/health              | Returns application status, application name, and a success message |
| GET    | /api/profile             | Returns a sample trainee profile                                    |
| GET    | /api/skills              | Returns a list of technical skills                                  |
| GET    | /api/training/tasks      | Returns all training tasks                                          |
| GET    | /api/training/tasks/{id} | Returns a specific task                                             |
| POST   | /api/contact             | Validates a contact request                                         |

---

## Successful JSON Response Example

Request:

```http
GET /api/training/tasks/1
```

Response:

```json
{
    "id": 1,
    "title": "Frontend Development",
    "status": "Completed",
    "estimated_hours": 8
}
```

---

## Error Response Example

Request:

```http
GET /api/training/tasks/100
```

Response:

```json
{
    "error": "Task not found"
}
```

HTTP Status:

```text
404 Not Found
```

---

## Summary of What I Learned

During Task 11, I learned how to:

- Create a Laravel project.
- Understand the Laravel project structure.
- Create API routes.
- Return JSON responses.
- Organize code using controllers.
- Use dynamic route parameters.
- Validate incoming requests.
- Return HTTP status codes.
- Test APIs using Postman.
- Use Artisan and Composer commands.

---

## Challenges, Blockers, or Questions Encountered

The latest Laravel version required PHP 8.3, while the installed PHP version was 8.2.12.

Another issue occurred because the PHP ZIP extension was disabled, which prevented Composer from completing the installation.

During API validation testing, Postman initially returned an HTML response instead of JSON. Adding the following header solved the problem:

```text
Accept: application/json
```

All issues were resolved successfully.

---

## Screenshots

### Laravel Application Running

![Laravel Running](screenshots/task11-laravel-running.png)

---

### Health Endpoint

![Health Endpoint](screenshots/task11-health-endpoint.png)

---

### Health Controller

![Health Controller](screenshots/task11-health-controller.png)

---

### Profile Endpoint

![Profile Endpoint](screenshots/task11-profile-endpoint.png)

---

### Skills Endpoint

![Skills Endpoint](screenshots/task11-skills-endpoint.png)

---

### Training Tasks Endpoint

![Training Tasks Endpoint](screenshots/task11-training-endpoint.png)

---

### Dynamic Task Endpoint

![Training Task by ID](screenshots/task11-training-task-by-id.png)

---

### 404 Error Response

![404 Error](screenshots/task11-training-task-404.png)

---

### Successful Contact Request

![Contact Success](screenshots/task11-contact-success.png)

---

### Contact Validation Error

![Contact Validation Error](screenshots/task11-contact-validation-error.png)
