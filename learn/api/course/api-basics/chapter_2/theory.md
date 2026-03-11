# Most Used Kinds of APIs

There are different API styles.
Here are the main ones:

- REST: Uses URLs and HTTP methods like GET and POST.
- GraphQL: You ask for only the fields you want.
- SOAP: Older style, very strict, uses XML.
- gRPC: Very fast, used between services.
- Webhooks: The server calls you when something happens.
- WebSocket: A live, two-way connection.

Quick examples:

REST:
```http
GET /users/42
```

GraphQL:
```graphql
{ user(id: 42) { name email } }
```

Webhook:
```json
{ "event": "payment_succeeded" }
```

REST is the most common on the web.
The others are for special cases.
