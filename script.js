let totalPrice = [];
const totalPriceElemet = document.querySelector('.total-price');
const recupera = JSON.parse(localStorage.getItem('cart'));
const savedCart = localStorage.getItem('cart') !== null ? recupera : [];
const cart = document.querySelector('.cart__items');
const emptyCart = document.querySelector('.empty-cart');
const items = document.querySelector('.total_cart');

emptyCart.addEventListener('click', () => {
cart.innerHTML = '';
localStorage.clear();
totalPriceElemet.innerText = 'Preço total: $0';
items.innerText = 'R$0';
totalPrice = [];
});

function sumPrice(salePrice) {
 totalPrice.push(salePrice);
 const totalNumber = totalPrice.reduce((total, numero) => total + numero, 0);
  if (Number.isInteger(totalNumber) === true) {
  totalPriceElemet.innerText = `Preço total: R$${totalNumber.toFixed(0)}`;
  items.innerText = `R$${totalNumber}`;
 } else {
  totalPriceElemet.innerText = `Preço total: R$${Number(totalNumber)}`;
  items.innerText = `R$${totalNumber}`;
 }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(item) {
 const itemClicado = item.target;
 cart.removeChild(itemClicado);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => {
    const totalNumber = totalPrice.reduce((total, numero) => total + numero, 0);
    if (Number.isInteger(totalNumber) === true) {
      totalPriceElemet.innerText = `${totalNumber.toFixed(0) - salePrice}`;
     } else {
      totalPriceElemet.innerText = `${Number(totalNumber) - salePrice}`;
     }
  });
  savedCart.push(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
  localStorage.setItem('cart', JSON.stringify(savedCart));
  return li;
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') {
    e.addEventListener('click', () => {
      const promise = fetch(`https://api.mercadolibre.com/items/${sku}`);
      promise.then((resposta) => {
        const promiseJson = resposta.json();
        promiseJson.then((data) => {
        const name = data.title; 
        const salePrice = data.price;
        sumPrice(salePrice);
        cart.appendChild(createCartItemElement({ sku, name, salePrice }));
        });
      });
    });
  }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id);

  section.appendChild(createCustomElement('span', 'item__sku', id, id));
  section.appendChild(createCustomElement('span', 'item__title', title, id));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(button);

  return section;
}

function recoverData() {
  const promise = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador?gamer');
  promise.then((resposta) => {
    const promiseJson = resposta.json();
    const loading = document.getElementsByClassName('loading');
    document.body.removeChild(loading[0]);

    promiseJson.then((dados) => {
      dados.results.forEach((element) => {
        const { title, id, thumbnail } = element;
        const section = document.getElementsByClassName('items');
        section[0].appendChild(createProductItemElement({ id, title, thumbnail }));
      });
    });
  });
}

function recoverCart() {
  savedCart.forEach((element) => {
  const cartItem = document.createElement('li');
  cartItem.innerText = element;
  cartItem.addEventListener('click', cartItemClickListener);
  cart.appendChild(cartItem);
  });
}

window.onload = () => { 
  recoverData();
  recoverCart();
};
