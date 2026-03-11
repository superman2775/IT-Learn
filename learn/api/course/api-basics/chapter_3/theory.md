# Requests and Responses (HTTP Basics)

Most APIs use HTTP.
The client sends a request.
The server sends a response.

Common methods:
- GET: read data
- POST: create data
- PUT: replace data
- PATCH: change part of data
- DELETE: remove data

Example request:

```http
POST /users
Content-Type: application/json

{ "name": "Ava" }
```

Example response:

```http
201 Created
```

```json
{ "id": 7, "name": "Ava" }
```

The method says the action.
The URL says what you want.
