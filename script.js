// Variable global para guardar la lista de productos y el total acumulado
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-btn');

    // Función para actualizar el contador visual y calcular totales
    window.updateCart = function() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            
            // Efecto sutil de animación al agregar
            cartCountElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }

        return { totalItems, totalPrice };
    };

    // Función global para añadir ítems al carrito con su precio
    window.addToCart = function(name, price, imageSrc) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: imageSrc,
                quantity: 1
            });
        }

        updateCart();
        alert(`¡"${name}" ($${price.toLocaleString('es-AR')}) se agregó al carrito!`);
    };

    // Listener para los botones de las promos (agrega el paquete completo)
    const promoButtons = document.querySelectorAll('.add-promo-btn');
    promoButtons.forEach(button => {
        button.addEventListener('click', () => {
            addToCart('Promo 6 Jabones', 25000, 'img/arcillaycoco.png');
        });
    });

    // Evento al hacer clic en el ícono del carrito para ver el desglose y el total
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            const { totalItems, totalPrice } = updateCart();

            if (totalItems === 0) {
                alert('Tu carrito está vacío actualmente.');
            } else {
                let resumen = '🛒 TU CARRITO DE COMPRAS:\n\n';
                cart.forEach(item => {
                    resumen += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
                });
                resumen += `\nTOTAL ACUMULADO: $${totalPrice.toLocaleString('es-AR')}`;

                alert(resumen);
            }
        });
    }
});

// --- Funciones para el Modal de Información de Productos ---
function openProductModal(name, desc, img, tag, fullInfo) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBodyContent');
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <img src="${img}" alt="${name}" style="width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px; margin-bottom: 15px; background: #faf9f6;">
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
    if (modal) modal.style.display = 'none';
}

// Cerrar el modal si hacen clic fuera de la cajita blanca
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event && event.target === modal) {
        modal.style.display = 'none';
    }
}
