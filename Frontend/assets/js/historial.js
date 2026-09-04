function logout() {
    window.location.href = "../pages/login.html";
}


// ========================================
// HISTORIAL
// ========================================

const tbodyHistorial = document.querySelector("#tablaHistorial");


// ========================================
// OBTENER LOTES GUARDADOS
// ========================================

function obtenerLotes() {

    return JSON.parse(
        localStorage.getItem("lotes")
    ) || [];

}


// ========================================
// MOSTRAR HISTORIAL
// ========================================

function cargarHistorial() {

    const lotes = obtenerLotes();

    tbodyHistorial.innerHTML = "";


    if (lotes.length === 0) {

        tbodyHistorial.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">
                    No hay lotes registrados.
                </td>
            </tr>
        `;

        return;
    }


    lotes.forEach((lote, indiceLote) => {

        lote.guias.forEach(guia => {

            const fila = document.createElement("tr");

            fila.innerHTML = `

                <td>${indiceLote + 1}</td>

                <td>${guia.Guia || "---"}</td>

                <td>${guia.TRK || "---"}</td>

                <td>${guia.Casillero || "---"}</td>

                <td>${guia.Cliente || "---"}</td>

                <td>${guia.Peso || "---"}</td>

                <td>${guia.Servicio || "---"}</td>

                <td>${guia.Manifiesto || "---"}</td>

                <td>${lote.fecha || "---"}</td>

            `;

            tbodyHistorial.appendChild(fila);

        });

    });

}

// ========================================
// LIMPIAR RESULTADOS INICIALES
// ========================================

function limpiarResultados() {

    tbodyHistorial.innerHTML = `
        <tr>
            <td colspan="9" style="text-align:center;">
                Realiza una búsqueda para consultar el historial.
            </td>
        </tr>
    `;

    actualizarContador(0);
}


// ========================================
// INICIAR
// ========================================

limpiarResultados();

// ========================================
// FILTROS
// ========================================

const botonesFiltro = document.querySelectorAll(".filter");
const inputBusqueda = document.querySelector("#inputBusqueda");
const filtroFechas = document.querySelector("#filtroFechas");
const fechaDesde = document.querySelector("#fechaDesde");
const fechaHasta = document.querySelector("#fechaHasta");

let filtroActivo = "Todas";


// ========================================
// SELECCIONAR FILTRO
// ========================================

botonesFiltro.forEach(boton => {

    boton.addEventListener("click", () => {

        // Quitar la clase active de todos
        botonesFiltro.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activar el botón seleccionado
        boton.classList.add("active");

        // Guardar el filtro seleccionado
        filtroActivo = boton.textContent.trim();

        if(filtroActivo === "Fechas") {
            inputBusqueda.style.display = "none";
            filtroFechas.style.display = "flex";
        } else {
            inputBusqueda.style.display = "block";
            filtroFechas.style.display = "none";
        }

        // Cambiar placeholder
        switch (filtroActivo) {

            case "Todas":
                inputBusqueda.placeholder =
                    "🔍 Buscar guía, TRK, manifiesto, casillero o cliente...";
                break;

            case "Guías":
                inputBusqueda.placeholder =
                    "🔍 Buscar número de guía...";
                break;

            case "TRK":
                inputBusqueda.placeholder =
                    "🔍 Buscar número de tracking...";
                break;

            case "Manifiestos":
                inputBusqueda.placeholder =
                    "🔍 Buscar número de manifiesto...";
                break;

            case "Casilleros":
                inputBusqueda.placeholder =
                    "🔍 Buscar casillero...";
                break;

            case "Clientes":
                inputBusqueda.placeholder =
                    "🔍 Buscar nombre del cliente...";
                break;

            case "Fechas":
                inputBusqueda.placeholder =
                    "🔍 Seleccionar fecha...";
                break;
        }

        // Limpiar búsqueda anterior
        inputBusqueda.value = "";

    });

});

// ========================================
// BÚSQUEDA DEL HISTORIAL
// ========================================

const btnBuscar = document.querySelector("#btnBuscar");
const btnLimpiar = document.querySelector("#btnLimpiar");

inputBusqueda.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {
        buscarHistorial();
    }

});


// ========================================
// BUSCAR
// ========================================

function buscarHistorial() {

    const texto = inputBusqueda.value.trim().toLowerCase();

    const desde = fechaDesde.value;
    const hasta = fechaHasta.value;

    const lotes = obtenerLotes();

    // Si no escribió nada, mostrar todo
    if (texto === "") {

        cargarHistorial();

        return;
    }


    // Convertir todos los lotes en una sola lista de guías
    let resultados = [];


    lotes.forEach((lote, indiceLote) => {

        lote.guias.forEach(guia => {

            resultados.push({

                lote: indiceLote + 1,

                fecha: lote.fecha,

                guia: guia.Guia || "",

                trk: guia.TRK || "",

                casillero: guia.Casillero || "",

                cliente: guia.Cliente || "",

                peso: guia.Peso || "",

                servicio: guia.Servicio || "",

                manifiesto: guia.Manifiesto || "",
                
                comentario: guia.comentario || ""

            });

            console.log("GUÍA:", guia.Guia, "MANIFIESTO:", guia.Manifiesto);

        });

    });


    // ========================================
    // APLICAR FILTRO
    // ========================================

    resultados = resultados.filter(item => {

        if (filtroActivo === "Fechas") {

            if (!desde && !hasta) {
                return true;
            }

            const fechaRegistro = convertirFecha(item.fecha);

            if (desde && fechaRegistro < desde) {
                return false;
            }

            if (hasta && fechaRegistro > hasta) {
                return false;
            }

            return true;
        }

        switch (filtroActivo) {

            case "Todas":

                return (

                    item.lote.toString().toLowerCase().includes(texto) ||

                    item.guia.toLowerCase().includes(texto) ||

                    item.trk.toLowerCase().includes(texto) ||

                    item.casillero.toLowerCase().includes(texto) ||

                    item.cliente.toLowerCase().includes(texto) ||

                    item.peso.toLowerCase().includes(texto) ||

                    item.servicio.toLowerCase().includes(texto) ||

                    item.manifiesto.toLowerCase().includes(texto) ||

                    item.fecha.toLowerCase().includes(texto)

                );


            case "Guías":

                return item.guia
                    .toLowerCase()
                    .includes(texto);


            case "TRK":

                return item.trk
                    .toLowerCase()
                    .includes(texto);


            case "Manifiestos":

                return item.manifiesto
                    .toLowerCase()
                    .includes(texto);


            case "Casilleros":

                return item.casillero
                    .toLowerCase()
                    .includes(texto);


            case "Clientes":

                return item.cliente
                    .toLowerCase()
                    .includes(texto);


            default:

                return false;

        }

    });

    function convertirFecha(fecha) {

        if (!fecha) {
            return "";
        }

        const partes = fecha.split("/");

        if (partes.length !== 3) {
            return fecha;
        }

        const dia = partes[0];
        const mes = partes[1];
        const año = partes[2];

        return `${año}-${mes}-${dia}`;
    }


    // ========================================
    // MOSTRAR RESULTADOS
    // ========================================

    mostrarResultados(resultados);

}


// ========================================
// MOSTRAR RESULTADOS
// ========================================

function mostrarResultados(resultados) {

    tbodyHistorial.innerHTML = "";


    if (resultados.length === 0) {

        tbodyHistorial.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">
                    No se encontraron resultados.
                </td>
            </tr>
        `;

        actualizarContador(0);

        return;
    }


    resultados.forEach(item => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${item.lote}</td>

            <td>${item.guia || "---"}</td>

            <td>${item.trk || "---"}</td>

            <td>${item.casillero || "---"}</td>

            <td>${item.cliente || "---"}</td>

            <td>${item.peso || "---"}</td>

            <td>${item.servicio || "---"}</td>

            <td>${item.manifiesto || "---"}</td>

            <td>${item.fecha || "---"}</td>



        `;

        tbodyHistorial.appendChild(fila);

    });


    actualizarContador(resultados.length);

}


// ========================================
// CONTADOR DE RESULTADOS
// ========================================

function actualizarContador(cantidad) {

    const lblResultados =
        document.querySelector("#lblResultados");

    if (lblResultados) {

        lblResultados.textContent =
            `Mostrando ${cantidad} registros`;

    }

}


// ========================================
// CONECTAR BOTONES
// ========================================

btnBuscar.addEventListener(
    "click",
    buscarHistorial
);


btnLimpiar.addEventListener(
    "click",
    () => {

        inputBusqueda.value = "";

        fechaDesde.value = "";
        fechaHasta.value = "";

        filtroActivo = "Todas";

        botonesFiltro.forEach(btn => {
            btn.classList.remove("active");
        });

        botonesFiltro[0].classList.add("active");

        inputBusqueda.style.display = "block";
        filtroFechas.style.display = "none";

        inputBusqueda.placeholder =
            "🔍 Buscar guía, TRK, manifiesto, casillero o cliente...";

        cargarHistorial();

    }
);

