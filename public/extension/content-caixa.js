
// Script mejorado para la web de CaixaBank Auto (Versión Robustez)
console.log("Quoter Link: Magic Script Loaded (v3.0 - Event Simulation)");

// --- CREACIÓN DEL BOTÓN MÁGICO ---
const magicButton = document.createElement('button');
magicButton.innerHTML = '✨ PEGAR DATOS';
Object.assign(magicButton.style, {
    position: 'fixed',
    top: '120px',
    right: '30px',
    zIndex: '999999',
    background: 'linear-gradient(135deg, #00a1e0 0%, #0077a3 100%)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.5)',
    borderRadius: '12px',
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '800',
    boxShadow: '0 10px 25px rgba(0, 161, 224, 0.4)',
    cursor: 'pointer',
    fontFamily: 'Segoe UI, sans-serif',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
});

magicButton.onmouseover = () => {
    magicButton.style.transform = 'scale(1.1) translateY(-2px)';
    magicButton.style.boxShadow = '0 15px 35px rgba(0, 161, 224, 0.6)';
};
magicButton.onmouseout = () => {
    magicButton.style.transform = 'scale(1) translateY(0)';
    magicButton.style.boxShadow = '0 10px 25px rgba(0, 161, 224, 0.4)';
};

// --- SIMULADOR DE EVENTOS (CRÍTICO PARA REACT/ANGULAR) ---
// Muchas webs modernas ignoran 'element.value = x' si no hay evento de usuario.
function setNativeValue(element, value) {
    if (!element) return;

    // 1. Enfocar
    element.focus();
    element.click();

    // 2. Usar el setter nativo del prototipo para saltar wrappers de React/Angular
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        element.value = value;
    }

    // 3. Disparar eventos en cascada
    const events = ['keydown', 'keypress', 'input', 'change', 'keyup', 'blur'];
    events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    });
}

// --- LÓGICA DE PEGADO ---
magicButton.onclick = async () => {
    magicButton.innerHTML = '⏳ PROCESANDO...';
    magicButton.style.background = '#64748b';

    try {
        // Leer Portapapeles
        const text = await navigator.clipboard.readText();
        let data;
        
        try {
            data = JSON.parse(text);
        } catch (e) {
            alert('❌ El portapapeles no contiene datos válidos de Quoter.\nCopia los datos desde la app primero.');
            resetButton();
            return;
        }

        console.log("Datos leídos:", data);

        // --- MAPEO INTELIGENTE ---
        // Intentamos encontrar campos por ID, Name, Placeholder o Labels cercanos
        
        // 1. Datos Personales
        fillField(['dni', 'nif', 'documento'], data.datosTitulares?.[0]?.dni);
        fillField(['nombre', 'name'], data.datosTitulares?.[0]?.nombre);
        fillField(['apellido1', 'primerapellido'], data.datosTitulares?.[0]?.primerApellido);
        fillField(['apellido2', 'segundoapellido'], data.datosTitulares?.[0]?.segundoApellido);
        fillField(['nacimiento', 'birth'], data.datosTitulares?.[0]?.fechaNacimiento); // Puede requerir formato específico
        
        // Contacto
        fillField(['telefono', 'movil', 'phone'], data.datosTitulares?.[0]?.contacto?.movil);
        fillField(['email', 'correo'], data.datosTitulares?.[0]?.contacto?.email);

        // Dirección
        fillField(['via', 'calle', 'domicilio'], data.datosTitulares?.[0]?.direccion?.nombreVia);
        fillField(['numero', 'num'], data.datosTitulares?.[0]?.direccion?.numero);
        fillField(['cp', 'postal', 'codigopostal'], data.datosTitulares?.[0]?.direccion?.codigoPostal);
        fillField(['poblacion', 'localidad', 'municipio'], data.datosTitulares?.[0]?.direccion?.poblacion);

        // 2. Datos Económicos (Prioridad a datos de oferta, fallback a root)
        const precio = data.pdd?.datosOferta?.precioVehiculo || data.salePrice;
        const entrada = data.pdd?.datosOferta?.entrada || data.downPayment;
        const plazo = data.pdd?.datosOferta?.plazo || data.term;

        fillField(['pvp', 'precio', 'importe'], precio);
        fillField(['entrada', 'aportacion'], entrada);
        fillField(['plazo', 'meses', 'duracion'], plazo);

        // 3. Vehículo
        fillField(['matricula', 'placa'], data.pdd?.datosVehiculo?.matricula || data.licensePlate);
        fillField(['bastidor', 'vin'], data.pdd?.datosVehiculo?.bastidor);

        magicButton.innerHTML = '✅ DATOS PEGADOS';
        magicButton.style.background = '#22c55e'; // Green
        setTimeout(resetButton, 3000);

    } catch (err) {
        console.error(err);
        alert('Error al acceder al portapapeles. Asegúrate de dar permisos.');
        resetButton();
    }
};

function resetButton() {
    magicButton.innerHTML = '✨ PEGAR DATOS';
    magicButton.style.background = 'linear-gradient(135deg, #00a1e0 0%, #0077a3 100%)';
}

// Función de búsqueda difusa de campos
function fillField(keywords, value) {
    if (!value) return;
    
    // Convertir todo a string para evitar errores
    const strValue = String(value);

    // Buscar todos los inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    
    for (const input of inputs) {
        // Ignorar hidden o disabled
        if (input.type === 'hidden' || input.disabled) continue;

        const id = (input.id || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        
        // Coincidencia
        const match = keywords.some(key => id.includes(key) || name.includes(key) || placeholder.includes(key));

        if (match) {
            console.log(`Campo encontrado para [${keywords.join(',')}]:`, input);
            setNativeValue(input, strValue);
            
            // Highlight visual
            input.style.transition = 'background 0.5s';
            input.style.backgroundColor = '#dcfce7'; // Light green
            setTimeout(() => input.style.backgroundColor = '', 2000);
            
            // Intentar solo rellenar el primero que coincida con fuerza para evitar sobrescrituras locas? 
            // No, mejor rellenar todos los candidatos posibles por si acaso (ej: email confirmación).
        }
    }
}

document.body.appendChild(magicButton);
