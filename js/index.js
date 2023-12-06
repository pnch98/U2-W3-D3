let cart = [];
window.onload = () => {
  if (localStorage.getItem("myCart")) {
    cart = JSON.parse(localStorage.getItem("myCart"));
    console.log(cart);
  }
  showInCart();
};

fetch("https://striveschool-api.herokuapp.com/books")
  .then((responseObj) => {
    if (responseObj.ok) return responseObj.json();
  })
  .then((data) => {
    data.forEach((book) => {
      generateCard(book);
    });
  })
  .catch((error) => console.log("Error: ", error));

function generateCard(obj) {
  const col = document.createElement("div");
  col.classList.add("col");

  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.style = "max-height: 250px; object-fit: contain; cursor: pointer";
  img.src = obj.img;

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column", "justify-content-between");
  cardBody.style = "height: 250px";

  const body1 = document.createElement("div");
  const body2 = document.createElement("div");
  body2.classList.add("d-flex", "justify-content-between");

  const h5 = document.createElement("h5");
  h5.classList.add("card-title");
  h5.innerText = obj.title;

  const asin = document.createElement("p");
  asin.classList.add("card-text", "mb-1");
  asin.innerText = obj.asin;

  const category = document.createElement("p");
  category.classList.add("card-text", "mb-0");
  category.innerHTML = "<b>Category: </b>" + obj.category;

  const price = document.createElement("p");
  price.classList.add("card-text");
  price.innerHTML = "<b>Price: </b>" + obj.price + "$";

  const buy = document.createElement("a");
  buy.classList.add("btn", "btn-primary", "btn-buy");
  buy.innerText = "Add to cart";
  addToCart(buy, obj);

  const remove = document.createElement("a");
  remove.classList.add("btn", "btn-danger");
  remove.innerText = "Remove";
  removeCard(remove);

  const row = document.getElementById("cards");

  body1.appendChild(h5);
  body1.appendChild(asin);
  body1.appendChild(category);
  body1.appendChild(price);

  body2.appendChild(buy);
  body2.appendChild(remove);

  cardBody.appendChild(body1);
  cardBody.appendChild(body2);

  card.appendChild(img);
  card.appendChild(cardBody);

  col.appendChild(card);

  row.appendChild(col);
}

function removeCard(button) {
  button.addEventListener("click", () => {
    button.closest(".col").remove();
  });
}

function addToCart(button, book) {
  button.addEventListener("click", () => {
    button.classList.toggle("btn-success");
    if (button.classList.contains("btn-success")) {
      button.innerText = "Added to cart";
      cart.push(book);
      localStorage.setItem("myCart", JSON.stringify(cart));
      showInCart();
    } else {
      button.innerText = "Add to cart";
      removeFromCart(book);
    }
  });
}

function removeFromCart(book) {
  if (cart.length > 0) {
    cart.forEach((elem) => {
      if (elem === book) {
        cart.splice(cart.indexOf(elem), 1);
        localStorage.setItem("myCart", JSON.stringify(cart));
        showInCart();
      }
    });
  }
}

function fromCartRemove(book) {
  removeFromCart(book);
  findBook(book);
}

function findBook(book) {
  const allImg = Array.from(document.querySelectorAll(".card img"));

  allImg.forEach((img) => {
    if (img.src === book.img) {
      const card = img.closest(".card");
      const child = card.closest("div");

      child.querySelector(".btn-buy").classList.remove("btn-success");
      child.querySelector(".btn-buy").innerText = "Add to cart";
    }
  });
}

function showInCart() {
  const cartDOM = document.getElementById("cartMenu");
  cartDOM.innerHTML = "";
  let total = 0;

  cart.forEach((book) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item", "px-1");
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center", "border", "border-1", "p-1");

    const divInside = document.createElement("div");
    divInside.classList.add("d-flex", "align-items-center");

    const img = document.createElement("img");
    img.src = book.img;
    img.classList.add("me-1");
    img.style = "width: 35px; height: 50px";

    const price = document.createElement("span");
    price.innerHTML = book.price + "$";
    total += book.price;

    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = "❌";
    button.addEventListener("click", () => fromCartRemove(book));

    divInside.appendChild(img);
    divInside.appendChild(price);

    div.appendChild(divInside);
    div.appendChild(button);

    a.appendChild(div);

    li.appendChild(a);

    cartDOM.appendChild(li);
  });

  const shop = document.createElement("div");
  shop.classList.add("d-flex", "justify-content-between", "align-items-center", "py-1", "px-2");

  const totalPrice = document.createElement("small");
  totalPrice.innerHTML = `Total: ${total.toFixed(2)}$`;

  const shopButton = document.createElement("button");
  shopButton.classList.add("btn", "btn-outline-primary", "px-1", "py-0");
  shopButton.innerText = "Shop";

  shop.appendChild(totalPrice);
  shop.appendChild(shopButton);

  cartDOM.appendChild(shop);
}
