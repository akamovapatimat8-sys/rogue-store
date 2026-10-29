
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const closeCart = document.getElementById("close-cart");
const clearCart = document.getElementById("clear-cart");
const totalElement = document.getElementById("cart-total");

const checkoutButton = document.getElementById("checkout-button");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

const toast = document.getElementById("rogue-toast");
const toastTitle = document.getElementById("rogue-toast-title");
const toastText = document.getElementById("rogue-toast-text");
const toastClose = document.getElementById("rogue-toast-close");

const productPrices = {
    "Oversized T-shirt": 2499,
    "Everyday Hoodie": 4999,
    "Baggy Jeans": 5499,
    "Leather Jacket": 7999,
    "Wide Leg Jeans": 5499,
    "Urban Jacket": 7999
};

let cart = [];
let toastTimer;

try {
    const savedCart = JSON.parse(localStorage.getItem("rogueCart"));
    cart = Array.isArray(savedCart) ? savedCart : [];
} catch {
    cart = [];
}

function showToast(message, title = "ROGUE") {
    if (!toast || !toastTitle || !toastText) {
        console.log(`${title}: ${message}`);
        return;
    }

    clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastText.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function hideToast() {
    if (toast) {
        toast.classList.remove("show");
    }

    clearTimeout(toastTimer);
}

if (toastClose) {
    toastClose.addEventListener("click", hideToast);
}

function saveCart() {
    localStorage.setItem("rogueCart", JSON.stringify(cart));
}

function formatPrice(price) {
    return Math.round(Number(price) || 0).toLocaleString("ru-RU") + " ₽";
}

function getPrice(item) {
    const savedPrice = Number(item.price);

    return Number.isFinite(savedPrice) && savedPrice >= 0
        ? savedPrice
        : (productPrices[item.name] || 0);
}

function renderCart() {
    if (!cartCount || !cartItems) return;

    cartCount.textContent = cart.reduce(
        (sum, item) => sum + Math.max(0, Number(item.quantity) || 1),
        0
    );

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Корзина пока пуста 🤍</p>";

        if (totalElement) {
            totalElement.textContent = "0 ₽";
        }

        saveCart();
        return;
    }

    let totalPrice = 0;

    cartItems.innerHTML = cart.map((item, index) => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = getPrice(item);

        totalPrice += price * quantity;

        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>Размер: ${item.size || "не выбран"}</p>
                    <p>${formatPrice(price)} × ${quantity}</p>

                    <div class="cart-quantity">
                        <button type="button" data-minus="${index}"
                            aria-label="Уменьшить количество">−</button>
                        <span>${quantity}</span>
                        <button type="button" data-plus="${index}"
                            aria-label="Увеличить количество">+</button>
                    </div>
                </div>

                <button type="button" data-remove="${index}">
                    Удалить
                </button>
            </div>
        `;
    }).join("");

    if (totalElement) {
        totalElement.textContent = formatPrice(totalPrice);
    }

    saveCart();
}

// Добавление товаров
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = productPrices[name];

        if (!name || price === undefined) {
            showToast("Не удалось определить товар.", "ОШИБКА");
            return;
        }

        const existingItem = cart.find(item =>
            item.name === name && !item.size
        );

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                name,
                price,
                quantity: 1,
                size: null
            });
        }

        renderCart();

        if (cartPanel) {
            cartPanel.hidden = false;
        }

        if (checkoutForm) {
            checkoutForm.hidden = true;
        }

        if (orderMessage) {
            orderMessage.textContent = "";
        }

        showToast(`${name} добавлен в корзину`, "ДОБАВЛЕНО");
    });
});

// Открытие и закрытие корзины
if (cartButton && cartPanel) {
    cartButton.addEventListener("click", () => {
        cartPanel.hidden = !cartPanel.hidden;
    });
}

if (closeCart && cartPanel) {
    closeCart.addEventListener("click", () => {
        cartPanel.hidden = true;
    });
}

// Изменение количества и удаление товаров
if (cartItems) {
    cartItems.addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove]");
        const plusButton = event.target.closest("[data-plus]");
        const minusButton = event.target.closest("[data-minus]");

        if (removeButton) {
            const index = Number(removeButton.dataset.remove);
            const removedItem = cart[index];

            if (removedItem) {
                cart.splice(index, 1);
                showToast(`${removedItem.name} удалён из корзины`, "КОРЗИНА");
            }
        }

        if (plusButton) {
            const item = cart[Number(plusButton.dataset.plus)];

            if (item) {
                item.quantity = Number(item.quantity || 1) + 1;
            }
        }

        if (minusButton) {
            const index = Number(minusButton.dataset.minus);
            const item = cart[index];

            if (item) {
                item.quantity = Number(item.quantity || 1) - 1;

                if (item.quantity <= 0) {
                    cart.splice(index, 1);
                }
            }
        }

        renderCart();
    });
}

// Очистка корзины
if (clearCart) {
    clearCart.addEventListener("click", () => {
        cart = [];
        renderCart();

        if (checkoutForm) {
            checkoutForm.hidden = true;
            checkoutForm.reset();
        }

        if (orderMessage) {
            orderMessage.textContent = "";
        }

        showToast("Корзина очищена", "ГОТОВО");
    });
}

// Открытие формы оформления заказа
if (checkoutButton && checkoutForm) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Сначала добавь товар в корзину 🤍", "КОРЗИНА");
            return;
        }

        checkoutForm.hidden = !checkoutForm.hidden;

        if (orderMessage) {
            orderMessage.textContent = "";
        }
    });
}

// Демо-подтверждение заказа
if (checkoutForm) {
    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            showToast("Добавь товар перед оформлением.", "КОРЗИНА");
            return;
        }

        if (!checkoutForm.reportValidity()) {
            return;
        }

        const nameInput = document.getElementById("customer-name");
        const customerName = nameInput ? nameInput.value.trim() : "";

        if (!customerName) {
            showToast("Пожалуйста, введи своё имя.", "ПРОВЕРЬ ДАННЫЕ");
            return;
        }

        const orderNumber = Math.floor(100000 + Math.random() * 900000);

        cart = [];
        renderCart();
        checkoutForm.reset();
        checkoutForm.hidden = true;

        if (orderMessage) {
            orderMessage.textContent =
                `Спасибо, ${customerName}! Заказ №${orderNumber} оформлен в деморежиме. Оплата не произведена.`;
        }

        showToast(`Заказ №${orderNumber} оформлен в деморежиме`, "СПАСИБО!");
    });
}

// Фильтры каталога
const filterButtons = document.querySelectorAll(".filter-button");
const products = document.querySelectorAll(".product");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        products.forEach(product => {
            product.style.display =
                category === "all" ||
                product.dataset.category === category
                    ? ""
                    : "none";
        });
    });
});

renderCart();
