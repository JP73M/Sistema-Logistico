function logout(){
    
    window.location.href="../pages/login.html";
}

const tbody = document.querySelector("#guideBody");

const counter = document.querySelector("#counter");

let baseGuias = [];

let baseGuiasControl = [];

let baseCasilleros = [];

const totalGuias = document.querySelector("#totalGuias");

const totalManifiestos =
document.querySelector("#totalManifiestos");

const pesoTotal = document.querySelector("#pesoTotal");

const toast =
document.querySelector("#toast");

const nombreArchivoManifiesto =
document.querySelector("#nombreArchivoManifiesto");

const listaManifiestos =
document.querySelector("#listaManifiestos");


const nombreArchivoCasilleros =
document.querySelector("#nombreArchivoCasilleros");




function actualizarTabla(){


    let filas = tbody.querySelectorAll("tr:not(.empty-row)").length;


    counter.textContent = `Mostrando ${filas} registros`;


    const emptyRow = document.querySelector(".empty-row");


    if(filas === 0){

        emptyRow.style.display = "";

    }else{

        emptyRow.style.display = "none";

    }


}


actualizarTabla();

actualizarCards();

function mostrarMensaje(texto){


    toast.textContent = texto;


    toast.classList.add("show");


    setTimeout(()=>{


        toast.classList.remove("show");


    },2500);


}

function obtenerManifiesto(index){


    const input = document.querySelector(
        `.numeroManifiesto[data-index="${index}"]`
    );


    if(input){

        return input.value;

    }


    return "---";


}

function validarManifiestos(){


    const manifiestos =
    document.querySelectorAll(".numeroManifiesto");


    let completos = true;


    manifiestos.forEach(input => {


        if(input.value.trim() === ""){


            completos = false;


            input.style.border =
            "2px solid red";


        }else{


            input.style.border =
            "1px solid #d1d5db";


        }


    });


    return completos;


}

const inputPeso = document.querySelector("#inputPeso");

const canalTV = new BroadcastChannel("diloscan-tv");

function enviarUltimasGuiasTV() {

    const filas =
        tbody.querySelectorAll("tr:not(.empty-row)");

    const ultimasGuias = [];

    filas.forEach((fila, index) => {

        if (index >= 3) {
            return;
        }

        ultimasGuias.push({

            numero: index + 1,

            guia:
                fila.children[1].textContent,

            trk:
                fila.children[2].textContent,

            casillero:
                fila.children[3].textContent,

            nombre:
                fila.children[4].textContent,

            pesoMIA:
                fila.children[5].textContent,

            pesoBOG:
                fila.children[6].textContent,

            pesoLIQ:
                fila.children[7].textContent,

            servicio:
                fila.children[8].textContent,

            manifiesto:
                fila.children[9].textContent

        });

    });


    canalTV.postMessage({

        tipo: "lista",

        guias: ultimasGuias

    });

}

const pesoActual = document.querySelector("#pesoActual");


inputPeso.addEventListener("input", ()=>{

    if(inputPeso.value === ""){

        pesoActual.textContent = "0";

        canalTV.postMessage({
            tipo: "peso",
            peso: "0"
        });

    }else{

        pesoActual.textContent = inputPeso.value;

        canalTV.postMessage({
            tipo: "peso",
            peso: inputPeso.value
        });

    }

});

const inputGuia = document.querySelector("#inputGuia");

inputPeso.addEventListener("keydown", (e) => {
    

    if (e.key === "Enter") {

        e.preventDefault();

        inputGuia.focus();

    }

});


const infoCasillero = document.querySelector("#infoCasillero");

const infoGuia = document.querySelector("#infoGuia");

const infoNombre = document.querySelector("#infoNombre");

const infoServicio = document.querySelector("#infoServicio");

const infoManifiesto = document.querySelector("#infoManifiesto");

const inputManifiesto = document.querySelector("#inputManifiesto");




