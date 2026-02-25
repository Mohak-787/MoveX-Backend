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
- `200 OK` — authentication successful (token returned).
- `400 Bad Request` — validation errors.
- `401 Unauthorized` — invalid credentials (email not found or wrong password).
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

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

## 3.) /api/users/profile Endpoint

Description
- Get the authenticated user's profile information.
- Endpoint: `GET /api/users/profile`

Expected request
- Headers (one of):
  - `Authorization: Bearer <jwt-token>`
  - or include cookie: `token=<jwt-token>`

Responses / Status codes
- `200 OK` — profile returned (user object).
- `401 Unauthorized` — missing or invalid token.
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

```json
{
  "_id": "699d63cbf9c574d37e2b4c20",
  "fullName": { "firstName": "Mohak", "lastName": "Devkota" },
  "email": "mohakdevkota@example.com",
  "socketId": null,
  "createdAt": "2026-02-24T08:39:39.786Z",
  "updatedAt": "2026-02-24T08:39:39.786Z"
}
```

Notes
- This endpoint is protected by the auth middleware; a valid JWT (signed with `JWT_SECRET`) must be provided either as a bearer token or in the `token` cookie.

## 4.) /api/users/logout Endpoint

Description
- Invalidate the current auth token (adds token to server-side blacklist) and clears the `token` cookie.
- Endpoint: `POST /api/users/logout`

Expected request
- Headers (one of):
  - `Authorization: Bearer <jwt-token>`
  - or include cookie: `token=<jwt-token>`

Responses / Status codes
- `200 OK` — logout successful (`{ message: "Logged out" }`).
- `400 Bad Request` — token not provided in header or cookie.
- `401 Unauthorized` — token invalid or user not found.
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

```json
{
  "message": "Logged out"
}
```

Notes
- The server stores blacklisted tokens; providing the same token after logout should be rejected by the auth middleware if blacklist checks are enforced.

## 5.) /api/movers/register Endpoint

Description
- Register a new mover (driver) in the system.
- Endpoint: `POST /api/movers/register`

Expected request
- Headers:
  - `Content-Type: application/json`
- JSON body (example):

```json
{
  "fullName": {
    "firstName": "Alex",
    "lastName": "Driver"
  },
  "email": "alex.driver@example.com",
  "password": "s3cretpwd",
  "vehicle": {
    "color": "red",
    "plate": "ABC-123",
    "capacity": 3,
    "vehicleType": "car"
  }
}
```

Field requirements
- `fullName.firstName`: string, required, minimum 3 characters.
- `fullName.lastName`: string, optional, minimum 3 characters if provided.
- `email`: string, required, must be a valid email address.
- `password`: string, required, minimum 6 characters.
- `vehicle.color`: string, required, minimum 3 characters.
- `vehicle.plate`: string, required, minimum 3 characters.
- `vehicle.capacity`: integer, required, minimum 1.
- `vehicle.vehicleType`: string, required, one of: `car`, `bike`, `scooter`.

Responses / Status codes
- `201 Created` — mover successfully registered. Response includes the created `mover` object and an auth `token` (also set as a `token` cookie).
- `400 Bad Request` — validation errors (returns `errors` array describing which fields failed validation) or other bad input.
- `409 Conflict` — duplicate email (if the email already exists in DB).
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (201):

```json
{
  "mover": {
    "_id": "603d2f8a2b1e8b0012345678",
    "fullName": { "firstName": "Alex", "lastName": "Driver" },
    "email": "alex.driver@example.com",
    "vehicle": { "color": "red", "plate": "ABC-123", "capacity": 3, "vehicleType": "car" },
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
- Validation is performed using `express-validator` on the fields listed above.
- The DB model enforces uniqueness on `email` and stores a hashed `password` field.
- On success the API returns a JWT token for authentication and sets the `token` cookie for convenience.

## 6.) /api/movers/login Endpoint

Description
- Authenticate an existing mover and return a JWT token.
- Endpoint: `POST /api/movers/login`

Expected request
- Headers:
  - `Content-Type: application/json`
- JSON body (example):

```json
{
  "email": "alex.driver@example.com",
  "password": "s3cretpwd"
}
```

Field requirements
- `email`: string, required, must be a valid email address.
- `password`: string, required, minimum 6 characters.

Responses / Status codes
- `200 OK` — authentication successful. Response includes the `mover` object and an auth `token` (also set as a `token` cookie).
- `400 Bad Request` — validation errors.
- `401 Unauthorized` — invalid credentials (email not found or wrong password).
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

```json
{
  "mover": {
    "_id": "699d63cbf9c574d37e2b4c20",
    "fullName": { "firstName": "Alex", "lastName": "Driver" },
    "email": "alex.driver@example.com",
    "vehicle": { "color": "red", "plate": "ABC-123", "capacity": 3, "vehicleType": "car" },
    "socketId": null,
    "createdAt": "2026-02-24T08:39:39.786Z",
    "updatedAt": "2026-02-24T08:39:39.786Z"
  },
  "token": "<jwt-token>"
}
```

Notes
- The `password` field is never returned in the response; it is stored hashed in the DB.
- Validation is performed using `express-validator` on `email` and `password`.
- On success the API returns a JWT token for authentication and sets the `token` cookie for convenience; the API also accepts a Bearer token in the `Authorization` header.

## 7.) /api/movers/profile Endpoint

Description
- Get the authenticated mover's profile information.
- Endpoint: `GET /api/movers/profile`

Expected request
- Headers (one of):
  - `Authorization: Bearer <jwt-token>`
  - or include cookie: `token=<jwt-token>`

Responses / Status codes
- `200 OK` — profile returned (mover object).
- `401 Unauthorized` — missing, blacklisted, or invalid token.
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

```json
{
  "_id": "699d63cbf9c574d37e2b4c20",
  "fullName": { "firstName": "Alex", "lastName": "Driver" },
  "email": "alex.driver@example.com",
  "vehicle": { "color": "red", "plate": "ABC-123", "capacity": 3, "vehicleType": "car" },
  "socketId": null,
  "createdAt": "2026-02-24T08:39:39.786Z",
  "updatedAt": "2026-02-24T08:39:39.786Z"
}
```

Notes
- This endpoint is protected by the mover auth middleware; a valid JWT (signed with `JWT_SECRET`) must be provided either as a bearer token or in the `token` cookie.

## 8.) /api/movers/logout Endpoint

Description
- Invalidate the current mover auth token (adds token to server-side blacklist) and clears the `token` cookie.
- Endpoint: `POST /api/movers/logout`

Expected request
- Headers (one of):
  - `Authorization: Bearer <jwt-token>`
  - or include cookie: `token=<jwt-token>`

Responses / Status codes
- `200 OK` — logout successful (`{ message: "Logged out" }`).
- `401 Unauthorized` — missing, blacklisted, or invalid token.
- `500 Internal Server Error` — unexpected server error.

Examples

Successful response (200):

```json
{
  "message": "Logged out"
}
```

Notes
- The server stores blacklisted tokens; providing the same token after logout should be rejected by the auth middleware.


