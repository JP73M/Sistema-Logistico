const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("diloBascula", {

    conectar: () => {
        return ipcRenderer.invoke("bascula:conectar");
    },

    desconectar: () => {
        return ipcRenderer.invoke("bascula:desconectar");
    },

    simular: (dato) => {
        return ipcRenderer.invoke("bascula:simular", dato);
    },

    onDato: (callback) => {

        const listener = (_event, dato) => {
            callback(dato);
        };

        ipcRenderer.on("bascula:dato", listener);

        return () => {
            ipcRenderer.removeListener("bascula:dato", listener);
        };
    },

    onEstado: (callback) => {

        const listener = (_event, estado) => {
            callback(estado);
        };

        ipcRenderer.on("bascula:estado", listener);

        return () => {
            ipcRenderer.removeListener("bascula:estado", listener);
        };
    }

});