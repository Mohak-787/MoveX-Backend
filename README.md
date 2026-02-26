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

## 9.) /api/maps/get-coordinates Endpoint

Description
- Get geographic coordinates (latitude/longitude) for a provided address string.
- Endpoint: `GET /api/maps/get-coordinates`

Expected request
- Query parameters:
  - `address` (string) — required, minimum 3 characters
- Authentication: `Authorization: Bearer <jwt-token>` or cookie `token=<jwt-token>`

Responses / Status codes
- `200 OK` — coordinates returned as `{ ltd: <lat>, lng: <lng> }`.
- `400 Bad Request` — validation errors (returns `errors` array).
- `404 Not Found` — coordinates not found for the address.
- `500 Internal Server Error` — unexpected server error.

Example successful response (200):

```json
{
  "ltd": 37.4224764,
  "lng": -122.0842499
}
```

Notes
- This endpoint relies on the Google Maps Geocoding API; ensure `GOOGLE_MAPS_API` is configured in environment variables.
- Validation is performed using `express-validator` on the `address` query parameter (minimum 3 characters); invalid requests return `400 Bad Request` with an `errors` array.
- On success the response body contains `ltd` and `lng` numeric fields. (Note: the code currently uses `ltd`; consider renaming to `lat` if you refactor for clarity.)
- If the Maps service cannot find coordinates the controller returns `404 Not Found`; other upstream errors map to `500 Internal Server Error`.
- Be mindful of Google API rate limits and billing; consider server-side caching or debouncing frequent requests.

## 10.) /api/maps/get-distance-time Endpoint

Description
- Get travel distance and duration between an origin and a destination.
- Endpoint: `GET /api/maps/get-distance-time`

Expected request
- Query parameters:
  - `origin` (string) — required, minimum 3 characters
  - `destination` (string) — required, minimum 3 characters
- Authentication: `Authorization: Bearer <jwt-token>` or cookie `token=<jwt-token>`

Responses / Status codes
- `200 OK` — returns the Distance Matrix element (distance, duration and related fields).
- `400 Bad Request` — validation errors (returns `errors` array).
- `500 Internal Server Error` — unexpected server error.

Example successful response (200):

```json
{
  "distance": { "text": "5.2 km", "value": 5200 },
  "duration": { "text": "12 mins", "value": 720 },
  "status": "OK"
}
```

Notes
- This endpoint uses the Google Maps Distance Matrix API to calculate travel distance and duration.
- Ensure `GOOGLE_MAPS_API` is configured in environment variables.
- Validation is performed using `express-validator` on the `origin` and `destination` query parameters (minimum 3 characters each).
- On success the response body contains `distance` and `duration` fields.
- If the Maps service cannot calculate distance or duration, the controller returns `500 Internal Server Error`.
- Be mindful of Google API rate limits and billing; consider server-side caching or debouncing frequent requests.

## 11.) /api/maps/get-suggestions Endpoint

Description
- Get address autocomplete suggestions for a partial input string.
- Endpoint: `GET /api/maps/get-suggestions`

Expected request
- Query parameters:
  - `input` (string) — required, minimum 3 characters
- Authentication: `Authorization: Bearer <jwt-token>` or cookie `token=<jwt-token>`

Responses / Status codes
- `200 OK` — returns an array of suggestion strings.
- `400 Bad Request` — validation errors (returns `errors` array).
- `500 Internal Server Error` — unexpected server error.

Example successful response (200):

```json
["1600 Amphitheatre Pkwy, Mountain View, CA, USA", "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA"]
```

Notes
- This endpoint uses the Google Maps Places API to fetch address suggestions based on partial input.
- Ensure `GOOGLE_MAPS_API` is configured in environment variables.
- Validation is performed using `express-validator` on the `input` query parameter (minimum 3 characters).
- On success the response body contains an array of suggestion strings.
- Be mindful of Google API rate limits and billing; consider server-side caching or debouncing frequent requests.

## 12.) /api/moves/create Endpoint

Description
- Create a new move (booking) for a user.
- Endpoint: `POST /api/moves/create`

Expected request
- Headers:
  - `Content-Type: application/json`
  - Authentication: cookie `token=<jwt-token>` or `Authorization: Bearer <jwt-token>` (protected by user auth middleware)
- JSON body (example):

```json
{
  "userId": "603d2f8a2b1e8b0012345678",
  "pickup": "1600 Amphitheatre Pkwy, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}
```

Field requirements / validation
- `userId`: string, required, must be a 24-character MongoDB ObjectId.
- `pickup`: string, required, minimum 3 characters.
- `destination`: string, required, minimum 3 characters.
- `vehicleType`: string, required, one of: `car`, `bike`, `scooter`.

Responses / Status codes
- `201 Created` — move successfully created. Returns the created move object (see model [`Move`](src/models/move.model.js)).
- `400 Bad Request` — validation errors.
- `401 Unauthorized` — missing/invalid token.
- `500 Internal Server Error` — unexpected server error.

Example successful response (201):

```json
{
  "_id": "60c9f0f2d4b3a90012345678",
  "user": "603d2f8a2b1e8b0012345678",
  "pickup": "1600 Amphitheatre Pkwy, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "fare": 200,
  "status": "pending",
  "otp": "<hidden>",
  "createdAt": "2026-02-24T00:00:00.000Z",
  "updatedAt": "2026-02-24T00:00:00.000Z"
}
```

Notes
- This endpoint is protected by user authentication middleware; a valid JWT must be provided.
- The `fare` field is calculated dynamically based on the distance, time, and vehicle type.
- Validation is performed using `express-validator` on the fields listed above.

## 13.) /api/moves/get-fare Endpoint

Description
- Calculate the fare for a move based on distance, time, and vehicle type.
- Endpoint: `GET /api/moves/get-fare`

Expected request
- Query parameters:
  - `origin` (string) — required, minimum 3 characters
  - `destination` (string) — required, minimum 3 characters
  - `vehicleType` (string) — required, one of: `car`, `bike`, `scooter`
- Authentication: `Authorization: Bearer <jwt-token>` or cookie `token=<jwt-token>`

Responses / Status codes
- `200 OK` — returns the calculated fare.
- `400 Bad Request` — validation errors (returns `errors` array).
- `500 Internal Server Error` — unexpected server error.

Example successful response (200):

```json
{
  "fare": 250
}
```

Notes
- This endpoint uses the Google Maps Distance Matrix API to calculate distance and duration between the origin and destination.
- The fare is calculated based on a base rate and multipliers for distance, time, and vehicle type.
- Ensure `GOOGLE_MAPS_API` is configured in environment variables.
- Validation is performed using `express-validator` on the query parameters.


