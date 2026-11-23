// Vista: confirmación del pedido (paso 3 del proceso de compra).
import { leerPedido } from '../almacen.js';
import { armarMensajePedido, crearElemento, formatearPrecio } from '../utilidades.js';
import { WHATSAPP_NEGOCIO } from '../config.js';

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
    whatsapp.href = `https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(armarMensajePedido(pedido))}`;
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
