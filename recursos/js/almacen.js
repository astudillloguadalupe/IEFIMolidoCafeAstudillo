// Estado del carrito. Se guarda en localStorage para sobrevivir entre páginas.
import { obtenerProductos } from './datos/productos.js';

const CLAVE = 'molido-carrito';
const CLAVE_PEDIDO = 'molido-ultimo-pedido';

function leer() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
    } catch (error) {
        console.error('No se pudo leer el carrito:', error);
        return [];
    }
}

function guardar(items) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(items));
        document.dispatchEvent(new CustomEvent('carrito:cambio'));
    } catch (error) {
        console.error('No se pudo guardar el carrito:', error);
    }
}

export function agregarAlCarrito(id) {
    const items = leer();
    const item = items.find((i) => i.id === id);
    if (item) item.cantidad += 1;
    else items.push({ id, cantidad: 1 });
    guardar(items);
}

export function cambiarCantidad(id, delta) {
    const items = leer();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.cantidad += delta;
    guardar(items.filter((i) => i.cantidad > 0));
}

export function eliminarDelCarrito(id) {
    guardar(leer().filter((i) => i.id !== id));
}

export function vaciarCarrito() {
    guardar([]);
}

export async function obtenerItemsDetallados() {
    const productos = await obtenerProductos();
    return leer()
        .map(({ id, cantidad }) => {
            const producto = productos.find((p) => p.id === id);
            return producto ? { producto, cantidad, subtotal: producto.precio * cantidad } : null;
        })
        .filter(Boolean);
}

export function contarUnidades() {
    return leer().reduce((suma, i) => suma + i.cantidad, 0);
}

export async function calcularSubtotal() {
    const items = await obtenerItemsDetallados();
    return items.reduce((suma, i) => suma + i.subtotal, 0);
}

export function guardarPedido(pedido) {
    try {
        localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
    } catch (error) {
        console.error('No se pudo guardar el pedido:', error);
    }
}

export function leerPedido() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_PEDIDO));
    } catch (error) {
        console.error('No se pudo leer el pedido:', error);
        return null;
    }
}
