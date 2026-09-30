let carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];

const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnConfirmarCompra = document.getElementById("btn-confirmar-compra");


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

        const textoUnidad = cantidad === 1 ? "unidad" : "unidades";


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


    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    );


    Toastify({
        text: `✅ Compra confirmada por $${total.toLocaleString("es-AR")}`,
        duration: 4000,
        gravity: "top",
        position: "right"
    }).showToast();

    localStorage.setItem(
        "ultimaCompra",
        JSON.stringify({
            fecha: new Date().toLocaleString("es-AR"),
            productos: carrito,
            total: total 
        })
    );

    carrito = [];

    guardarCarrito();
    renderizarCarrito();

});


// Mostrar el carrito al cargar la página
renderizarCarrito();