# What Is an API and Why Use It?

An API lets apps talk to each other.
It is just a set of rules.

Think of a restaurant.
You order food.
The kitchen makes it.
The waiter brings it back.
The waiter is like the API.

APIs help apps:
- Share data
- Use features from other services
- Stay separate but work together

Small example:

```http
GET /weather?city=Brussels
```

```json
{
  "city": "Brussels",
  "temp": 12,
  "unit": "C"
}
```

Your app did not create the weather data.
The API did that for you.
