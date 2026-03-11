# Data Formats and Status Codes

APIs send data in formats like:
- JSON (most common)
- XML (older, still used)

A response also has a status code:
- 200 OK: success
- 201 Created: new item made
- 400 Bad Request: wrong input
- 401 Unauthorized: not logged in
- 403 Forbidden: not allowed
- 404 Not Found: missing data
- 500 Server Error: server failed

Example JSON response:

```http
200 OK
```

```json
{
  "id": 9,
  "title": "Notebook",
  "price": 3.5
}
```

Status codes tell you what happened.
