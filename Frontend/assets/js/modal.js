document.body.insertAdjacentHTML("beforeend",`

<div id="diloModalOverlay" class="dilo-overlay">

    <div class="dilo-modal">

        <div id="diloIcono" class="dilo-icono">

        </div>

        <h2 id="diloTitulo">

        </h2>

        <p id="diloMensaje">

        </p>

        <div
            id="diloBotones"
            class="dilo-botones">

        </div>

    </div>

</div>

`);

const overlay =
document.querySelector("#diloModalOverlay");

const icono =
document.querySelector("#diloIcono");

const titulo =
document.querySelector("#diloTitulo");

const mensaje =
document.querySelector("#diloMensaje");

const botones =
document.querySelector("#diloBotones");

const tiposModal = {

    success:{

        icono:"success.svg",

        fondo:"#DCFCE7"

    },

    error:{

        icono:"error.svg",

        fondo:"#FEE2E2"

    },

    warning:{

        icono:"warning.svg",

        fondo:"#FEF3C7"

    },

    info:{

        icono:"info.svg",

        fondo:"#DBEAFE"

    },

    confirm:{
        icono:"info.svg",
        fondo:"#DBEAFE"
    }

};

const DiloUI = {

    modal:{
            // ===== Metodos publicos =====

    success(titulo,mensaje){

        this.mostrar(
            "success",
            titulo,
            mensaje
        );

    },



    error(titulo,mensaje){

        this.mostrar(
            "error",
            titulo,
            mensaje
        );

    },



    warning(titulo,mensaje){

        this.mostrar(
            "warning",
            titulo,
            mensaje
        );

    },



    info(titulo,mensaje){

        this.mostrar(
            "info",
            titulo,
            mensaje
        );

    },

    confirm(titulo, mensaje, callback){

    this.mostrar(

        "confirm",

        titulo,

        mensaje,

        callback

    );

},

    // ===== Metodos internos =====

    mostrar(tipo,tituloTexto,mensajeTexto, callback = null){

        // Mostrar el modal
        overlay.style.display = "flex";

        // Asignar título y mensaje
        titulo.textContent = tituloTexto;

        mensaje.textContent = mensajeTexto;

        const actual = tiposModal[tipo];

        icono.innerHTML = `
            <img src="../assets/img/icons/modal/${actual.icono}">
        `;

        icono.style.background = actual.fondo;

        // Limpiar botones
        botones.innerHTML = "";

        if(tipo === "confirm"){

            botones.innerHTML = `

                <button id="btnCancelarModal" class="btn-secundario">

                    Cancelar

                </button>

                <button id="btnAceptarModal" class="btn-principal">

                    Nuevo lote

                </button>

            `;

        }else{

            botones.innerHTML = `

                <button id="btnAceptarModal" class="btn-principal">

                    Aceptar

                </button>

            `;

        }


    },

    cerrar(){

       overlay.style.display = "none";

    }
    }



};

console.log("Modal.js cargado");
console.log(DiloUI);