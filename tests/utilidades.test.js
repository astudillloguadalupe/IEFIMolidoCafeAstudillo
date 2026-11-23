import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularTotales, normalizar, formatearPrecio, armarMensajePedido } from '../recursos/js/utilidades.js';

test('calcularTotales suma el costo de envío cuando no se alcanza el mínimo', () => {
    assert.deepEqual(calcularTotales(20000), {
        subtotal: 20000,
        envio: 3000,
        total: 23000,
    });
});

test('calcularTotales no cobra envío desde $50.000', () => {
    assert.deepEqual(calcularTotales(50000), {
        subtotal: 50000,
        envio: 0,
        total: 50000,
    });
});

test('calcularTotales no cobra envío con el carrito vacío', () => {
    assert.equal(calcularTotales(0).total, 0);
});

test('normalizar elimina tildes y convierte el texto a minúsculas', () => {
    assert.equal(normalizar('Café MOLIDO'), 'cafe molido');
});

test('formatearPrecio agrega el signo $ y el punto de miles', () => {
    assert.equal(formatearPrecio(9500), '$9.500');
});

test('armarMensajePedido incluye número, cliente, productos y total', () => {
    const mensaje = armarMensajePedido({
        numero: 'MC-123456',
        cliente: { nombre: 'Lucía Pérez', telefono: '3511234567', direccion: 'Calle 123' },
        items: [{ nombre: 'Café Origen', cantidad: 2, subtotal: 19000 }],
        total: 22000,
    });
    assert.match(mensaje, /MC-123456/);
    assert.match(mensaje, /Lucía Pérez/);
    assert.match(mensaje, /2 x Café Origen/);
    assert.match(mensaje, /Total: \$22\.000/);
});