inputGuia.addEventListener("input", ()=>{

    canalTV.postMessage({
        tipo: "guia",
        guia: inputGuia.value
    });

    const guiaBuscada = inputGuia.value.trim();


    let resultado = baseGuias.find(
        item => item.guia === guiaBuscada
    );

    let origen = "Misiil";

    if (!resultado) {

        resultado = baseGuiasControl.find(
            item => item.guia === guiaBuscada
        );

        origen = "ControlBox";

    }



    if(resultado){

        let nombreCliente = "No encontrado";
        let numeroManifiesto = "---";

        infoGuia.textContent = resultado.guia || "---";

        // =========================
        // MISIIL
        // =========================

        if(origen === "Misiil"){

            let casillero = String(resultado.casillero || "").trim();

            if (casillero === "") {

                // Si Misiil no tiene casillero,
                // usar Usuario como nombre
                nombreCliente =
                    resultado.usuario || "No encontrado";

            } else {

                let cliente = baseCasilleros.find(item =>

                    item.casillero.replace("DILO","DL") ===
                    casillero.replace("DILO","DL")

                );

                if(cliente){

                    nombreCliente = cliente.nombre;

                }
            }

            infoCasillero.textContent =
                resultado.casillero || "---";

            numeroManifiesto =
                obtenerManifiesto(resultado.archivoIndex);

        }

        // =========================
        // CONTROLBOX
        // =========================

        else if(origen === "ControlBox"){

            infoCasillero.textContent = "---";

            nombreCliente =
                resultado.nombreRemitente || "No encontrado";

            const inputManifiestoControl =
                document.querySelector(
                    `.numeroManifiestoControl[data-index="${resultado.archivoIndex}"]`
                );

            if(inputManifiestoControl){

                numeroManifiesto =
                    inputManifiestoControl.value.trim();

            }

        }

        // =========================
        // MOSTRAR INFORMACIÓN
        // =========================

        infoNombre.textContent =
            nombreCliente;

        infoServicio.textContent =
            resultado.servicio || "---";

        infoManifiesto.textContent =
            numeroManifiesto;


        // =========================
        // ENVIAR INFORMACIÓN AL TV
        // =========================
        canalTV.postMessage({
            tipo: "informacion",
            guia: resultado.guia || "---",
            casillero: resultado.casillero || "---",
            nombre: nombreCliente || "---",
            servicio: resultado.servicio || "---",
            manifiesto: numeroManifiesto || "---"
        });

    }


});


const btnAgregar = document.querySelector("#btnAgregar");

const btnCerrarLote =
document.querySelector("#btnCerrarLote");

const comentarioInput = document.querySelector("#comentarioInput");


