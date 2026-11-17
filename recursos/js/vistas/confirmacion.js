// Vista: confirmación del pedido (paso 3 del proceso de compra).
import { leerPedido } from '../almacen.js';
import { crearElemento, formatearPrecio } from '../utilidades.js';

const WHATSAPP_NEGOCIO = '543516134420';

function crearMensajeWhatsApp(pedido) {
    const detalle = pedido.items
        .map((i) => `- ${i.cantidad} x ${i.nombre} (${formatearPrecio(i.subtotal)})`)
        .join('\n');

    return [
        'Hola Molido Café, quiero confirmar mi pedido:',
        `Pedido: ${pedido.numero}`,
        `Cliente: ${pedido.cliente.nombre}`,
        `Teléfono: ${pedido.cliente.telefono}`,
        `Dirección: ${pedido.cliente.direccion}`,
        '',
        detalle,
        '',
        `Total: ${formatearPrecio(pedido.total)}`,
    ].join('\n');
}

export function iniciarConfirmacion() {
    const contenedor = document.querySelector('#confirmacion');
    const pedido = leerPedido();

    if (!pedido) {
        contenedor.replaceChildren(crearElemento('p', '', 'No hay ningún pedido reciente para mostrar.'));
        return;
    }

    const lista = crearElemento('ul', 'confirmacion__lista');
    lista.append(
        ...pedido.items.map((i) =>
            crearElemento('li', '', `${i.cantidad} × ${i.nombre} — ${formatearPrecio(i.subtotal)}`)
        )
    );

    const whatsapp = crearElemento('a', 'btn btn--primario', 'Enviar pedido por WhatsApp');
    whatsapp.href = `https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(crearMensajeWhatsApp(pedido))}`;
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener';

    contenedor.replaceChildren(
        crearElemento('h2', 'confirmacion__titulo', `¡Gracias, ${pedido.cliente.nombre}!`),
        crearElemento('p', '', `Tu pedido ${pedido.numero} fue registrado.`),
        lista,
        crearElemento('p', 'confirmacion__total', `Total: ${formatearPrecio(pedido.total)}`),
        crearElemento('p', '', 'Para completar el proceso, enviá el pedido por WhatsApp.'),
        whatsapp
    );
}
