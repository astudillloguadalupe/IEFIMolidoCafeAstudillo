// Vista: catálogo. Carga los datos desde JSON, renderiza, filtra, busca y ordena.
import { cargarDatosCatalogo } from '../datos/productos.js';
import { crearElemento, normalizar } from '../utilidades.js';
import { crearTarjeta } from './tarjeta.js';

const ordenadores = {
    relevancia: () => 0,
    precio_asc: (a, b) => a.precio - b.precio,
    precio_desc: (a, b) => b.precio - a.precio,
    nombre_asc: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
    nombre_desc: (a, b) => b.nombre.localeCompare(a.nombre, 'es'),
};

function leerFiltros(form) {
    const datos = new FormData(form);
    const categorias = new Set(datos.getAll('categoria'));
    const catSelect = datos.get('categoria_busqueda');
    if (catSelect) categorias.add(catSelect);

    return {
        texto: normalizar(datos.get('buscar') ?? '').trim(),
        categorias,
        origenes: new Set(datos.getAll('origen')),
        precioMax: Number(datos.get('precio')),
        orden: datos.get('orden') ?? 'relevancia',
    };
}

function filtrarProductos(productos, filtros) {
    return productos
        .filter((p) => !filtros.texto || normalizar(p.nombre + ' ' + p.detalle).includes(filtros.texto))
        .filter((p) => filtros.categorias.size === 0 || filtros.categorias.has(p.categoria))
        .filter((p) => filtros.origenes.size === 0 || filtros.origenes.has(p.origen))
        .filter((p) => p.precio <= filtros.precioMax)
        .sort(ordenadores[filtros.orden]);
}

function renderizar(contenedor, lista, secciones) {
    contenedor.replaceChildren();

    if (lista.length === 0) {
        contenedor.append(crearElemento('p', 'catalogo__vacio', 'No encontramos productos con esos filtros.'));
        return;
    }

    for (const { id, titulo } of secciones) {
        const deLaSeccion = lista.filter((p) => p.seccion === id);
        if (deLaSeccion.length === 0) continue;

        const seccion = crearElemento('section', 'seccion categoria');
        const grilla = crearElemento('div', 'grilla');
        grilla.append(...deLaSeccion.map(crearTarjeta));
        seccion.append(crearElemento('h2', 'seccion__titulo', titulo), grilla);
        contenedor.append(seccion);
    }
}

export async function iniciarCatalogo() {
    const form = document.querySelector('.buscador__form');
    const contenedor = document.querySelector('#catalogo');
    const salidaPrecio = document.querySelector('#precio-valor');

    if (!form || !contenedor) return;

    contenedor.replaceChildren(crearElemento('p', 'catalogo__vacio', 'Cargando productos...'));

    try {
        const { productos, secciones } = await cargarDatosCatalogo();

        const actualizar = () => {
            const filtros = leerFiltros(form);
            if (salidaPrecio) {
                salidaPrecio.textContent = 'Hasta $' + filtros.precioMax.toLocaleString('es-AR');
            }
            renderizar(contenedor, filtrarProductos(productos, filtros), secciones);
        };

        form.addEventListener('input', actualizar);
        form.addEventListener('submit', (e) => e.preventDefault());
        form.addEventListener('reset', () => setTimeout(actualizar));

        actualizar();
    } catch {
        contenedor.replaceChildren(
            crearElemento('p', 'catalogo__vacio', 'No pudimos cargar el catálogo. Intentá nuevamente más tarde.')
        );
    }
}