btnAgregar.addEventListener("click",()=>{


    let guia = inputGuia.value;

    let peso = inputPeso.value;

    let comentario = comentarioInput.value;
    

    let existe = false;
 
    if(!validarManifiestos()){


    DiloUI.modal.error(

        "Manifiestos incompletos",

        "Debe ingresar el número de todos los manifiestos antes de continuar."

    );

return;


}

    tbody.querySelectorAll("tr:not(.empty-row)").forEach(fila=>{


        let guiaTabla = fila.children[1].textContent;


        if(guiaTabla === guia){


            existe = true;


        }


    });



    if(existe){


        DiloUI.modal.warning(

            "Guía duplicada",

            "La guía ya fue agregada al lote."

        );


        inputGuia.value="";

        inputGuia.focus();


        return;


    }

    inputGuia.focus();

    if(!validarManifiestos()){


    DiloUI.modal.error(

        "Manifiestos incompletos",

        "Debe ingresar el número de todos los manifiestos antes de continuar."

    );

    return;


}

    let datos = baseGuias.find(
        item => item.guia === guia
    );

    let origen = "Misiil";

    if (!datos) {

        datos = baseGuiasControl.find(
            item => item.guia === guia
        );

        origen = "ControlBox";

    }

    if (!datos) {

        DiloUI.modal.error(
            "Guía no encontrada",
            "La guía no se encuentra en el manifiesto Misiil ni en ControlBox."
        );

        return;
    }



    if(peso === ""){

        DiloUI.modal.error(

            "Peso requerido",

            "Debe ingresar el peso antes de continuar."

        );

        return; 

    }




    if (origen === "Misiil") {

        let casillero = String(datos.casillero || "").trim();

        if (casillero === "") {

            // Si no tiene casillero,
            // usar Usuario como nombre
            nombreCliente =
                datos.usuario || "No encontrado";

        } else {

            let cliente = baseCasilleros.find(item =>
                item.casillero.replace("DILO","DL") ===
                casillero.replace("DILO","DL")
            );

            nombreCliente = cliente
                ? cliente.nombre
                : "No encontrado";
        }

    } else {

        nombreCliente =
            datos.nombreRemitente || "No encontrado";

    }

    let numeroManifiesto = "---";

    if (origen === "Misiil") {

        numeroManifiesto =
            obtenerManifiesto(datos.archivoIndex);

    } else if (origen === "ControlBox") {

        const inputManifiestoControl =
            document.querySelector(
                `.numeroManifiestoControl[data-index="${datos.archivoIndex}"]`
            );

        if (inputManifiestoControl) {

            numeroManifiesto =
                inputManifiestoControl.value.trim();

        }

    }

        
    const fila = document.createElement("tr");

    // =========================
    // PESOS
    // =========================

    let pesoMIA = parseFloat(
        String(datos.pesoMIA || "").replace(",", ".")
    );

    let pesoBOG = parseFloat(
        String(peso || "").replace(",", ".")
    );

    let pesoLIQ = 0;

    // Si no existe peso MIA, usamos solamente BOG
    if (isNaN(pesoMIA)) {
        pesoMIA = 0;
    }

    // Si no existe peso BOG, usamos solamente MIA
    if (isNaN(pesoBOG)) {
        pesoBOG = 0;
    }

    // =========================
    // CALCULAR PESO LIQ
    // =========================

    const usuarioGuia =
        String(datos.usuario || "").trim().toLowerCase();

    if (usuarioGuia.includes("willy")) {

        // Willy Envíos:
        // Peso LIQ = Peso BOG
        pesoLIQ = pesoBOG;

    } else {

        // Demás usuarios:
        // Peso LIQ = mayor entre MIA y BOG
        pesoLIQ = Math.ceil(
            Math.max(pesoMIA, pesoBOG)
        );
    }


    // =========================
    // CREAR FILA
    // =========================

    fila.innerHTML = `
        <td></td>

        <td>${datos.guia}</td>

        <td>${datos.trk || "---"}</td>

        <td>${datos.casillero || "---"}</td>

        <td>${nombreCliente}</td>

        <td>${pesoMIA > 0 ? pesoMIA + " LB" : "---"}</td>

        <td>${pesoBOG > 0 ? pesoBOG + " LB" : "---"}</td>

        <td>${pesoLIQ > 0 ? pesoLIQ + " LB" : "---"}</td>

        <td>${datos.servicio || "---"}</td>

        <td>${numeroManifiesto}</td>

        <td>${comentario}</td>

        <td>
            <div class="action-buttons">

                <button class="edit-btn" title="Editar">
                    <img src="../assets/img/icons/edit.png" alt="Editar">
                </button>

                <button class="delete-btn" title="Eliminar">
                    <img src="../assets/img/icons/transh.png" alt="Eliminar">
                </button>

            </div>
        </td>
    `;



        tbody.prepend(fila);

        // =========================
        // ENVIAR PESO BOG AL TV
        // =========================

        canalTV.postMessage({
            tipo: "peso",
            peso: pesoBOG
        });
        limpiarCampos();


        actualizarTabla();

        actualizarCards();

        enviarUltimasGuiasTV();


});



function limpiarCampos(){


    inputGuia.value="";

    inputPeso.value="";

    comentarioInput.value="";

    inputPeso.focus();

    pesoActual.textContent="0";

}

function limpiarLote(){

    tbody.querySelectorAll("tr:not(.empty-row)")
    .forEach(fila=>{

        fila.remove();

    });

    actualizarTabla();

    actualizarCards();

}

const editPanel = document.querySelector("#editPanel");

const btnCerrarEdit =
    document.querySelector("#btnCerrarEdit");

const btnGuardarEdit =
    document.querySelector("#btnGuardarEdit");

const editGuia =
    document.querySelector("#editGuia");

const editTrk =
    document.querySelector("#editTrk");

const editCasillero =
    document.querySelector("#editCasillero");

const editNombre =
    document.querySelector("#editNombre");

const editPesoMIA =
    document.querySelector("#editPesoMIA");

const editPesoBOG =
    document.querySelector("#editPesoBOG");

const editPesoLIQ =
    document.querySelector("#editPesoLIQ");

const editServicio =
    document.querySelector("#editServicio");

