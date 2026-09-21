document.addEventListener("DOMContentLoaded", () => {

    const listaManifiestos =
        document.getElementById("listaManifiestos");

    // Obtener los lotes guardados
    const lotesGuardados =
        JSON.parse(localStorage.getItem("lotes")) || [];

    // Si no hay lotes
    if (lotesGuardados.length === 0) {

        listaManifiestos.innerHTML = `
            <div class="sin-manifiestos">
                No hay manifiestos cargados.
            </div>
        `;

        return;
    }

    // Agrupar manifiestos
    const manifiestos = {};

    lotesGuardados.forEach(lote => {

        if (!lote.guias) return;

        lote.guias.forEach(guia => {

            const numeroManifiesto = guia.Manifiesto;

            // Ignorar guías sin manifiesto
            if (
                !numeroManifiesto ||
                numeroManifiesto === "---"
            ) {
                return;
            }

            // Crear manifiesto
            if (!manifiestos[numeroManifiesto]) {

                manifiestos[numeroManifiesto] = {
                    numero: numeroManifiesto,
                    fecha: lote.fecha,
                    origen: "Misiil",
                    guias: {}
                };
            }

            // Evitar guías repetidas
            const numeroGuia = guia.Guia;

            if (!manifiestos[numeroManifiesto].guias[numeroGuia]) {

                manifiestos[numeroManifiesto].guias[numeroGuia] = guia;

            }

        });

    });

    const lista = Object.values(manifiestos);

    // Si no hay manifiestos
    if (lista.length === 0) {

        listaManifiestos.innerHTML = `
            <div class="sin-manifiestos">
                No hay manifiestos cargados.
            </div>
        `;

        return;
    }

    // Crear tarjetas
    lista.forEach(manifiesto => {

        const guias =
            Object.values(manifiesto.guias);

        // Calcular peso total
        let pesoTotal = 0;

        guias.forEach(guia => {

            const peso = parseFloat(
                String(guia.Peso)
                    .replace(",", ".")
                    .replace(/[^\d.-]/g, "")
            );

            if (!isNaN(peso)) {
                pesoTotal += peso;
            }

        });

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "manifiesto-card";

        tarjeta.innerHTML = `

            <div class="manifiesto-top">

                <div class="manifiesto-identidad">

                    <div class="manifiesto-icon">

                        <img
                            src="../assets/img/icons/Truck.png"
                            alt=""
                        >

                    </div>

                    <div class="manifiesto-numero">
                        ${manifiesto.numero}
                    </div>

                </div>

                <div class="manifiesto-flecha">
                    →
                </div>

            </div>

            <div class="manifiesto-info">

                <div class="manifiesto-dato">
                    Fecha:
                    <strong>${manifiesto.fecha}</strong>
                </div>

                <div class="manifiesto-dato">
                    Guías:
                    <strong>${guias.length}</strong>
                </div>

                <div class="manifiesto-dato">
                    Peso total:
                    <strong>${pesoTotal.toFixed(2)} kg</strong>
                </div>

                <span class="manifiesto-origen">
                    ${manifiesto.origen}
                </span>

            </div>
        `;

        listaManifiestos.appendChild(tarjeta);

        // Abrir detalle
        tarjeta.addEventListener("click", () => {

            mostrarDetalle(manifiesto);

        });

    });

});


function mostrarDetalle(manifiesto) {

    const listaManifiestos =
        document.getElementById("listaManifiestos");

    const guias =
        Object.values(manifiesto.guias);

    // Calcular peso total
    let pesoTotal = 0;

    guias.forEach(guia => {

        const peso = parseFloat(
            String(guia.Peso)
                .replace(",", ".")
                .replace(/[^\d.-]/g, "")
        );

        if (!isNaN(peso)) {
            pesoTotal += peso;
        }

    });


    // Mostrar detalle
    listaManifiestos.innerHTML = `

        <div class="detalle-manifiesto">

            <button
                id="btnVolverManifiestos"
                class="btn-volver-manifiestos">

                ← Volver a manifiestos

            </button>


            <div class="detalle-header">

                <h2>
                    Manifiesto ${manifiesto.numero}
                </h2>

                <p>
                    Fecha: ${manifiesto.fecha}
                </p>

                <p>
                    Origen: ${manifiesto.origen}
                </p>


                <div class="detalle-resumen">

                    <div>

                        <strong>
                            ${guias.length}
                        </strong>

                        <span>
                            Guías
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${pesoTotal.toFixed(2)} kg
                        </strong>

                        <span>
                            Peso total
                        </span>

                    </div>

                </div>


                <button
                    id="btnDescargarManifiesto"
                    class="btn-descargar-manifiesto">

                    Descargar Excel

                </button>

            </div>


            <div class="detalle-tabla">

                <table>

                    <thead>

                        <tr>

                            <th>Guía</th>
                            <th>TRK</th>
                            <th>Casillero</th>
                            <th>Cliente</th>
                            <th>Peso</th>
                            <th>Servicio</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${guias.map(guia => `

                            <tr>

                                <td>
                                    ${guia.Guia || "---"}
                                </td>

                                <td>
                                    ${guia.TRK || "---"}
                                </td>

                                <td>
                                    ${guia.Casillero || "---"}
                                </td>

                                <td>
                                    ${guia.Cliente || "---"}
                                </td>

                                <td>
                                    ${guia.Peso || "---"}
                                </td>

                                <td>
                                    ${guia.Servicio || "---"}
                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;


    // BOTÓN VOLVER

    document
        .getElementById("btnVolverManifiestos")
        .addEventListener("click", () => {

            location.reload();

        });


    // BOTÓN DESCARGAR EXCEL

    document
        .getElementById("btnDescargarManifiesto")
        .addEventListener("click", () => {

            const datosExcel = guias.map(guia => ({

                "Guía": guia.Guia || "---",
                "TRK": guia.TRK || "---",
                "Casillero": guia.Casillero || "---",
                "Cliente": guia.Cliente || "---",
                "Peso": guia.Peso || "---",
                "Servicio": guia.Servicio || "---",
                "Manifiesto": guia.Manifiesto || "---",
                "Comentario": guia.Comentario || "---"

            }));


            const hoja =
                XLSX.utils.json_to_sheet(datosExcel);


            const libro =
                XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
                libro,
                hoja,
                "Manifiesto"
            );


            XLSX.writeFile(
                libro,
                `Manifiesto_${manifiesto.numero}.xlsx`
            );

        });

}
