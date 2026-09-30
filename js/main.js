let videojuegos = [];

const contenedorVideojuegos = document.getElementById("contenedor-videojuegos");
const buscador = document.getElementById("buscador");
const mensaje = document.getElementById("mensaje");

// Cargar videojuegos desde data.json
async function cargarVideojuegos() {

    mensaje.textContent = "Cargando videojuegos...";
    mensaje.className = "mensaje-exito";

    try {

        const respuesta = await fetch("./data/data.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los videojuegos.");
        }

        const datos = await respuesta.json();

        videojuegos = datos;


        renderizarVideojuegos(videojuegos);

        Toastify({
            text: "🎮 Videojuegos cargados con éxito",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

    } catch (error) {

        mensaje.textContent = "❌ No se pudieron cargar los videojuegos.";
        mensaje.className = "mensaje-error";

        Toastify({
            text: "❌ Error al cargar los videojuegos",
            duration: 4000,
            gravity: "top",
            position: "right"
        }).showToast();

    } finally {

        setTimeout(() => {
            mensaje.textContent = "";
        },3000);

    }
}

// Mostrat videojuegos
function renderizarVideojuegos(lista) {

    if (lista.length === 0) {

        contenedorVideojuegos.innerHTML = `
            <p class="mensaje-vacio">
                No se encontraron videojuegos.
            </p>
        `;

        return;
    }

    contenedorVideojuegos.innerHTML = "";

    lista.forEach((videojuego) => {

        const {
            id,
            nombre,
            precio,
            categoria,
            imagen
        } = videojuego;

        contenedorVideojuegos.innerHTML += `
            <article class="videojuego">

                <img
                    src="${imagen}"
                    alt="Portada de ${nombre}"
                >

                <div class="info-videojuego">

                    <h3>${nombre}</h3>

                    <p>
                        Categoría: ${categoria}
                    </p>

                    <p class="precio">
                        $${precio.toLocaleString("es-AR")}
                    </p>

                    <button
                        type="button"
                        class="btn-agregar"
                        data-id="${id}"
                    >
                        🛒 Agregar al carrito
                    </button>

                </div>

            </article>
        `;
    });
}


// Agregar producto al carrito
contenedorVideojuegos.addEventListener("click", (evento) => {

    if (evento.target.classList.contains("btn-agregar")) {

        const id = Number(evento.target.dataset.id);

        const videojuego = videojuegos.find(
            (producto) => producto.id === id
        );

        if (videojuego) {
            agregarProductoAlCarrito(videojuego);
        }
    }

});


// Buscador
buscador.addEventListener("input", () => {

    const textoBuscado = buscador.value
        .toLowerCase()
        .trim();

    const videojuegosFiltrados = videojuegos.filter(
        (videojuego) =>
            videojuego.nombre
                .toLowerCase()
                .includes(textoBuscado)
    );

    renderizarVideojuegos(videojuegosFiltrados);

});


// Iniciar aplicación
cargarVideojuegos();