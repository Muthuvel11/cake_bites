const cakes = [
  { name: "Apple Honey Cake", price: 25, img: "assets/appleHoney.jpg" },
  { name: "Wallnut Cake", price: 27, img: "assets/wallnut.jpeg" },
  { name: "Triple Chocolate Browine", price: 35, img: "assets/troupleChocolateBrowine.jpg" },
  { name: "Oreo Cream Cake", price: 250, img: "assets/oreoCream.jpg" },
  { name: "Red Welwet Cake", price: 16, img: "assets/redWelwet.jpg" },
  { name: "Chocolate Moeusse", price: 150, img: "assets/chocolateMoeusse.jpg" },
  { name: "Triple Layer Chocolate Cake", price: 150, img: "assets/tripleLayerChocolate.jpg" },
  { name: "Oreo Chocolate", price: 80, img: "assets/Oreochocolate.jpg" },
  { name: "Oreo Cheese Cake", price: 200, img: "assets/OreoCheese.jpeg" },
  { name: "Vanilla Cake", price: 12, img: "assets/vanillaCake.jpg" },
  { name: "Dream Cake 1/2 KG", price: 250, img: "assets/dreamCake.JPG" },
];

let cart = [];
const cakeList = document.getElementById("cake-list");
const quantities = cakes.map(() => 1);

// Create cake cards
cakes.forEach((cake, i) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${cake.img}" alt="${cake.name}">
    <h3>${cake.name}</h3>
    <p id="price-${i}" class="price-text">₹${cake.price}</p>
    <div class="quantity">
      <button onclick="decreaseQuantity(${i})">-</button>
      <span id="qty-${i}">1</span>
      <button onclick="increaseQuantity(${i})">+</button>
    </div>
    <button class="btn" onclick="openOrderForm(${i})">Order Now</button>
  `;
  cakeList.appendChild(card);
});

// Quantity functions
function increaseQuantity(i) {
  quantities[i]++;
  updateDisplay(i);
  updateCartFromCard(i);
}

function decreaseQuantity(i) {
  if (quantities[i] > 1) {
    quantities[i]--;
    updateDisplay(i);
    updateCartFromCard(i);
  }
}

function updateDisplay(i) {
  document.getElementById(`qty-${i}`).textContent = quantities[i];
  const priceEl = document.getElementById(`price-${i}`);
  priceEl.textContent = `₹${cakes[i].price * quantities[i]}`;
  priceEl.classList.remove("price-animate");
  void priceEl.offsetWidth;
  priceEl.classList.add("price-animate");
}

// Update cart if item already exists
function updateCartFromCard(i) {
  const selected = cakes[i];
  const existing = cart.find(item => item.name === selected.name);
  if (existing) {
    existing.quantity = quantities[i];
    existing.total = existing.price * existing.quantity;
    showCartPreview();
  }
}

// Form inputs
const nameEl = document.getElementById("customer-name");
const mobileEl = document.getElementById("mobile-number");
const addressEl = document.getElementById("address");
const errName = document.getElementById("error-name");
const errMobile = document.getElementById("error-mobile");
const errAddress = document.getElementById("error-address");

[nameEl, mobileEl, addressEl].forEach((el) => {
  el.addEventListener("blur", () => validateField(el));
  el.addEventListener("input", () => validateField(el));
});

function validateField(el) {
  if(el === nameEl) {
    if(nameEl.value.trim() === "") { errName.classList.remove("hidden"); return false; }
    else { errName.classList.add("hidden"); return true; }
  }
  if(el === mobileEl) {
    if(!/^[0-9]{10}$/.test(mobileEl.value.trim())) { errMobile.classList.remove("hidden"); return false; }
    else { errMobile.classList.add("hidden"); return true; }
  }
  if(el === addressEl) {
    if(addressEl.value.trim() === "") { errAddress.classList.remove("hidden"); return false; }
    else { errAddress.classList.add("hidden"); return true; }
  }
}

// Open order form
function openOrderForm(i) {
  const selected = cakes[i];
  const existing = cart.find(item => item.name === selected.name);
  if (existing) {
    existing.quantity = quantities[i]; // update quantity if already in cart
    existing.total = existing.price * existing.quantity;
  } else {
    cart.push({
      name: selected.name,
      price: selected.price,
      quantity: quantities[i],
      total: selected.price * quantities[i]
    });
  }
  showCartPreview();
  document.getElementById("order-form").classList.remove("hidden");
}

// Display cart preview (read-only in form)
function showCartPreview() {
  const cartDiv = document.getElementById("cart-summary");
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>No cakes added yet.</p>";
    return;
  }

  cartDiv.innerHTML = cart.map(item => `
    <p>${item.name} × ${item.quantity} — ₹${item.total}</p>
  `).join("");
}

// Cancel button
document.getElementById("cancel-order").addEventListener("click", () => {
  resetOrderFormInputs();
  document.getElementById("order-form").classList.add("hidden");
});

function resetOrderFormInputs() {
  nameEl.value = "";
  mobileEl.value = "";
  addressEl.value = "";
  errName.classList.add("hidden");
  errMobile.classList.add("hidden");
  errAddress.classList.add("hidden");
}

// Submit order
document.getElementById("submit-order").addEventListener("click", () => {
  const isValid = validateField(nameEl) & validateField(mobileEl) & validateField(addressEl);
  if(!isValid || cart.length === 0) return;

  document.getElementById("hidden-name").value = nameEl.value.trim();
  document.getElementById("hidden-mobile").value = mobileEl.value.trim();
  document.getElementById("hidden-address").value = addressEl.value.trim();
  document.getElementById("hidden-product").value = cart.map(item => `${item.name} × ${item.quantity} — ₹${item.total}`).join("\n");
  document.getElementById("hidden-quantity").value = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById("hidden-amount").value = cart.reduce((sum, i) => sum + i.total, 0);

  document.getElementById("orderForm").submit();
  showSuccessPopup();

  // Reset everything
  cart = [];
  quantities.forEach((_, i) => {
    quantities[i] = 1;
    document.getElementById(`qty-${i}`).textContent = 1;
    document.getElementById(`price-${i}`).textContent = `₹${cakes[i].price}`;
  });
  resetOrderFormInputs();
  document.getElementById("order-form").classList.add("hidden");
});

// Success popup
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  popup.classList.remove("hidden");
  popup.classList.add("fade-in");

  setTimeout(() => {
    popup.classList.remove("fade-in");
    popup.classList.add("fade-out");

    setTimeout(() => {
      popup.classList.add("hidden");
      popup.classList.remove("fade-out");
    }, 500);
  }, 3000);
}

