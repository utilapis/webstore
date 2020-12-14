const express = require("express");
const app = express();
const port = 3000;

const products = [
  {
    id: 1,
    name: "2 Mancuernas",
    price: 50,
    image: "images/product-1.jpg",
    stock: 50,
  },
  {
    id: 2,
    name: "Banco ajustable",
    price: 50,
    image: "images/product-2.jpg",
    stock: 50,
  },
  {
    id: 3,
    name: "Kit de pesas con estuche",
    price: 50,
    image: "images/product-3.jpg",
    stock: 50,
  },
  {
    id: 4,
    name: "Pesas",
    price: 50,
    image: "images/product-4.jpg",
    stock: 50,
  },
  {
    id: 5,
    name: "Pesa de 30Kg",
    price: 50,
    image: "images/product-5.jpg",
    stock: 50,
  },
  {
    id: 6,
    name: "Bolsa de boxeo con pie",
    price: 50,
    image: "images/product-6.jpg",
    stock: 50,
  },
];

app.get("/api/products", (req, res) => {
  res.send(products);
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
