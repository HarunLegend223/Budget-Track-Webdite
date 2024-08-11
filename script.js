document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.getElementById('cart-items');
    const cartElement = document.getElementById('cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const closeCartButton = document.getElementById('close-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.getAttribute('data-title');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(title, price);
        });
    });

    function addToCart(title, price) {
        cart.push({ title, price });
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${item.title} - $${item.price.toFixed(2)}`;
            cartItems.appendChild(listItem);
            total += item.price;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    document.getElementById('cart-icon').addEventListener('click', () => {
        cartElement.classList.toggle('hidden');
    });

    closeCartButton.addEventListener('click', () => {
        cartElement.classList.add('hidden');
    });
});
