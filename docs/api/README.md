# Forex Trading Helper API Documentation

## Overview

API documentation untuk Forex Trading Helper menggunakan OpenAPI 3.0.3 specification.

## Accessing the Documentation

### Swagger UI

Akses dokumentasi interaktif melalui browser:

```
http://localhost:3000/api/docs
```

Swagger UI menyediakan:
- Daftar semua endpoints
- Request/Response schemas
- Try it out functionality
- Authentication testing

### OpenAPI Specification

#### YAML Format
```
http://localhost:3000/api/docs/openapi.yaml
```

#### JSON Format
```
http://localhost:3000/api/docs/json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Lot Calculator
- `POST /api/lot-calculator/calculate` - Calculate position size
- `GET /api/lot-calculator/pairs` - Get currency pairs
- `GET /api/lot-calculator/pip-value` - Get pip value

### Trade History
- `GET /api/trades` - Get all trades
- `POST /api/trades` - Create new trade
- `GET /api/trades/:id` - Get trade by ID
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade

### Reports
- `GET /api/reports/metrics` - Get performance metrics
- `POST /api/reports/generate` - Generate trading report
- `GET /api/reports/:id` - Get report by ID

## Authentication

API menggunakan JWT (JSON Web Tokens) untuk autentikasi. Setelah login, gunakan token di header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Responses

Semua error responses mengikuti format:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Calculate Position Size

```bash
curl -X POST http://localhost:3000/api/lot-calculator/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "accountBalance": 10000,
    "accountCurrency": "USD",
    "riskPercentage": 2,
    "stopLoss": 50,
    "stopLossUnit": "pips",
    "currencyPair": "EURUSD"
  }'
```

## Updating Documentation

Untuk mengupdate dokumentasi, edit file `docs/api/openapi.yaml` sesuai dengan perubahan API.

