let videojuegos = [];

const contenedorVideojuegos = document.getElementById("contenedor-videojuegos");
const buscador = document.getElementById("buscador");
const mensaje = document.getElementById("mensaje");
const btnVerMas = document.getElementById("btn-ver-mas");

let mostrarTodos = false;
let videojuegosFiltrados = [];

// Cargar videojuegos desde data.json
async function cargarVideojuegos() {

    mensaje.textContent = "Cargando videojuegos...";
    mensaje.className = "mensaje-exito";

    try {

        const respuesta = await fetch("./assets/data/data.json");

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

// Mostrar videojuegos
function renderizarVideojuegos(lista) {

    videojuegosFiltrados = lista;

    if (lista.length === 0) {

        contenedorVideojuegos.innerHTML = `
            <p class="mensaje-vacio">
                No se encontraron videojuegos.
            </p>
        `;

        btnVerMas.style.display = "none";

        return;
    }

    const videojuegosVisibles = mostrarTodos
        ? lista
        : lista.slice(0, 4);

    contenedorVideojuegos.innerHTML = "";

    videojuegosVisibles.forEach((videojuego) => {

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

    const resultados = videojuegos.filter(
        (videojuego) =>
            videojuego.nombre
                .toLowerCase()
                .includes(textoBuscado)
    );

    renderizarVideojuegos(resultados);

});

//mostrat mas o menos juegos
btnVerMas.addEventListener("click", () => {

    mostrarTodos = !mostrarTodos;

    renderizarVideojuegos(videojuegosFiltrados);

    btnVerMas.textContent = mostrarTodos
        ? "Ver menos"
        : "Ver más juegos";
});

// Iniciar aplicación
cargarVideojuegos();