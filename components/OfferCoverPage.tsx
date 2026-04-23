import React from 'react';

const OfferCoverPage: React.FC = () => {
    const today = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const pageStyle: React.CSSProperties = {
        width: '210mm',
        height: '297mm',
        padding: '2.5cm',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11pt',
        lineHeight: '1.6',
        backgroundColor: 'white',
        color: '#000',
    };

    return (
        <div style={pageStyle}>
            <header className="flex justify-between items-start mb-16 border-b border-black pb-4">
                 <h1 className="text-2xl font-light tracking-tight">Oferta Financiera</h1>
                <div className="text-right text-sm font-medium">
                    <p>{today}</p>
                </div>
            </header>

            <main className="flex-grow space-y-6 text-black text-base">
                <p>Estimado Cliente;</p>
                <p>Le agradecemos que haya elegido nuestros servicios para financiar su nuevo vehículo.</p>
                <p>En las páginas anexas, podrá ver todas las condiciones del préstamo ofertado.</p>
                <p>Es una oferta no vinculante, sujeta a estudio, por lo cual, tendrá que aportar la documentación necesaria, indicada en el anexo, para el estudio de la misma.</p>
                <p>Su comercial de confianza en su Concesionario, le informará de todo el proceso.</p>
                <p className="font-bold mt-8">Le recordamos las ventajas de Financiar su nuevo vehículo con nosotros:</p>
                
                <ul className="list-none pl-0 space-y-4 mt-4">
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>Mantenga su capacidad de crédito con su entidad bancaria habitual.</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>COBERTURA TOTAL.</strong> No es necesaria Entrada.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>TIPOS DE INTERÉS FIJOS.</strong> Sepa de antemano lo que va a pagar.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>FLEXIBILIDAD.</strong> Hasta 120 meses (en función de la edad del vehículo).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>SIN CAMBIAR DE BANCO.</strong> Domicilie los recibos en su entidad bancaria habitual.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>AGILIDAD EN LA TRAMITACIÓN.</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-black font-bold mt-1">•</span>
                        <span><strong>AGILIDAD EN LA CONTRATACIÓN.</strong> Firma digital presencial en Concesionario.</span>
                    </li>
                </ul>
            </main>

            <footer className="text-[8pt] text-slate-500 border-t border-slate-200 pt-4 mt-auto">
                <p className="text-center font-bold mb-1 text-xs uppercase tracking-widest">Documento Informativo No Vinculante</p>
                <div className="text-right mt-4 font-bold text-black">1</div>
            </footer>
        </div>
    );
};

export default OfferCoverPage;
