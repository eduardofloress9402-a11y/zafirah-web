window.cart = [];

// Función para abrir/cerrar el carrito manualmente
window.toggleCartDropdown = function(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;

    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) window.updateCartUI();
};

// Actualizar el contador y la lista dentro del desplegable
window.updateCartUI = function() {
    const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Actualizar el número rojo en el header
    const badges = document.querySelectorAll('#cart-count, .cart-count, .cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
    });

    // Actualizar el contenido de la cajita desplegable
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');

    if (cartTotalElement) {
        cartTotalElement.textContent = `$${totalPrice.toLocaleString('es-AR')}`;
    }

    if (cartItemsContainer) {
        if (window.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="margin: 0; font-size: 13px; color: #777; text-align: center; padding: 20px 0;">Tu carrito está vacío.</p>';
        } else {
            cartItemsContainer.innerHTML = window.cart.map((item, index) => `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
                    <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; background: #fafafa;">
                    <div style="flex: 1; margin: 0 10px;">
                        <div style="font-size: 13px; font-weight: bold; color: #333;">${item.name}</div>
                        <div style="font-size: 12px; color: #666;">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button onclick="changeQuantity(${index}, -1)" style="border: 1px solid #ddd; background: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="font-size: 13px; font-weight: bold;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="border: 1px solid #ddd; background: #fff; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    return { totalItems, totalPrice };
};

// Modificar cantidades (+ / -)
window.changeQuantity = function(index, delta) {
    window.cart[index].quantity += delta;
    if (window.cart[index].quantity <= 0) {
        window.cart.splice(index, 1);
    }
    window.updateCartUI();
};

// Notificación flotante elegante (Toast) al agregar producto
function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #333; color: #fff; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 14px; z-index: 99999; transition: opacity 0.3s ease; opacity: 0;';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// Función para agregar producto al carrito
window.addToCart = function(name, price, imageSrc) {
    const existingItem = window.cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.cart.push({
            name: name,
            price: Number(price),
            image: imageSrc,
            quantity: 1
        });
    }

    window.updateCartUI();
    showToast(`✓ Agregaste "${name}" al carrito`);
};

// Enviar el pedido listo por WhatsApp
window.sendToWhatsApp = function() {
    if (window.cart.length === 0) {
        showToast('El carrito está vacío.');
        return;
    }

    let mensaje = 'Hola! Quisiera realizar el siguiente pedido en Zafirah:\n\n';
    let total = 0;

    window.cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        mensaje += `• ${item.name} x${item.quantity} - $${subtotal.toLocaleString('es-AR')}\n`;
    });

    mensaje += `\n*TOTAL: $${total.toLocaleString('es-AR')}*`;

    const numero = '5493510000000'; 
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
};

// Listeners al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    window.updateCartUI();

    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            // Previene el cierre si hace clic dentro de la caja del carrito
            if (cartDropdown && cartDropdown.contains(e.target) && e.target !== cartBtn) {
                return;
            }
            window.toggleCartDropdown(e);
        });
    }

    // Cerrar el carrito desplegable si hace clic afuera
    document.addEventListener('click', (e) => {
        if (cartBtn && cartDropdown && !cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.style.display = 'none';
        }
    });
});

// --- Modal de Productos ---
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

window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event && event.target === modal) {
        modal.style.display = 'none';
    }
};
// Abrir / Cerrar Chatbot
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbot-window');
    chatWindow.classList.toggle('hidden');
}

// Respuestas Automáticas del Bot
function sendQuickReply(question) {
    const msgContainer = document.getElementById('chatbot-messages');

    // 1. Mostrar mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = question;
    msgContainer.appendChild(userMsg);

    // 2. Determinar respuesta del bot
    let botResponse = "";

    if (question.includes('pago')) {
        botResponse = "Aceptamos transferencias bancarias, Mercado Pago y tarjetas de crédito/débito. 💳";
    } else if (question.includes('envíos') || question.includes('Envíos')) {
        botResponse = "Realizamos envíos a todo el país. En Córdoba Capital entregamos en 24/48hs. 🚚";
    } else if (question.includes('Materiales')) {
        botResponse = "Todas nuestras velas están hechas con 100% cera de soja vegetal biodegradable y pabilo de algodón. 🌿";
    } else if (question.includes('Asesor')) {
        botResponse = "¡Te derivamos con un asesor! Hacé clic abajo para abrir WhatsApp:";
        setTimeout(() => {
            window.open('https://wa.me/5492966764069?text=Hola,%20quisiera%20hacer%20una%20consulta', '_blank');
        }, 1200);
    } else {
        botResponse = "Gracias por tu consulta. Si querés una atención personalizada, podés presionar 'Hablar con Asesor'.";
    }

    // 3. Mostrar respuesta del bot con retraso suave
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = botResponse;
        msgContainer.appendChild(botMsg);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600);

    msgContainer.scrollTop = msgContainer.scrollHeight;
}
