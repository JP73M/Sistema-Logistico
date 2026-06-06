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

const totalGuias = document.querySelector("#totalGuias");

const pesoTotal = document.querySelector("#pesoTotal");



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


const btnAgregar = document.querySelector("#btnAgregar");

const comentarioInput = document.querySelector("#comentarioInput");


btnAgregar.addEventListener("click",()=>{


    let guia = inputGuia.value;

    let peso = inputPeso.value;

    let comentario = comentarioInput.value;

        let existe = false;


    tbody.querySelectorAll("tr:not(.empty-row)").forEach(fila=>{


        let guiaTabla = fila.children[1].textContent;


        if(guiaTabla === guia){


            existe = true;


        }


    });



    if(existe){


        alert("Esta guía ya fue agregada al lote");


        inputGuia.value="";

        inputGuia.focus();


        return;


    }

    inputGuia.focus();



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

        <td>${peso} LB</td>

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

        actualizarCards();


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

        actualizarCards();


    }


});

function actualizarCards(){


    let filas = tbody.querySelectorAll("tr:not(.empty-row)");


    let cantidad = filas.length;


    let peso = 0;



    filas.forEach(fila=>{


        let valorPeso = fila.children[4].textContent;


        peso += parseFloat(valorPeso);


    });



    totalGuias.textContent = cantidad;


    pesoTotal.textContent = peso;


}
