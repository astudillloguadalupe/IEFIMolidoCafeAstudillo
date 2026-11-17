import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularTotales, normalizar } from '../recursos/js/utilidades.js';

test('calcularTotales suma el costo de envío cuando no se alcanza el mínimo', () => {
    assert.deepEqual(calcularTotales(20000), {
        subtotal: 20000,
        envio: 3000,
        total: 23000,
    });
});

test('normalizar elimina tildes y convierte el texto a minúsculas', () => {
    assert.equal(normalizar('Café MOLIDO'), 'cafe molido');
});
