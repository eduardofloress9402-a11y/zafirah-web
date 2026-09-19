document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartCountElement = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-btn');

    // Función para actualizar el contador visual del carrito
    function updateCart(amount = 1) {
        cartCount += amount;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            // Efecto sutil de animación al agregar
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Listener para todos los botones de "Agregar al Carrito"
    const addCartButtons = document.querySelectorAll('.btn-add-cart:not(.add-promo-btn)');
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card, .vela-card');
            let productName = 'Producto';
            
            if (productCard) {
                const nameEl = productCard.querySelector('.product-name, .vela-title');
                if (nameEl) productName = nameEl.textContent.trim();
            }

            updateCart(1);
            alert(`¡"${productName}" se agregó al carrito!`);
        });
    });

    // Listener especial para botones de promociones
    const promoButtons = document.querySelectorAll('.add-promo-btn');
    promoButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateCart(6); // Agrega los 6 jabones de la promo al contador
            alert('¡Promo de 6 Jabones ($25.000) agregada al carrito!');
        });
    });

    // Evento al hacer clic en el ícono del carrito
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            if (cartCount === 0) {
                alert('Tu carrito está vacío actualmente.');
            } else {
                alert(`Tenés ${cartCount} producto(s) en tu carrito.`);
            }
        });
    }
});