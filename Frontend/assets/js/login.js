function login(){

    const inputUsuario =
        document.querySelector('input[type="text"]');

    const inputPassword =
        document.querySelector('input[type="password"]');

    const loginError =
        document.querySelector("#loginError");

    const usuario =
        inputUsuario.value.trim();

    const password =
        inputPassword.value.trim();


    if(usuario === "" || password === ""){

        loginError.textContent =
            "Ingrese usuario y contraseña.";

        inputUsuario.focus();

        return;
    }


    const usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    const usuarioEncontrado =
        usuarios.find(item =>
            item.usuario === usuario &&
            item.password === password
        );

    if(!usuarioEncontrado){

        loginError.textContent =
            "Usuario o contraseña incorrectos.";

        inputPassword.value = "";

        inputUsuario.focus();

        return;
    }

    localStorage.setItem(
        "usuarioActivo",
        JSON.stringify(usuarioEncontrado)
    );


    window.location.href =
        "../pages/dashboard.html";
}


// ========================================
// CREAR USUARIO INICIAL
// ========================================

const usuariosExistentes =
    JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];


if(usuariosExistentes.length === 0){

    const usuarioInicial = {

        nombre: "Juan Melo",

        usuario: "juan",

        password: "1234"

    };


    localStorage.setItem(
        "usuarios",
        JSON.stringify([
            usuarioInicial
        ])
    );

}