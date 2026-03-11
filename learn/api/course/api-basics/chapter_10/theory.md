# Simple API Examples (GET and POST)

Here is a small GET request with `fetch`:

```js
fetch("https://api.example.com/products/1")
  .then(res => res.json())
  .then(data => console.log(data));
```

And a simple POST request:

```js
fetch("https://api.example.com/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Notebook", price: 3.5 })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

GET reads data.
POST sends data to create something new.
