let products = [];
let total = 0;

function add(product, price) {
    console.log(product, price);
    products.push(product);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Pagar $${total}`
}

function pay() {
    window.alert(products.join(", \n"));
}

//-----
function displayProducts(productList) {
    let productsHTML = '';
    productList.forEach(element => {
        productsHTML +=
        `<div class="product-container">
            <h3>${element.name}</h3>
            <img src="${element.image}" />
            <h1>$${element.price}</h1>
            <button class="button-add" onclick="add(${element.id}, ${element.price})">Agregar</button>
        </div>`
    });
    document.getElementById('page-content').innerHTML = productsHTML;
}

window.onload = async() => {
    const productList = await (await fetch("/api/products")).json();
    console.log(productList);
    displayProducts(productList);
}