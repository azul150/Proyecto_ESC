// ==========================
// EXPIRACIÓN DE PROGRESO CON CONTADOR Y REINICIO DE SESIÓN
// ==========================

// Tiempo límite en minutos
const EXPIRATION_MINUTES = 3;

// Clave en localStorage
const COURSE_PROGRESS_KEY_PREFIX = "progress_";

// Variable para almacenar el intervalo del temporizador
let timerInterval = null;

// Crear contenedor del contador en pantalla
const timerContainer = document.createElement('div');
timerContainer.id = "progress-timer";
timerContainer.style.position = "fixed";
timerContainer.style.bottom = "10px";
timerContainer.style.right = "10px";
timerContainer.style.padding = "8px 12px";
timerContainer.style.background = "#ff4d4d";
timerContainer.style.color = "#fff";
timerContainer.style.fontWeight = "bold";
timerContainer.style.borderRadius = "5px";
timerContainer.style.zIndex = "9999";
timerContainer.style.fontFamily = "Arial, sans-serif";
timerContainer.style.display = "none"; // Oculto por defecto
document.body.appendChild(timerContainer);

// Inicializar timestamp al iniciar progreso (solo si no existe)
function initProgressTimestamp() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        timerContainer.style.display = "none";
        return false;
    }

    const key = `${COURSE_PROGRESS_KEY_PREFIX}${currentUser.companyId}_${currentUser.fullname}`;
    let saved = localStorage.getItem(key);

    if (!saved) {
        // Solo crear nuevo timestamp si no existe progreso
        const progress = { startTimestamp: Date.now(), activities: {} };
        localStorage.setItem(key, JSON.stringify(progress));
    } else {
        // NO actualizar el timestamp si ya existe progreso
        // Esto evita que se reinicie al recargar la página
        const progress = JSON.parse(saved);
        if (!progress.startTimestamp) {
            progress.startTimestamp = Date.now();
            localStorage.setItem(key, JSON.stringify(progress));
        }
    }
    
    return true;
}

// Verificar expiración y actualizar contador
function updateProgressTimer() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        timerContainer.style.display = "none";
        return;
    }

    const key = `${COURSE_PROGRESS_KEY_PREFIX}${currentUser.companyId}_${currentUser.fullname}`;
    const saved = localStorage.getItem(key);
    if (!saved) {
        timerContainer.style.display = "none";
        return;
    }

    const progress = JSON.parse(saved);
    if (!progress.startTimestamp) {
        timerContainer.style.display = "none";
        return;
    }

    const now = Date.now();
    const diffMinutes = (now - progress.startTimestamp) / 1000 / 60;
    const remaining = EXPIRATION_MINUTES - diffMinutes;

    if (remaining <= 0) {
        // Tiempo expirado: borrar progreso y cerrar sesión
        localStorage.removeItem(key);
        localStorage.removeItem('currentUser');
        
        // Limpiar el intervalo
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // Ocultar el contador
        timerContainer.style.display = "none";
        
        // Redirigir a pantalla de login
        const loginScreen = document.getElementById('login-screen');
        const courseScreen = document.getElementById('course-screen');
        if (loginScreen && courseScreen) {
            courseScreen.style.display = 'none';
            loginScreen.style.display = 'block';
        }

        // Limpiar campos de login
        const fullnameInput = document.getElementById('fullname');
        const companyIdInput = document.getElementById('company-id');
        if (fullnameInput) fullnameInput.value = '';
        if (companyIdInput) companyIdInput.value = '';
        
        alert("Tu progreso ha caducado. Se borró todo y se cerró sesión.");
    } else {
        // Mostrar tiempo restante en minutos y segundos
        timerContainer.style.display = "block";
        const minutes = Math.floor(remaining);
        const seconds = Math.floor((remaining - minutes) * 60);
        timerContainer.textContent = `Progreso expira en: ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    }
}

// Iniciar temporizador
function startProgressTimer() {
    // Limpiar cualquier intervalo existente
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Inicializar timestamp solo si hay usuario
    if (initProgressTimestamp()) {
        updateProgressTimer();
        timerInterval = setInterval(updateProgressTimer, 1000); // actualizar cada segundo
    }
}

// Función para reiniciar el temporizador (llamar en cada interacción del usuario)
function resetProgressTimer() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const key = `${COURSE_PROGRESS_KEY_PREFIX}${currentUser.companyId}_${currentUser.fullname}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        const progress = JSON.parse(saved);
        progress.startTimestamp = Date.now();
        localStorage.setItem(key, JSON.stringify(progress));
    }
}

// Detener el temporizador (llamar al cerrar sesión)
function stopProgressTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerContainer.style.display = "none";
}

// Función para iniciar sesión (debes llamar a esta función cuando el usuario haga login)
function loginUser(fullname, companyId) {
    const user = { fullname, companyId };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Iniciar el temporizador inmediatamente después del login
    startProgressTimer();
    
    // Aquí también deberías hacer la redirección a la pantalla de cursos
    const loginScreen = document.getElementById('login-screen');
    const courseScreen = document.getElementById('course-screen');
    if (loginScreen && courseScreen) {
        loginScreen.style.display = 'none';
        courseScreen.style.display = 'block';
    }
}

// Llamar cuando el usuario inicie sesión (tanto al cargar como después de caducar)
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay un usuario logueado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        startProgressTimer();
    }
    
    // Configurar el evento de login para que inicie el temporizador
    const loginButton = document.getElementById('login-btn'); // Asegúrate de tener este botón
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const fullname = document.getElementById('fullname').value;
            const companyId = document.getElementById('company-id').value;
            if (fullname && companyId) {
                loginUser(fullname, companyId);
            }
        });
    }
});