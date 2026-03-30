// Mentimos a los rastreadores diciendo que ya tienen nuestra respuesta
window.__tcfapi = (cmd, version, callback) => {
    if (cmd === 'getTCData') {
        callback({ gdprApplies: true, purpose: { consents: {} } }, true);
    }
};
window.doNotSell = true;
Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, writable: false });

// Diccionario con la lista negra de avisos y sus botones
const CMP_DICTIONARY = [
    { contenedor: '#didomi-host, #didomi-popup, .didomi-popup-container', rechazar: '#didomi-notice-disagree-button, .didomi-components-button--color-secondary' },
    { contenedor: '#contentpass-banner, .contentpass-container', rechazar: null },
    { contenedor: '#onetrust-consent-sdk, #onetrust-banner-sdk', rechazar: '#onetrust-reject-all-handler, .ot-pc-refuse-all-handler' },
    { contenedor: '#CybotCookiebotDialog', rechazar: '#CybotCookiebotDialogBodyButtonDecline' },
    { contenedor: '#sp_message_container, [id^="sp_message_container"]', rechazar: 'button[title*="Reject"], button[title*="Rechazar"], .reject-all' },
    { contenedor: '#truste-consent-track, .truste_overlay', rechazar: '.truste_box_inner a:last-child, #truste-show-consent' },
    { contenedor: '.cky-consent-container, #cookie-law-info-bar', rechazar: '.cky-btn-reject, #cookie_action_close_header_reject' },
    { contenedor: '#iubenda-cs-banner', rechazar: '.iubenda-cs-reject-btn, #iubenda-cs-close-btn' },
    { contenedor: '#axeptio_overlay', rechazar: '.axeptio_btn--decline, #axeptio__decline' },
    { contenedor: '.cmplz-cookiebanner', rechazar: '.cmplz-deny' },
    { contenedor: '#BorlabsCookieBox', rechazar: '.borlabs-cookie-btn-decline, ._brlbs-refuse-btn' },
    { contenedor: '[data-testid="uc-container"]', rechazar: '[data-testid="uc-deny-all"]' },
    { contenedor: '.qc-cmp2-container', rechazar: '.qc-cmp2-summary-buttons button:first-child' },
    { contenedor: '.klaro .cookie-modal, .klaro .cookie-notice', rechazar: '.klaro .cm-btn-decline, .klaro .cn-decline' },
    { contenedor: '#cookie-notice', rechazar: '#cn-refuse-cookie' },
    { contenedor: '.fc-ab-root', rechazar: '.fc-cta-do-not-consent, .fc-secondary-button' },
    { contenedor: '.wrapper-sub, .tp-modal, .tp-backdrop', rechazar: null }
];

// Buscamos los contenedores conocidos y pulsamos rechazar o los borramos
function intentarRechazar() {
    CMP_DICTIONARY.forEach(({ contenedor, rechazar }) => {
        const elementoContenedor = document.querySelector(contenedor);
        if (!elementoContenedor) return;
        
        if (rechazar) {
            const boton = document.querySelector(rechazar);
            if (boton) { boton.click(); return; }
        }
        elementoContenedor.remove();
        incrementarContador();
    });
}

// Limpieza a lo bruto para los carteles que se resisten
function limpiarResto() {
    // Liberamos la barra de desplazamiento por si la han bloqueado
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.setProperty('overflow', 'auto', 'important');

    // Revisamos las capas flotantes fijas
    document.querySelectorAll('div, section, iframe').forEach(capa => {
        const estilos = window.getComputedStyle(capa);
        
        if ((estilos.position === 'fixed' || estilos.position === 'absolute') && parseInt(estilos.zIndex) > 99) {
            const rastros = (capa.id + ' ' + capa.className).toLowerCase();
            
            // Escudo por si falla al intentar leer el texto de un anuncio externo
            let texto = '';
            try { 
                texto = (capa.innerText || '').toLowerCase(); 
            } catch(e) {}

            // Ignoramos cosas útiles de la página para no romperla
            if (rastros.includes('whatsapp') || rastros.includes('chat') ||
                rastros.includes('cart') || rastros.includes('menu') ||
                rastros.includes('nav') || rastros.includes('header')) return;

            // Detectamos si es un aviso de cookies por su código interno
            const esGalleta = rastros.includes('cookie') || rastros.includes('consent') ||
                rastros.includes('gdpr') || rastros.includes('privacy') ||
                rastros.includes('aviso') || rastros.includes('privacidad');
            
            // Detectamos si es un chantaje o un muro de pago oculto
            const esChantaje = texto.includes('acepta cookies para navegar') || 
                               texto.includes('sin coste adicional') || 
                               texto.includes('contentpass') ||
                               texto.includes('atresplayer');

            // Cazamos marcos gigantes que tapan toda la pantalla
            const esIframeGigante = capa.tagName === 'IFRAME' && capa.offsetWidth > window.innerWidth * 0.8;

            // Fulminamos la capa si es culpable
            if (esGalleta || esChantaje || esIframeGigante) {
                capa.remove();
                incrementarContador();
            }
        }
    });
}

// Función principal que arranca la limpieza
function iniciar() {
    // Apagamos el script si estás en tu servidor para no estorbar
    const sitio = window.location.hostname;
    if (sitio.includes('mmirandamartinez.com') || sitio.includes('localhost')) return;

    // Primer disparo de limpieza
    intentarRechazar();
    limpiarResto();

    // Vigilamos en silencio si la página carga carteles nuevos
    const observer = new MutationObserver(() => {
        intentarRechazar();
        limpiarResto();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Bucle de repaso continuo
    setInterval(() => {
        intentarRechazar();
        limpiarResto();
    }, 1500);
}
// Función para incrementar el contador de carteles eliminados

function incrementarContador() {
    chrome.storage.local.get(['contador'], (datos) => {
        const nuevo = (datos.contador || 0) + 1;
        chrome.storage.local.set({ contador: nuevo });
    });
}

// Miramos la memoria antes de arrancar la bestia
chrome.storage.local.get(['activado'], (datos) => {
    // Si no lo has apagado a mano, dale caña
    if (datos.activado !== false) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', iniciar);
        } else {
            iniciar();
        }
    }
});