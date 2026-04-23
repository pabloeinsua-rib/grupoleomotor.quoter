import React, { useState, useMemo } from 'react';
import { SearchIcon } from './Icons.tsx';

interface Bank {
  code: string;
  name: string;
}

const allBankData: Bank[] = [
  // Bancos
  { code: '0241', name: 'A&G BANCA PRIVADA, S.A.' },
  { code: '2080', name: 'ABANCA CORPORACION BANCARIA, S.A.' },
  { code: '0011', name: 'ALLFUNDS BANK, S.A.' },
  { code: '1544', name: 'ANDBANK ESPAÑA, S.A.' },
  { code: '0136', name: 'ARESBANK, S.A.' },
  { code: '3183', name: 'ARQUIA BANK, S.A.' },
  { code: '0061', name: 'BANCA MARCH, S.A.' },
  { code: '0078', name: 'BANCA PUEYO, S.A.' },
  { code: '0188', name: 'BANCO ALCALA, S.A.' },
  { code: '0182', name: 'BANCO BILBAO VIZCAYA ARGENTARIA, S.A.' },
  { code: '0234', name: 'BANCO CAMINOS, S.A.' },
  { code: '0225', name: 'BANCO CETELEM, S.A.' },
  { code: '0198', name: 'BANCO COOPERATIVO ESPAÑOL, S.A.' },
  { code: '0091', name: 'BANCO DE ALBACETE, S.A.' },
  { code: '0240', name: 'BANCO DE CREDITO SOCIAL COOPERATIVO, S.A.' },
  { code: '0003', name: 'BANCO DE DEPOSITOS, S.A.' },
  { code: '0081', name: 'BANCO DE SABADELL, S.A.' },
  { code: '0184', name: 'BANCO EUROPEO DE FINANZAS, S.A.' },
  { code: '0113', name: 'BANCO INDUSTRIAL DE BILBAO, S.A.' },
  { code: '0232', name: 'BANCO INVERSIS, S.A.' },
  { code: '0186', name: 'BANCO MEDIOLANUM, S.A.' },
  { code: '0121', name: 'BANCO OCCIDENTAL, S.A.' },
  { code: '0235', name: 'BANCO PICHINCHA ESPAÑA, S.A.' },
  { code: '0049', name: 'BANCO SANTANDER, S.A.' },
  { code: '0125', name: 'BANCOFAR, S.A.' },
  { code: '0219', name: 'BANK OF AFRICA EUROPE, S.A.' },
  { code: '0128', name: 'BANKINTER, S.A.' },
  { code: '0038', name: 'CACEIS BANK SPAIN S.A.' },
  { code: '2100', name: 'CAIXABANK, S.A.' },
  { code: '0237', name: 'CAJASUR BANCO, S.A.' },
  { code: '2000', name: 'CECABANK, S.A.' },
  { code: '0243', name: 'CREDIT SUISSE BANK (EUROPE) S.A.' },
  { code: '0019', name: 'DEUTSCHE BANK, S.A.E.' },
  { code: '0211', name: 'EBN BANCO DE NEGOCIOS, S.A.' },
  { code: '0239', name: 'EVO BANCO S.A.' },
  { code: '2085', name: 'IBERCAJA BANCO, S.A.' },
  { code: '2095', name: 'KUTXABANK, S.A.' },
  { code: '0244', name: 'MIRALTA FINANCE BANK, S.A.' },
  { code: '0133', name: 'NUEVO MICRO BANK, S.A.' },
  { code: '0073', name: 'OPEN BANK, S.A.' },
  { code: '0083', name: 'RENTA 4 BANCO, S.A.' },
  { code: '0242', name: 'SABADELL CONSUMER FINANCE, S.A.' },
  { code: '0224', name: 'SANTANDER CONSUMER FINANCE, S.A.' },
  { code: '0036', name: 'SANTANDER INVESTMENT, S.A.' },
  { code: '1490', name: 'SINGULAR BANK, S.A.' },
  { code: '0216', name: 'TARGOBANK, S.A.' },
  { code: '2103', name: 'UNICAJA BANCO, S.A.' },
  { code: '0200', name: 'WEALTHPRIVAT BANK, S.A.' },
  { code: '0229', name: 'WIZINK BANK, S.A.' },
  // Cajas de Ahorros
  { code: '2045', name: "CAJA DE AHORROS Y M.P. DE ONTINYENT" },
  { code: '2056', name: "COLONYA - CAIXA D'ESTALVIS DE POLLENSA" },
  // Cooperativas de Credito
  { code: '3060', name: 'C.R. BURGOS,FUENTEPELAYO, SEGOVIA Y CASTELLDANS, SCC' },
  { code: '3190', name: 'C.R. DE ALBACETE, CIUDAD REAL Y CUENCA, S.C.C.' },
  { code: '3025', name: 'CAIXA DE C. DELS ENGINYERS-C.C. INGENIEROS, S.C.C' },
  { code: '3159', name: 'CAIXA POPULAR-CAIXA RURAL, S.C.C.V.' },
  { code: '3045', name: 'CAIXA R. ALTEA, C.C.V.' },
  { code: '3162', name: 'CAIXA R. BENICARLO, S.C.C.V.' },
  { code: '3117', name: "CAIXA R. D'ALGEMESI, S.C.V.C." },
  { code: '3105', name: "CAIXA R. DE CALLOSA D'EN SARRIA, C.C.V." },
  { code: '3096', name: "CAIXA R. DE L'ALCUDIA, S.C.V.C." },
  { code: '3123', name: 'CAIXA R. DE TURIS, C.C.V.' },
  { code: '3070', name: 'CAIXA R. GALEGA, S.C.C.L.G.' },
  { code: '3111', name: "CAIXA R. LA VALL 'S. ISIDRO', S.C.C.V." },
  { code: '3102', name: "CAIXA R. S. VICENT FERRER DE LA VALL D'UIXO,C.C.V." },
  { code: '3174', name: 'CAIXA R. VINAROS, S.C.C.V.' },
  { code: '3160', name: 'CAIXA R.S.JOSEP DE VILAVELLA, S.C.C.V.' },
  { code: '3166', name: 'CAIXA RURAL LES COVES DE VINROMA, S.C.C.V.' },
  { code: '3118', name: 'CAIXA RURAL TORRENT C.C.V.' },
  { code: '3184', name: 'CAJA DE CREDITO DE ALCOY, C.C.V. (EN LIQUIDACION)' },
  { code: '3029', name: 'CAJA DE CREDITO DE PETREL, CAJA RURAL, C.C.V.' },
  { code: '3035', name: 'CAJA LABORAL POPULAR COOP. DE CREDITO' },
  { code: '3115', name: "CAJA R. 'NUESTRA MADRE DEL SOL', S.C.A.C." },
  { code: '3089', name: 'CAJA R. BAENA NTRA. SRA. DE GUADALUPE S.C.C.A.' },
  { code: '3110', name: 'CAJA R. CATOLICO AGRARIA, S.C.C.V.' },
  { code: '3005', name: 'CAJA R. CENTRAL, S.C.C.' },
  { code: '3179', name: 'CAJA R. DE ALGINET, S.C.C.V.' },
  { code: '3001', name: 'CAJA R. DE ALMENDRALEJO, S.C.C.' },
  { code: '3059', name: 'CAJA R. DE ASTURIAS, S.C.C.' },
  { code: '3127', name: 'CAJA R. DE CASAS IBAÑEZ, S.C.C.CASTILLA-LA MANCHA' },
  { code: '3104', name: 'CAJA R. DE CAÑETE TORRES NTRA.SRA. CAMPO, S.C.A.' },
  { code: '3121', name: 'CAJA R. DE CHESTE, S.C.C.V.' },
  { code: '3009', name: 'CAJA R. DE EXTREMADURA, S.C.C.' },
  { code: '3007', name: 'CAJA R. DE GIJON, S.C. ASTURIANA DE CREDITO' },
  { code: '3023', name: 'CAJA R. DE GRANADA, S.C.C.' },
  { code: '3140', name: 'CAJA R. DE GUISSONA, S.C.C.' },
  { code: '3067', name: 'CAJA R. DE JAEN, BARCELONA Y MADRID, S.C.C.' },
  { code: '3008', name: 'CAJA R. DE NAVARRA, S.C.C.' },
  { code: '3016', name: 'CAJA R. DE SALAMANCA, S.C.C.' },
  { code: '3017', name: 'CAJA R. DE SORIA, S.C.C.' },
  { code: '3080', name: 'CAJA R. DE TERUEL, S.C.C.' },
  { code: '3020', name: 'CAJA R. DE UTRERA, S.C.A.C.' },
  { code: '3144', name: 'CAJA R. DE VILLAMALEA, S.C.C.A. CASTILLA-LA MANCHA' },
  { code: '3152', name: 'CAJA R. DE VILLAR C.C.V.' },
  { code: '3085', name: 'CAJA R. DE ZAMORA, C.C.' },
  { code: '3187', name: 'CAJA R. DEL SUR, S. COOP. DE CREDITO' },
  { code: '3157', name: 'CAJA R. LA JUNQUERA DE CHILCHES, S.C.C.V.' },
  { code: '3134', name: 'CAJA R. NTRA. SRA. LA ESPERANZA DE ONDA, S.C.C.V.' },
  { code: '3165', name: 'CAJA R. S. ISIDRO DE VILAFAMES, S.C.C.V.' },
  { code: '3119', name: 'CAJA R. S. JAIME ALQUERIAS NIÑO PERDIDO S.C.C.V.' },
  { code: '3113', name: 'CAJA R. S. JOSE DE ALCORA S.C.C.V.' },
  { code: '3130', name: 'CAJA R. S. JOSE DE ALMASSORA, S.C.C.V.' },
  { code: '3112', name: 'CAJA R. S. JOSE DE BURRIANA, S.C.C.V.' },
  { code: '3135', name: 'CAJA R. S. JOSE DE NULES S.C.C.V.' },
  { code: '3095', name: 'CAJA R. S. ROQUE DE ALMENARA S.C.C.V.' },
  { code: '3018', name: 'CAJA R.R.S.AGUSTIN DE FUENTE ALAMO M., S.C.C.' },
  { code: '3150', name: 'CAJA RURAL DE ALBAL COOP. DE CREDITO V.' },
  { code: '3191', name: 'CAJA RURAL DE ARAGON SOC. COOP. DE CREDITO' },
  { code: '3098', name: 'CAJA RURAL DE NUEVA CARTEYA, S.C.A.C.' },
  { code: '3058', name: 'CAJAMAR CAJA RURAL, S.C.C.' },
  { code: '3076', name: 'CAJASIETE, CAJA RURAL, S.C.C.' },
  { code: '3081', name: 'EUROCAJA RURAL, S.C.C.' },
  { code: '3138', name: 'RURALNOSTRA, S.C.C.V.' },
  // Establecimientos Financieros de Credito
  { code: '8211', name: 'BANSABADELL FINANCIACION E.F.C., S.A.' },
  { code: '8235', name: 'BILBAO HIPOTECARIA, S.A., E.F.C.' },
  { code: '4706', name: 'CATERPILLAR FINANCIAL CORP.FINAN., S.A.E.F.C.' },
  { code: '8221', name: 'CORPORACION HIPOTECARIA MUTUAL, S.A., E.F.C.' },
  { code: '8841', name: 'CREDIT AGRICOLE CONSUMER FINANCE SPAIN EFC, S.A.' },
  { code: '8842', name: 'DAIMLER TRUCK FINANCIAL SERVICES ESPAÑA EFC, S.A.' },
  { code: '8826', name: 'DEUTSCHE LEASING IBERICA, E.F.C., S.A.' },
  { code: '8640', name: 'FCA CAPITAL ESPAÑA, E.F.C., S.A.' },
  { code: '8308', name: 'FINANCIERA CARRION, S.A., E.F.C.' },
  { code: '8823', name: 'FINANCIERA ESPAÑOLA DE CREDITO A DISTANCIA, EFC, SA' },
  { code: '4832', name: 'IBERCAJA LEASING Y FINANCIACION, S.A., E.F.C.' },
  { code: '8342', name: 'LUZARO E.F.C., S.A.' },
  { code: '4799', name: 'MERCEDES-BENZ FINANCIAL SERVICES ESPAÑA E.F.C.,S.A' },
  { code: '8838', name: 'PSA FINANCIAL SERVICES SPAIN E.F.C., S.A.' },
  { code: '8906', name: 'SANTANDER FACTORING Y CONFIRMING, S.A., E.F.C.' },
  { code: '4797', name: 'SANTANDER LEASE, S.A. E.F.C.' },
  { code: '8813', name: 'SCANIA FINANCE HISPANIA E.F.C., S.A.' },
  { code: '8833', name: 'SG EQUIPMENT FINANCE IBERIA, E.F.C., S.A.' },
  { code: '8836', name: 'TELEFONICA CONSUMER FINANCE, E.F.C., S.A.' },
  { code: '4784', name: 'TRANSOLVER FINANCE, E.F.C., S.A.' },
  { code: '8596', name: 'UNION CTO. FIN. MOB. INMOB. CREDIFIMO, E.F.C. S.A.' },
  { code: '8512', name: 'UNION DE CREDITOS INMOBILIARIOS, S.A., E.F.C.' },
  { code: '8769', name: 'UNION FINANCIERA ASTURIANA, S.A., E.F.C.' },
  { code: '8806', name: 'VFS FINANCIAL SERVICES SPAIN E.F.C., S.A.' },
  // Entidades de Pago
  { code: '8620', name: 'ABANCA SERVICIOS FINANCIEROS E.F.C., S.A.' },
  { code: '8832', name: 'BANKINTER CONSUMER FINANCE, E.F.C., S.A.' },
  { code: '8776', name: 'CAIXABANK PAYMENTS & CONSUMER, EFC, EP, S.A.' },
  { code: '8805', name: 'FINANCIERA EL CORTE INGLES E.F.C., S.A.' },
  { code: '8839', name: 'GCC CONSUMO, E.F.C., S.A.' },
  { code: '8814', name: 'ONEY SERVICIOS FINANCIEROS E.F.C., S.A.' },
  { code: '8816', name: 'SDAD. CONJUNTA EMISION GESTION MEDIOS PAGO, EFC,SA' },
  { code: '8795', name: 'SERVICIOS FINANCIEROS CARREFOUR, E.F.C., S.A.' },
  { code: '8840', name: 'XFERA CONSUMER FINANCE, EFC, S.A.' }
].sort((a, b) => a.code.localeCompare(b.code));

const BankCodes: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBanks = useMemo(() => {
        if (!searchTerm) {
            return allBankData;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return allBankData.filter(bank =>
            bank.name.toLowerCase().includes(lowercasedFilter) ||
            bank.code.includes(lowercasedFilter)
        );
    }, [searchTerm]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-full flex flex-col">
            <div className="relative mb-4 flex-shrink-0">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-caixa-blue"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr>
                            <th className="p-2 font-semibold text-slate-600">Código</th>
                            <th className="p-2 font-semibold text-slate-600">Nombre de la Entidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBanks.map((bank, index) => (
                            <tr key={index} className="border-b hover:bg-slate-50">
                                <td className="p-2 font-mono text-slate-700">{bank.code}</td>
                                <td className="p-2 text-slate-800">{bank.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBanks.length === 0 && (
                    <div className="text-center p-8 text-gray-500">
                        No se encontraron entidades con ese criterio de búsqueda.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankCodes;
