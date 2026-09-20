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

// --- Funciones para el Modal de Información de Productos ---
function openProductModal(name, desc, img, tag, fullInfo) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBodyContent');
    
    modalBody.innerHTML = `
        <img src="${img}" alt="${name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
        <span style="background: #E8F5E9; color: #2E7D32; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${tag}</span>
        <h2 style="margin: 10px 0; color: #333; font-size: 24px;">${name}</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 10px;"><strong>Efecto:</strong> ${desc}</p>
        <p style="color: #444; font-size: 15px; line-height: 1.5; margin-bottom: 20px;">${fullInfo}</p>
        <button onclick="closeProductModal()" style="background: #333; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold;">Cerrar</button>
    `;
    
    modal.style.display = 'flex';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

// Cerrar el modal si hacen clic fuera de la cajita blanca
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
