/*
 * Mascota Interactiva - Script Único
 * Este script inyecta el CSS, el HTML y la lógica necesaria
 * para las animaciones de la mascota.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- PASO 1: INYECTAR EL CSS ---
    const cssStyles = `
        /* --- INTERACCIÓN 1 (MONTACARGAS, IZQUIERDA) --- */
        #mascot-animation-container {
            position: fixed;
            top: 40%;
            left: 0;
            width: 100%;
            height: 300px;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
        }

        /* 1. Mascota Estática ÚNICA */
        #static-mascot {
            position: fixed;
            bottom: 30px;
            left: 3px;
            width: 200px;
            height: auto;
            cursor: pointer;
            z-index: 2;
            transition: opacity 0.3s ease;
        }

        /* 2. Mascota Animada 1 (Montacargas) */
        #animated-mascot {
            position: absolute;
            width: 250px;
            height: auto;
            display: none;
        }

        /* 3. Clase de Activación 1 */
        #animated-mascot.is-driving {
            display: block;
            animation: drive-across 4s linear;
        }

        /* 4. Animación 1 (Derecha a Izquierda) */
        @keyframes drive-across {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-300px); }
        }

        /* --- INTERACCIÓN 2 (TUBERÍA, DERECHA) --- */
        #mascot-animation-container-2 {
            position: fixed;
            top: 40%; /* Misma altura que el montacargas */
            left: 0;
            width: 100%;
            height: 200px;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
        }

        /* 2. Mascota Animada 2 */
        #animated-mascot-2 {
            position: absolute;
            width: 250px; /* Ajusta el tamaño */
            height: auto;
            display: none;
        }

        /* 3. Clase de Activación 2 */
        #animated-mascot-2.is-driving-right {
            display: block;
            animation: drive-across-right 4s linear; /* Nueva animación */
        }

        /* 4. Animación 2 (Izquierda a Derecha) */
        @keyframes drive-across-right {
            0% { transform: translateX(-300px); }
            100% { transform: translateX(100vw); }
        }
        
        /* --- INTERACCIÓN 3 (TRAILER, CAÍDA) --- */
        #mascot-animation-container-3 {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
        }
        
        /* 2. Mascota Animada 3 */
        #animated-mascot-3 {
            position: absolute;
            width: 250px; /* Ajusta el tamaño */
            height: auto;
            display: none;
            left: 10%; /* Posición horizontal (izquierda) */
            transform: translateX(-50%);
        }
        
        /* 3. Clase de Activación 3 */
        #animated-mascot-3.is-dropping {
            display: block;
            animation: drop-down 4s linear;
        }
        
        /* 4. Animación 3 (Arriba a Abajo) */
        @keyframes drop-down {
            0% { transform: translate(-50%, -300px); } /* Empieza arriba */
            100% { transform: translate(-50%, 100vh); } /* Termina abajo */
        }

        /* --- INTERACCIÓN 4 (SUBIDA) --- */
        #mascot-animation-container-4 {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
        }
        
        /* 2. Mascota Animada 4 */
        #animated-mascot-4 {
            position: absolute;
            width: 250px; /* Ajusta el tamaño */
            height: auto;
            display: none;
            left: 93%; /* Posición horizontal (derecha) */
            transform: translateX(-50%) rotate(-180deg); /* --- ¡ROTACIÓN AÑADIDA AQUÍ! --- */
        }
        
        /* 3. Clase de Activación 4 */
        #animated-mascot-4.is-rising {
            display: block;
            animation: rise-up 4s linear;
        }
        
        /* 4. Animación 4 (Abajo a Arriba) */
        @keyframes rise-up {
            0% { transform: translate(-50%, 100vh) rotate(-180deg); } /* Empieza abajo con rotación */
            100% { transform: translate(-50%, -300px) rotate(-180deg); } /* Termina arriba con rotación */
        }


        /* --- RESPONSIVE (PARA TODAS) --- */
        @media (max-width: 768px) {
            #animated-mascot, #animated-mascot-2, #animated-mascot-3, #animated-mascot-4 { width: 150px; }
            #static-mascot { width: 120px; bottom: 20px; left: 20px; }
            
            @keyframes drive-across {
                0% { transform: translateX(100vw); }
                100% { transform: translateX(-150px); }
            }
            @keyframes drive-across-right {
                0% { transform: translateX(-150px); }
                100% { transform: translateX(100vw); }
            }
            @keyframes drop-down {
                0% { transform: translate(-50%, -150px); }
                100% { transform: translate(-50%, 100vh); }
            }
            @keyframes rise-up {
                0% { transform: translate(-50%, 100vh) rotate(-180deg); } /* Mantener rotación */
                100% { transform: translate(-50%, -150px) rotate(-180deg); } /* Mantener rotación */
            }
        }

        @media (max-width: 480px) {
            #animated-mascot, #animated-mascot-2, #animated-mascot-3, #animated-mascot-4 { width: 120px; }
            #static-mascot { width: 100px; bottom: 15px; left: 15px; }

            @keyframes drive-across {
                0% { transform: translateX(100vw); }
                100% { transform: translateX(-120px); }
            }
            @keyframes drive-across-right {
                0% { transform: translateX(-120px); }
                100% { transform: translateX(100vw); }
            }
            @keyframes drop-down {
                0% { transform: translate(-50%, -120px); }
                100% { transform: translate(-50%, 100vh); }
            }
            @keyframes rise-up {
                0% { transform: translate(-50%, 100vh) rotate(-180deg); } /* Mantener rotación */
                100% { transform: translate(-50%, -120px) rotate(-180deg); } /* Mantener rotación */
            }
        }
    `;

    // Creamos una etiqueta <style> y la añadimos al <head>
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = cssStyles;
    document.head.appendChild(styleSheet);


    // --- PASO 2: INYECTAR EL HTML ---
    const mascotHtml = `
        <img src="../../MATY/Maty.svg" alt="Mascota estática" id="static-mascot">
    
        <div id="mascot-animation-container">
            <img src="../../MATY/MONTACARGAS-MATY.svg" alt="Mascota en montacargas" id="animated-mascot">
        </div>
    
        <div id="mascot-animation-container-2">
            <img src="../../MATY/TUBERIA-MATY.svg" alt="Mascota con tubería" id="animated-mascot-2">
        </div>
        
        <div id="mascot-animation-container-3">
            <img src="../../MATY/TRAILER-MATY.svg" alt="Mascota en trailer" id="animated-mascot-3">
        </div>

        <div id="mascot-animation-container-4">
            <img src="../../MATY/LANCHA-MATY.svg" alt="Mascota subiendo" id="animated-mascot-4">
        </div>
    `;

    // Insertamos el HTML justo antes de que se cierre el <body>
    document.body.insertAdjacentHTML('beforeend', mascotHtml);


    // --- PASO 3: EJECUTAR LA LÓGICA JS ---

    // Seleccionar los 5 elementos
    const staticMascot = document.getElementById('static-mascot');
    const animatedMascot1 = document.getElementById('animated-mascot');
    const animatedMascot2 = document.getElementById('animated-mascot-2');
    const animatedMascot3 = document.getElementById('animated-mascot-3');
    const animatedMascot4 = document.getElementById('animated-mascot-4');

    // Variable de estado (contador de turnos)
    // 0 = Montacargas, 1 = Tubería, 2 = Trailer, 3 = Subida
    let animationTurn = 0;

    // 1. Escuchar el clic en la mascota estática
    staticMascot.addEventListener('click', () => {
        
        staticMascot.style.display = 'none';
        
        // Decidir por turnos usando el contador
        switch (animationTurn) {
            case 0:
                // Opción 1: Montacargas
                console.log('Clic: Iniciando animación 1 (izquierda)...');
                animatedMascot1.classList.add('is-driving');
                break;
            case 1:
                // Opción 2: Tubería
                console.log('Clic: Iniciando animación 2 (derecha)...');
                animatedMascot2.classList.add('is-driving-right');
                break;
            case 2:
                // Opción 3: Trailer (Caída)
                console.log('Clic: Iniciando animación 3 (caída)...');
                animatedMascot3.classList.add('is-dropping');
                break;
            case 3:
                // Opción 4: Subida (Rotada)
                console.log('Clic: Iniciando animación 4 (subida y rotada)...');
                animatedMascot4.classList.add('is-rising');
                break;
        }

        // Incrementar y rotar el turno (0 -> 1 -> 2 -> 3 -> 0)
        animationTurn = (animationTurn + 1) % 4;
    });

    // 2. Escuchar fin de Animación 1 (Montacargas)
    animatedMascot1.addEventListener('animationend', () => {
        console.log('Animación 1 terminada: Reseteando...');
        animatedMascot1.classList.remove('is-driving');
        staticMascot.style.display = 'block';
    });
    
    // 3. Escuchar fin de Animación 2 (Tubería)
    animatedMascot2.addEventListener('animationend', () => {
        console.log('Animación 2 terminada: Reseteando...');
        animatedMascot2.classList.remove('is-driving-right');
        staticMascot.style.display = 'block';
    });
    
    // 4. Escuchar fin de Animación 3 (Trailer/Caída)
    animatedMascot3.addEventListener('animationend', () => {
        console.log('Animación 3 terminada: Reseteando...');
        animatedMascot3.classList.remove('is-dropping');
        staticMascot.style.display = 'block';
    });

    // 5. Escuchar fin de Animación 4 (Subida)
    animatedMascot4.addEventListener('animationend', () => {
        console.log('Animación 4 terminada: Reseteando...');
        animatedMascot4.classList.remove('is-rising');
        staticMascot.style.display = 'block';
    });

}); // Fin de document.addEventListener('DOMContentLoaded')