const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");

let ventanaPrincipal;
let ventanaTV = null;

let basculaPort = null;

function createWindow() {
    ventanaPrincipal = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    ventanaPrincipal.loadFile(
        path.join(__dirname, "Frontend", "pages", "login.html")
    );

    // Permitir que el Dashboard solicite abrir la TV
    ventanaPrincipal.webContents.setWindowOpenHandler(({ url }) => {

        if (url === "diloscan://tv") {
            abrirVentanaTV();

            return {
                action: "deny"
            };
        }

        return {
            action: "deny"
        };
    });
}

// ===============================
// CONEXIÓN CON BÁSCULA
// ===============================

ipcMain.handle("bascula:conectar", async () => {

    // Si ya está conectada
    if (basculaPort && basculaPort.isOpen) {
        return {
            ok: true,
            mensaje: "La báscula ya está conectada."
        };
    }

    try {

        basculaPort = new SerialPort({
            path: "COM3",
            baudRate: 9600,
            dataBits: 8,
            parity: "none",
            stopBits: 1,
            autoOpen: false
        });

        basculaPort.on("open", () => {

            console.log("Báscula conectada en COM3");

            if (ventanaPrincipal && !ventanaPrincipal.isDestroyed()) {
                ventanaPrincipal.webContents.send(
                    "bascula:estado",
                    "conectada"
                );
            }

        });

        let bufferBascula = "";

        basculaPort.on("data", (data) => {

            bufferBascula += data.toString();

            console.log(
                "Fragmento recibido:",
                JSON.stringify(data.toString())
            );

            console.log(
                "Buffer báscula:",
                JSON.stringify(bufferBascula)
            );

            // Buscar un dato completo como =55.200
            const coincidencia = bufferBascula.match(/=[0-9]+\.[0-9]+/);

            if (coincidencia) {

                const datoCompleto = coincidencia[0];

                console.log(
                    "Dato completo de báscula:",
                    datoCompleto
                );

                if (
                    ventanaPrincipal &&
                    !ventanaPrincipal.isDestroyed()
                ) {
                    ventanaPrincipal.webContents.send(
                        "bascula:dato",
                        datoCompleto
                    );
                }

                // Limpiar el dato que ya fue procesado
                bufferBascula =
                    bufferBascula.substring(
                        bufferBascula.indexOf(datoCompleto) +
                        datoCompleto.length
                    );
            }

            // Seguridad para evitar que el buffer crezca demasiado
            if (bufferBascula.length > 100) {
                bufferBascula = "";
            }
        });

        basculaPort.on("error", (error) => {

            console.error("Error de báscula:", error.message);

            if (ventanaPrincipal && !ventanaPrincipal.isDestroyed()) {
                ventanaPrincipal.webContents.send(
                    "bascula:estado",
                    "error"
                );
            }

        });

        basculaPort.on("close", () => {

            console.log("Báscula desconectada");

            if (ventanaPrincipal && !ventanaPrincipal.isDestroyed()) {
                ventanaPrincipal.webContents.send(
                    "bascula:estado",
                    "desconectada"
                );
            }

        });

        await new Promise((resolve, reject) => {

            basculaPort.open((error) => {

                if (error) {
                    reject(error);
                } else {
                    resolve();
                }

            });

        });

        return {
            ok: true,
            mensaje: "Báscula conectada correctamente."
        };

    } catch (error) {

        console.error(
            "No se pudo conectar la báscula:",
            error.message
        );

        basculaPort = null;

        return {
            ok: false,
            mensaje: error.message
        };
    }
});


// ===============================
// DESCONECTAR BÁSCULA
// ===============================

ipcMain.handle("bascula:desconectar", async () => {

    if (!basculaPort) {
        return {
            ok: true,
            mensaje: "La báscula no estaba conectada."
        };
    }

    try {

        if (basculaPort.isOpen) {
            await new Promise((resolve) => {
                basculaPort.close(() => {
                    resolve();
                });
            });
        }

        basculaPort = null;

        return {
            ok: true,
            mensaje: "Báscula desconectada."
        };

    } catch (error) {

        console.error(
            "Error desconectando báscula:",
            error.message
        );

        return {
            ok: false,
            mensaje: error.message
        };
    }
});


// ===============================
// SIMULACIÓN DE BÁSCULA
// ===============================

ipcMain.handle("bascula:simular", async (_event, dato) => {

    console.log("Dato simulado:", dato);

    if (ventanaPrincipal && !ventanaPrincipal.isDestroyed()) {

        ventanaPrincipal.webContents.send(
            "bascula:dato",
            dato
        );
    }

    return {
        ok: true
    };
});

function abrirVentanaTV() {

    // Si la TV ya está abierta, simplemente la mostramos
    if (ventanaTV && !ventanaTV.isDestroyed()) {
        ventanaTV.show();
        ventanaTV.focus();
        return;
    }

    const displays = screen.getAllDisplays();

    // Buscar un monitor diferente al principal
    const displayTV = displays.find(
        display => display.id !== screen.getPrimaryDisplay().id
    );

    // Si no hay segundo monitor, usar el principal
    const display = displayTV || screen.getPrimaryDisplay();

    const { x, y, width, height } = display.bounds;

    ventanaTV = new BrowserWindow({
        x,
        y,
        width,
        height,
        frame: false,
        fullscreen: false,
        backgroundColor: "#ffffff",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    

    ventanaTV.loadFile(
        path.join(__dirname, "Frontend", "pages", "tv.html")
    );

    ventanaTV.on("closed", () => {
        ventanaTV = null;
    });

    
}

app.whenReady().then(() => {

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});