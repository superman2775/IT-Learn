# Endpoints, Paths, and Parameters

An API has a base URL like:
```
https://api.example.com
```

An endpoint is a path after the base URL:
```
GET /users
GET /users/42
```

Two common parameter types:

Path params (part of the URL):
```
GET /users/42
```

Query params (after a ?):
```
GET /users?role=admin&limit=10
```

Path params point to one item.
Query params filter or change results.
