# Task 11 - Laravel API

## Overview

This project was developed as part of the Blue Full Stack Training program.

The goal of this task is to build a simple REST API using Laravel and return JSON responses through API endpoints.

---

## Technologies Used

- Laravel 12
- PHP 8.2.12
- Composer 2.10.2

---

## Installation

Clone the repository and install the dependencies:

```bash
composer install
```

---

## Run the Development Server

```bash
php artisan serve
```

The application will run at:

```text
http://127.0.0.1:8000
```

---

## API Endpoints

### Health Endpoint

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "message": "Backend is running successfully"
}
```

---

### Training Endpoint

```http
GET /api/training
```

Response:

```json
{
  "intern": "Shahd Barmawi",
  "task": "Task 11",
  "framework": "Laravel"
}
```

---

## Project Structure

```text
app
├── Http
│   └── Controllers
│       ├── HealthController.php
│       └── TrainingController.php

routes
├── api.php
├── web.php
└── console.php

screenshots
├── task11-laravel-running.png
├── task11-health-endpoint.png
└── task11-training-endpoint.png
```

---

---

## Screenshots

### 1. Laravel Application Running

**File:** `screenshots/task11-laravel-running.png`

This screenshot shows the Laravel development server running successfully in the browser using:

```bash
php artisan serve
```

The application is accessible through:

```text
http://127.0.0.1:8000
```

---

### 2. Health Controller Endpoint

**File:** `screenshots/task11-health-controller.png`

This screenshot demonstrates the `/api/health` endpoint after moving the response logic from the route file to `HealthController`.

The endpoint returns a JSON response confirming that the backend is running correctly.

Expected response:

```json
{
  "status": "ok",
  "message": "Backend is running successfully"
}
```

---

### 3. Health API Endpoint

**File:** `screenshots/task11-health-endpoint.png`

This screenshot verifies that the `/api/health` API route is registered correctly and returns a successful JSON response through the browser.

---

### 4. Training API Endpoint

**File:** `screenshots/task11-training-endpoint.png`

This screenshot shows the `/api/training` endpoint.

The endpoint returns training-related information as a JSON response.

Expected response:

```json
{
  "intern": "Shahd Barmawi",
  "task": "Task 11",
  "framework": "Laravel"
}
```

## Testing

The following items were tested successfully:

- Laravel installation
- Composer configuration
- API routing
- Controller responses
- JSON responses
- Database migration

---

## Status

Task 11 setup completed successfully.