import React, { useState } from 'react';
import PageHeader from './PageHeader.tsx';
import { FileTextIcon, PrintIcon, EmailIcon } from './Icons.tsx';

export const FichaTramicar = () => {
  const [formData, setFormData] = useState({
    concesionario: 'GRUPO LEOMOTOR',
    codigoConcesionario: '',
    razonSocial: '',
    cif: '',
    domicilio: '',
    personaContacto: '',
    telefono: '',
    email: '',
    tipoOperacion: 'Prestamo Empresa',
    importe: '',
    plazo: '',
    marca: '',
    modelo: '',
    matricula: '',
    esNuevo: 'No'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validar identificador (CIF/NIF)
    const identifier = formData.cif || 'SD';
    const emailTo = 'empresasdoc@caixabankpc.com';
    const subject = encodeURIComponent(`${identifier.trim().toUpperCase()} / Documentación Empresa y PDD`);
    
    const checklist = `
--------------------------------------------------
DOCUMENTACIÓN A ADJUNTAR (Marque lo que envía):

--- EMPRESAS (Sociedades) ---
[ ] Oferta firmada
[ ] DNI / NIE Administrador/es
[ ] IRPF Administrador/es
[ ] CIF Definitivo
[ ] ESCRITURAS (Constitución y Poderes)
[ ] IMPUESTO SOCIEDADES Mod. 200 (Último)
[ ] IVA Mod. 390 (Anual) y Mod. 303 (Trimestrales)
[ ] BALANCE y P y G provisional
[ ] Certificado cuenta bancaria de la sociedad

--- VEHÍCULO ---
[ ] FICHA TÉCNICA y PERMISO DE CIRCULACIÓN (Vehículos matriculados)
[ ] FICHA TÉCNICA ESPAÑOLA (Vehículos de importación)
[ ] FACTURA PROFORMA (Solo para Resicuota o Leasing)
--------------------------------------------------`;

    const pddData = `
--- DATOS DE LA OPERACIÓN (PDD y Contacto) ---
Concesionario: ${formData.concesionario}
Código Concesionario: ${formData.codigoConcesionario}
Razón Social: ${formData.razonSocial}
CIF/NIF: ${formData.cif}
Domicilio: ${formData.domicilio}

Persona de Contacto (Administrador): ${formData.personaContacto}
Teléfono (Móvil): ${formData.telefono}
Email: ${formData.email}

Tipo de Operación: ${formData.tipoOperacion}
Importe a Financiar: ${formData.importe} €
Plazo: ${formData.plazo} meses

Vehículo:
Marca: ${formData.marca}
Modelo: ${formData.modelo}
Matrícula/Bastidor: ${formData.matricula}
Es Nuevo: ${formData.esNuevo}
--------------------------------------------------`;

    const body = encodeURIComponent(
      `Hola,\n\nAdjunto la documentación para la referencia/CIF: ${identifier.trim().toUpperCase()}.\n\n(Este correo incluye los datos de la Ficha Tramicar / PDD):\n\n${pddData}\n\nIMPORTANTE: No olvide adjuntar los siguientes ficheros a este correo antes de enviarlo, enviándolo TODO JUNTO.\n${checklist}\n\nGracias.`
    );

    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <PageHeader 
        title="Ficha Tramicar" 
        description="Cumplimenta esta ficha exclusivamente para operaciones de Empresas y Leasing (Empresas/Autónomos)."
        icon={<FileTextIcon className="w-8 h-8 text-caixa-blue" />}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden gap-4">
            <h2 className="text-xl font-bold text-slate-800">Datos de la Operación y PDD</h2>
            <div className="flex flex-col sm:flex-row gap-2">
                <button 
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-none hover:bg-slate-200 transition-colors border border-slate-300"
                >
                    <PrintIcon className="w-5 h-5" />
                    Imprimir / PDF
                </button>
                <button 
                    onClick={handleEmail}
                    className="flex items-center justify-center gap-2 bg-caixa-blue text-white px-4 py-2 rounded-none hover:bg-blue-900 transition-colors"
                >
                    <EmailIcon className="w-5 h-5" />
                    Crear Email (Empresas)
                </button>
            </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-800 pb-4">
            <h1 className="text-3xl font-bold text-slate-800">FICHA TRAMICAR</h1>
            <p className="text-slate-600 mt-2">Operaciones de Empresa y Leasing</p>
        </div>

        <form className="space-y-8">
          {/* Datos del Concesionario */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Datos del Concesionario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Concesionario</label>
                <input type="text" name="concesionario" value={formData.concesionario} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código Concesionario</label>
                <input type="text" name="codigoConcesionario" value={formData.codigoConcesionario} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
            </div>
          </section>

          {/* Datos del Cliente */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Datos del Cliente (Empresa / Autónomo)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Razón Social / Nombre Completo</label>
                <input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CIF / NIF</label>
                <input type="text" name="cif" value={formData.cif} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Persona de Contacto</label>
                <input type="text" name="personaContacto" value={formData.personaContacto} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Domicilio Social</label>
                <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
            </div>
          </section>

          {/* Datos de la Operación */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Datos de la Operación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Operación</label>
                <select name="tipoOperacion" value={formData.tipoOperacion} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue">
                  <option value="Prestamo Empresa">Préstamo Empresa</option>
                  <option value="Leasing Empresa">Leasing Empresa</option>
                  <option value="Leasing Autonomo">Leasing Autónomo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Importe a Financiar (€)</label>
                <input type="number" name="importe" value={formData.importe} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plazo (meses)</label>
                <input type="number" name="plazo" value={formData.plazo} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
            </div>
          </section>

          {/* Datos del Vehículo */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Datos del Vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matrícula / Bastidor</label>
                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">¿Es Nuevo?</label>
                <select name="esNuevo" value={formData.esNuevo} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-caixa-blue">
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
