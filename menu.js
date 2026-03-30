const boton = document.getElementById('boton');
const estado = document.getElementById('estado');
const contador = document.getElementById('contador');

chrome.storage.local.get(['activado', 'contador'], (datos) => {
    const activo = datos.activado !== false;
    contador.textContent = datos.contador || 0;
    actualizarUI(activo);
});

boton.addEventListener('click', () => {
    chrome.storage.local.get('activado', (datos) => {
        const nuevoEstado = datos.activado === false ? true : false;
        chrome.storage.local.set({ activado: nuevoEstado });
        actualizarUI(nuevoEstado);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { activado: nuevoEstado });
        });
    });
});

function actualizarUI(activo) {
    if (activo) {
        boton.textContent = 'Activo';
        boton.classList.remove('apagado');
        estado.textContent = 'Destruyendo en esta pestaña';
        estado.classList.add('activo');
    } else {
        boton.textContent = 'Pausado';
        boton.classList.add('apagado');
        estado.textContent = 'Extensión pausada';
        estado.classList.remove('activo');
    }
}