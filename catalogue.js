// Product data
const data = [
  { image: { thumbnail: "./img/pef/pef 2.jpg" }, name: "Qaed Al Fursan", about: "A long lasting perfume that gets you smelling attractive", price: 19000 },
  { image: { thumbnail: "./img/pef/pef5.jpg" }, name: "Ramz by lataffa", about: "Some quick example text to build on the card title and make up the bulk of the card's content.", price: 19000 },
  { image: { thumbnail: "/img/pef/pef4.jpg" }, name: "Khamrah by Lattafa", about: "Warm, spicy and sweet Fragrance(unisex)", price: 35000 },
  { image: { thumbnail: "./img/pef/pef3.jpg" }, name: "Cocktail", about: "The aroma is luxurious, attractive, and intoxicating with its flawlessness and depth.", price: 19000 },
  { image: { thumbnail: "./img/pef/24k.jpg" }, name: "24k perfume", about: "This luxurious scent is infused with gold flakes that add a touch of glamour and sophistication.", price: 7000 },
  { image: { thumbnail: "./img/pef/dancer.jpg" }, name: "Dancer spray(men and women)", about: "Immerse yourself in the heart of this captivating fragrance, where the blend of top notes ignites your senses with a burst of vibrant citrus.", price: 4000 },
  { image: { thumbnail: "./img/pef/riggs.jpg" }, name: "Riggs", about: "Made using the best French fragrances with stunning light and refreshing notes, Riggs Body Spray offers 24-hour protection, keeping you on the move all day and night.", price: 4000 },
  { image: { thumbnail: "./img/pef/wave body mist.jpg" }, name: "Wave Body Mist", about: "Wave® body mist is a fresh, lightweight scent that entices with a mix of dewy tropical fruit. Enter a swell of passionate flowers.", price: 4550 }
];

let cartItems = JSON.parse(localStorage.getItem("cart")) || {};

const handleAddToCart = (itemName, itemPrice, controlsContainer) => {
  if (cartItems[itemName]) {
    cartItems[itemName].quantity += 1;
  } else {
    cartItems[itemName] = { quantity: 1, price: itemPrice };
  }

  controlsContainer.innerHTML = `
    <button class='deletebtn' id="minus-btn-${itemName}" style="margin-right: 5px;">-</button>
    <span id="quantity-display-${itemName}">${cartItems[itemName].quantity}</span>
    <button class='plusbtn' id="plus-btn-${itemName}" style="margin-left: 5px;">+</button>
  `;

  document.getElementById(`minus-btn-${itemName}`).addEventListener("click", () => {
    if (cartItems[itemName].quantity > 1) {
      cartItems[itemName].quantity -= 1;
      document.getElementById(`quantity-display-${itemName}`).textContent = cartItems[itemName].quantity;
    } else {
      delete cartItems[itemName];
      controlsContainer.innerHTML = "";
      renderAddButton(controlsContainer, itemName, itemPrice);
    }
    updateCart();
  });

  document.getElementById(`plus-btn-${itemName}`).addEventListener("click", () => {
    cartItems[itemName].quantity += 1;
    document.getElementById(`quantity-display-${itemName}`).textContent = cartItems[itemName].quantity;
    updateCart();
  });

  updateCart();
};

const renderAddButton = (controlsContainer, itemName, itemPrice) => {
  const addButton = document.createElement("button");
  addButton.textContent = "Add to Cart";
  addButton.classList.add("btn", "cart-btn", "btn-sm", "mt-2");
  addButton.onclick = () => handleAddToCart(itemName, itemPrice, controlsContainer);
  controlsContainer.innerHTML = "";
  controlsContainer.appendChild(addButton);
};

const updateCart = () => {
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");

  cartList.innerHTML = "";
  const items = Object.keys(cartItems);
  cartCount.textContent = items.length;

  if (items.length === 0) {
    document.getElementById("empty-cart").style.display = "block";
    localStorage.removeItem("cart");
    return;
  }

  document.getElementById("empty-cart").style.display = "none";

  items.forEach((itemName) => {
    const item = cartItems[itemName];
    const itemTotal = (item.quantity * item.price).toFixed(2);
    const listItem = document.createElement("li");
    listItem.textContent = `${itemName}: ${item.quantity} unit(s) - ₦${itemTotal}`;
    cartList.appendChild(listItem);
  });

  localStorage.setItem("cart", JSON.stringify(cartItems));
};

const renderProducts = () => {
  const productSection = document.getElementById("product-section");
  productSection.innerHTML = "";

  data.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image.thumbnail}" style='width:100%; height:350px' alt="Body mist">
      <div class="card-body">
        <p class="text-start mt-3"><b>Product name</b><br> <u>${product.name}</u></p>
        <div class="price-add-line">
          <span><b>Price:</b> ₦${product.price.toFixed(2)}</span>
          <div class="controls-container"></div>
        </div>
        <p class='text-start'><b>About:</b><br><i>${product.about}</i></p>
      </div>
    `;

    const controlsContainer = productCard.querySelector(".controls-container");
    renderAddButton(controlsContainer, product.name, product.price);
    productSection.appendChild(productCard);
  });
};

const handleSearch = () => {
  const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
  const productSection = document.getElementById('product-section');
  productSection.innerHTML = "";

  const foundProducts = data.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (foundProducts.length === 0) {
    alert("Product not found!");

    
    renderProducts();
    return;
  }

  foundProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image.thumbnail}" style='width:100%; height:350px' alt="Body mist">
      <div class="card-body">
        <p class="text-start mt-3"><b>Product name</b><br> <u>${product.name}</u></p>
        <div class="price-add-line">
          <span><b>Price:</b> ₦${product.price.toFixed(2)}</span>
          <div class="controls-container"></div>
        </div>
        <p class='text-start'><b>About:</b><br><i>${product.about}</i></p>
      </div>
    `;

    const controlsContainer = productCard.querySelector(".controls-container");
    renderAddButton(controlsContainer, product.name, product.price);
    productSection.appendChild(productCard);
  });
};

document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("clearSearchBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderProducts();
});

renderProducts();
updateCart();
