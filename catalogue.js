// Product data
const productData = [
  { image: { thumbnail: "./img/pef/pef 2.jpg" }, name: "Qaed Al Fursan",  price: 19000 },
  { image: { thumbnail: "./img/pef/pef5.jpg" }, name: "Ramz by lataffa",  price: 19000 },
  { image: { thumbnail: "/img/pef/pef4.jpg" }, name: "Khamrah by Lattafa", price: 35000 },
  { image: { thumbnail: "./img/pef/pef3.jpg" }, name: "Cocktail",  price: 19000 },
  { image: { thumbnail: "./img/pef/24k.jpg" }, name: "24k perfume",  price: 7000 },
  { image: { thumbnail: "./img/pef/dancer.jpg" }, name: "Dancer spray(men and women)", price: 4000 },
  { image: { thumbnail: "./img/pef/riggs.jpg" }, name: "Riggs",  price: 4000 },
  { image: { thumbnail: "./img/pef/wave body mist.jpg" }, name: "Wave Body Mist", price: 4550 }
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
  const cartCount = document.getElementById("cart-count"); // On store page
  const indexCartCount = document.getElementById("index-cart-count"); // On index.html

  cartList.innerHTML = "";

  const items = Object.keys(cartItems);
  const totalItems = items.length;

  cartCount.textContent = totalItems; // Update cart count in store.html
  if (indexCartCount) {
    indexCartCount.textContent = totalItems; // Update cart count in index.html
  }

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

  // Store updated cart in localStorage
  localStorage.setItem("cart", JSON.stringify(cartItems));
};
;

const renderProducts = () => {
  const productSection = document.getElementById("product-section");
  productSection.innerHTML = "";

  productData.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = ` 
      <img src="${product.image.thumbnail}" style='width:100%; height:350px' alt="Body mist" >
      <div class="card-body">
        <p class="text-start mt-3"><b>Product name</b><br> <u>${product.name}</u></p>
        <div class="price-add-line">
          <span><b>Price:</b> ₦${product.price.toFixed(2)}</span>
          <div class="controls-container"></div>
          </div>
       
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

  const foundProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (foundProducts.length === 0) {
    Toastify({
      text: "Product not found!",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", 
      position: "center",
      stopOnFocus: true,
      style: {
         background: "linear-gradient(to right,rgb(176, 53, 0),rgb(255, 38, 0))"
      },
      onClick: function () { } // Callback after click
    }).showToast();
  


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

document.getElementById("whatsappOrderBtn").addEventListener("click", () => {
  if (Object.keys(cartItems).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Hello Perfumegirly ! I'd like to order:\n";

  Object.entries(cartItems).forEach(([name, { quantity, price }]) => {
    message += `- ${name} x${quantity} (₦${(quantity * price).toLocaleString()})\n`;
  });

  const totalAmount = Object.values(cartItems)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toLocaleString();

  message += `\nTotal: ₦${totalAmount}`;

  const phoneNumber = "2349132148904"; 
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});

