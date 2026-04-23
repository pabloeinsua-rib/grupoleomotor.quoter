import React from 'react';
import { ExternalLinkIcon, WarningIcon } from './Icons.tsx';

const UserCredentials = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
      <div className="bg-white p-8 rounded-2xl shadow-lg mt-10">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column: User Keys Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-500 tracking-wider mb-2">NÚMERO DE INDENTIFICADOR (USUARIO)</h3>
              <p className="text-gray-700">TU NÚMERO DE IDENTIFICADOR ES <strong className="text-[#0085c7]">TU DNI / NIE CON LETRA</strong>, Y ES EL MISMO PARA:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 pl-4 text-gray-600">
                <li>WEB DE OPERACIONES</li>
                <li>APP DE FIRMA DIGITAL</li>
                <li>APP MI GESTOR DE OPERACIONES</li>
                <li>LENDISMART, Donde esté operativo (Solicita el código de Concesionario a tu Gestor)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-500 tracking-wider mb-2">CLAVE DE ACCESO (CONTRASEÑA)</h3>
              <p className="text-gray-700">TU CLAVE DE ACCESO ESTÁ FORMADA POR <strong className="text-[#0085c7]">AL MENOS 6 DÍGITOS</strong> Y ES LA MISMA PARA:</p>
               <ul className="list-disc list-inside space-y-1 mt-2 pl-4 text-gray-600">
                <li>WEB DE OPERACIONES</li>
                <li>APP DE FIRMA DIGITAL</li>
                <li>APP MI GESTOR DE OPERACIONES</li>
                <li>LENDISMART, Donde esté operativo.</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-gray-500 tracking-wider mb-4 text-center">MIS CLAVES DE USUARIO</h3>
                <p className="text-center text-sm mb-4 text-gray-600">AQUÍ PUEDES GUARDAR TUS CLAVES DE USUARIO:</p>
                <div className="space-y-2 text-sm">
                    <div className="border p-2 rounded text-center"><strong>IDENTIFICADOR / USUARIO:</strong> Tu DNI/NIE con Letra Mayúscula</div>
                    <div className="border p-2 rounded text-center"><strong>CLAVE DE ACCESO / CONTRASEÑA:</strong> Clave de 6 o más dígitos</div>
                    <div className="border p-2 rounded text-center"><strong>CÓDIGO DE CONCESIONARIO:</strong> si no lo conoces, contacta con tu gestor</div>
                </div>
            </div>

            <a 
                href="https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-[#00a1e0] text-white font-bold py-4 px-6 rounded-none hover:bg-[#0085c7] transition-colors shadow-lg hover:shadow-xl"
            >
                Ir a la Web de Operaciones <ExternalLinkIcon className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Right Column: Password Recovery */}
          <div className="space-y-6 border-t lg:border-t-0 lg:border-l lg:pl-12 pt-8 lg:pt-0">
            <h3 className="text-lg font-bold text-gray-500 tracking-wider mb-2">HE OLVIDADO MIS CLAVES DE USUARIO</h3>
            <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">1.</span>
                    <span>Entra en la Web de operaciones.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">2.</span>
                    <span>Seleccióna NIF o NIE en <strong>Tipo de Identificador</strong>, según tu DNI.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">3.</span>
                    <span>Introduce tu <strong>Número de identificador</strong> (TU DNI/NIE CON LETRA).</span>
                </li>
            </ul>
            {/* Image removed */}
            
            <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">4.</span>
                    <span>CLICK EN <strong>"Recuperar código secreto"</strong>.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">5.</span>
                    <span>Por <strong>SMS</strong> llega a tu móvil una Clave de Seguridad temporal de 6 dígitos.</span>
                </li>
            </ul>

            <div className="flex items-center gap-4 bg-blue-50 border-l-4 border-[#00a1e0] p-4 rounded-r-lg">
                <WarningIcon className="w-10 h-10 text-[#00a1e0] flex-shrink-0" />
                <p className="font-semibold text-blue-800">SI NO RECIBES SMS CON TU CLAVE TEMPORAL, PONTE EN CONTACTO CON TU GESTOR.</p>
            </div>

             <h4 className="font-bold text-gray-800 pt-4">Crear una nueva contraseña</h4>
             {/* Image removed */}

             <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">6.</span>
                    <span>En el Campo <strong>Clave de Seguridad</strong>, introduce la contraseña que has recibido por <strong>SMS</strong>.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">7.</span>
                    <span>En el campo <strong>Nueva Contraseña</strong>, introduce tu nueva contraseña definitiva de al menos 6 dígitos.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">8.</span>
                    <span>Repite de nuevo tu nueva contraseña en el campo <strong>Repetir Contraseña</strong>.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <span className="font-bold text-[#0085c7]">9.</span>
                    <span>Click en <strong>Confirmar</strong>.</span>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCredentials;