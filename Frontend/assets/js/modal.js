/* =====================================================
   DiloUI - Modal v1.0
   ===================================================== */

document.body.insertAdjacentHTML("beforeend", `

<div id="diloModalOverlay" class="dilo-overlay">

    <div class="dilo-modal">

        <div id="diloIcono" class="dilo-icono"></div>

        <h2 id="diloTitulo"></h2>

        <p id="diloMensaje"></p>

        <div
            id="diloBotones"
            class="dilo-botones">
        </div>

    </div>

</div>

`);


/* =====================================================
   Referencias DOM
   ===================================================== */

const overlay = document.querySelector("#diloModalOverlay");
const icono = document.querySelector("#diloIcono");
const titulo = document.querySelector("#diloTitulo");
const mensaje = document.querySelector("#diloMensaje");
const botones = document.querySelector("#diloBotones");


/* =====================================================
   Tipos de modal
   ===================================================== */

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


/* =====================================================
   Funciones privadas
   ===================================================== */

function cargarIcono(tipo){

    const actual = tiposModal[tipo];

    icono.innerHTML = `
        <img src="../assets/img/icons/modal/${actual.icono}">
    `;

    icono.style.background = actual.fondo;

}


function crearBotones(tipo){

    if(tipo === "confirm"){

        botones.innerHTML = `

            <button
                id="btnCancelarModal"
                class="btn-secundario">

                Cancelar

            </button>

            <button
                id="btnAceptarModal"
                class="btn-principal">

                Nuevo lote

            </button>

        `;

    }else{

        botones.innerHTML = `

            <button
                id="btnAceptarModal"
                class="btn-principal">

                Aceptar

            </button>

        `;

    }

}


function conectarEventos(callback){

    const btnAceptar =
    document.querySelector("#btnAceptarModal");

    const btnCancelar =
    document.querySelector("#btnCancelarModal");


    if(btnCancelar){

        btnCancelar.onclick = ()=>{

            DiloUI.modal.cerrar();

        };

    }


    if(btnAceptar){

        btnAceptar.onclick = ()=>{

            if(typeof callback === "function"){

                callback();

            }

            DiloUI.modal.cerrar();

        };

    }

}


/* =====================================================
   DiloUI
   ===================================================== */

const DiloUI = {

    modal:{

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


        confirm(titulo,mensaje,callback){

            this.mostrar(
                "confirm",
                titulo,
                mensaje,
                callback
            );

        },


        mostrar(
            tipo,
            tituloTexto,
            mensajeTexto,
            callback = null
        ){

            overlay.style.display = "flex";

            titulo.textContent = tituloTexto;

            mensaje.textContent = mensajeTexto;

            cargarIcono(tipo);

            crearBotones(tipo);

            conectarEventos(callback);

        },


        cerrar(){

            overlay.style.display = "none";

        }

    }

};

console.log("✅ DiloUI Modal v1.0 cargado");