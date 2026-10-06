let carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];

const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnConfirmarCompra = document.getElementById("btn-confirmar-compra");
const btnIrCarrito = document.getElementById("btn-ir-carrito");

const seccionComprobante = document.getElementById("seccion-comprobante");
const formularioCompra = document.getElementById("formulario-compra");
const comprobanteGenerado = document.getElementById("comprobante-generado");

const contenedorCompras = document.getElementById("contenedor-compras");
const btnLimpiarCompras = document.getElementById("btn-limpiar-compras");

const metodoPago = document.getElementById("metodo-pago");
const opcionesCuotas = document.getElementById("opciones-cuotas");
const cuotas = document.getElementById("cuotas");
const valorCuota = document.getElementById("valor-cuota");


function actualizarCuotas() {

    if (metodoPago.value === "Tarjeta de crédito") {

        opcionesCuotas.hidden = false;

        const cantidadCuotas = Number(cuotas.value);

        const total = carrito.reduce(
            (acumulado, producto) => 
                acumulado + producto.precio * producto.cantidad,
            0         
        );

        const valor = total / cantidadCuotas;

        valorCuota.textContent =
             `${cantidadCuotas} cuota${cantidadCuotas > 1 ? "s" : ""} de $${valor.toLocaleString("es-AR")}`;

    } else {

        opcionesCuotas.hidden = true;

        valorCuota.textContent = "";
    }
}

metodoPago.addEventListener("change", actualizarCuotas);

cuotas.addEventListener("change", actualizarCuotas);


// Guardar carrito en localStorage
function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// Agregar producto al carrito
function agregarProductoAlCarrito(videojuego) {

    const productoExistente = carrito.find(
        (producto) => producto.id === videojuego.id
    );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            ...videojuego,
            cantidad: 1
        });

    }

    guardarCarrito();
    renderizarCarrito();

    Toastify({
        text: `🛒 "${videojuego.nombre}" agregado al carrito`,
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();

}


// Mostrar carrito
function renderizarCarrito() {

    if (carrito.length === 0) {

        contenedorCarrito.innerHTML = `
            <p class="mensaje-vacio">
                🛒 Tu carrito está vacío.
            </p>
        `;

        totalCarrito.textContent = "$0";
        cantidadCarrito.textContent = "0";

        return;
    }


    contenedorCarrito.innerHTML = "";


    carrito.forEach((producto) => {

        const {
            id,
            nombre,
            precio,
            categoria,
            imagen,
            cantidad
        } = producto;

        const textoUnidad = cantidad === 1
            ? "unidad"
            : "unidades";


        contenedorCarrito.innerHTML += `
            <article class="item-carrito">

                <img
                    src="${imagen}"
                    alt="Portada de ${nombre}"
                >

                <div class="info-carrito">

                    <h3>${nombre}</h3>

                    <p>
                        Categoría: ${categoria}
                    </p>

                    <p>
                        Precio unitario:
                        $${precio.toLocaleString("es-AR")}
                    </p>

                    <p>
                        Cantidad: ${cantidad} ${textoUnidad}
                    </p>

                    <p class="subtotal">
                        Subtotal:
                        $${(precio * cantidad).toLocaleString("es-AR")}
                    </p>

                </div>


                <div class="controles-cantidad">

                    <button
                        type="button"
                        class="btn-cantidad"
                        data-id="${id}"
                        data-accion="restar"
                    >
                        −
                    </button>

                    <span>
                        ${cantidad}
                    </span>

                    <button
                        type="button"
                        class="btn-cantidad"
                        data-id="${id}"
                        data-accion="sumar"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="btn-eliminar-carrito"
                    data-id="${id}"
                >
                    🗑️ Eliminar
                </button>

            </article>
        `;

    });


    calcularTotal();

}


// Calcular total
function calcularTotal() {

    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    );


    const cantidadTotal = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.cantidad,
        0
    );


    totalCarrito.textContent =
        `$${total.toLocaleString("es-AR")}`;

    cantidadCarrito.textContent = cantidadTotal;

}


// Mostrar mis compras
function mostrarMisCompras() {

    const compras = JSON.parse(
        localStorage.getItem("compras")
    ) || [];

    if (compras.length === 0) {

        contenedorCompras.innerHTML = `
            <p class="mensaje-vacio">
                🧾 Todavía no realizaste ninguna compra.
            </p>
        `;

        return;
    }

    contenedorCompras.innerHTML = "";

    compras.forEach((compra) => {

        contenedorCompras.innerHTML += `
            <article class="compra">

                <div class="encabezado-compra">

                    <div>

                        <h3>
                            🧾 Compra realizada
                        </h3>

                        <p>
                            <strong>Cliente:</strong>
                            ${compra.cliente}
                        </p>

                        <p>
                            <strong>Fecha:</strong>
                            ${compra.fecha}
                        </p>

                    </div>

                    <div class="total-compra">

                        <span>Total</span>

                        <strong>
                            $${compra.total.toLocaleString("es-AR")}
                        </strong>

                    </div>

                </div>


                <div class="productos-compra">

                    ${compra.productos.map((producto) => `
                        
                        <div class="producto-compra">

                            <div>

                                <strong>
                                    ${producto.nombre}
                                </strong>

                                <p>
                                    Cantidad:
                                    ${producto.cantidad}
                                </p>

                                <strong>
                                    $${producto.subtotal.toLocaleString("es-AR")}
                                </strong>

                            </div>

                        </div>

                    `).join("")}

                </div>

            </article>
        `;

    });

}


// Limpiar historial de compras
btnLimpiarCompras.addEventListener("click", () => {

    const compras = JSON.parse(
        localStorage.getItem("compras")
    ) || [];

    if (compras.length === 0) {

        Toastify({
            text: "🧾 No hay compras para eliminar",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

        return;
    }

    localStorage.removeItem("compras");

    mostrarMisCompras();

    Toastify({
        text: "🗑️ Historial de compras eliminado",
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();

});


// Modificar cantidad
function modificarCantidad(id, accion) {

    const producto = carrito.find(
        (item) => item.id === id
    );


    if (!producto) {
        return;
    }


    if (accion === "sumar") {

        producto.cantidad++;

    } else if (accion === "restar") {

        producto.cantidad--;

        if (producto.cantidad <= 0) {

            eliminarDelCarrito(id);

            return;
        }
    }


    guardarCarrito();
    renderizarCarrito();

}


// Eliminar producto
function eliminarDelCarrito(id) {

    carrito = carrito.filter(
        (producto) => producto.id !== id
    );

    guardarCarrito();
    renderizarCarrito();


    Toastify({
        text: "🗑️ Producto eliminado del carrito",
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();

}


// Eventos del carrito
contenedorCarrito.addEventListener("click", (evento) => {

    const botonCantidad =
        evento.target.closest(".btn-cantidad");

    const botonEliminar =
        evento.target.closest(".btn-eliminar-carrito");


    if (botonCantidad) {

        const id = Number(
            botonCantidad.dataset.id
        );

        const accion =
            botonCantidad.dataset.accion;

        modificarCantidad(id, accion);
    }


    if (botonEliminar) {

        const id = Number(
            botonEliminar.dataset.id
        );

        eliminarDelCarrito(id);
    }

});


// Vaciar carrito
btnVaciarCarrito.addEventListener("click", () => {

    if (carrito.length === 0) {

        Toastify({
            text: "🛒 El carrito ya está vacío",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

        return;
    }


    carrito = [];

    guardarCarrito();
    renderizarCarrito();


    Toastify({
        text: "🧹 Carrito vaciado correctamente",
        duration: 3000,
        gravity: "top",
        position: "right"
    }).showToast();

});


// Confirmar compra
btnConfirmarCompra.addEventListener("click", () => {

    if (carrito.length === 0) {

        Toastify({
            text: "⚠️ Agregá productos antes de confirmar la compra",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

        return;
    }

    seccionComprobante.hidden = false;

    seccionComprobante.scrollIntoView({
        behavior: "smooth"
    });

});


formularioCompra.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const nombre = document
        .getElementById("nombre-cliente")
        .value
        .trim();

    const apellido = document
        .getElementById("apellido-cliente")
        .value
        .trim();

    const metodoSeleccionado = metodoPago.value;

    const cantidadCuotas = 
        metodoSeleccionado === "Tarjeta de crédito"
            ? Number(cuotas.value)
            : 1;

    const fechaCompra =
        new Date().toLocaleString("es-AR");


    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    );


    const productosComprobante = carrito.map((producto) => {

        const {
            nombre,
            precio,
            cantidad
        } = producto;

        return {
            nombre,
            precio,
            cantidad,
            subtotal: precio * cantidad
        };

    });


    const compra = {
        cliente: `${nombre} ${apellido}`,
        fecha: fechaCompra,
        productos: productosComprobante,
        total,
        metodoPago: metodoSeleccionado,
        cuotas: cantidadCuotas
    };


    const comprasGuardadas = JSON.parse(
        localStorage.getItem("compras")
    ) || [];


    comprasGuardadas.push(compra);


    localStorage.setItem(
        "compras",
        JSON.stringify(comprasGuardadas)
    );


    mostrarMisCompras();


    comprobanteGenerado.innerHTML = `
        <div class="comprobante-contenido">

            <h2>🎮 GameStore</h2>

            <h3>🧾 Comprobante de compra</h3>

            <div class="datos-comprobante">

                <p>
                    <strong>Cliente:</strong>
                    ${nombre} ${apellido}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${fechaCompra}
                </p>

                <p>
                   <strong>Método de pago:</strong>
                   ${metodoSeleccionado}
                </p>

                ${metodoSeleccionado === "Tarjeta de crédito" ? `
                    <p>
                       <strong>Cuotas:</strong>
                       ${cantidadCuotas}
                    </p>

                    <p>
                        <strong>Valor de cada cuota:</strong>
                        $${(total / cantidadCuotas).toLocaleString("es-AR")}
                    </p>
                    `: ""}

            </div>


            <div class="productos-comprobante">

                ${productosComprobante.map((producto) => `
                    
                    <div class="producto-comprobante">

                        <div>

                            <strong>
                                ${producto.nombre}
                            </strong>

                            <p>
                                Cantidad:
                                ${producto.cantidad}
                            </p>

                            <p>
                                Precio unitario:
                                $${producto.precio.toLocaleString("es-AR")}
                            </p>

                        </div>

                        <strong>
                            $${producto.subtotal.toLocaleString("es-AR")}
                        </strong>

                    </div>

                `).join("")}

            </div>


            <div class="total-comprobante">

                <span>Total:</span>

                <strong>
                    $${total.toLocaleString("es-AR")}
                </strong>

            </div>

        </div>
    `;


    carrito = [];

    guardarCarrito();
    renderizarCarrito();

    formularioCompra.reset();


    Toastify({
        text: `✅ Compra confirmada por $${total.toLocaleString("es-AR")}`,
        duration: 4000,
        gravity: "top",
        position: "right"
    }).showToast();

});

btnIrCarrito.addEventListener("click", () => {

    const carritoSeccion = document.querySelector(".carrito");

    carritoSeccion.scrollIntoView({
        behavior: "smooth"
    });
});


// Mostrar el carrito y las compras al cargar
renderizarCarrito();
mostrarMisCompras();