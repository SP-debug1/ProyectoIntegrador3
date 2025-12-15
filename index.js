// ==========================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// Usaremos la configuración que proporcionaste para UVM Manager
// ==========================================================
const firebaseConfig = {
    apiKey: "AIzaSyAADH0Fke8NEmlMs8lx03pojuHeSWldF5U", // NOTA: Asumo que esta es la clave correcta
    authDomain: "uvm-manager-app.firebaseapp.com",
    projectId: "uvm-manager-app",
    storageBucket: "uvm-manager-app.firebasestorage.app",
    messagingSenderId: "893270870594",
    appId: "1:893270870594:web:49691b8b65be9044cebbdb",
    measurementId: "G-2S215G3ZXP"
};

let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase conectado para UVM Manager (Modo Compat)");
    // alert("App Conectada a Firebase"); // Desactivar alerta de prueba para uso continuo
} catch (e) {
    console.error("Error inicializando:", e);
    alert("Error conectando a Firebase: " + e.message);
}

// -----------------------------------------------------------
// 2. FUNCIONES CRUD PARA MATERIAS
// -----------------------------------------------------------

// A. CREAR (Guardar Materia)
window.guardarMateria = function() {
    console.log("Guardando materia...");

    const nombre = document.getElementById('inputMateria').value;
    const dia = document.getElementById('selectDia').value;
    const horaInicio = document.getElementById('inputHoraInicio').value;
    const salon = document.getElementById('inputSalon').value;

    if (nombre.trim() === "" || horaInicio.trim() === "") {
        alert("Por favor completa el nombre de la materia y la hora de inicio.");
        return;
    }

    // Guardar en Firestore en la colección "materias"
    db.collection("materias").add({
        nombre: nombre,
        dia: dia,
        horaInicio: horaInicio,
        salon: salon,
        timestamp: new Date().getTime() // Usamos timestamp para ordenar si es necesario
    })
    .then((docRef) => {
        alert("✅ Materia guardada con éxito!");
        
        // Limpiar campos
        document.getElementById('inputMateria').value = "";
        document.getElementById('inputHoraInicio').value = "";
        document.getElementById('inputSalon').value = "";
        
        // Actualizar lista
        window.cargarMaterias();
    })
    .catch((error) => {
        console.error("Error guardando:", error);
        alert("Error al guardar: " + error.message);
    });
};

// B. LEER (Cargar lista y ordenarla por día y hora)
window.cargarMaterias = function() {
    const listaHtml = document.getElementById('listaMaterias');
    
    // Consulta: Pedimos las materias y las ordenamos por 'dia' y 'horaInicio'
    // Nota: La ordenación por 'día' alfabética no es perfecta, pero funciona para un listado simple.
    db.collection("materias").orderBy("dia").orderBy("horaInicio").get().then((querySnapshot) => {
        listaHtml.innerHTML = ""; // Limpiar
        
        if (querySnapshot.empty) {
            listaHtml.innerHTML = "<p>🎉 ¡No tienes materias registradas! ¡Añade una!</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            
            listaHtml.innerHTML += `
                <div class="tarjeta-materia">
                    <h3>${data.nombre}</h3>
                    <p><strong>Día:</strong> ${data.dia}</p>
                    <p><strong>Hora:</strong> <span class="horario-texto">${data.horaInicio}</span></p>
                    <p><strong>Salón:</strong> ${data.salon}</p>
                    
                    <button class="btn-danger" onclick="borrarMateria('${id}')">🗑 Eliminar</button>
                </div>
            `;
        });
    }).catch((error) => {
        console.error("Error cargando datos:", error);
        listaHtml.innerHTML = "<p>Error cargando datos de Firebase.</p>";
    });
};

// C. BORRAR (Eliminar Materia)
window.borrarMateria = function(id) {
    if(confirm("¿Eliminar esta materia del horario?")) {
        db.collection("materias").doc(id).delete().then(() => {
            alert("Materia Eliminada");
            window.cargarMaterias();
        }).catch((error) => {
            console.error("Error borrando:", error);
            alert("Error al eliminar la materia.");
        });
    }
};

// Iniciar carga al abrir
document.addEventListener("DOMContentLoaded", function() {
    window.cargarMaterias();
});