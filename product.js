const products = {
    tee: {
        name: "Oversized T-shirt",
        price: "2 499 ₽",
        description: "Базовая футболка свободного кроя. Минималистичный дизайн и комфорт на каждый день.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85"
    },
    hoodie: {
        name: "Everyday Hoodie",
        price: "4 999 ₽",
        description: "Удобное худи свободного кроя. Идеально для повседневных образов.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85"
    },
    jeans: {
        name: "Baggy Jeans",
        price: "5 499 ₽",
        description: "Свободные джинсы в стиле streetwear. Комфортная посадка и универсальный силуэт.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85"
    },
    jacket: {
        name: "Leather Jacket",
        price: "7 999 ₽",
        description: "Кожаная куртка с выразительным силуэтом. Акцентная вещь для городского образа.",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85"
    }
};

const item = new URLSearchParams(window.location.search).get("item");
const product = products[item] || products.tee;

document.getElementById("product-name").textContent = product.name;
document.getElementById("product-price").textContent = product.price;
document.getElementById("product-description").textContent = product.description;

const image = document.getElementById("product-image");
image.src = product.image;
image.alt = product.name;

document.title = product.name + " — ROGUE";
const sizeButtons = document.querySelectorAll(".size-button");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});
const addButton = document.querySelector(".product-add-button");

addButton.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-button.active");

    if (!selectedSize) {
        alert("Пожалуйста, выбери размер ❤️");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("rogueCart")) || [];

    const item = {
        name: product.name,
        price: product.price,
        size: selectedSize.textContent,
        quantity: 1
    };

    const existingItem = cart.find(cartItem =>
        cartItem.name === item.name &&
        cartItem.size === item.size
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }

    localStorage.setItem("rogueCart", JSON.stringify(cart));

    alert("Товар добавлен в корзину! 🤍");
});
