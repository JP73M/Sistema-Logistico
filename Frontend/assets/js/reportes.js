// ========================================
// DILOSCAN - REPORTES
// ========================================


// ========================================
// ELEMENTOS
// ========================================

const totalGuiasReporte =
    document.querySelector("#totalGuiasReporte");

const pesoTotalReporte =
    document.querySelector("#pesoTotalReporte");

const totalLotesReporte =
    document.querySelector("#totalLotesReporte");

const totalManifiestosReporte =
    document.querySelector("#totalManifiestosReporte");

const tablaReportes =
    document.querySelector("#tablaReportes");

const cantidadRegistros =
    document.querySelector("#cantidadRegistros");

const buscarReporte =
    document.querySelector("#buscarReporte");

const fechaInicio =
    document.querySelector("#fechaInicio");

const fechaFin =
    document.querySelector("#fechaFin");

const filtroManifiesto =
    document.querySelector("#filtroManifiesto");

const filtroServicio =
    document.querySelector("#filtroServicio");

const filtroUsuario =
    document.querySelector("#filtroUsuario");

const btnGenerarReporte =
    document.querySelector("#btnGenerarReporte");

const btnReporteLotes =
    document.querySelector("#btnReporteLotes");

const btnReporteResumen =
    document.querySelector("#btnReporteResumen");

const reportTabs =
    document.querySelectorAll(".report-tab");


const nombreUsuarioPerfil =
    document.querySelector("#nombreUsuarioPerfil");

const avatarUsuario =
    document.querySelector("#avatarUsuario");


// ========================================
// OBTENER LOTES
// ========================================

function obtenerLotes() {

    return JSON.parse(
        localStorage.getItem("lotes")
    ) || [];

}


// ========================================
// CONVERTIR PESO A NÚMERO
// ========================================

function convertirPeso(valor) {

    if (valor === null || valor === undefined) {
        return 0;
    }

    return parseFloat(
        String(valor)
            .replace("LB", "")
            .replace(",", ".")
            .trim()
    ) || 0;

}


// ========================================
// OBTENER TODAS LAS GUÍAS
// ========================================

function obtenerGuias() {

    const lotes =
        obtenerLotes();

    const registros = [];


    lotes.forEach(lote => {

        const guias =
            Array.isArray(lote.guias)
                ? lote.guias
                : [];


        guias.forEach(guia => {

            registros.push({

                fecha:
                    lote.fecha || "",

                usuario:
                    lote.usuario ||
                    "Usuario no identificado",

                Guia:
                    guia.Guia || "",

                TRK:
                    guia.TRK || "",

                Casillero:
                    guia.Casillero || "",

                Cliente:
                    guia.Cliente || "",

                PesoMIA:
                    guia.PesoMIA || "",

                PesoBOG:
                    guia.PesoBOG || "",

                PesoLIQ:
                    guia.PesoLIQ || "",

                Servicio:
                    guia.Servicio || "",

                Manifiesto:
                    guia.Manifiesto || ""

            });

        });

    });


    return registros;

}

// ========================================
// CAMBIAR REPORTE ACTIVO
// ========================================

function activarReporte(boton) {

    reportTabs.forEach(tab => {

        tab.classList.remove("active");

    });


    boton.classList.add("active");

}

// ========================================
// CALCULAR RESUMEN
// ========================================

function actualizarResumen() {

    const lotes =
        obtenerLotes();

    const guias =
        obtenerGuias();


    // ------------------------------------
    // TOTAL GUÍAS
    // ------------------------------------

    totalGuiasReporte.textContent =
        guias.length;


    // ------------------------------------
    // PESO TOTAL LIQ
    // ------------------------------------

    let pesoTotal = 0;


    lotes.forEach(lote => {

        if (
            lote.peso !== undefined &&
            lote.peso !== null &&
            lote.peso !== ""
        ) {

            pesoTotal +=
                convertirPeso(lote.peso);

            return;
        }


        const guiasLote =
            Array.isArray(lote.guias)
                ? lote.guias
                : [];


        guiasLote.forEach(guia => {

            pesoTotal +=
                convertirPeso(
                    guia.PesoLIQ
                );

        });

    });


    pesoTotalReporte.textContent =
        `${pesoTotal.toFixed(0)} LB`;


    // ------------------------------------
    // TOTAL LOTES
    // ------------------------------------

    totalLotesReporte.textContent =
        lotes.length;


    // ------------------------------------
    // MANIFIESTOS ÚNICOS
    // ------------------------------------

    const manifiestos =
        new Set();


    guias.forEach(guia => {

        const manifiesto =
            String(
                guia.Manifiesto || ""
            ).trim();


        if (manifiesto !== "") {

            manifiestos.add(
                manifiesto
            );

        }

    });


    totalManifiestosReporte.textContent =
        manifiestos.size;

}


