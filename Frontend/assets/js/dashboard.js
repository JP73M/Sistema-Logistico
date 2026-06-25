function logout(){
    
    window.location.href="../pages/login.html";
}

const tbody = document.querySelector("#guideBody");

const counter = document.querySelector("#counter");

let baseGuias = [];

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

const inputManifiesto = document.querySelector("#inputManifiesto");




inputGuia.addEventListener("input", ()=>{


    let guiaBuscada = inputGuia.value;


    let resultado = baseGuias.find(

        item => item.guia === guiaBuscada

    );



    if(resultado){


        let cliente = baseCasilleros.find(item =>

            item.casillero.replace("DILO","DL")
            ===
            resultado.casillero.replace("DILO","DL")

        );



        infoCasillero.textContent = resultado.casillero;


        if(cliente){

            infoNombre.textContent = cliente.nombre;

        }else{

            infoNombre.textContent = "No encontrado";

        }



        infoServicio.textContent = resultado.servicio;

        infoManifiesto.textContent =
        obtenerManifiesto(resultado.archivoIndex);


    }else{


        infoCasillero.textContent = "---";

        infoNombre.textContent = "---";

        infoServicio.textContent = "---";

        infoManifiesto.textContent = "---";


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


    alert("Complete todos los manifiestos");


    return;


}

    tbody.querySelectorAll("tr:not(.empty-row)").forEach(fila=>{


        let guiaTabla = fila.children[1].textContent;


        if(guiaTabla === guia){


            existe = true;


        }


    });



    if(existe){


        mostrarMensaje("Esta guía ya fue agregada al lote");


        inputGuia.value="";

        inputGuia.focus();


        return;


    }

    inputGuia.focus();

    if(!validarManifiestos()){


    alert("Complete todos los manifiestos");


    inputGuia.focus();


    return;


}

    let datos = baseGuias.find(

        item => item.guia === guia

    );



    if(!datos){

        return;

    }



    if(peso === ""){

        mostrarMensaje("Ingrese un peso");

        return; 

    }




        let cliente = baseCasilleros.find(item =>

            item.casillero.replace("DILO","DL")
            ===
            datos.casillero.replace("DILO","DL")

        );


        let nombreCliente = cliente ? cliente.nombre : "No encontrado";

        let numeroManifiesto =
        obtenerManifiesto(datos.archivoIndex);


        
        const fila = document.createElement("tr");


        fila.innerHTML = `

        <td></td>

        <td>${datos.guia}</td>

        <td>${datos.casillero}</td>

        <td>${nombreCliente}</td>

        <td>${peso} LB</td>

        <td>${datos.servicio}</td>

        <td>${numeroManifiesto}</td>

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

    inputPeso.focus();

    pesoActual.textContent="0";

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

const excelManifiesto = document.querySelector("#excelManifiesto");


excelManifiesto.addEventListener("change",(e)=>{


    const archivos = Array.from(e.target.files);

    totalManifiestos.textContent =
    archivos.length;


    baseGuias = [];


    listaManifiestos.innerHTML = "";


    nombreArchivoManifiesto.textContent =
    `${archivos.length} archivos cargados`;



    archivos.forEach((archivo,index)=>{


       const div = document.createElement("div");


        div.classList.add("item-manifiesto");


        div.innerHTML = `


            <div class="archivo-info">

                <img src="../assets/img/icons/exceal.png">

                <span>${archivo.name}</span>

            </div>

            <div>
            
                <small>Manifiesto</small>
            
                <input
                class="numeroManifiesto"
                data-index="${index}"
                placeholder="00000">

            </div>
            

        `;


        listaManifiestos.appendChild(div);



        const reader = new FileReader();



        reader.onload = function(event){


            const data =
            new Uint8Array(event.target.result);



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


                    guia:item.Guia,


                    casillero:item.Casillero,


                    servicio:item.Servicio,


                    archivoIndex:index


                });


            });



            console.log(baseGuias);


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

    inputGuia.addEventListener("keydown",(e)=>{

        if(e.key === "Enter"){

            e.preventDefault();

            if(procesandoScan){
                return;
            }

            procesandoScan = true

            setTimeout(()=>{

                if(inputGuia.value.trim() !== ""){
                    
                    btnAgregar.click();

                }

                procesandoScan = false;
            }, 200);
        }
    }
    
    
    );


});

function obtenerDatosLote(){


    let filas =
    tbody.querySelectorAll("tr:not(.empty-row)");


    let guias = [];


    filas.forEach(fila=>{


        guias.push({


            Guia:
            fila.children[1].textContent,


            Casillero:
            fila.children[2].textContent,


            Cliente:
            fila.children[3].textContent,


            Peso:
            fila.children[4].textContent,


            Servicio:
            fila.children[5].textContent,


            Manifiesto:
            fila.children[6].textContent,


            Comentario:
            fila.children[7].textContent


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

btnCerrarLote.addEventListener("click",()=>{


    let guias =
    obtenerDatosLote();



    if(guias.length === 0){


        mostrarMensaje(
            "No hay guías para cerrar"
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

    let nuevo =
    confirm(
        "Lote cerrado correctamente\n\n¿Desea iniciar un nuevo lote?"
    );


    if(nuevo){


        tbody.querySelectorAll("tr:not(.empty-row)")
        .forEach(fila=>{

            fila.remove();

        });


        actualizarTabla();

        actualizarCards();


}



    mostrarMensaje(
        "Lote cerrado correctamente"
    );



});