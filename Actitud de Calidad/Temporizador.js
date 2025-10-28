// ==========================
// TEMPORIZADOR INDEPENDIENTE (SIN REINICIO) - VERSIÓN CORREGIDA
// ==========================

// Tiempo límite en minutos
const EXPIRATION_MINUTES = 2880;
const TIMER_KEY = "session_timer_end";
const TIMER_USER_KEY = "session_timer_user";

// Variable para almacenar el intervalo del temporizador
let timerInterval = null;

// Crear contenedor del contador en pantalla
const timerContainer = document.createElement('div');
timerContainer.id = "session-timer";
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
timerContainer.style.display = "none";
document.body.appendChild(timerContainer);

// VERIFICAR SI EL TEMPORIZADOR PERTENECE AL USUARIO ACTUAL
function isTimerForCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const timerUser = JSON.parse(localStorage.getItem(TIMER_USER_KEY) || '{}');
    
    return (currentUser.fullname === timerUser.fullname && 
            currentUser.companyId === timerUser.companyId);
}

// Iniciar temporizador (solo si no existe uno para este usuario)
function startSessionTimer() {
    console.log("Iniciando temporizador de sesión...");
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser || !currentUser.fullname) {
        console.log("No hay usuario logueado, no se inicia temporizador");
        return;
    }
    
    // Verificar si ya existe un temporizador para ESTE usuario
    const timerUser = JSON.parse(localStorage.getItem(TIMER_USER_KEY) || '{}');
    const expirationTime = parseInt(localStorage.getItem(TIMER_KEY) || "0");
    
    if (expirationTime > 0 && 
        timerUser.fullname === currentUser.fullname && 
        timerUser.companyId === currentUser.companyId) {
        console.log("Ya existe un temporizador para este usuario, no se crea uno nuevo");
        startVisualTimer();
        return;
    }
    
    // Establecer hora de expiración (solo si no existe o es para otro usuario)
    const newExpirationTime = Date.now() + (EXPIRATION_MINUTES * 60 * 1000);
    localStorage.setItem(TIMER_KEY, newExpirationTime.toString());
    localStorage.setItem(TIMER_USER_KEY, JSON.stringify(currentUser));
    
    // Iniciar contador visual
    startVisualTimer();
}

// Iniciar contador visual
function startVisualTimer() {
    // Limpiar intervalo existente
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Mostrar contador solo si hay usuario logueado Y el temporizador es para él
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.fullname && isTimerForCurrentUser()) {
        timerContainer.style.display = "block";
    } else {
        timerContainer.style.display = "none";
    }
    
    // Actualizar cada segundo
    timerInterval = setInterval(updateVisualTimer, 1000);
    updateVisualTimer();
}

// Actualizar contador visual
function updateVisualTimer() {
    const expirationTime = parseInt(localStorage.getItem(TIMER_KEY) || "0");
    const now = Date.now();
    const remaining = expirationTime - now;
    
    if (remaining <= 0) {
        handleSessionExpiration();
    } else {
        // Mostrar tiempo restante solo si hay usuario logueado Y el temporizador es para él
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser.fullname && isTimerForCurrentUser()) {
            timerContainer.style.display = "block";
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            timerContainer.textContent = `Sesión expira en: ${minutes}m ${seconds}s`;
        } else {
            timerContainer.style.display = "none";
        }
    }
}

// Manejar expiración de sesión
function handleSessionExpiration() {
    console.log("Temporizador expirado, verificando si borrar datos...");
    
    // Limpiar intervalo
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Ocultar contador
    timerContainer.style.display = "none";
    
    // Obtener usuario asociado al temporizador
    const timerUser = JSON.parse(localStorage.getItem(TIMER_USER_KEY) || '{}');
    
    // Solo borrar datos si el temporizador está asociado a un usuario
    if (timerUser && timerUser.companyId && timerUser.fullname) {
        const userKey = `progress_${timerUser.companyId}_${timerUser.fullname}`;
        
        // Verificar si los datos aún existen antes de borrar
        if (localStorage.getItem(userKey)) {
            localStorage.removeItem(userKey);
            console.log("Datos de usuario eliminados por expiración:", userKey);
            
            // Mostrar alerta solo si el usuario afectado es el actual
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser && currentUser.fullname === timerUser.fullname && currentUser.companyId === timerUser.companyId) {
                alert("Tu sesión ha expirado por inactividad. Todos los datos han sido eliminados.");
                
                // Cerrar sesión del usuario afectado
                localStorage.removeItem('currentUser');
                
                // Redirigir a login
                const loginScreen = document.getElementById('login-screen');
                const courseScreen = document.getElementById('course-screen');
                if (loginScreen && courseScreen) {
                    courseScreen.style.display = 'none';
                    loginScreen.style.display = 'block';
                }
                
                // Limpiar campos
                const fullnameInput = document.getElementById('fullname');
                const companyIdInput = document.getElementById('company-id');
                if (fullnameInput) fullnameInput.value = '';
                if (companyIdInput) companyIdInput.value = '';
            }
        }
    }
    
    // Limpiar temporizador
    localStorage.removeItem(TIMER_KEY);
    localStorage.removeItem(TIMER_USER_KEY);
}