// ========================================
// MOSTRAR GUÍAS EN TABLA
// ========================================

function mostrarTabla(guias) {

    tablaReportes.innerHTML = "";


    if (guias.length === 0) {

        tablaReportes.innerHTML = `

            <tr class="fila-vacia">

                <td colspan="12">

                    No hay información para mostrar.

                </td>

            </tr>

        `;

        cantidadRegistros.textContent =
            "0 registros";

        return;

    }


    guias.forEach((guia, index) => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${guia.fecha}
            </td>

            <td>
                ${guia.Guia}
            </td>

            <td>
                ${guia.TRK}
            </td>

            <td>
                ${guia.Casillero}
            </td>

            <td>
                ${guia.Cliente}
            </td>

            <td>
                ${guia.PesoMIA}
            </td>

            <td>
                ${guia.PesoBOG}
            </td>

            <td>
                ${guia.PesoLIQ}
            </td>

            <td>
                ${guia.Servicio}
            </td>

            <td>
                ${guia.Manifiesto}
            </td>

            <td>
                ${guia.usuario}
            </td>

        `;


        tablaReportes.appendChild(
            fila
        );

    });


    cantidadRegistros.textContent =
        `${guias.length} ${
            guias.length === 1
                ? "registro"
                : "registros"
        }`;

}


// ========================================
// USUARIO ACTIVO
// ========================================

function mostrarUsuarioActivo() {

    const usuarioActivo =
        JSON.parse(
            localStorage.getItem(
                "usuarioActivo"
            )
        );


    if (!usuarioActivo) {
        return;
    }


    if (nombreUsuarioPerfil) {

        nombreUsuarioPerfil.textContent =
            usuarioActivo.nombre;

    }


    if (avatarUsuario) {

        const nombre =
            String(
                usuarioActivo.nombre || ""
            ).trim();


        const partes =
            nombre.split(/\s+/);


        let iniciales = "";


        if (partes.length >= 2) {

            iniciales =
                partes[0].charAt(0) +
                partes[1].charAt(0);

        } else {

            iniciales =
                nombre.substring(0, 2);

        }


        avatarUsuario.textContent =
            iniciales.toUpperCase();

    }

}


// ========================================
// BUSCADOR
// ========================================

function configurarBuscador() {

    if (!buscarReporte) {
        return;
    }


    buscarReporte.addEventListener(
        "input",
        () => {

            const texto =
                buscarReporte.value
                .trim()
                .toLowerCase();


            const guias =
                obtenerGuias();


            if (texto === "") {

                mostrarTabla(
                    guias
                );

                return;

            }


            const filtradas =
                guias.filter(guia => {

                    return (

                        String(guia.Guia)
                            .toLowerCase()
                            .includes(texto)

                        ||

                        String(guia.TRK)
                            .toLowerCase()
                            .includes(texto)

                        ||

                        String(guia.Casillero)
                            .toLowerCase()
                            .includes(texto)

                        ||

                        String(guia.Cliente)
                            .toLowerCase()
                            .includes(texto)

                        ||

                        String(guia.Manifiesto)
                            .toLowerCase()
                            .includes(texto)

                    );

                });


            mostrarTabla(
                filtradas
            );

        }
    );

}

// ========================================
// CARGAR OPCIONES DE LOS FILTROS
// ========================================

function cargarFiltros() {

    const guias =
        obtenerGuias();


    const manifiestos =
        new Set();

    const servicios =
        new Set();

    const usuarios =
        new Set();


    guias.forEach(guia => {

        if (guia.Manifiesto) {

            manifiestos.add(
                guia.Manifiesto
            );

        }

        if (guia.Servicio) {

            servicios.add(
                guia.Servicio
            );

        }

        if (guia.usuario) {

            usuarios.add(
                guia.usuario
            );

        }

    });


    // ====================================
    // MANIFIESTOS
    // ====================================

    filtroManifiesto.innerHTML = `
        <option value="">
            Todos
        </option>
    `;


    [...manifiestos]
        .sort()
        .forEach(manifiesto => {

            filtroManifiesto.innerHTML += `
                <option value="${manifiesto}">
                    ${manifiesto}
                </option>
            `;

        });


    // ====================================
    // SERVICIOS
    // ====================================

    filtroServicio.innerHTML = `
        <option value="">
            Todos
        </option>
    `;


    [...servicios]
        .sort()
        .forEach(servicio => {

            filtroServicio.innerHTML += `
                <option value="${servicio}">
                    ${servicio}
                </option>
            `;

        });


    // ====================================
    // USUARIOS
    // ====================================

    filtroUsuario.innerHTML = `
        <option value="">
            Todos
        </option>
    `;


    [...usuarios]
        .sort()
        .forEach(usuario => {

            filtroUsuario.innerHTML += `
                <option value="${usuario}">
                    ${usuario}
                </option>
            `;

        });

}

// ========================================
// APLICAR FILTROS
// ========================================

function aplicarFiltros() {

    const guias =
        obtenerGuias();


    const inicio =
        fechaInicio.value;

    const fin =
        fechaFin.value;

    const manifiesto =
        filtroManifiesto.value;

    const servicio =
        filtroServicio.value;

    const usuario =
        filtroUsuario.value;


    const filtradas =
        guias.filter(guia => {


            // ==============================
            // FECHA
            // ==============================

            if (inicio || fin) {

                const partes =
                    guia.fecha.split(",");


                const fechaTexto =
                    partes[0].trim();


                const fechaPartes =
                    fechaTexto.split("/");


                if (
                    fechaPartes.length === 3
                ) {

                    const dia =
                        fechaPartes[0].padStart(
                            2,
                            "0"
                        );

                    const mes =
                        fechaPartes[1].padStart(
                            2,
                            "0"
                        );

                    const anio =
                        fechaPartes[2];


                    const fechaGuia =
                        `${anio}-${mes}-${dia}`;


                    if (
                        inicio &&
                        fechaGuia < inicio
                    ) {

                        return false;

                    }


                    if (
                        fin &&
                        fechaGuia > fin
                    ) {

                        return false;

                    }

                }

            }


            // ==============================
            // MANIFIESTO
            // ==============================

            if (
                manifiesto &&
                guia.Manifiesto !== manifiesto
            ) {

                return false;

            }


            // ==============================
            // SERVICIO
            // ==============================

            if (
                servicio &&
                guia.Servicio !== servicio
            ) {

                return false;

            }


            // ==============================
            // USUARIO
            // ==============================

            if (
                usuario &&
                guia.usuario !== usuario
            ) {

                return false;

            }


            return true;

        });


    mostrarTabla(
        filtradas
    );


    actualizarResumenFiltrado(
        filtradas
    );

}

// ========================================
// RESUMEN DEL RESULTADO FILTRADO
// ========================================

function actualizarResumenFiltrado(guias) {

    totalGuiasReporte.textContent =
        guias.length;


    // ====================================
    // PESO LIQ
    // ====================================

    let pesoTotal = 0;


    guias.forEach(guia => {

        pesoTotal +=
            convertirPeso(
                guia.PesoLIQ
            );

    });


    pesoTotalReporte.textContent =
        `${pesoTotal.toFixed(0)} LB`;


    // ====================================
    // LOTES
    // ====================================

    const clavesLotes =
        new Set();


    guias.forEach(guia => {

        clavesLotes.add(
            `${guia.fecha}|${guia.usuario}`
        );

    });


    totalLotesReporte.textContent =
        clavesLotes.size;


    // ====================================
    // MANIFIESTOS
    // ====================================

    const manifiestos =
        new Set();


    guias.forEach(guia => {

        if (
            guia.Manifiesto &&
            guia.Manifiesto.trim() !== ""
        ) {

            manifiestos.add(
                guia.Manifiesto
            );

        }

    });


    totalManifiestosReporte.textContent =
        manifiestos.size;

}

// ========================================
// BOTÓN GENERAR REPORTE
// ========================================

btnGenerarReporte.addEventListener(
    "click",
    () => {

        aplicarFiltros();

    }
);

// ========================================
// REPORTE DE LOTES CERRADOS
// ========================================

function mostrarReporteLotes() {

    const lotes =
        obtenerLotes();


    // ====================================
    // TÍTULO DE LA TABLA
    // ====================================

    const tituloTabla =
        document.querySelector(
            ".table-header h2"
        );

    if (tituloTabla) {

        tituloTabla.textContent =
            "Lotes cerrados";

    }


    // ====================================
    // ENCABEZADOS
    // ====================================

    const encabezado =
        document.querySelector("thead tr");

    encabezado.innerHTML = `

        <th>#</th>

        <th>Fecha / Hora</th>

        <th>Usuario</th>

        <th>Guías</th>

        <th>Peso total</th>

        <th>Manifiestos</th>

    `;


    // ====================================
    // TABLA
    // ====================================

    tablaReportes.innerHTML = "";


    if (lotes.length === 0) {

        tablaReportes.innerHTML = `

            <tr class="fila-vacia">

                <td colspan="6">

                    No hay lotes cerrados.

                </td>

            </tr>

        `;

        cantidadRegistros.textContent =
            "0 lotes";

        return;

    }


    // Más reciente primero
    const lotesOrdenados =
        [...lotes].reverse();


    lotesOrdenados.forEach(
        (lote, index) => {

            const fila =
                document.createElement("tr");


            // =================================
            // MANIFIESTOS DEL LOTE
            // =================================

            const manifiestos =
                new Set();


            const guias =
                Array.isArray(lote.guias)
                    ? lote.guias
                    : [];


            guias.forEach(guia => {

                const manifiesto =
                    String(
                        guia.Manifiesto || ""
                    ).trim();


                if (manifiesto !== "") {

                    manifiestos.add(
                        manifiesto
                    );

                }

            });


            const listaManifiestos =
                [...manifiestos].join(", ");


            fila.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${lote.fecha || "—"}
                </td>

                <td>
                    ${
                        lote.usuario ||
                        "Usuario no identificado"
                    }
                </td>

                <td>
                    ${lote.cantidad || guias.length}
                </td>

                <td>
                    ${lote.peso || "0"} LB
                </td>

                <td>
                    ${listaManifiestos || "—"}
                </td>

            `;


            tablaReportes.appendChild(
                fila
            );

        }
    );


    cantidadRegistros.textContent =
        `${lotes.length} ${
            lotes.length === 1
                ? "lote"
                : "lotes"
        }`;

}

