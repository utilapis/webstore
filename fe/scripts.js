const mercadopago = new MercadoPago('TEST-c6353c13-c841-473d-8dd6-bf56114341c3', {
  locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

let productList = [];

let order = {
  total: 0,
  items: [],
};

function add(productId, price) {
  const product = productList.find((p) => p.id === productId);
  product.stock--;

  const productInOrder = order.items.find((p) => p.id === productId);
  if (productInOrder) {
    productInOrder.quantity = productInOrder.quantity + 1;
  }
  else {
    order.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  console.log(productId, price);

  order.total = order.total + price;
  document.getElementById("checkout").innerHTML = `Carrito $${order.total}`;
  displayProducts();
}

async function showOrder() {
  document.getElementById("all-products").style.display = "none";
  document.getElementById("order").style.display = "block";

  document.getElementById("order-total").innerHTML = `$${order.total}`;

  let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
    </tr>`;
  order.items.forEach((p) => {
    productsHTML += `<tr>
            <td>${p.quantity}</td>
            <td>${p.name}</td>
            <td>$${p.price * p.quantity}</td>
        </tr>`;
  });
  document.getElementById("order-table").innerHTML = productsHTML;
}

async function pay() {
  try {
    order.shipping = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      addressLine1: document.getElementById("addressLine1").value,
      addressLine2: document.getElementById("addressLine2").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
    };

    const preference = await (
      await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    const bricksBuilder = mercadopago.bricks();
    document.getElementById("order-actions").innerHTML = "";

    const renderComponent = async (bricksBuilder) => {
      if (window.checkoutButton) window.checkoutButton.unmount();
      await bricksBuilder.create(
        'wallet',
        'order-actions', // class/id where the payment button will be displayed
        {
          initialization: {
            preferenceId: preference.preferenceId
          },
          callbacks: {
            onError: (error) => console.error(error),
            onReady: () => {}
          }
        }
      );
    };
    window.checkoutButton =  renderComponent(bricksBuilder);

    document.getElementById("name").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("addressLine1").disabled = true;
    document.getElementById("addressLine2").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("postalCode").disabled = true;
    document.getElementById("state").disabled = true;
    document.getElementById("country").disabled = true;
  } catch {
    window.alert("Sin stock");
  }

  order = {
    total: 0,
    items: [],
  };
  //await fetchProducts();
  document.getElementById("checkout").innerHTML = `Carrito $${order.total}`;
}

//-----
function displayProducts() {
  document.getElementById("all-products").style.display = "block";
  document.getElementById("order").style.display = "none";

  const gym = productList.filter((p) => p.category === "gym");
  displayProductsByType(gym, "product-cards-gym");

  const car = productList.filter((p) => p.category === "car");
  displayProductsByType(car, "product-cards-car");

  const pc = productList.filter((p) => p.category === "pc");
  displayProductsByType(pc, "product-cards-pc");
}

function displayProductsByType(productsByType, tagId) {
  let productsHTML = "";
  productsByType.forEach((p) => {
    let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;

    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})">Sin stock</button>`;
    }

    productsHTML += `<div class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" />
            <h1>$${p.price}</h1>
            ${buttonHTML}
        </div>`;
  });
  document.getElementById(tagId).innerHTML = productsHTML;
}

async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts();
}

window.onload = async () => {
  await fetchProducts();
};
