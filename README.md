# MoveX-Backend API Documentation

## 1.) /api/users/register Endpoint

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

Notes
- Validation is performed using `express-validator` on `fullName.firstName`, `email`, and `password`.
- The DB model enforces uniqueness on `email` and stores a hashed `password` field.
- On success the API returns a JWT token for authentication.

## 2.) /api/users/login Endpoint

Description
- Authenticate an existing user and return a JWT token.
- Endpoint: `POST /api/users/login`

Expected request
- Headers:
  - `Content-Type: application/json`
- JSON body (example):

```json
{
  "email": "mohakdevkota@example.com",
  "password": "s3cretpwd"
}
```

Field requirements
- `email`: string, required, must be a valid email address.
- `password`: string, required, minimum 6 characters.

Responses / Status codes
- `201 Created` — authentication successful (token returned).
- `400 Bad Request` — validation errors.
- `401 Unauthorized` — invalid credentials (email not found or wrong password).
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (201):

```json
{
  "user": {
    "_id": "699d63cbf9c574d37e2b4c20",
    "fullName": { "firstName": "Mohak", "lastName": "Devkota" },
    "email": "mohakdevkota@example.com",
    "socketId": null,
    "createdAt": "2026-02-24T08:39:39.786Z",
    "updatedAt": "2026-02-24T08:39:39.786Z"
  },
  "token": "<jwt-token>"
}
```

Validation error example (400):

```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
  ]
}
```

Notes
- The `password` field is never returned in the response; it is stored hashed in the DB.
- Validation is performed using `express-validator` on `email` and `password`.