// ========================================
// REPORTE RESUMEN
// ========================================

function mostrarReporteResumen() {

    const tituloTabla =
        document.querySelector(
            ".table-header h2"
        );

    if (tituloTabla) {

        tituloTabla.textContent =
            "Detalle de guías procesadas";

    }


    const encabezado =
        document.querySelector("thead tr");

    encabezado.innerHTML = `

        <th>#</th>
        <th>Fecha / Hora</th>
        <th>Guía</th>
        <th>TRK</th>
        <th>Casillero</th>
        <th>Nombre</th>
        <th>MIA</th>
        <th>BOG</th>
        <th>LIQ</th>
        <th>Servicio</th>
        <th>Manifiesto</th>
        <th>Usuario</th>

    `;


    const guias =
        obtenerGuias();


    mostrarTabla(
        guias
    );


    actualizarResumen();

}

// ========================================
// INICIALIZAR REPORTES
// ========================================

function cargarReportes() {

    const guias =
        obtenerGuias();


    actualizarResumen();

    mostrarTabla(
        guias
    );

    mostrarUsuarioActivo();

    configurarBuscador();

    cargarFiltros();

}


// ========================================
// EJECUTAR
// ========================================

btnReporteResumen.addEventListener(
    "click",
    () => {

        activarReporte(
            btnReporteResumen
        );

        mostrarReporteResumen();

    }
);

btnReporteLotes.addEventListener(
    "click",
    () => {

        activarReporte(
            btnReporteLotes
        );

        mostrarReporteLotes();

    }
);

cargarReportes();