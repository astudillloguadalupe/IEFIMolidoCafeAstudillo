// Carga de datos del catálogo desde JSON.
// Se mantiene una caché en memoria para no repetir la petición en la misma página.
let cacheDatos = null;

export async function cargarDatosCatalogo() {
    if (cacheDatos) return cacheDatos;

    try {
        const url = new URL('./productos.json', import.meta.url);
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`No se pudieron cargar los productos (${respuesta.status})`);
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos.productos) || !Array.isArray(datos.secciones)) {
            throw new Error('El archivo JSON no tiene la estructura esperada.');
        }

        cacheDatos = datos;
        return cacheDatos;
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        throw error;
    }
}

export async function obtenerProductos() {
    const { productos } = await cargarDatosCatalogo();
    return productos;
}
