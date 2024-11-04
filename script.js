// Conectar con Supabase
const supabaseUrl = 'https://qtghsespngapcawhvbxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2hzZXNwbmdhcGNhd2h2YnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NjEzNDksImV4cCI6MjA0NjMzNzM0OX0.lCRLg75yLRHnzpS6dayg-ozkP2DF2lmKYLE07FSkadA';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Referencias a elementos del DOM
const homenajeForm = document.getElementById('create-homenaje-form');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const imagenInput = document.getElementById('imagen');
const homenajesList = document.getElementById('homenajes-list');

// Subir imagen a Supabase Storage
async function subirImagen(imagen) {
    const nombreArchivo = `${Date.now()}_${imagen.name}`;
    const { data, error } = await supabase.storage
        .from('imagenes-homenajes')
        .upload(nombreArchivo, imagen);

    if (error) {
        alert("Error al subir la imagen: " + error.message);
        return null;
    }

    // Obtener la URL pública de la imagen
    const { publicURL } = supabase.storage
        .from('imagenes-homenajes')
        .getPublicUrl(nombreArchivo);

    return publicURL;
}

// Crear un homenaje
homenajeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const imagen = imagenInput.files[0];
    let imagenUrl = '';

    if (!nombre || !descripcion) {
        alert("Por favor, completa los campos requeridos.");
        return;
    }

    // Si el usuario subió una imagen, la subimos a Supabase Storage
    if (imagen) {
        imagenUrl = await subirImagen(imagen);
        if (!imagenUrl) {
            alert("Error al subir la imagen.");
            return;
        }
    }

    const { data, error } = await supabase
        .from('homenajes')
        .insert([{ nombre, descripcion, imagen_url: imagenUrl }]);

    if (error) {
        alert('Error al crear homenaje: ' + error.message);
    } else {
        alert('Homenaje creado exitosamente');
        nombreInput.value = '';
        descripcionInput.value = '';
        imagenInput.value = '';
        cargarHomenajes(); // Actualiza la lista de homenajes
    }
});

// Código mejorado en script.js

// Cargar homenajes desde la base de datos
async function cargarHomenajes() {
    const { data: homenajes, error } = await supabase
        .from('homenajes')
        .select('*')
        .order('fecha', { ascending: false });

    if (error) {
        alert('Error al cargar homenajes: ' + error.message);
    } else {
        homenajesList.innerHTML = ''; // Limpia la lista de homenajes
        homenajes.forEach(homenaje => {
            const homenajeDiv = document.createElement('div');
            homenajeDiv.classList.add('homenaje');
            homenajeDiv.innerHTML = `
                <h3>${homenaje.nombre}</h3>
                <p>${homenaje.descripcion}</p>
                ${homenaje.imagen_url ? `<img src="${homenaje.imagen_url}" alt="Imagen de ${homenaje.nombre}">` : ''}
                <a href="detalle.html?id=${homenaje.id}">Ver homenaje completo</a>
                <small>Publicado el ${new Date(homenaje.fecha).toLocaleString()}</small>
            `;
            homenajesList.appendChild(homenajeDiv);
        });
    }
}

// Cargar homenajes al iniciar la página
cargarHomenajes();

