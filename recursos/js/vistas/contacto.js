import { WHATSAPP_NEGOCIO } from '../config.js';

// Vista: contacto. Valida el formulario con HTML y JavaScript y muestra una notificación.
export function iniciarContacto() {
    const form = document.querySelector('.formulario');
    const estado = document.querySelector('#estado-formulario');
    if (!form || !estado) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const datos = new FormData(form);
        const nombre = String(datos.get('nombre') ?? '').trim();
        const telefono = String(datos.get('telefono') ?? '').replace(/\D/g, '');
        const mensaje = String(datos.get('mensaje') ?? '').trim();

        if (nombre.length < 3 || telefono.length < 8 || mensaje.length < 10) {
            estado.textContent = 'Revisá los datos: nombre, teléfono y mensaje deben estar completos.';
            estado.hidden = false;
            return;
        }

        const texto = [
            'Hola Molido Café, les escribo desde la web:',
            `Nombre: ${nombre}`,
            `Email: ${datos.get('email') ?? ''}`,
            `Teléfono: ${datos.get('telefono')}`,
            `Asunto: ${datos.get('asunto') ?? ''}`,
            `Mensaje: ${mensaje}`,
        ].join('\n');
        window.open(`https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');

        estado.textContent = `Gracias, ${nombre}. Abrimos WhatsApp para enviar tu consulta; si no se abrió, escribinos al +54 351 613 4420.`;
        estado.hidden = false;
        form.reset();
    });

    form.addEventListener('reset', () => {
        estado.hidden = true;
    });
}
