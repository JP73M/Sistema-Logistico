// ========================================
// ELEMENTOS
// ========================================

const listaUsuarios =
    document.querySelector("#listaUsuarios");

const contadorUsuarios =
    document.querySelector("#contadorUsuarios");

const btnNuevoUsuario =
    document.querySelector("#btnNuevoUsuario");

const modalUsuario =
    document.querySelector("#modalUsuario");

const btnCerrarModalUsuario =
    document.querySelector("#btnCerrarModalUsuario");

const btnCancelarUsuario =
    document.querySelector("#btnCancelarUsuario");

const btnGuardarUsuario =
    document.querySelector("#btnGuardarUsuario");

const nombreUsuario =
    document.querySelector("#nombreUsuario");

const usuarioUsuario =
    document.querySelector("#usuarioUsuario");

const passwordUsuario =
    document.querySelector("#passwordUsuario");


// ========================================
// OBTENER USUARIOS
// ========================================

function obtenerUsuarios(){

    return JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

}


// ========================================
// GUARDAR USUARIOS
// ========================================

function guardarUsuarios(usuarios){

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

}


// ========================================
// MOSTRAR USUARIOS
// ========================================

function mostrarUsuarios(){

    const usuarios =
        obtenerUsuarios();

    listaUsuarios.innerHTML = "";


    if(usuarios.length === 0){

        listaUsuarios.innerHTML = `
            <tr class="usuarios-vacio">
                <td colspan="3">
                    No hay usuarios registrados
                </td>
            </tr>
        `;

    }else{

        usuarios.forEach((usuario, index) => {

            const fila =
                document.createElement("tr");

            fila.innerHTML = `

                <td>
                    ${usuario.nombre}
                </td>

                <td>
                    ${usuario.usuario}
                </td>

                <td>

                    <button
                        class="btn-eliminar-usuario"
                        data-index="${index}"
                        title="Eliminar usuario">

                        🗑️

                    </button>

                </td>

            `;

            listaUsuarios.appendChild(fila);

        });

    }


    contadorUsuarios.textContent =
        usuarios.length === 1
            ? "1 usuario"
            : `${usuarios.length} usuarios`;

}


// ========================================
// ABRIR MODAL
// ========================================

function abrirModal(){

    nombreUsuario.value = "";
    usuarioUsuario.value = "";
    passwordUsuario.value = "";

    modalUsuario.classList.add("activo");

    nombreUsuario.focus();

}


// ========================================
// CERRAR MODAL
// ========================================

function cerrarModal(){

    modalUsuario.classList.remove("activo");

}


// ========================================
// NUEVO USUARIO
// ========================================

btnNuevoUsuario.addEventListener(
    "click",
    abrirModal
);

btnCerrarModalUsuario.addEventListener(
    "click",
    cerrarModal
);

btnCancelarUsuario.addEventListener(
    "click",
    cerrarModal
);


// ========================================
// CREAR USUARIO
// ========================================

btnGuardarUsuario.addEventListener(
    "click",
    () => {

        const nombre =
            nombreUsuario.value.trim();

        const usuario =
            usuarioUsuario.value.trim();

        const password =
            passwordUsuario.value.trim();


        if(
            nombre === "" ||
            usuario === "" ||
            password === ""
        ){

            alert(
                "Complete todos los campos."
            );

            return;

        }


        const usuarios =
            obtenerUsuarios();


        const existe =
            usuarios.some(
                item =>
                    item.usuario.toLowerCase() ===
                    usuario.toLowerCase()
            );


        if(existe){

            alert(
                "Ese usuario ya existe."
            );

            return;

        }


        usuarios.push({

            nombre: nombre,

            usuario: usuario,

            password: password

        });


        guardarUsuarios(usuarios);

        mostrarUsuarios();

        cerrarModal();

    }
);


// ========================================
// ELIMINAR USUARIO
// ========================================

listaUsuarios.addEventListener(
    "click",
    (e) => {

        const boton =
            e.target.closest(
                ".btn-eliminar-usuario"
            );


        if(!boton){
            return;
        }


        const index =
            Number(
                boton.dataset.index
            );


        const usuarios =
            obtenerUsuarios();


        const usuario =
            usuarios[index];


        const confirmar =
            confirm(
                `¿Desea eliminar al usuario "${usuario.nombre}"?`
            );


        if(!confirmar){
            return;
        }


        usuarios.splice(
            index,
            1
        );


        guardarUsuarios(usuarios);

        mostrarUsuarios();

    }
);


// ========================================
// CERRAR SESIÓN
// ========================================

const btnCerrarSesion =
    document.querySelector(
        "#btnCerrarSesion"
    );


if(btnCerrarSesion){

    btnCerrarSesion.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            localStorage.removeItem(
                "usuarioActivo"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// INICIO
// ========================================

mostrarUsuarios();