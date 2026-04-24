
export interface KnowledgeItem {
    keywords: string[];
    answer: string;
    category: string;
}

export const offlineKnowledge: KnowledgeItem[] = [
    // --- GENERAL ---
    {
        keywords: ['hola', 'buenos', 'dias', 'tardes', 'que tal', 'quien eres', 'ayuda'],
        category: 'General',
        answer: "¡Hola! Soy Quoter Assistant 2.0. Conozco toda la operativa de CaixaBank Payments & Consumer. Puedo ayudarte con documentación, estados de solicitudes, productos financieros, seguros, firma digital y mucho más. ¿Qué necesitas saber?"
    },
    // --- DOCUMENTACIÓN AUTÓNOMOS (MUY DETALLADO) ---
    {
        keywords: ['autonomo', 'autónomo', 'documentacion autonomo', 'papeles autonomo', 'requisitos autonomo'],
        category: 'Documentación',
        answer: "📄 **Documentación Completa para AUTÓNOMOS:**\n\n1. **DNI/NIE:** En vigor y escaneado por ambas caras (color).\n2. **IRPF Anual:** Modelo 100 completo (todas las hojas) del último ejercicio cerrado, con el código CSV visible.\n   - *Nota:* Debes fijarte en la Casilla 435 (Base Imponible General) para calcular los ingresos netos reales.\n3. **Trimestrales (Año en curso):** \n   - **Modelo 130** (Estimación Directa) o **Modelo 131** (Módulos).\n   - Deben presentarse TODOS los trimestres vencidos del año actual.\n4. **Vida Laboral:** Reciente (antigüedad máxima 1 mes) o Modelo 036 (Alta censal) para verificar la actividad y fecha de inicio.\n5. **Recibo Bancario:** Recibo de cuota de autónomos o certificado de titularidad donde figure el nombre y el IBAN completo.\n6. **Resumen IVA (Opcional pero recomendable):** Modelo 390 del año anterior."
    },
    // --- DOCUMENTACIÓN PARTICULARES ---
    {
        keywords: ['particular', 'documentacion particular', 'papeles particular', 'asalariado'],
        category: 'Documentación',
        answer: "📄 **Documentación para PARTICULARES (Asalariados):**\n\n1. **DNI/NIE:** En vigor, original y en color (ambas caras).\n2. **Recibo Banco / Certificado:** Debe figurar el titular y el IBAN completo. Antigüedad máx. 3 meses.\n3. **Nómina:** \n   - Última nómina mensual completa.\n   - **REGLA DE ORO:** Mínimo **20 días trabajados** del mes de la nómina. Si tiene menos de 20 días, la nómina no es válida.\n   - **EMPRESAS DE TRABAJO TEMPORAL (ETT):** Las nóminas de ETT NO son válidas para financiar.\n   - Si no hay nóminas válidas de más de 20 días, es **OBLIGATORIO** solicitar un **COTITULAR SOLVENTE**.\n   - No valen pagas extras sueltas ni anticipos.\n   - Antigüedad máxima: 2 meses.\n   - *Atención:* Si es un contrato muy reciente (< 6 meses) o no figura fecha de antigüedad, solicitar también Vida Laboral.\n4. **IRPF (Si > 25.000€):** Si el importe a financiar supera los 25.000€, es obligatorio aportar el IRPF completo del último año."
    },
    // --- AUTONÓMINAS ---
    {
        keywords: ['autonomina', 'autonómina', 'sin retenciones', 'nomina sin retencion', 'socio trabajador'],
        category: 'Documentación',
        answer: "📄 **Subcaso Especial: Autonóminas:**\n\nUna autonómina es una nómina percibida por un trabajador asalariado (por lo general socio/directivo) **sin retenciones**.  En estos casos:\n1. Estas nóminas SOLO sirven para ver el empleador y la antigüedad.\n2. **NO son fraude**, es 100% legal que la Vida Laboral figure como Autónomo y la nómina como asalariado.\n3. Se trata internamente como Autónomo.\n4. Se debe presentar **OBLIGATORIAMENTE el IRPF**, y se utilizará el importe de la Casilla 435 como ingresos, con 1 sola paga.\n5. **NO** se pedirán los modelos 130 ni 131."
    },
    // --- DOCUMENTACIÓN EMPRESAS ---
    {
        keywords: ['empresa', 'sociedad', 'documentacion empresa', 'juridica', 'sl', 'sa'],
        category: 'Documentación',
        answer: "🏢 **Documentación para EMPRESAS (S.L. / S.A.):**\n\n1. **Identificación Administrador:** DNI/NIE del administrador/es firmantes.\n2. **CIF:** Tarjeta de Identificación Fiscal (CIF) definitiva.\n3. **Escrituras:** \n   - Constitución de la sociedad.\n   - Poderes reales vigentes del firmante (si no están en la constitución).\n   - Acta de Titularidad Real (obligatoria por blanqueo de capitales).\n4. **Impuesto Sociedades:** Modelo 200 (último ejercicio cerrado) completo con CSV.\n5. **IVA:** \n   - Modelo 390 (Resumen Anual anterior).\n   - Modelo 303 (Trimestrales del año en curso).\n6. **Estados Financieros:** Balance de Sumas y Saldos actualizado (provisional año en curso).\n7. **Certificado Bancario:** Titularidad de la cuenta de la empresa."
    },
    // --- DOCUMENTACIÓN PENSIONISTAS ---
    {
        keywords: ['pensionista', 'jubilado', 'pension', 'documentacion pensionista'],
        category: 'Documentación',
        answer: "📄 **Documentación para PENSIONISTAS:**\n\n1. **DNI/NIE:** En vigor.\n2. **Carta de Revalorización:** Documento oficial del año en curso emitido por la Seguridad Social indicando la pensión mensual.\n3. **Recibo Banco:** Justificante donde se ingresa la pensión (con titular e IBAN).\n*Importante:* No se aceptan pensiones no contributivas, de orfandad temporal o por cuidado de familiares si no son vitalicias."
    },
    // --- DOCUMENTACIÓN VEHÍCULO ---
    {
        keywords: ['vehiculo', 'coche', 'papeles coche', 'ficha', 'permiso', 'vo', 'usado'],
        category: 'Documentación',
        answer: "🚗 **Documentación del Vehículo:**\n\n- **Vehículo Nuevo:** Hoja de pedido firmada o Factura Proforma.\n- **Vehículo Usado (VO/Matriculado):**\n  1. **Ficha Técnica:** Ambas caras (verificar ITV en vigor si corresponde).\n  2. **Permiso de Circulación:** Verificar que no tiene Reserva de Dominio activa (informe DGT si hay dudas)."
    },
    // --- OPERATIVA Y ESTADOS ---
    {
        keywords: ['estado', 'estudio', 'pendiente', 'analisis'],
        category: 'Estados',
        answer: "⚠️ **Solicitud En Estudio:**\nLa operación requiere revisión manual por un analista de riesgos. \n- **Acción:** Sube toda la documentación disponible a la web o envíala a `documentacion.admision@caixabankpc.com` indicando el DNI en el asunto.\n- **Plazo:** Suele resolverse en 24h laborables."
    },
    {
        keywords: ['aprobada', 'preautorizada', 'ok'],
        category: 'Estados',
        answer: "✅ **Solicitud Aprobada / Pre-Autorizada:**\nLa operación es viable financieramente.\n- **Siguiente paso:** Subir la documentación completa para validación.\n- **Firma:** Si tienes todos los documentos y el importe es < 30.000€, puedes firmar digitalmente ya.\n- **Ojo:** Cualquier cambio en importe o plazo revertirá el estado a 'En Estudio'."
    },
    {
        keywords: ['denegada', 'rechazada', 'roja'],
        category: 'Estados',
        answer: "❌ **Solicitud Denegada:**\nNo cumple criterios de riesgo. La decisión es definitiva y automática basada en scoring y política de riesgos. No admite recurso."
    },
    {
        keywords: ['condicionada', 'aval', 'entrada', 'condiciones'],
        category: 'Estados',
        answer: "⚠️ **Aprobada Condicionada:**\nViable PERO se requiere modificar condiciones:\n- Aumentar entrada / Reducir importe.\n- Reducir plazo.\n- Añadir un avalista solvente.\nDebes realizar estos cambios para que pase a Aprobada Definitiva."
    },
    // --- PRODUCTOS FINANCIEROS ---
    {
        keywords: ['lineal', 'estandar', 'prestamo'],
        category: 'Productos',
        answer: "🚗 **Financiación Lineal:**\nPréstamo clásico. Cliente es propietario desde el inicio. Plazos hasta 120 meses (según antigüedad). Cancelable en cualquier momento (comisión 1% o 0,5%)."
    },
    {
        keywords: ['resicuota', 'multiopcion', 'valor final', 'futuro'],
        category: 'Productos',
        answer: "🔄 **Resicuota (Multi-opción):**\nCuotas bajas + VFG (Valor Final Garantizado). Al final (3 o 4 años), el cliente decide: Cambiar (por uno nuevo), Devolver (saldar deuda) o Quedárselo (pagar/refinanciar VFG)."
    },
    {
        keywords: ['leasing', 'arrendamiento', 'condiciones leasing'],
        category: 'Productos',
        answer: "💼 **LEASING (Condiciones Detalladas):**\n\n- **Clientes:** Sociedades y Autónomos (No Asalariados).\n- **Plazos:** Hasta **84 meses** (Sociedades) / **72 meses** (Autónomos).\n- **Entrada:** Máxima 30% sobre Base Imponible.\n- **Valor Residual:** Igual a 1 cuota. Compra del bien abonando última cuota.\n- **Cancelación Anticipada:** No admite parciales. Total: 3% s/ capital pendiente.\n- **Seguros:** No contratables.\n- **Notaría:** Obligatoria en operaciones ≥ **30.000 €** (Empresas).\n- **Documentación:** Imprescindible Factura Proforma con Nº Bastidor.\n\n**Datos de Facturación para el Abono:**\nCAIXABANK PAYMENTS & CONSUMER E.F.C., E.P., S.A.U.\nNIF: A08980153\nDomicilio: Avda. Manoteras 20, Edif. París. 28080 Madrid."
    },
    // --- SEGUROS ---
    {
        keywords: ['seguro', 'proteccion', 'vida', 'desempleo'],
        category: 'Seguros',
        answer: "🛡️ **Seguros de Protección de Pagos (PUF):**\n1. **Pack Vida:** Fallecimiento, Invalidez, Cáncer, Infarto.\n2. **Pack Protección:** Todo lo anterior + Desempleo (Asalariados) o Incapacidad Temporal (Autónomos). Cubre hasta 6 cuotas consecutivas.\n3. **Vida Senior:** Solo Fallecimiento (para > 60 años)."
    },
    // --- FIRMA ---
    {
        keywords: ['firma', 'digital', 'app', 'firmar'],
        category: 'Firma',
        answer: "✍️ **Firma Digital (APP):**\nDescarga 'Firma Digital CaixaBank P&C'. Loguéate con tu DNI y Contraseña. Escanea DNI cliente y firma en pantalla. Rápido y sin papel."
    },
    {
        keywords: ['papel', 'firma papel'],
        category: 'Firma',
        answer: "📝 **Firma en Papel:**\nObligatoria para Empresas o incidencias técnicas. Imprimir 3 copias. Firmar todas las hojas. Enviar escaneado a `documentacion.auto@caixabankpc.com`."
    },
    {
        keywords: ['notaria', 'notario'],
        category: 'Firma',
        answer: "⚖️ **Firma ante Notario:**\nObligatoria si importe ≥ 40.000€ (Asalariados/Autónomos) o ≥ 30.000€ (Empresas). El cliente elige notario y paga gastos. Comunica fecha/lugar a tu gestor."
    },
    // --- OPERATIVA ---
    {
        keywords: ['abono', 'pago', 'cobrar', 'matricula'],
        category: 'Operativa',
        answer: "💰 **Abono y Matriculación:**\nSolo cuando recibas la **CARTA DE PAGO** por email. Significa que el contrato está firmado y la documentación validada. NUNCA matricules antes."
    },
    {
        keywords: ['modificar', 'cambiar'],
        category: 'Operativa',
        answer: "✏️ **Modificar Solicitud:**\n- Si está 'En Estudio': Llama a soporte (933 203 365).\n- Si está 'Aprobada': Puedes modificar datos en la web, pero volverá a pasar riesgos."
    },
    // --- SOPORTE ---
    {
        keywords: ['telefono', 'contacto', 'soporte', 'email'],
        category: 'Contacto',
        answer: "📞 **Contactos Clave:**\n- **Soporte Comercial:** 933 203 365 (L-S 9-21h).\n- **Estudio:** `documentacion.admision@caixabankpc.com`\n- **Pago/Validación:** `documentacion.auto@caixabankpc.com`\n- **Atención Cliente Final:** 900 101 601."
    }
];

export const getFullKnowledgeText = () => {
    return offlineKnowledge.map(item => `[${item.category.toUpperCase()}] ${item.answer}`).join('\n\n');
};