const editManifiesto =
    document.querySelector("#editManifiesto");

const editComentario =
    document.querySelector("#editComentario");

let filaEditando = null;

tbody.addEventListener("click", (e) => {

    // =========================
    // EDITAR
    // =========================

    const botonEditar =
        e.target.closest(".edit-btn");

    if (botonEditar) {

        filaEditando =
            botonEditar.closest("tr");

        editGuia.value =
            filaEditando.children[1].textContent;

        editTrk.value =
            filaEditando.children[2].textContent;

        editCasillero.value =
            filaEditando.children[3].textContent === "---"
            ? ""
            : filaEditando.children[3].textContent;

        editNombre.value =
            filaEditando.children[4].textContent;

        editPesoMIA.value =
            filaEditando.children[5].textContent
            .replace("LB", "")
            .trim();

        editPesoBOG.value =
            filaEditando.children[6].textContent
            .replace("LB", "")
            .trim();

        editPesoLIQ.value =
            filaEditando.children[7].textContent
            .replace("LB", "")
            .trim();

        editServicio.value =
            filaEditando.children[8].textContent;

        editManifiesto.value =
            filaEditando.children[9].textContent;

        editComentario.value =
            filaEditando.children[10].textContent;

        editPanel.classList.add("active");

        editGuia.focus();

        return;
    }


    // =========================
    // ELIMINAR
    // =========================

    const botonEliminar =
        e.target.closest(".delete-btn");

    if (botonEliminar) {

        const fila =
            botonEliminar.closest("tr");

        fila.remove();

        actualizarTabla();
        actualizarCards();

    }

});

btnCerrarEdit.addEventListener("click", () => {

    editPanel.classList.remove("active");

    filaEditando = null;

});

document.addEventListener("keydown", (e) => {

    if (
        e.key === "Escape" &&
        editPanel.classList.contains("active")
    ) {

        editPanel.classList.remove("active");

        filaEditando = null;

    }

});

btnGuardarEdit.addEventListener("click", () => {

    if (!filaEditando) {
        return;
    }

    calcularPesoLIQEditado();


    filaEditando.children[1].textContent =
        editGuia.value.trim();

    filaEditando.children[2].textContent =
        editTrk.value.trim() || "---";

    filaEditando.children[3].textContent =
        editCasillero.value.trim() || "---";

    filaEditando.children[4].textContent =
        editNombre.value.trim() || "No encontrado";

    filaEditando.children[5].textContent =
        editPesoMIA.value.trim()
        ? `${editPesoMIA.value.trim()} LB`
        : "---";

    filaEditando.children[6].textContent =
        editPesoBOG.value.trim()
        ? `${editPesoBOG.value.trim()} LB`
        : "---";

    filaEditando.children[7].textContent =
        editPesoLIQ.value.trim()
        ? `${editPesoLIQ.value.trim()} LB`
        : "---";

    filaEditando.children[8].textContent =
        editServicio.value.trim() || "---";

    filaEditando.children[9].textContent =
        editManifiesto.value.trim() || "---";

    filaEditando.children[10].textContent =
        editComentario.value.trim();


    actualizarTabla();
    actualizarCards();

    editPanel.classList.remove("active");

    filaEditando = null;

});

function actualizarCards(){


    let filas = tbody.querySelectorAll("tr:not(.empty-row)");


    let cantidad = filas.length;


    let peso = 0;



    filas.forEach(fila=>{


        let valorPeso = fila.children[7].textContent;


        peso += parseFloat(valorPeso);


    });



    totalGuias.textContent = cantidad;


    pesoTotal.textContent = peso;


}

// ===============================
// MANIFIESTO MISIIL
// ===============================

const excelManifiestoMisiil =
document.querySelector("#excelManifiestoMisiil");

const nombreArchivoManifiestoMisiil =
document.querySelector("#nombreArchivoManifiestoMisiil");

const listaManifiestosMisiil =
document.querySelector("#listaManifiestosMisiil");


