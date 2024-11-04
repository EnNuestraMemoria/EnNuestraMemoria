// Conectar a Supabase
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Obtener el ID del homenaje desde la URL
const urlParams = new URLSearchParams(window.location.search);
const homenajeId = urlParams.get('id');

// Referencias del DOM
const homenajeInfo = document.getElementById('homenaje-info');
const comentariosList = document.getElementById('comentarios-list');
const comentarioForm = document.getElementById('comentario-form');
const autorInput = document.getElementById('autor');
const comentarioInput = document.getElementById('comentario');

// Cargar detalles del homenaje
async function cargarHomenaje() {
    const { data: homenaje, error } = await supabase
        .from('homenajes')
        .select('*')
        .eq('id', homenajeId)
        .single();

    if (error) {
        alert('Error al cargar el homenaje: ' + error.message);
    } else {
        homenajeInfo.innerHTML = `
            <h2>${homenaje.nombre}</h2>
            <p>${homenaje.descripcion}</p>
            ${homenaje.imagen_url ? `<img src="${homenaje.imagen_url}" alt="Imagen de ${homenaje.nombre}">` : ''}
            <small>Publicado el ${new Date(homenaje.fecha).toLocaleString()}</small>
        `;
    }
}

// Cargar comentarios del homenaje
async function cargarComentarios() {
    const { data: comentarios, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('homenaje_id', homenajeId)
        .order('fecha', { ascending: false });

    if (error) {
        alert('Error al cargar comentarios: ' + error.message);
    } else {
        comentariosList.innerHTML = '';
        comentarios.forEach(comentario => {
            const comentarioDiv = document.createElement('div');
            comentarioDiv.classList.add('comentario');
            comentarioDiv.innerHTML = `
                <p><strong>${comentario.autor}</strong>: ${comentario.comentario}</p>
                <small>Publicado el ${new Date(comentario.fecha).toLocaleString()}</small>
            `;
            comentariosList.appendChild(comentarioDiv);
        });
    }
}

// Añadir nuevo comentario
comentarioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const autor = autorInput.value.trim();
    const comentario = comentarioInput.value.trim();

    if (!autor || !comentario) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const { error } = await supabase
        .from('comentarios')
        .insert([{ homenaje_id: homenajeId, autor, comentario }]);

    if (error) {
        alert('Error al añadir comentario: ' + error.message);
    } else {
        autorInput.value = '';
        comentarioInput.value = '';
        cargarComentarios();
