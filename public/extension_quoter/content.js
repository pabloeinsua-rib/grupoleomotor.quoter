chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'FILL_PDD') {
        const pdd = request.data;
        try {
            // =========================================================================
            // LÓGICA DE INYECCIÓN DE CAMPOS. 
            // Esta lógica simula rellenar los inputs del DOM de CaixaBank.
            // Dado que no sabemos los IDs exactos del DOM de CaixaBank sin ver su código,
            // esto es una plantilla base (pseudo-código DOM) que el integrador ajustará.
            // =========================================================================

            const t = pdd.datosTitulares && pdd.datosTitulares[0];
            const v = pdd.datosVehiculo;
            const f = pdd.datosOferta;

            // Función Helper para rellenar campos e invocar dispatchEvent de React/Angular
            const fillInput = (selectorList, value) => {
                if (!value) return;
                let el = null;
                for(const selector of selectorList) {
                    el = document.querySelector(selector);
                    if (el) break;
                }
                if (el) {
                    el.value = value;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            };

            // EJEMPLOS DE MAPEADO A CAMPOS GENÉRICOS (A ajustar con los IDs reales)
            if (t) {
                // Nombre y Apellidos
                fillInput(['input[name="nombre"]', 'input#name', 'input[formcontrolname="nombre"]'], t.nombre);
                fillInput(['input[name="primerApellido"]', 'input#surname1', 'input[formcontrolname="apellido1"]'], t.primerApellido);
                fillInput(['input[name="segundoApellido"]', 'input#surname2', 'input[formcontrolname="apellido2"]'], t.segundoApellido);
                
                // DNI
                fillInput(['input[name="dni"]', 'input#documentId'], t.dni);
                
                // Móvil e Email
                if (t.contacto) {
                    fillInput(['input[name="movil"]', 'input[type="tel"]'], t.contacto.movil);
                    fillInput(['input[name="email"]', 'input[type="email"]'], t.contacto.email);
                }

                // Domicilio
                if (t.direccion) {
                    fillInput(['input[name="codigoPostal"]', 'input#cp'], t.direccion.codigoPostal);
                    fillInput(['input[name="poblacion"]', 'input#city'], t.direccion.poblacion);
                    fillInput(['input[name="nombreVia"]', 'input#street'], t.direccion.nombreVia);
                }
            }

            if (f) {
                fillInput(['input[name="importeFinanciar"]', 'input[name="amount"]'], f.importeAFinanciar);
                fillInput(['input[name="plazo"]', 'input[name="term"]'], f.plazo);
            }

            // Mapeo super-básico completado
            sendResponse({success: true});
        } catch (err) {
            console.error("Quoter Content Script Error:", err);
            sendResponse({success: false, error: err.message});
        }
        return true; 
    }
});
