# Pagination, Filtering, and Sorting

APIs can return lots of data.
Pagination breaks it into pages.
Filtering and sorting help you find what you need.

Example:
```
GET /orders?page=2&limit=20&status=paid&sort=created_at&order=desc
```

Common patterns:
- `page` and `limit`
- `offset` and `limit`
- `cursor` for infinite scrolling

Without pagination, responses can be huge and slow.
