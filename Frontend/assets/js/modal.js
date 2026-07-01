document.body.insertAdjacentHTML("beforeend",`

<div id="diloModalOverlay" class="dilo-overlay">

    <div class="dilo-modal">

        <div id="diloIcono" class="dilo-icono">

        </div>

        <h2 id="diloTitulo">

        </h2>

        <p id="diloMensaje">

        </p>

        <div id="diloBotones">

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

    // ===== Metodos internos =====

    mostrar(tipo,tituloTexto,mensajeTexto){

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

        // Limpiar botones anteriores
        botones.innerHTML = "";

        // Crear botón aceptar
        const btnAceptar = document.createElement("button");

        btnAceptar.textContent = "Aceptar";

        botones.appendChild(btnAceptar);

        // Cerrar al hacer clic
        btnAceptar.addEventListener("click",()=>{

            this.cerrar();

        });


    },

    cerrar(){

       overlay.style.display = "none";

    }
    }



};

console.log("Modal.js cargado");
console.log(DiloUI);