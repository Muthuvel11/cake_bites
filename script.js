const cakes = [
  { name: "Chocolate Cake", price: 500, img: "assets/chocolate.jpg" },
  { name: "Vanilla Cupcake", price: 150, img: "assets/vanilla.jpg" },
  { name: "Red Velvet Cake", price: 600, img: "assets/redvelvet.jpg" },
  { name: "Strawberry Cake", price: 550, img: "assets/strawberry.jpg" },
  { name: "Blueberry Cupcake", price: 180, img: "assets/blueberry.jpg" }
];

const cakeList = document.getElementById("cake-list");
const quantities = cakes.map(() => 1);
let selectedCake = null;

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

function increaseQuantity(i) {
  quantities[i]++;
  updateDisplay(i);
}
function decreaseQuantity(i) {
  if (quantities[i] > 1) { quantities[i]--; updateDisplay(i); }
}
function updateDisplay(i) {
  document.getElementById(`qty-${i}`).textContent = quantities[i];
  const priceEl = document.getElementById(`price-${i}`);
  priceEl.textContent = `₹${cakes[i].price * quantities[i]}`;
  priceEl.classList.remove("price-animate");
  void priceEl.offsetWidth;
  priceEl.classList.add("price-animate");
}

// Order Form Functions
function resetOrderForm() {
  const nameEl = document.getElementById("customer-name");
  const mobileEl = document.getElementById("mobile-number");
  const addressEl = document.getElementById("address");

  nameEl.value = "";
  mobileEl.value = "";
  addressEl.value = "";

  document.getElementById("error-name").classList.add("hidden");
  document.getElementById("error-mobile").classList.add("hidden");
  document.getElementById("error-address").classList.add("hidden");
  quantities.forEach((_, i) => {
    quantities[i] = 1;
    document.getElementById(`qty-${i}`).textContent = 1;
    document.getElementById(`price-${i}`).textContent = `₹${cakes[i].price}`;
  });

  selectedCake = null;

}

function openOrderForm(i) {
  selectedCake = i;
  resetOrderForm();
  document.getElementById("order-form").classList.remove("hidden");
}

document.getElementById("cancel-order").addEventListener("click", () => {
  resetOrderForm();
  document.getElementById("order-form").classList.add("hidden");
});

// Inputs
const nameEl = document.getElementById("customer-name");
const mobileEl = document.getElementById("mobile-number");
const addressEl = document.getElementById("address");

const errName = document.getElementById("error-name");
const errMobile = document.getElementById("error-mobile");
const errAddress = document.getElementById("error-address");

// ✅ Touched + Dynamic Validation
[nameEl, mobileEl, addressEl].forEach((el) => {

  // When field loses focus, show error if invalid
  el.addEventListener("blur", () => {
    validateField(el);
  });

  // While typing, remove error if now valid
  el.addEventListener("input", () => {
    validateField(el);
  });
});

// Validation function
function validateField(el) {
  if(el === nameEl) {
    if(nameEl.value.trim() === "") {
      errName.classList.remove("hidden");
      return false;
    } else {
      errName.classList.add("hidden");
      return true;
    }
  }
  if(el === mobileEl) {
    if(!/^[0-9]{10}$/.test(mobileEl.value.trim())) {
      errMobile.classList.remove("hidden");
      return false;
    } else {
      errMobile.classList.add("hidden");
      return true;
    }
  }
  if(el === addressEl) {
    if(addressEl.value.trim() === "") {
      errAddress.classList.remove("hidden");
      return false;
    } else {
      errAddress.classList.add("hidden");
      return true;
    }
  }
}


// Submit order
document.getElementById("submit-order").addEventListener("click", () => {
  let isValid = true;

  if(nameEl.value.trim() === "") { errName.classList.remove("hidden"); isValid=false; }
  if(!/^[0-9]{10}$/.test(mobileEl.value.trim())) { errMobile.classList.remove("hidden"); isValid=false; }
  if(addressEl.value.trim() === "") { errAddress.classList.remove("hidden"); isValid=false; }
  if(!isValid) return;

  // Fill hidden form
  const cake = cakes[selectedCake];
  document.getElementById("hidden-name").value = nameEl.value.trim();
  document.getElementById("hidden-mobile").value = mobileEl.value.trim();
  document.getElementById("hidden-address").value = addressEl.value.trim();
  document.getElementById("hidden-product").value = cake.name;
  document.getElementById("hidden-quantity").value = quantities[selectedCake];
  document.getElementById("hidden-amount").value = cake.price * quantities[selectedCake];

  document.getElementById("orderForm").submit();
  showSuccessPopup();
  resetOrderForm();
  document.getElementById("order-form").classList.add("hidden");
});

// Success popup
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  console.log("Success popup function called");

  // Show popup
  popup.classList.remove("hidden");
  popup.classList.add("fade-in");

  // Fade out after 3s
  setTimeout(() => {
    popup.classList.remove("fade-in");
    popup.classList.add("fade-out");

    setTimeout(() => {
      popup.classList.add("hidden");
      popup.classList.remove("fade-out");
    }, 500); // match fadeOut duration
  }, 3000);
}


