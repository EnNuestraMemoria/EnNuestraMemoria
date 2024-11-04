// Conectar con Supabase
const supabaseUrl = 'https://qtghsespngapcawhvbxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2hzZXNwbmdhcGNhd2h2YnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NjEzNDksImV4cCI6MjA0NjMzNzM0OX0.lCRLg75yLRHnzpS6dayg-ozkP2DF2lmKYLE07FSkadA';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Crear un nuevo homenaje
document.getElementById('create-homenaje-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenUrl = document.getElementById('imagen').value;

    const { data, error } = await supabase
        .from('homenajes')
        .insert([{ nombre, descripcion, imagen_url: imagenUrl }]);

    if (error) {
        alert('Error creando homenaje: ' + error.message);
    } else {
        alert('Homenaje creado exitosamente');
        cargarHomenajes();
    }
});

// Cargar homenajes desde la base de datos
async function cargarHomenajes() {
    const { data: homenajes, error } = await supabase
        .from('homenajes')
        .select('*')
        .order('fecha', { ascending: false });

    if (error) {
        alert('Error cargando homenajes: ' + error.message);
    } else {
        const container = document.getElementById('homenajes-container');
        container.innerHTML = '';
        homenajes.forEach(homenaje => {
            const div = document.createElement('div');
            div.classList.add('homenaje');
            div.innerHTML = `
                <h2>${homenaje.nombre}</h2>
                <p>${homenaje.descripcion}</p>
                ${homenaje.imagen_url ? `<img src="${homenaje.imagen_url}" alt="Imagen de ${homenaje.nombre}" width="100%">` : ''}
                <small>Publicado el ${new Date(homenaje.fecha).toLocaleString()}</small>
            `;
            container.appendChild(div);
        });
    }
}

// Cargar homenajes al iniciar la página
cargarHomenajes();
