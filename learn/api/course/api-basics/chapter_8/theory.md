# Errors and Rate Limits

Errors happen.
Good APIs return a clear message and a status code.

Example error response:

```http
400 Bad Request
```

```json
{
  "error": "invalid_email",
  "message": "Email is not valid"
}
```

Rate limits protect APIs from too many requests.
If you hit the limit, you often see:

```http
429 Too Many Requests
```

Wait and try again later.
