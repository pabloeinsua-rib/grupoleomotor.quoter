import React, { useState, useEffect } from "react";
import {
  SpinnerIcon,
  CheckIcon,
  XIcon,
  PhoneIcon,
  MapPinIcon,
  WifiOffIcon,
  FingerprintIcon,
  FaceIdIcon,
} from "./Icons.tsx";

interface LoginProps {
  onLogin: (userId: string, rememberMe: boolean) => void;
}

// --- Helper: Validación Contraseña (DNI o NIE) ---
const isValidPassword = (value: string): boolean => {
  const str = value.replace(/\s/g, "").replace(/-/g, "");
  // DNI: 8 dígitos y 1 letra. NIE: 1 letra (X, Y, Z), 7 dígitos y 1 letra.
  // Relajamos un poco la longitud de dígitos para evitar rechazos (7 u 8)
  return /(^[0-9]{8}[a-zA-Z]$)|(^[a-zA-Z][0-9]{7,8}[a-zA-Z]$)/.test(str);
};

// --- Array de Administradores Responsables (pueden ver ref) ---
export const RESPONSABLES_EMAILS = [
  "daniel@grupoleomotor.net",
  "samueldarrosa@grupoleomotor.net",
  "adriannistal@grupoleomotor.com",
  "nataliapalacio@grupoleomotor.net",
  "salomerodriguez@grupoleomotor.net",
  "jaimesanchez@toyota.grupoleomotor.com",
  "javierivan.rodriguez@asturias.toyota.es",
  "bernabemartin@lexus.grupoleomotor.com",
  "marcosgonzalez@toyota.grupoleomotor.com",
  "aaronisidoro@toyota.grupoleomotor.com",
  "pabloeinsua@gmail.com",
  // Typos comunes
  "adriannistal@grupolemotor.com",
  "daniel@grupolemotor.net",
  "samueldarrosa@grupolemotor.net",
  "nataliapalacio@grupolemotor.net",
  "salomerodriguez@grupolemotor.net",
];

