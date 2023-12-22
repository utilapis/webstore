const express = require("express");
const repository = require("./repository");
const mercadopago = require("mercadopago");
const app = express();
const port = process.env.PORT || 3000;

const client = new mercadopago.MercadoPagoConfig({ accessToken: 'TEST-8840939573547467-020707-248077b0607d89f9d2b67ee11a4f9e27-705632138', options: { timeout: 5000 } });
const preferenceClient = new mercadopago.Preference(client);
const paymentClient = new mercadopago.Payment(client);
const merchantOrderClient = new mercadopago.MerchantOrder(client);

app.use(express.json());

app.get("/api/products", async (req, res) => {
  res.send(await repository.read());
});

app.post("/api/pay", async (req, res) => {
  const order = req.body;
  const ids = order.items.map((p) => p.id);
  const productsCopy = await repository.read();

  let preference = {
    items: [],
    back_urls: {
      success: "http://localhost:3000/feedback",
      failure: "http://localhost:3000/feedback",
      pending: "http://localhost:3000/feedback",
    },
    auto_return: "approved",
  };

  let error = false;
  ids.forEach((id) => {
    const product = productsCopy.find((p) => p.id === id);
    if (product.stock > 0) {
      product.stock--;
      preference.items.push({
        title: product.name,
        unit_price: product.price,
        quantity: 1,
      });
    } else {
      error = true;
    }
  });

  if (error) {
    res.send("Sin stock").statusCode(400);
  } else {
    const response = await preferenceClient.create({ body: preference });
    const preferenceId = response.id;
    await repository.write(productsCopy);
    order.date = new Date().toISOString();
    order.preferenceId = preferenceId;
    order.status = "pending";
    const orders = await repository.readOrders();
    orders.push(order);
    await repository.writeOrders(orders);
    res.send({ preferenceId });
  }
});

app.get("/feedback", async (req, res) => {
  const payment = await paymentClient.get({ id: req.query.payment_id });
  const merchantOrder = await merchantOrderClient.get({ merchantOrderId: payment.order.id });
  const preferenceId = merchantOrder.preference_id;
  const status = payment.status;
  await repository.updateOrderByPreferenceId(preferenceId, status);

  res.sendFile(require.resolve("./fe/index.html"));
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