// Verificar temporizador al cargar la página
function checkExistingTimer() {
    const expirationTime = parseInt(localStorage.getItem(TIMER_KEY) || "0");
    const now = Date.now();
    
    if (expirationTime > 0) {
        console.log("Temporizador existente encontrado. Tiempo restante:", Math.floor((expirationTime - now) / 60000), "minutos");
        if (now >= expirationTime) {
            handleSessionExpiration();
        } else {
            startVisualTimer();
        }
    } else {
        console.log("No se encontró temporizador activo");
        // Limpiar datos de temporizador si existen
        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(TIMER_USER_KEY);
    }
}

// ✅ **INICIO DE LA MODIFICACIÓN 1**
// Función para iniciar sesión con temporizador (AHORA INCLUYE REGIÓN)
function loginWithTimer(fullname, companyId, region) {
    const user = { fullname, companyId, region }; // Incluye la región
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Crear nuevo progreso solo si no existe
    const key = `progress_${companyId}_${fullname}`;
    if (!localStorage.getItem(key)) {
        const progress = { activities: {} };
        localStorage.setItem(key, JSON.stringify(progress));
    }
    
    // Iniciar el temporizador (solo si no existe uno para este usuario)
    startSessionTimer();
    
    // Redirigir a pantalla de cursos
    const loginScreen = document.getElementById('login-screen');
    const courseScreen = document.getElementById('course-screen');
    if (loginScreen && courseScreen) {
        loginScreen.style.display = 'none';
        courseScreen.style.display = 'block';
    }
    
    // Mostrar nombre de usuario
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) {
        userNameSpan.textContent = fullname;
    }
}
// ✅ **FIN DE LA MODIFICACIÓN 1**

// Sobrescribir la función de logout para NO borrar datos
function handleLogoutWithoutDataDeletion() {
    console.log("Cerrando sesión sin borrar datos...");
    
    // Limpiar temporizador visual
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerContainer.style.display = "none";
    
    // Cerrar sesión (solo remover currentUser, mantener progress_*)
    localStorage.removeItem('currentUser');
    
    // Redirigir a login
    const loginScreen = document.getElementById('login-screen');
    const courseScreen = document.getElementById('course-screen');
    if (loginScreen && courseScreen) {
        courseScreen.style.display = 'none';
        loginScreen.style.display = 'block';
    }
    
    // Limpiar campos
    const fullnameInput = document.getElementById('fullname');
    const companyIdInput = document.getElementById('company-id');
    if (fullnameInput) fullnameInput.value = '';
    if (companyIdInput) companyIdInput.value = '';
    
    console.log("Sesión cerrada manualmente, datos conservados");
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, verificando temporizador...");
    
    // Verificar temporizador existente
    checkExistingTimer();
    
    // ✅ **INICIO DE LA MODIFICACIÓN 2**
    // Reemplazar el evento de login original (AHORA INCLUYE REGIÓN)
    const loginButton = document.getElementById('login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const fullname = document.getElementById('fullname').value.trim().toUpperCase();
            const companyId = document.getElementById('company-id').value.trim().toUpperCase();
            const region = document.getElementById('region').value; // Lee la región
            
            if (!fullname || !companyId || !region) { // Valida la región
                alert('Completa todos los campos');
                return;
            }
            
            loginWithTimer(fullname, companyId, region); // Envía los tres datos
        });
    }
    // ✅ **FIN DE LA MODIFICACIÓN 2**
    
    // Verificar si ya hay una sesión activa al cargar
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.fullname) {
        console.log("Usuario ya logueado:", currentUser.fullname);
        // Solo iniciar visualización si el temporizador es para este usuario
        if (isTimerForCurrentUser()) {
            startVisualTimer();
        } else {
            console.log("El temporizador existente es para otro usuario, no se muestra");
            timerContainer.style.display = "none";
        }
    }
});

// Reemplazar la función de logout original
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogoutWithoutDataDeletion);
}

// Función para abrir actividades (NO reinicia el temporizador)
function openActivity(activityId, url) {
    window.open(url, '_blank');
}