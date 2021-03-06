const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  "653250056256-ecdqbeehrajsppi4oagvinloqjkofbhd.apps.googleusercontent.com",
  "IuqvFQQhCSHHyZfGoy6YTPV4",
  "urn:ietf:wg:oauth:2.0:oob"
);

oAuth2Client.setCredentials({
  access_token:
    "ya29.a0AfH6SMCKBUmfIJeFel-DKhgwuln0IiuGEP67k-72-3w9gh2FONsjA9FU11SZ19ya1Y3KeM_mssBVJDZrd9OLVz8mmRPzGY0GA1e9wBkUP2Bw8f-aetkIJP-sW4KzWLLW7Lxcz4dg8GODqGFmooICDBIeywxjI--bjRhTdLViTVM",
  refresh_token:
    "1//0go3CKc26E0KWCgYIARAAGBASNwF-L9Ir4kXUigSfieh7fOaGYM6VN3Ag7GjhxzXkDSUWkx4M-z4-mXGH8NalJWV7JqYFkjxiaKo",
  scope: "https://www.googleapis.com/auth/spreadsheets",
  token_type: "Bearer",
  expiry_date: 1608879811848,
});

const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

async function read() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1fO4WiyE2EP9AVT8qRLGbGrcdNPYxCAXiTBXwz3IafcM",
    range: "Products!A2:E",
  });

  const rows = response.data.values;
  const products = rows.map((row) => ({
    id: +row[0],
    name: row[1],
    price: +row[2],
    image: row[3],
    stock: +row[4],
  }));

  return products;
}

async function write(products) {
  let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1fO4WiyE2EP9AVT8qRLGbGrcdNPYxCAXiTBXwz3IafcM",
    range: "Products!A2:E",
    valueInputOption: "RAW",
    resource,
  });
}

async function writeOrders(orders) {
  let values = orders.map((order) => [
    order.date,
    order.preferenceId,
    order.shipping.name,
    order.shipping.email,
    JSON.stringify(order.items),
    JSON.stringify(order.shipping),
    order.status,
  ]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1fO4WiyE2EP9AVT8qRLGbGrcdNPYxCAXiTBXwz3IafcM",
    range: "Orders!A2:G",
    valueInputOption: "RAW",
    resource,
  });
}

async function readOrders() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1fO4WiyE2EP9AVT8qRLGbGrcdNPYxCAXiTBXwz3IafcM",
    range: "Orders!A2:G",
  });

  const rows = response.data.values;
  const orders = rows.map((row) => ({
    date: row[0],
    preferenceId: row[1],
    name: row[2],
    email: row[3],
    items: JSON.parse(row[4]),
    shipping: JSON.parse(row[5]),
    status: row[6],
  }));

  return orders;
}

async function updateOrderByPreferenceId(preferenceId, status) {
  const orders = await readOrders();
  const order = orders.find(o => o.preferenceId === preferenceId)
  order.status = status;
  await writeOrders(orders);
}

module.exports = {
  read,
  write,
  writeOrders,
  updateOrderByPreferenceId,
  readOrders,
};
