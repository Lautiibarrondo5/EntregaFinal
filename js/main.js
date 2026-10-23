let videojuegos = [];

const contenedorVideojuegos = document.getElementById("contenedor-videojuegos");
const buscador = document.getElementById("buscador");
const mensaje = document.getElementById("mensaje");
const btnVerMas = document.getElementById("btn-ver-mas");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const modalDetalles = document.getElementById("modal-detalles");
const contenidoModalDetalles = document.getElementById("contenido-modal-detalles");
const btnCerrarDetalles = document.getElementById("btn-cerrar-detalles");
const contenedorOfertas = document.getElementById("contenedor-ofertas");

let mostrarTodos = false;
let videojuegosFiltrados = [];
let plataformaSeleccionada = "Todas";

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
        renderizarOfertas();

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

// Detalles de juegos
function mostrarDetalles(id) {

    const videojuego = videojuegos.find(
        (producto) => producto.id === id 
    );

    if (!videojuego) {
        return;
    }

    const {
        nombre,
        precio,
        categoria,
        plataforma,
        descripcion,
        imagen,
        oferta,
        descuento
    } = videojuego;

    const precioFinal = oferta 
        ? precio - (precio * descuento / 100)
        : precio;

    contenidoModalDetalles.innerHTML = `
         <img 
             src="${imagen}"
             alt="Portada de ${nombre}"
             class="imagen-detalles"
          >

          <h2>${nombre}</h2>

          <p>
             <strong>Categoría:</strong> ${categoria}
          </p>

          <p>
             <strong>Plataforma:</strong> ${plataforma}
          </p>

          <p>
             <strong>Descripción:</strong>
             ${descripcion}
          </p>

          ${
            oferta 
               ? `
                <p class="precio-anterior">
                $${precio.toLocaleString("es-AR")}
                </p>   

                <p class="precio">
                $${precioFinal.toLocaleString("es-AR")}
                </p>

                <span class="etiqueta-oferta">
                     🔥 OFERTA -${descuento}%
                </span>
            `
            : `
               <p class="precio">
                   $${precio.toLocaleString("es-AR")}
               </p>
            `
          }

        <button
             type="button"
             class="btn-agregar"
             data-id="${id}"
        >
            🛒  Agregar al carrito
        </button>  
    `;

    modalDetalles.hidden = false;
}
//Ofertas
function renderizarOfertas() {

    const ofertas = videojuegos.filter(
        (videojuego) => videojuego.oferta === true 
    );

    contenedorOfertas.innerHTML = "";

    ofertas.forEach((videojuego) => {

        const{
            id,
            nombre,
            precio,
            categoria,
            plataforma,
            imagen,
            descuento
        } = videojuego;

        const precioFinal = 
            precio - (precio * descuento / 100);

        contenedorOfertas.innerHTML += `
             <article class="oferta-card">

             <div class="oferta-imagen">
               <img 
                   src="${imagen}"
                   alt="Portada de ${nombre}"
                >

                <span class="oferta-descuento">
                        -${descuento}%
                    </span>
                </div>

                <div class="oferta-info">

                    <span class="oferta-plataforma">
                        ${plataforma}
                    </span>

                    <h3>${nombre}</h3>

                    <p>${categoria}</p>

                    <span class="oferta-precio-anterior">
                        $${precio.toLocaleString("es-AR")}
                    </span>

                    <strong class="oferta-precio">
                        $${precioFinal.toLocaleString("es-AR")}
                    </strong>

                    <button
                        type="button"
                        class="btn-agregar"
                        data-id="${id}"
                    >
                        🛒 Aprovechar oferta
                    </button>

                </div>

            </article>
             
        `;
    });
}

// Mostrar videojuegos
function renderizarVideojuegos(lista) {

    videojuegosFiltrados = lista;

    btnVerMas.style.display = lista.length > 4 ? "block" : "none";

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
            plataforma,
            imagen,
            oferta,
            descuento
        } = videojuego;

        const precioFinal = oferta 
            ? precio - (precio * descuento / 100)
            : precio;

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

                    ${oferta ? `
                        <span class="etiqueta-oferta">
                            🔥 OFERTA -${descuento}%
                        </span>

                        <p class="precio-anterior">
                             $${precio.toLocaleString("es-AR")}
                        </p>

                        <p class="precio">
                            $${precioFinal.toLocaleString("es-AR")}
                        </p>
                        ` : `
                         <p class="precio">
                              $${precioFinal.toLocaleString("es-AR")}
                         </p>
                    `} 

                   <p>
                     Plataforma: ${plataforma}
                   </p>

                   <button
                       type="button"
                       class="btn-detalles"
                       data-id="${id}" 
                    > 
                    📋 Ver detalles 
                   </button>
                        

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

    if (evento.target.classList.contains("btn-detalles")) {

        const id = Number(evento.target.dataset.id);

        mostrarDetalles(id);

        return;
    }

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

contenedorOfertas.addEventListener("click", (evento) => {
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

modalDetalles.addEventListener("click", (evento) => {

    if (evento.target.classList.contains("btn-agregar")){

        const id = Number(evento.target.dataset.id);

        const videojuego = videojuegos.find(
            (producto) => producto.id === id  
        );

        if (videojuego) {

            agregarProductoAlCarrito(videojuego);

            modalDetalles.hidden = true;
        }
    }
});

btnCerrarDetalles.addEventListener("click", () => {

    modalDetalles.hidden = true;

});

modalDetalles.addEventListener("click", (evento) => {

    if (evento.target === modalDetalles) {
        modalDetalles.hidden = true;
    }
});



// Buscador
function aplicarFiltros() {

    const textoBuscado = buscador.value
        .toLowerCase()
        .trim();

    const resultados = videojuegos.filter((videojuego) => {

        const coincideNombre = videojuego.nombre
            .toLowerCase()
            .includes(textoBuscado);

        const coincidePlataforma =
            plataformaSeleccionada === "Todas" ||
            videojuego.plataforma === plataformaSeleccionada;

        return coincideNombre && coincidePlataforma;
    });

    renderizarVideojuegos(resultados);
}

buscador.addEventListener("input", aplicarFiltros);


// Filtros de plataforma
botonesFiltro.forEach((boton) => {

    boton.addEventListener("click", () => {

        plataformaSeleccionada = boton.dataset.plataforma;

        botonesFiltro.forEach((btn) => {
            btn.classList.remove("activo");
        });

        boton.classList.add("activo");

        aplicarFiltros();
    });

});

    

//mostrar mas o menos juegos
btnVerMas.addEventListener("click", () => {

    mostrarTodos = !mostrarTodos;

    renderizarVideojuegos(videojuegosFiltrados);

    btnVerMas.textContent = mostrarTodos
        ? "Ver menos"
        : "Ver más juegos";
});

// Iniciar aplicación
cargarVideojuegos();