excelManifiestoMisiil.addEventListener("change",(e)=>{

    const archivos =
    Array.from(e.target.files);

    baseGuias = [];

    listaManifiestosMisiil.innerHTML = "";

    nombreArchivoManifiestoMisiil.textContent =
    `${archivos.length} archivos cargados`;


    archivos.forEach((archivo,index)=>{

        const div =
        document.createElement("div");

        div.classList.add("item-manifiesto");

        div.innerHTML = `

            <div class="archivo-info">

                <img
                    src="../assets/img/icons/exceal.png"
                >

                <span>${archivo.name}</span>

            </div>

            <div>

                <small>Manifiesto Misiil</small>

                <input
                    class="numeroManifiesto"
                    data-index="${index}"
                    placeholder="00000"
                >

            </div>

        `;

        listaManifiestosMisiil.appendChild(div);


        const reader =
        new FileReader();


        reader.onload = function(event){

            const data =
            new Uint8Array(
                event.target.result
            );


            const workbook =
            XLSX.read(data,{
                type:"array"
            });


            const hoja =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];


            const datosExcel =
            XLSX.utils.sheet_to_json(hoja);


            datosExcel.forEach(item=>{

                baseGuias.push({
                    guia:
                        String(item.Guia || "").trim(),

                    trk:
                        String(
                            item["Numero De Rastreo"] || ""
                        ).trim(),

                    casillero:
                        String(
                            item.Casillero || ""
                        ).trim(),

                    servicio:
                        String(
                            item.Servicio || ""
                        ).trim(),

                    pesoMIA:
                        String(
                            item.Peso || ""
                        ).trim(),

                    usuario:
                        String(
                            item.Usuario || ""
                        ).trim(),

                    archivoIndex:index,

                    origen:"Misiil"
                });

            });


            console.log(
                "BASE MISIIL:",
                baseGuias
            );

        };


        reader.readAsArrayBuffer(archivo);

    });

});

// ===============================
// MANIFIESTO CONTROLBOX
// ===============================

const excelManifiestoControl =
document.querySelector("#excelManifiestoControl");

const nombreArchivoManifiestoControl =
document.querySelector("#nombreArchivoManifiestoControl");

const listaManifiestosControl =
document.querySelector("#listaManifiestosControl");


excelManifiestoControl.addEventListener("change",(e)=>{

    const archivos =
    Array.from(e.target.files);

    baseGuiasControl = [];

    listaManifiestosControl.innerHTML = "";

    nombreArchivoManifiestoControl.textContent =
    `${archivos.length} archivos cargados`;


    archivos.forEach((archivo,index)=>{

        const div =
        document.createElement("div");

        div.classList.add("item-manifiesto");

        div.innerHTML = `

            <div class="archivo-info">

                <img
                    src="../assets/img/icons/exceal.png"
                >

                <span>${archivo.name}</span>

            </div>

            <div>

                <small>Manifiesto ControlBox</small>

                <input
                    class="numeroManifiestoControl"
                    data-index="${index}"
                    placeholder="00000"
                >

            </div>

        `;

        listaManifiestosControl.appendChild(div);


        const reader =
        new FileReader();


        reader.onload = function(event){

            const data =
            new Uint8Array(
                event.target.result
            );


            const workbook =
            XLSX.read(data,{
                type:"array"
            });


            const hoja =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];


            const datosExcel =
            XLSX.utils.sheet_to_json(hoja);


            datosExcel.forEach(item=>{

                baseGuiasControl.push({
                    guia:
                        String(item["Guia#"] || "").trim(),

                    trk:
                        String(
                            item["TRACKING"] || ""
                        ).trim(),

                    nombreRemitente:
                        String(
                            item["Nombre del Remitente"] || ""
                        ).trim(),

                    servicio:
                        String(
                            item["Servicio"] || ""
                        ).trim(),

                    pesoMIA:
                        String(
                            item.Peso || ""
                        ).trim(),

                    archivoIndex:index,

                    origen:"ControlBox"
                });

            });


            console.log(
                "BASE CONTROLBOX:",
                baseGuiasControl
            );

        };


        reader.readAsArrayBuffer(archivo);

    });

});

const excelCasilleros = document.querySelector("#excelCasilleros");


