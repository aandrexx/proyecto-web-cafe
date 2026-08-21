/* =========================
   CAFÉ AETHEL
   FUNCIONES PRINCIPALES
========================= */

let cart = JSON.parse(localStorage.getItem("aethelCart")) || [];
let favorites = JSON.parse(localStorage.getItem("aethelFavorites")) || [];


/* =========================
   ELEMENTOS
========================= */

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchInput");

const themeBtn = document.getElementById("themeBtn");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");

const checkoutForm = document.getElementById("checkoutForm");

const reservationForm =
  document.getElementById("reservationForm");


/* =========================
   CARRITO
========================= */

function saveCart() {

  localStorage.setItem(
    "aethelCart",
    JSON.stringify(cart)
  );

}


function addToCart(name, price) {

  const existing = cart.find(
    item => item.name === name
  );

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      name: name,
      price: Number(price),
      quantity: 1
    });

  }

  saveCart();

  renderCart();

  showToast(`${name} agregado al carrito 🛒`);

}


function removeFromCart(name) {

  cart = cart.filter(
    item => item.name !== name
  );

  saveCart();

  renderCart();

}


function changeQuantity(name, amount) {

  const item = cart.find(
    product => product.name === name
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {

    removeFromCart(name);

    return;

  }

  saveCart();

  renderCart();

}


function renderCart() {

  cartItems.innerHTML = "";

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        Tu carrito está vacío ☕
      </p>
    `;

  } else {

    cart.forEach(item => {

      const element = document.createElement("div");

      element.className = "cart-item";

      element.innerHTML = `

        <div>
          <h4>${item.name}</h4>

          <p>
            $${item.price.toFixed(2)}
          </p>
        </div>

        <div class="quantity">

          <button
            onclick="changeQuantity('${item.name}', -1)"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            onclick="changeQuantity('${item.name}', 1)"
          >
            +
          </button>

        </div>

      `;

      cartItems.appendChild(element);

    });

  }


  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const quantity = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );


  cartTotal.textContent =
    `$${total.toFixed(2)}`;

  cartCount.textContent = quantity;

}


/* =========================
   ABRIR / CERRAR CARRITO
========================= */

function openCart() {

  cartPanel.classList.add("active");

  cartOverlay.classList.add("active");

}


function closeCartPanel() {

  cartPanel.classList.remove("active");

  cartOverlay.classList.remove("active");

}


cartBtn.addEventListener(
  "click",
  openCart
);


closeCart.addEventListener(
  "click",
  closeCartPanel
);


cartOverlay.addEventListener(
  "click",
  closeCartPanel
);


/* =========================
   PRODUCTOS DEL MENÚ
========================= */

document.querySelectorAll(".menu-card")
.forEach(card => {

  const button =
    card.querySelector(".add-btn");

  button.addEventListener(
    "click",
    () => {

      const name =
        card.dataset.name;

      const price =
        card.dataset.price;

      addToCart(name, price);

    }
  );

});


/* =========================
   PRODUCTOS DE TIENDA
========================= */

document.querySelectorAll(
  "[data-shop-name]"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      addToCart(
        button.dataset.shopName,
        button.dataset.shopPrice
      );

    }
  );

});


/* =========================
   BUSCADOR
========================= */

searchInput.addEventListener(
  "input",
  filterProducts
);


function filterProducts() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();

  document.querySelectorAll(
    ".product"
  ).forEach(product => {

    const name =
      product.dataset.name
        .toLowerCase();

    product.style.display =
      name.includes(search)
        ? ""
        : "none";

  });

}


/* =========================
   CATEGORÍAS
========================= */

document.querySelectorAll(
  ".category-btn"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      document.querySelectorAll(
        ".category-btn"
      ).forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      const category =
        button.dataset.category;

      document.querySelectorAll(
        ".product"
      ).forEach(product => {

        const matchesCategory =
          category === "todos" ||
          product.dataset.category === category;

        const matchesSearch =
          product.dataset.name
            .toLowerCase()
            .includes(
              searchInput.value
                .toLowerCase()
            );

        product.style.display =
          matchesCategory && matchesSearch
            ? ""
            : "none";

      });

    }
  );

});


/* =========================
   FAVORITOS
========================= */

document.querySelectorAll(
  ".favorite-btn"
).forEach(button => {

  const product =
    button.dataset.product;

  if (favorites.includes(product)) {

    button.classList.add("active");

    button.textContent = "♥";

  }


  button.addEventListener(
    "click",
    () => {

      if (favorites.includes(product)) {

        favorites =
          favorites.filter(
            item => item !== product
          );

        button.classList.remove("active");

        button.textContent = "♡";

        showToast(
          "Eliminado de favoritos"
        );

      } else {

        favorites.push(product);

        button.classList.add("active");

        button.textContent = "♥";

        showToast(
          "Añadido a favoritos ❤️"
        );

      }


      localStorage.setItem(
        "aethelFavorites",
        JSON.stringify(favorites)
      );

    }
  );

});


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(
    () => {
      toast.classList.remove("show");
    },
    2500
  );

}


/* =========================
   MODO OSCURO
========================= */

const savedTheme =
  localStorage.getItem("aethelTheme");

if (savedTheme === "dark") {

  document.body.classList.add("dark");

  themeBtn.textContent = "☀️";

}


themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle("dark");

    const isDark =
      document.body.classList.contains("dark");

    localStorage.setItem(
      "aethelTheme",
      isDark ? "dark" : "light"
    );

    themeBtn.textContent =
      isDark ? "☀️" : "🌙";

  }
);


/* =========================
   MENÚ MÓVIL
========================= */

mobileMenuBtn.addEventListener(
  "click",
  () => {

    navMenu.classList.toggle("active");

  }
);


document.querySelectorAll(
  ".nav-link"
).forEach(link => {

  link.addEventListener(
    "click",
    () => {
      navMenu.classList.remove("active");
    }
  );

});


/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener(
  "click",
  () => {

    if (cart.length === 0) {

      showToast(
        "Agrega productos antes de continuar ☕"
      );

      return;

    }

    checkoutModal.classList.add("active");

  }
);


closeCheckout.addEventListener(
  "click",
  () => {

    checkoutModal.classList.remove("active");

  }
);


checkoutForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const orderNumber =
      Math.floor(
        10000 + Math.random() * 90000
      );

    cart = [];

    saveCart();

    renderCart();

    checkoutModal.classList.remove("active");

    closeCartPanel();

    checkoutForm.reset();

    showToast(
      `Pedido #${orderNumber} confirmado 🎉`
    );

  }
);


/* =========================
   RESERVAS
========================= */

reservationForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const name =
      document.getElementById(
        "reservationName"
      ).value;

    const date =
      document.getElementById(
        "reservationDate"
      ).value;

    const time =
      document.getElementById(
        "reservationTime"
      ).value;


    showToast(
      `Reserva confirmada para ${name} 🎉`
    );

    reservationForm.reset();

  }
);


/* =========================
   INICIALIZACIÓN
========================= */

renderCart();
