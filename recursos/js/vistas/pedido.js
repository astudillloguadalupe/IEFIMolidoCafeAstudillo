// Vista: datos de entrega y pago (paso 2 del proceso de compra).
import { guardarPedido, obtenerItemsDetallados, vaciarCarrito, calcularSubtotal } from '../almacen.js';
import { calcularTotales, crearElemento, formatearPrecio } from '../utilidades.js';
import { actualizarResumen } from './resumen.js';

function renderizarProductos(lista, items) {
    lista.replaceChildren(
        ...items.map(({ producto, cantidad, subtotal }) =>
            crearElemento('li', 'resumen__producto', `${cantidad} × ${producto.nombre} — ${formatearPrecio(subtotal)}`)
        )
    );
}

function validarDatos(datos) {
    const telefono = String(datos.telefono ?? '').replace(/\D/g, '');
    if (String(datos.nombre ?? '').trim().length < 3) return 'Ingresá tu nombre y apellido.';
    if (telefono.length < 8) return 'Ingresá un teléfono válido.';
    if (String(datos.direccion ?? '').trim().length < 5) return 'Ingresá una dirección válida.';
    if (!datos.pago) return 'Seleccioná un medio de pago.';
    return '';
}

export async function iniciarPedido() {
    let items;
    try {
        items = await obtenerItemsDetallados();
    } catch {
        const aviso = document.querySelector('#estado-pedido');
        if (aviso) {
            aviso.textContent = 'No se pudieron cargar los datos del pedido. Intentá nuevamente.';
            aviso.hidden = false;
        }
        return;
    }

    if (items.length === 0) {
        window.location.replace('./carrito.html');
        return;
    }

    renderizarProductos(document.querySelector('#resumen-productos'), items);
    await actualizarResumen();

    const form = document.querySelector('#form-pedido');
    const estado = document.querySelector('#estado-pedido');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const datos = Object.fromEntries(new FormData(form));
        const error = validarDatos(datos);
        if (error) {
            if (estado) {
                estado.textContent = error;
                estado.hidden = false;
            }
            return;
        }

        const totales = calcularTotales(await calcularSubtotal());
        const pedido = {
            numero: 'MC-' + Date.now().toString().slice(-6),
            cliente: datos,
            items: items.map(({ producto, cantidad, subtotal }) => ({
                nombre: producto.nombre,
                cantidad,
                subtotal,
            })),
            ...totales,
        };

        guardarPedido(pedido);
        vaciarCarrito();
        window.location.href = './confirmacion.html';
    });
}