excelCasilleros.addEventListener("change",(e)=>{


    const archivo = e.target.files[0];

    nombreArchivoCasilleros.textContent =
    archivo.name;



    const reader = new FileReader();



    reader.onload = function(event){


        const data = new Uint8Array(event.target.result);


        const workbook = XLSX.read(data,{
            type:"array"
        });



        const hoja = workbook.Sheets[
            workbook.SheetNames[0]
        ];



        const datosExcel = XLSX.utils.sheet_to_json(hoja);



        console.log(datosExcel[0]);



        baseCasilleros = datosExcel.map(item => {


            return {


                casillero:item["No. Casillero"],


                nombre:item["Nombre de casillero"],


                email:item.Email,


                telefono:item.Telefono


            }


        });



        console.log(baseCasilleros);



    };



    reader.readAsArrayBuffer(archivo);

    let procesandoScan = false;

    inputGuia.addEventListener("keydown", (e) => {

        if (e.key !== "Enter") {
            return;
        }

        e.preventDefault();

        if (procesandoScan) {
            return;
        }

        const guia = inputGuia.value.trim();

        if (guia === "") {
            return;
        }

        procesandoScan = true;

        btnAgregar.click();

        setTimeout(() => {
            procesandoScan = false;
        }, 300);

    });
    
    
    


});

function obtenerDatosLote(){

    let filas =
        tbody.querySelectorAll("tr:not(.empty-row)");

    let guias = [];

    filas.forEach(fila => {

        guias.push({

            Guia:
                fila.children[1].textContent,

            TRK:
                fila.children[2].textContent,

            Casillero:
                fila.children[3].textContent,

            Cliente:
                fila.children[4].textContent,

            PesoMIA:
                fila.children[5].textContent,

            PesoBOG:
                fila.children[6].textContent,

            PesoLIQ:
                fila.children[7].textContent,

            Servicio:
                fila.children[8].textContent,

            Manifiesto:
                fila.children[9].textContent,

            Comentario:
                fila.children[10].textContent

        });

    });

    return guias;

}

function exportarExcel(guias){


    const hoja =
    XLSX.utils.json_to_sheet(guias);


    const libro =
    XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "DiloScan"
    );


    let fecha =
    new Date()
    .toLocaleDateString("es-CO")
    .replaceAll("/","-");


    let manifiestos = [
        ...new Set(
            guias.map(g=>g.Manifiesto)
        )
    ];


    let nombreArchivo =
    `DiloScan_${fecha}_${manifiestos.join("-")}.xlsx`;



    XLSX.writeFile(
        libro,
        nombreArchivo
    );


}

function validarCantidadGuiasManifiestos(guias) {

    const esperadas = {};
    const escaneadas = {};

    // =========================
    // CONTAR GUÍAS MISIIL
    // =========================

    baseGuias.forEach(item => {

        if (!item.guia) return;

        const inputManifiesto =
            document.querySelector(
                `.numeroManifiesto[data-index="${item.archivoIndex}"]`
            );

        if (!inputManifiesto) return;

        const manifiesto =
            inputManifiesto.value.trim();

        if (!manifiesto) return;

        if (!esperadas[manifiesto]) {
            esperadas[manifiesto] = 0;
        }

        esperadas[manifiesto]++;
    });


    // =========================
    // CONTAR GUÍAS CONTROLBOX
    // =========================

    baseGuiasControl.forEach(item => {

        if (!item.guia) return;

        const inputManifiesto =
            document.querySelector(
                `.numeroManifiestoControl[data-index="${item.archivoIndex}"]`
            );

        if (!inputManifiesto) return;

        const manifiesto =
            inputManifiesto.value.trim();

        if (!manifiesto) return;

        if (!esperadas[manifiesto]) {
            esperadas[manifiesto] = 0;
        }

        esperadas[manifiesto]++;
    });


    // =========================
    // CONTAR GUÍAS ESCANEADAS
    // =========================

    guias.forEach(guia => {

        const manifiesto =
            String(guia.Manifiesto || "").trim();

        if (!manifiesto) return;

        if (!escaneadas[manifiesto]) {
            escaneadas[manifiesto] = 0;
        }

        escaneadas[manifiesto]++;
    });


    // =========================
    // COMPARAR
    // =========================

    const diferencias = [];

    Object.keys(esperadas).forEach(manifiesto => {

        const cantidadEsperada =
            esperadas[manifiesto];

        const cantidadEscaneada =
            escaneadas[manifiesto] || 0;

        if (cantidadEsperada !== cantidadEscaneada) {

            diferencias.push({
                manifiesto: manifiesto,
                esperadas: cantidadEsperada,
                escaneadas: cantidadEscaneada
            });

        }

    });


    // =========================
    // VERIFICAR MANIFIESTOS
    // QUE NO TENGAN GUÍAS ESPERADAS
    // =========================

    Object.keys(escaneadas).forEach(manifiesto => {

        if (!esperadas[manifiesto]) {

            diferencias.push({
                manifiesto: manifiesto,
                esperadas: 0,
                escaneadas: escaneadas[manifiesto]
            });

        }

    });


    return diferencias;
}

