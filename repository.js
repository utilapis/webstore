const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  "391925411084-d6m6hefvvb4t5jc3nged5i2vp2tdau9d.apps.googleusercontent.com",
  "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",
  "urn:ietf:wg:oauth:2.0:oob"
);

oAuth2Client.setCredentials({
    access_token: "ya29.a0ARrdaM9LlIJjLORxWWpAT2Q1x8Sd3v9q3z38k4F42RNLclz3_QMX2ko-EFPVxJgOEAYo6t8YzVnxfrwh12ixb0HElqrYi6vgZnS9Mv9fROrvQAqH4SsYbdOVQcFROjD1zyh8mQVES1VR3TmeZwr-q169LEaQ",
    refresh_token: "1//05M4jzbYBMz10CgYIARAAGAUSNwF-L9IrrExo6Evy_Bbl2W5ww7rNdcTyh5rbD-SA24eflhjHFHl6hfzKJB9WUp6XdKxTtrtNKqc",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    token_type: "Bearer",
    expiry_date: 1634699523457,
});

const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

async function read() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "15LrbSZOvvC1hTmaP46RClWJ672IeKisAE-oZhm2SA6w",
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
    spreadsheetId: "15LrbSZOvvC1hTmaP46RClWJ672IeKisAE-oZhm2SA6w",
    range: "Products!A2:E",
    valueInputOption: "RAW",
    resource,
  });

  console.log(result.updatedCells);
}

// async function readAndWrite() {
//   const products = await read();
//   products[0].stock = 20;
//   await write(products);
// }

// readAndWrite();

module.exports = {
  read,
  write,
};
