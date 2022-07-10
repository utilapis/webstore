const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: './your-secret-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: "v4", auth: auth });

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
