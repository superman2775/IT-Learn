# Authentication and Authorization

Many APIs need to know who you are.
That is authentication.
They also check what you can do.
That is authorization.

Common methods:
- API keys: a simple secret string
- Bearer tokens: sent in the Authorization header
- OAuth: a login flow used by big platforms

Example header:

```http
Authorization: Bearer eyJhbGciOi...
```

Never share keys in public code.
Keep them in environment variables.
