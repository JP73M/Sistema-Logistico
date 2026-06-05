function logout(){
    
    window.location.href="../pages/login.html";
}

const tbody = document.querySelector("#guideBody");

const counter = document.querySelector("#counter");

const baseGuias = [

    {
        guia:"7003001965",
        casillero:"C205",
        nombre:"Carlos Pérez",
        servicio:"Express",
        manifiesto:"M001"
    },

    {
        guia:"7003001966",
        casillero:"C300",
        nombre:"Juan Melo",
        servicio:"Normal",
        manifiesto:"M001"
    }

];



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

// ===========================
// PESO EN TIEMPO REAL
// ===========================

const inputPeso = document.querySelector("#inputPeso");

const pesoActual = document.querySelector("#pesoActual");


inputPeso.addEventListener("input", ()=>{


    if(inputPeso.value === ""){

        pesoActual.textContent = "0";

    }else{

        pesoActual.textContent = inputPeso.value;

    }


});

const inputGuia = document.querySelector("#inputGuia");


const infoCasillero = document.querySelector("#infoCasillero");

const infoNombre = document.querySelector("#infoNombre");

const infoServicio = document.querySelector("#infoServicio");

const infoManifiesto = document.querySelector("#infoManifiesto");



inputGuia.addEventListener("input", ()=>{


    let guiaBuscada = inputGuia.value;


    let resultado = baseGuias.find(

        item => item.guia === guiaBuscada

    );



    if(resultado){


        infoCasillero.textContent = resultado.casillero;

        infoNombre.textContent = resultado.nombre;

        infoServicio.textContent = resultado.servicio;

        infoManifiesto.textContent = resultado.manifiesto;


    }else{


        infoCasillero.textContent = "---";

        infoNombre.textContent = "---";

        infoServicio.textContent = "---";

        infoManifiesto.textContent = "---";


    }


});

// ===========================
// AGREGAR GUIA A TABLA
// ===========================


const btnAgregar = document.querySelector("#btnAgregar");

const comentarioInput = document.querySelector("#comentarioInput");


btnAgregar.addEventListener("click",()=>{


    let guia = inputGuia.value;

    let peso = inputPeso.value;

    let comentario = comentarioInput.value;



    let datos = baseGuias.find(

        item => item.guia === guia

    );



    if(!datos){

        alert("Guía no encontrada");

        return;

    }



    if(peso === ""){

        alert("Ingrese un peso");

        return;

    }




    const fila = document.createElement("tr");



    fila.innerHTML = `

        <td></td>

        <td>${datos.guia}</td>

        <td>${datos.casillero}</td>

        <td>${datos.nombre}</td>

        <td>${peso} KG</td>

        <td>${datos.servicio}</td>

        <td>${comentario}</td>

        <td>

            <button class="delete-btn">

                 <img src="../assets/img/icons/transh.png" alt="Eliminar">

            </button>

        </td>

    `;



    tbody.appendChild(fila);



    limpiarCampos();


    actualizarTabla();


});

function limpiarCampos(){


    inputGuia.value="";

    inputPeso.value="";

    comentarioInput.value="";


    pesoActual.textContent="0";


    infoCasillero.textContent="---";

    infoNombre.textContent="---";

    infoServicio.textContent="---";

    infoManifiesto.textContent="---";


}


tbody.addEventListener("click", (e)=>{


    const botonEliminar = e.target.closest(".delete-btn");


    if(botonEliminar){


        const fila = botonEliminar.closest("tr");


        fila.remove();


        actualizarTabla();


    }


});