# MoveX-Backend API DOCUMENTATION

## /api/users/register Endpoint

Description
- Register a new user in the system.
- Endpoint: `POST /api/users/register`

Expected request
- Headers:
  - `Content-Type: application/json`
- JSON body (example):

```json
{
  "fullName": {
    "firstName": "Mohak",
    "lastName": "Devkota"
  },
  "email": "mohakdevkota@example.com",
  "password": "s3cretpwd"
}
```

Field requirements
- `fullName.firstName`: string, required, minimum 3 characters.
- `fullName.lastName`: string, optional, minimum 3 characters if provided.
- `email`: string, required, must be a valid email address.
- `password`: string, required, minimum 6 characters.

Responses / Status codes
- `201 Created` — user successfully registered. Response includes the created `user` object and an auth `token`.
- `400 Bad Request` — validation errors (returns `errors` array describing which fields failed validation).
- `409 Conflict` — duplicate email (if the email already exists in DB).
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (201):

```json
{
  "user": {
    "_id": "603d2f8a2b1e8b0012345678",
    "fullName": { "firstName": "Mohak", "lastName": "Devkota" },
    "email": "mohakdevkota@example.com",
    "socketId": null,
    "createdAt": "2026-02-24T00:00:00.000Z",
    "updatedAt": "2026-02-24T00:00:00.000Z"
  },
  "token": "<jwt-token>"
}
```

Validation error example (400):

```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    { "msg": "First name must be at least 3 characters long", "param": "fullName.firstName", "location": "body" }
  ]
}
```

CURL example

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":{"firstName":"Mohak","lastName":"Devkota"},"email":"mohakdevkota@example.com","password":"s3cretpwd"}'
```

Notes
- Validation is performed using `express-validator` on `fullName.firstName`, `email`, and `password`.
- The DB model enforces uniqueness on `email` and stores a hashed `password` field.
- On success the API returns a JWT token for authentication.
