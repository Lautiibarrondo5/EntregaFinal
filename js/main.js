let videojuegos = [];

const contenedorVideojuegos = document.getElementById("contenedor-videojuegos");
const formulario = document.getElementById("formulario-videojuego");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputCategoria = document.getElementById("categoria");
const buscador = document.getElementById("buscador");
const mensaje = document.getElementById("mensaje");

async function cargarVideojuegos() {

    mensaje.textContent = "Cargando videojuegos...";
    mensaje.className = "mensaje-exito";

    try {

        const respuesta = await fetch("./data.json");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los videojuegos.");
        }

        const datos = await respuesta.json();

        videojuegos = datos;

        localStorage.setItem("videojuegos", JSON.stringify(videojuegos));

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

        console.error("Error:", error);

    } finally {

        console.log("Proceso de carga de videojuegos finalizado.");

    }
}

function renderizarVideojuegos(lista) {

    contenedorVideojuegos.innerHTML = lista.length
        ? ""
        : "<p>No hay videojuegos para mostrar.</p>"  

    lista.forEach((videojuego) => {

        const { id, nombre, precio, categoria } = videojuego;

        contenedorVideojuegos.innerHTML += `
            <article class="videojuego">
                <div>
                    <h3>${nombre}</h3>
                    <p>Categoría: ${categoria}</p>
                    <p class="precio">$${precio.toLocaleString("es-AR")}</p>
                </div>

                <button class="btn-eliminar" data-id="${id}">
                    Eliminar
                </button>
            </article>
        `;
    });

}

function eliminarVideojuego(id) {
    const indice = videojuegos.findIndex((videojuego) => videojuego.id === id);

    if (indice !== -1) {
        videojuegos.splice(indice, 1);
    }

    localStorage.setItem("videojuegos", JSON.stringify(videojuegos));

    renderizarVideojuegos(videojuegos);

    Toastify({
    text: "🗑️ Videojuego eliminado correctamente",
    duration: 3000,
    gravity: "top",
    position: "right"
}).showToast();
}

contenedorVideojuegos.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("btn-eliminar")) {
        const id = Number(evento.target.dataset.id);

        eliminarVideojuego(id);
    }
});

// Cargamos los videojuegos desde data.json
cargarVideojuegos();

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    try {
        const nombre = inputNombre.value.trim();
        const precio = Number(inputPrecio.value);
        const categoria = inputCategoria.value.trim();

        if (nombre === "" || precio <= 0 || categoria === "") {
            mensaje.textContent = "Por favor, completá todos los campos correctamente.";
            mensaje.className = "mensaje-error";
            return;
        }

        const nuevoVideojuego = {
            id: Date.now(),
            nombre: nombre,
            precio: precio,
            categoria: categoria
        };

        videojuegos.push(nuevoVideojuego);

        localStorage.setItem("videojuegos", JSON.stringify(videojuegos));

        renderizarVideojuegos(videojuegos);

        mensaje.textContent = `"${nombre}" fue agregado correctamente.`;
        mensaje.className = "mensaje-exito";

        Toastify({
            text: `🎮 "${nombre}" fue agregado correctamente`,
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

        formulario.reset();

    } catch (error) {
        mensaje.textContent = "⚠️ No se pudo agregar el videojuego. Intentá de nuevo.";
        mensaje.className = "mensaje-error";

        console.error("Error al agregar videojuego:", error);

    } finally {
        console.log("Proceso de agregar videojuego finalizado.");
    }
});


buscador.addEventListener("input", () => {
    const textoBuscado = buscador.value.toLowerCase().trim();

    const videojuegosFiltrados = videojuegos.filter((videojuego) =>
        videojuego.nombre.toLowerCase().includes(textoBuscado)
    );

    renderizarVideojuegos(videojuegosFiltrados);
});