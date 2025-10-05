function manejarNombreUsuario() {
    
    let nombreUsuario = sessionStorage.getItem('nombreUsuario');
    const elementoMensaje = document.getElementById('bienvenida');

    
    if (!nombreUsuario) {
        nombreUsuario = prompt("Por favor, ingresa tu nombre y apellido:");
        
      
        if (nombreUsuario) {
            sessionStorage.setItem('nombreUsuario', nombreUsuario);
        } else {
            
            nombreUsuario = 'invitado';
        }
    }

    
    if (elementoMensaje) {
        elementoMensaje.textContent = `Bienvenido(a) ${nombreUsuario} `;
    }
}


document.addEventListener('DOMContentLoaded', manejarNombreUsuario);




function mostrarAlerta() {
  alert("Tu carrito está vacio");
}



function enviarMensaje() {
  alert("Guardado exitosamente");
}


function slug(nombre) {
      return nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    let carrito = [];

    function ajustarProducto(nombre, precio, cantidad) {
      const index = carrito.findIndex(p => p.nombre === nombre);
      if (index >= 0) {
        carrito[index].cantidad += cantidad;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
      } else if (cantidad > 0) {
        carrito.push({ nombre, precio, cantidad });
      }
      actualizarCarrito();
      actualizarCantidadUI(nombre);
      mostrarMensaje(`${nombre}: ${cantidad > 0 ? 'Agregado' : 'Quitado'}`);
    }

    function actualizarCantidadUI(nombre) {
      const prod = carrito.find(p => p.nombre === nombre);
      const cantidad = prod ? prod.cantidad : 0;
      const span = document.getElementById("qty-" + slug(nombre));
      if (span) span.textContent = cantidad;
    }

    function actualizarCarrito() {
      const contenedor = document.getElementById("cart-items");
      const subtotalEl = document.getElementById("cart-subtotal");
      const ivaEl = document.getElementById("cart-iva");
      const totalIvaEl = document.getElementById("cart-total-iva");
      const totalEl = document.getElementById("cart-total");
      const section = document.getElementById("cart-section");

      if (carrito.length === 0) {
        section.style.display = "none";
        return;
      }

      section.style.display = "block";
      contenedor.innerHTML = "";
      let totalConIVA = 0;

      carrito.forEach((prod, i) => {
        const precioTotal = prod.precio * prod.cantidad;
        totalConIVA += precioTotal;

        const div = document.createElement("div");
        div.className = "cart__item";
        div.innerHTML = `
          <span class="cart__item-name">${prod.nombre}</span>
          <div class="cart__controls">
            <button onclick="ajustarProducto('${prod.nombre}', ${prod.precio}, -1)" class="btn btn-sm btn-secondary cart__button">−</button>
            <span>${prod.cantidad}</span>
            <button onclick="ajustarProducto('${prod.nombre}', ${prod.precio}, 1)" class="btn btn-sm btn-primary cart__button">+</button>
            <button onclick="eliminar(${i})" class="btn btn-sm cart__button cart__button--delete">Eliminar</button>
          </div>
          <span class="cart__price">$${(precioTotal).toLocaleString()}</span>
        `;
        contenedor.appendChild(div);
      });

      const neto = Math.round(totalConIVA / 1.19);
      const iva = totalConIVA - neto;
      
      const totalFinal = totalConIVA;

      subtotalEl.textContent = neto.toLocaleString();
      ivaEl.textContent = iva.toLocaleString();
      totalIvaEl.textContent = totalConIVA.toLocaleString();
      totalEl.textContent = totalFinal.toLocaleString();
    }

    function eliminar(index) {
      const nombre = carrito[index].nombre;
      carrito.splice(index, 1);
      actualizarCarrito();
      actualizarCantidadUI(nombre);
      mostrarMensaje(`Producto eliminado`);
    }

    function vaciarCarrito() {
      carrito = [];
      document.querySelectorAll(".product__quantity").forEach(span => span.textContent = 0);
      actualizarCarrito();
      mostrarMensaje("Carrito vacío");
    }

    function finalizarCompra() {
      if (carrito.length === 0) {
        mostrarMensaje("Tu carrito está vacío.");
        return;
      }
      const confirmacion = confirm("¿Deseas finalizar la compra?");
      if (confirmacion) {
        mostrarMensaje("✅ ¡Compra finalizada! Gracias por tu pedido.");
        vaciarCarrito();
      }
    }

    function mostrarMensaje(texto) {
      const mensaje = document.getElementById("feedback-message");
      mensaje.textContent = texto;
      mensaje.style.display = "block";
      setTimeout(() => mensaje.style.display = "none", 2000);
    }