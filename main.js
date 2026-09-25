const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let ventanaPrincipal;
let ventanaTV = null;

function createWindow() {
    ventanaPrincipal = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
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
            contextIsolation: true
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