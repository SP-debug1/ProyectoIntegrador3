const firebaseConfig = {
    apiKey: "AIzaSyAADH0Fke8NEmlMs8lx03pojuHeSWldF5U", 
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
   
} catch (e) {
    console.error("Error inicializando:", e);
    alert("Error conectando a Firebase: " + e.message);
}


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

    
    db.collection("materias").add({
        nombre: nombre,
        dia: dia,
        horaInicio: horaInicio,
        salon: salon,
        timestamp: new Date().getTime() 
    })
    .then((docRef) => {
        alert("✅ Materia guardada con éxito!");
        
      
        document.getElementById('inputMateria').value = "";
        document.getElementById('inputHoraInicio').value = "";
        document.getElementById('inputSalon').value = "";
        
        
        window.cargarMaterias();
    })
    .catch((error) => {
        console.error("Error guardando:", error);
        alert("Error al guardar: " + error.message);
    });
};


window.cargarMaterias = function() {
    const listaHtml = document.getElementById('listaMaterias');
    
 
    db.collection("materias").orderBy("dia").orderBy("horaInicio").get().then((querySnapshot) => {
        listaHtml.innerHTML = "";
        
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


document.addEventListener("DOMContentLoaded", function() {
    window.cargarMaterias();
});