btnCerrarLote.addEventListener("click",()=>{


    let guias =
    obtenerDatosLote();



    if(guias.length === 0){


        DiloUI.modal.warning(

            "Lote vacío",

            "No existen guías para cerrar el lote."

        );


        return;


    }

    // =========================
    // VALIDAR CANTIDAD DE GUÍAS
    // =========================

    const diferencias =
        validarCantidadGuiasManifiestos(guias);

    if (diferencias.length > 0) {

        const totalEsperadas =
            diferencias.reduce(
                (total, diferencia) =>
                    total + diferencia.esperadas,
                0
            );

        const totalEscaneadas =
            diferencias.reduce(
                (total, diferencia) =>
                    total + diferencia.escaneadas,
                0
            );

        const faltantes =
            totalEsperadas - totalEscaneadas;

        const mensaje =
            `Se encontraron ${totalEsperadas} guías en los manifiestos, ` +
            `pero solo has escaneado ${totalEscaneadas} guías. ` +
            `Faltan ${faltantes} guías para poder finalizar el lote.`;

        DiloUI.modal.error(
            "Lote incompleto",
            mensaje
        );

        return;
    }


    let lote = {


        fecha:
        new Date().toLocaleString(),


        cantidad:
        guias.length,


        peso:
        pesoTotal.textContent,


        guias:
        guias


    };

    let lotesGuardados =
    JSON.parse(
        localStorage.getItem("lotes")
    ) || [];


    lotesGuardados.push(lote);


    localStorage.setItem(

        "lotes",

        JSON.stringify(lotesGuardados)

    );



    exportarExcel(guias);

        DiloUI.modal.confirm(

        "Nuevo lote",

        "¿Desea iniciar un nuevo lote?"

    );

    DiloUI.modal.confirm(

        "Nuevo lote",

        "¿Desea iniciar un nuevo lote?",

        ()=>{

            limpiarLote();

        }

    );




});

const btnManual = document.querySelector("#btnManual");

const btnTV = document.querySelector("#btnTV");

btnTV.addEventListener("click", () => {
    window.open("diloscan://tv");
});

function calcularPesoLIQEditado() {

    const pesoMIA =
        parseFloat(
            String(editPesoMIA.value || "")
            .replace(",", ".")
        ) || 0;

    const pesoBOG =
        parseFloat(
            String(editPesoBOG.value || "")
            .replace(",", ".")
        ) || 0;

    const usuario =
        String(editNombre.value || "")
        .trim()
        .toLowerCase();

    if (usuario.includes("willy")) {

        editPesoLIQ.value = pesoBOG;

    } else {

        editPesoLIQ.value =
            Math.ceil(
                Math.max(pesoMIA, pesoBOG)
            );
    }
}

// AQUÍ VA EL BLOQUE QUE PREGUNTASTE

editPesoMIA.addEventListener(
    "input",
    calcularPesoLIQEditado
);

editPesoBOG.addEventListener(
    "input",
    calcularPesoLIQEditado
);

editNombre.addEventListener(
    "input",
    calcularPesoLIQEditado
);



const manualPanel = document.querySelector("#manualPanel");

const btnCerrarManual =
document.querySelector("#btnCerrarManual");

btnManual.addEventListener("click",()=>{

    manualPanel.classList.add("active");

    manualGuia.focus();

});

btnCerrarManual.addEventListener("click",()=>{

    manualPanel.classList.remove("active");

});

const manualGuia = document.querySelector("#manualGuia");

document.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

        manualPanel.classList.remove("active");

    }

});

document.addEventListener("keydown", (e) => {

    if(e.key === "Escape" && manualPanel.classList.contains("active")){

        manualPanel.classList.remove("active");

    }

});

document.body.style.overflow = "hidden";

document.body.style.overflow = "";