// --- Componente: Wizard Primer Acceso (Mantenido por si se usa en futuro) ---
const OnboardingWizard = ({
  userId,
  onComplete,
}: {
  userId: number;
  onComplete: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mobile: "",
    dealershipName: "",
    dealershipCif: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.surname || !formData.mobile)
        return setError("Todos los campos son obligatorios.");
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.dealershipName || !formData.dealershipCif)
        return setError("Todos los campos son obligatorios.");
      setError("");
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de éxito local para no depender del backend en esta demo
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Bienvenido a Quoter
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Por favor, completa tu perfil para continuar.
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full ${step >= i ? "bg-caixa-blue" : "bg-slate-200"}`}
            ></div>
          ))}
        </div>

        <form
          className="space-y-4"
          onSubmit={
            step === 3
              ? handleSubmit
              : (e) => {
                  e.preventDefault();
                  handleNext();
                }
          }
        >
          {step === 1 && (
            <div className="animate-fade-in-up space-y-4">
              <h3 className="font-bold text-lg">1. Datos Personales</h3>
              <input
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
              <input
                name="surname"
                placeholder="Apellidos"
                value={formData.surname}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
              <input
                name="mobile"
                placeholder="Móvil"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in-up space-y-4">
              <h3 className="font-bold text-lg">2. Datos Concesionario</h3>
              <input
                name="dealershipName"
                placeholder="Nombre Concesionario"
                value={formData.dealershipName}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
              <input
                name="dealershipCif"
                placeholder="CIF Concesionario"
                value={formData.dealershipCif}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-in-up space-y-4">
              <h3 className="font-bold text-lg">3. Seguridad</h3>
              <input
                name="newPassword"
                type="password"
                placeholder="Nueva Contraseña (mín 6 caracteres)"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
                minLength={6}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repetir Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full glass-btn rounded-none py-3 rounded-none font-bold text-white text-lg shadow-lg mt-6"
          >
            {isSubmitting ? (
              <SpinnerIcon className="w-6 h-6 animate-spin mx-auto" />
            ) : step === 3 ? (
              "Finalizar Registro"
            ) : (
              "Siguiente"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Componente Principal: Login ---
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Ahora actúa como DNI/NIE
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "connected" | "dev" | "disconnected"
  >("disconnected");

  const [emailStatusDetail, setEmailStatusDetail] = useState("");
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detect PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsPWA(!!isStandalone);

    // Auto-fill if remembered
    const savedEmail = localStorage.getItem("remembered_email");
    const savedPass = localStorage.getItem("remembered_password");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPass) {
      setPassword(savedPass);
    }
  }, []);

  const handleBiometricAuth = async () => {
    if (!window.PublicKeyCredential) {
      setErrorMessage("Tu dispositivo no soporta autenticación biométrica web.");
      setIsError(true);
      return;
    }

    try {
      // Mock logic for demo purposes as real WebAuthn requires server registration
      // In a real app, this would use navigator.credentials.get()
      console.log("Iniciando autenticación biométrica...");
      setIsLoading(true);
      
      // Simulate biometric success if we have saved credentials
      const savedEmail = localStorage.getItem("remembered_email");
      const savedPass = localStorage.getItem("remembered_password");

      if (savedEmail && savedPass) {
        // Wait for user to bypass system biometric prompt (simulated)
        setTimeout(() => {
          setEmail(savedEmail);
          setPassword(savedPass);
          // Auto-trigger login
          const mockEvent = { suppressVibrate: true } as any;
          performLogin(savedEmail, savedPass, true, mockEvent);
        }, 1500);
      } else {
        setIsLoading(false);
        setErrorMessage("Primero debes iniciar sesión convencionalmente marcando 'Recordar usuario' para habilitar la firma biométrica.");
        setIsError(true);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Biometric error:", err);
      setErrorMessage("Error en la autenticación biométrica.");
      setIsError(true);
    }
  };

  const performLogin = async (emailInput: string, passwordInput: string, isRemembering: boolean, e?: React.FormEvent) => {
    if (e && !(e as any).suppressVibrate && window.navigator && window.navigator.vibrate)
      window.navigator.vibrate(50);

    const emailLower = emailInput.trim().toLowerCase();
    const passTrim = passwordInput.trim();

    // 1. ADMIN - Requiere contraseña 999999
    if (emailLower === "quoter.cpc@gmail.com") {
      if (passTrim === "999999") {
        finalizeLogin(emailLower, isRemembering, passTrim);
        return;
      } else {
        throw new Error("Contraseña de administrador incorrecta.");
      }
    }

    // 2. TRAMICAR - Requiere contraseña tramicar
    if (emailLower === "tramicar") {
      if (passTrim.toLowerCase() === "tramicar") {
        finalizeLogin("tramicar", isRemembering, passTrim);
        return;
      } else {
        throw new Error("Contraseña incorrecta para Tramicar.");
      }
    }

    // 3. USUARIOS GENERALES
    if (emailLower.length > 0) {
      const validSuffixes = [".grupoleomotor.com", ".grupoleomotor.net", "@grupoleomotor.com", "@grupoleomotor.net", "@caixabankpc.com", ".grupolemotor.com", ".grupolemotor.net", "@grupolemotor.com", "@grupolemotor.net"];
      const hasValidSuffix = validSuffixes.some(suffix => emailLower.endsWith(suffix));
      const isAllowedAdmin = emailLower === "pabloeinsua@gmail.com";
      const isResponsable = RESPONSABLES_EMAILS.includes(emailLower);

      if (!hasValidSuffix && !isAllowedAdmin && !isResponsable) {
        throw new Error("El correo no tiene permisos para acceder.");
      }

      if (isAllowedAdmin && passTrim === "999999") {
        finalizeLogin(emailLower, isRemembering, passTrim);
        return;
      }

      if (isValidPassword(passTrim)) {
        finalizeLogin(emailLower, isRemembering, passTrim);
        return;
      } else {
        throw new Error("La contraseña debe ser tu DNI o NIE (ej. 12345678A).");
      }
    }
    throw new Error("Credenciales incorrectas");
  };

  const finalizeLogin = (userId: string, isRemembering: boolean, pass: string) => {
    if (isRemembering) {
      localStorage.setItem("remembered_email", email);
      localStorage.setItem("remembered_password", pass);
    } else {
      localStorage.removeItem("remembered_email");
      localStorage.removeItem("remembered_password");
    }
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userId, isRemembering);
    }, 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      await performLogin(email, password, rememberMe, e);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 overflow-hidden">
      <style>{`
        @keyframes single-bounce-error { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-error { animation: single-bounce-error 0.2s ease-in-out 3; }
        @keyframes glow-red {
            0%, 100% { box-shadow: 0 0 15px rgba(239,68,68,0.5); border-color: rgba(239,68,68,0.8); }
            50% { box-shadow: 0 0 5px rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.4); }
        }
        .animate-glow-red {
            animation: glow-red 0.8s ease-in-out infinite;
        }
        @keyframes gradient-border {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .fancy-border-card {
            background: linear-gradient(90deg, #00a1e0, #00ff88, #4f46e5, #ec4899, #00a1e0);
            background-size: 300% 300%;
            animation: gradient-border 6s ease infinite;
            padding: 1.2px;
            box-shadow: 
                0 0 15px rgba(0, 161, 224, 0.3),
                0 4px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center px-4 md:px-8">
        {/* Empty left space for desktop to keep center column centered */}
        <div className="hidden md:block"></div>

        {/* Login Card (Center) */}
        <div className="w-full max-w-sm flex-shrink-0 md:col-start-2">
          <div
            className={`bg-white p-8 sm:p-10 rounded-none relative overflow-hidden transition-all duration-300 ${isError ? "border border-red-500 animate-glow-red" : "border border-caixa-blue/50 shadow-[0_0_15px_rgba(0,161,224,0.3)]"}`}
          >
            <div className="text-center mb-10 flex flex-col items-center justify-center select-none notranslate">
              <span className="font-montserrat font-light text-4xl text-black leading-none tracking-normal mb-2">
                QUOTER
              </span>
              <span className="font-montserrat font-medium text-[11px] tracking-[0.45em] text-[#8ea7c5] uppercase leading-none ml-[0.45em]">
                AUTOMOTIVE
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
                >
                  Email Corporativo
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-0 py-2 border-b border-slate-200 bg-transparent focus:outline-none focus:border-black text-sm transition-colors placeholder-slate-300"
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div className="animate-fade-in-up transition-opacity duration-300">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
                >
                  DNI / NIE
                </label>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  className="block w-full px-0 py-2 border-b border-slate-200 bg-transparent focus:outline-none focus:border-black text-sm uppercase transition-colors placeholder-slate-300"
                  placeholder="12345678A"
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-pulse">
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="flex items-center pt-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-slate-300 rounded accent-black"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-500"
                >
                  Recordar usuario
                </label>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full flex justify-center items-center rounded-none bg-black py-4 px-4 text-xs font-bold text-white uppercase tracking-widest hover:bg-slate-800 focus:outline-none transition-colors
                    ${isLoading ? "opacity-80 cursor-default" : "cursor-pointer"}
                    ${isError ? "animate-bounce-error" : ""}
                `}
                >
                  {isLoading ? (
                    <SpinnerIcon className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    "Entrar"
                  )}
                </button>

                {isPWA && (
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 rounded-none bg-white border border-black py-4 px-4 text-[10px] font-bold text-black uppercase tracking-widest hover:bg-slate-50 focus:outline-none transition-colors"
                  >
                    <FingerprintIcon className="w-5 h-5" />
                    <FaceIdIcon className="w-5 h-5" />
                    <span>Firma Biométrica</span>
                  </button>
                )}
              </div>
            </form>

            <div className="text-center mt-10 pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-light">
                &copy; 2026 Quoter Automotive
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-[10px] text-slate-400 font-light">
                  Grupo Leomotor
                </p>
                <div
                  className={`w-2 h-2 rounded-full ${
                    emailStatus === "connected" || emailStatus === "dev"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                  title={`Estado de Email: ${emailStatus === "connected" || emailStatus === "dev" ? "Conectado a Brevo" : "Desconectado"}. ${emailStatusDetail}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card (Right) */}
        <div
          className="hidden md:flex w-full max-w-[220px] flex-shrink-0 animate-fade-in-up md:mt-0 md:col-start-3 justify-self-center md:justify-self-center lg:justify-self-center xl:justify-self-center"
          style={{ animationDelay: "200ms" }}
        >
          <div className="fancy-border-card rounded-none shadow-lg">
            <div className="bg-white p-5 sm:p-6 rounded-none flex flex-col items-center text-center">
              <h3 className="font-montserrat font-bold text-sm text-black mb-1.5 leading-tight uppercase tracking-wide">
                Lleva Quoter
                <br />
                contigo
              </h3>
              <p className="text-[10px] text-slate-500 mb-5 max-w-[160px] leading-relaxed">
                Descarga la APP a tu Smartphone con este QR.
              </p>

              <div className="bg-white p-2 border border-slate-300 shadow-sm rounded-none mb-3">
                <img
                  src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/QR%20PARA%20ACUERDOS/qr-codeQUOTERGRUPOLEOMOTOR.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL1FSIFBBUkEgQUNVRVJET1MvcXItY29kZVFVT1RFUkdSVVBPTEVPTU9UT1IucG5nIiwiaWF0IjoxNzc2OTQwODU3LCJleHAiOjI2NDA4NTQ0NTd9.u31X3ZbkOqwi8LyA3mJ6tZuCnnnipGMIN8V2S4lJ7I4"
                  alt="QR Descarga App"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              </div>

              <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">
                Grupo Leomotor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
