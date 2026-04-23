
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, SavedOfferData } from '../App.tsx';
import { XIcon, WarningIcon, InfoIcon, SearchIcon, ArrowUturnLeftIcon, EditIcon } from './Icons.tsx';
import { licensePlateData } from '../data/licensePlates.ts';
// FIX: Imported the missing OfferDetailsData type.
import type { OfferDetailsData } from './OfferDetails.tsx';

interface WorkflowSimulatorProps {
  onOfferSaved: (data: SavedOfferData) => void;
  initialState?: SavedOfferData | null;
}

const ToggleButton: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full px-5 py-3 text-xs uppercase tracking-widest font-bold rounded-lg border transition-all duration-300 ease-in-out ${
        selected
            ? 'bg-black text-white border-black'
            : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'
        }`}
    >
        {label}
    </button>
);

const InsuranceCard = ({ label, sublabel, selected, onClick, onInfoClick }: { label: string, sublabel: string, selected: boolean, onClick: () => void, onInfoClick: () => void }) => (
    <div className={`flex items-stretch gap-2 rounded-lg border transition-all duration-300 ease-in-out ${
        selected
            ? 'bg-black border-black'
            : 'bg-white border-slate-200 hover:border-black'
    }`}>
        <button
            type="button"
            onClick={onClick}
            className={`flex-grow p-4 text-left rounded-l-lg transition-colors ${
                selected ? 'text-white' : 'text-black'
            }`}
        >
            <p className="font-bold text-xs uppercase tracking-widest">{label}</p>
            <p className={`text-xs mt-1 ${selected ? 'text-slate-300' : 'text-slate-500'}`}>{sublabel}</p>
        </button>
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
            }}
            aria-label={`Más información sobre ${label}`}
            className={`flex-shrink-0 w-16 flex items-center justify-center rounded-r-lg transition-colors border-l border-slate-200 ${
                selected ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-white hover:bg-slate-50'
            }`}
        >
            <span className={`font-bold text-sm ${selected ? 'text-white' : 'text-black'}`}>+info</span>
        </button>
    </div>
);


const WorkflowSimulator: React.FC<WorkflowSimulatorProps> = ({ onOfferSaved, initialState: initialOfferState }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const minAllowedYear = currentYear - 15;

    const initialState = {
        productType: null, vehicleType: null, clientType: null, vehicleUse: 'Turismo',
        registrationTax: 0, openingFeePaymentType: 'Financiados', insuranceType: 'Vida + Desempleo / IT',
        licensePlate: '', registrationYear: currentYear, registrationMonth: currentMonth,
        foundPlateDate: null, salePrice: 30000, downPayment: 0, term: 84, finalValuePercentage: 20,
        interestRate: 9.99, monthlyPayment: null, valorResidual: null, openingFeeValue: 0, tae: null,
        // New fields for Leasing logic
        registrationTaxRate: 0, // 0, 4.75, 9.75, 14.75
        financeRegistrationTax: true,
        error: null,
    };
    
    const [state, setState] = useState(initialOfferState ? { ...initialState, ...initialOfferState } : initialState);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Local state for manual input fields to prevent slider conflicts
    const [yearInputValue, setYearInputValue] = useState(String(state.registrationYear));
    const [monthInputValue, setMonthInputValue] = useState(String(state.registrationMonth));
    const [termInputValue, setTermInputValue] = useState(String(state.term));

    const [openingFeePercentage, setOpeningFeePercentage] = useState(3.99);
    const [showOpeningFeeSlider, setShowOpeningFeeSlider] = useState(false);

    const updateState = (update: Partial<typeof initialState>) => {
        const newState = { ...state, ...update };
        setState(newState);
    };

    const {
        productType, vehicleType, clientType, vehicleUse, registrationTax, openingFeePaymentType, insuranceType,
        licensePlate, registrationYear, registrationMonth, foundPlateDate, salePrice, downPayment, term,
        finalValuePercentage, interestRate, monthlyPayment, valorResidual, openingFeeValue, tae, error,
        registrationTaxRate, financeRegistrationTax
    } = state;

     // Sync local input state when main state changes
    useEffect(() => setYearInputValue(String(registrationYear)), [registrationYear]);
    useEffect(() => setMonthInputValue(String(registrationMonth)), [registrationMonth]);
    useEffect(() => setTermInputValue(String(term)), [term]);
    
    // UI Modals
    const [interestRateLimits, setInterestRateLimits] = useState({ min: 5.99, max: 10.99, step: 0.50 });
    const [termLimits, setTermLimits] = useState({ min: 12, max: 120 });
    const [downPaymentLimits, setDownPaymentLimits] = useState({ min: 0, max: 30000 });
    const [registrationYearMin, setRegistrationYearMin] = useState(2000);
    const [showNotFinanciableModal, setShowNotFinanciableModal] = useState(false);
    const [showAgeExceededModal, setShowAgeExceededModal] = useState(false);
    const [insuranceModal, setInsuranceModal] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const [showVidaSeniorModal, setShowVidaSeniorModal] = useState(false);
    const [showNoInsuranceWarningModal, setShowNoInsuranceWarningModal] = useState(false);
    
    const isLeasing = productType === 'Leasing';
    const isCuotaSolucion = productType === 'Resicuota';
    const isInsuranceAvailable = !isLeasing && clientType !== 'Sociedades';

    // Calculate max term based on vehicle age - Updated Logic
    const vehicleAgeInfo = useMemo(() => {
        // --- NUEVO ---
        if (vehicleType !== 'Matriculado') {
            if (productType === 'Leasing') {
                if (clientType === 'Autónomos') return { maxTerm: 72, ageText: 'Nuevo', isFinanciable: true, message: '' };
                if (clientType === 'Sociedades') return { maxTerm: 84, ageText: 'Nuevo', isFinanciable: true, message: '' };
                return { maxTerm: 0, ageText: 'Nuevo', isFinanciable: false, message: 'Leasing no disponible para Asalariados' };
            }
            // Financiación Lineal & Cuota Solución (Nuevo)
            if (productType === 'Financiación Lineal') {
                 if (clientType === 'Sociedades') return { maxTerm: 84, ageText: 'Nuevo', isFinanciable: true, message: '' };
                 if (clientType === 'Autónomos') return { maxTerm: 120, ageText: 'Nuevo', isFinanciable: true, message: '' };
            }
            // Default for Particulares or Cuota Solución
            return { maxTerm: 120, ageText: 'Nuevo', isFinanciable: true, message: '' };
        }

        // --- MATRICULADO ---
        const ageMonths = (currentYear - registrationYear) * 12 + (currentMonth - registrationMonth);
        const ageYears = Math.floor(ageMonths / 12);
        const remainingMonths = ageMonths % 12;
        const ageText = `${ageYears} años y ${remainingMonths} meses`;

        let maxTerm = 120;
        let isFinanciable = true;
        let message = '';

        // 1. LEASING (Matriculado)
        if (productType === 'Leasing') {
            if (clientType === 'Asalariados') {
                return { maxTerm: 0, ageText, isFinanciable: false, message: "Leasing no disponible para Asalariados" };
            }
            
            const isIndustrial = vehicleUse === 'Industrial';
            
            if (isIndustrial) {
                // INDUSTRIAL
                if (ageMonths > 36) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE ( > 36 Meses para Leasing Industrial)";
                    maxTerm = 0;
                } else {
                    if (ageMonths > 24) {
                        maxTerm = 48;
                    } else {
                        // Age <= 24
                        maxTerm = clientType === 'Sociedades' ? 72 : 60;
                    }
                }
            } else {
                // TURISMO
                if (ageMonths > 48) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE ( > 48 Meses para Leasing Turismo)";
                    maxTerm = 0;
                } else {
                    if (ageMonths > 36) {
                        maxTerm = 60;
                    } else {
                        // Age <= 36
                        maxTerm = clientType === 'Sociedades' ? 84 : 72;
                    }
                }
            }
        } 
        // 2. FINANCIACIÓN LINEAL (Matriculado)
        else if (productType === 'Financiación Lineal') {
             if (clientType === 'Sociedades') {
                const isIndustrial = vehicleUse === 'Industrial';
                const maxAge = isIndustrial ? 36 : 48;
                const maxTotalLife = isIndustrial ? 72 : 96;

                if (ageMonths > maxAge) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE (EXCEDE LA ANTIGUEDAD MÁXIMA NORMATIVA)";
                    maxTerm = 0;
                } else {
                    maxTerm = maxTotalLife - ageMonths;
                }
             } else {
                 // Particulares / Autónomos
                 if (ageMonths > 96) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE (EXCEDE LA ANTIGUEDAD MÁXIMA NORMATIVA)";
                    maxTerm = 0;
                } else if (ageMonths >= 85) maxTerm = 60;
                else if (ageMonths >= 73) maxTerm = 72;
                else if (ageMonths >= 61) maxTerm = 84;
                else if (ageMonths >= 49) maxTerm = 96;
                else if (ageMonths >= 37) maxTerm = 108;
                else maxTerm = 120;
             }
        }

        return { maxTerm, ageText, isFinanciable, message };
    }, [vehicleType, registrationYear, registrationMonth, currentYear, currentMonth, productType, clientType, vehicleUse]);

    // Update term if it exceeds new max
    useEffect(() => {
        if (vehicleAgeInfo.isFinanciable && term > vehicleAgeInfo.maxTerm) {
            setTerm(vehicleAgeInfo.maxTerm);
        }
    }, [vehicleAgeInfo.maxTerm, term, vehicleAgeInfo.isFinanciable]);

    const handleBack = () => {
        if (currentStep > 0) {
            // Logic to skip steps if necessary based on vehicle type
            if (currentStep === 4 && vehicleType === 'Nuevo') {
                setCurrentStep(2); // Skip Step 3 (Matricula) if New
            } else {
                setCurrentStep(prev => prev - 1);
            }
        }
    };

    const handleNext = () => {
        // If on step 2 (vehicle type) and selected 'Nuevo', skip to step 4 (Financials)
        // But if 'Matriculado', go to step 3 (Age selection)
        
        if (currentStep === 2 && vehicleType === 'Nuevo' && productType !== 'Leasing') {
            setCurrentStep(4);
        } else if (currentStep < 6) { // Max 6 steps
            // Check if vehicle is financiabe before proceeding from step 3
            if (currentStep === 3 && !vehicleAgeInfo.isFinanciable) {
                setShowNotFinanciableModal(true);
                return;
            }
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSaveAndContinue = () => {
        if (!productType || !clientType || !vehicleType || !offerData || monthlyPayment === null) {
            updateState({ error: "Faltan datos clave para poder guardar la oferta." });
            return;
        }

        setShowSuccess(true);

        setTimeout(() => {
            let vehicleCategory = '';
            if (vehicleType === 'Nuevo') {
                vehicleCategory = vehicleUse === 'Industrial' ? '[Nuevo] Furgoneta' : '[Nuevo] Turismo';
            } else { // Matriculado
                const vehicleAgeMonths = (new Date().getFullYear() - registrationYear) * 12 + (new Date().getMonth() + 1 - registrationMonth);
                const useType = vehicleUse === 'Industrial' ? 'Furgoneta' : 'Turismo';
                if (vehicleAgeMonths <= 36) {
                    vehicleCategory = `Seminuevo ${useType}`;
                } else if (vehicleAgeMonths <= 60) {
                    vehicleCategory = `Ocasión 36-60 Meses ${useType}`;
                } else {
                    vehicleCategory = `Ocasión >60 Meses ${useType}`;
                }
            }
            
            if (valorResidual) { // REFI logic
                vehicleCategory = "Refinanciacion Valor Final";
            }
    
            const dataToSave: SavedOfferData = {
                productType,
                clientType,
                vehicleCategory,
                vehicleUse,
                registrationDate: vehicleType === 'Matriculado' ? `${String(registrationMonth).padStart(2, '0')}/${registrationYear}` : undefined,
                salePrice,
                downPayment,
                amountToFinance: offerData.importeAFinanciar,
                term,
                interestRate,
                insuranceType,
                monthlyPayment,
                tae,
                openingFeeValue,
                openingFeeType: isLeasing ? openingFeePaymentType : 'Financiados'
            };
    
            onOfferSaved(dataToSave);
        }, 1500);
    };
    
    const setProductType = (value: string | null) => { 
        updateState({ productType: value }); 
        if (value === 'Leasing') {
            if (clientType === 'Asalariados') updateState({ clientType: null });
            setOpeningFeePercentage(2.00);
            updateState({ insuranceType: 'Sin Protección' });
        } else {
            setOpeningFeePercentage(3.99);
        }
        handleNext(); 
    };
    const setClientType = (value: string | null) => { updateState({ clientType: value }); handleNext(); };
    
    const setVehicleType = (value: string | null) => { 
        updateState({ vehicleType: value });
        // If Leasing, force showing Vehicle Use selection, do not auto-advance if Leasing
        if (productType !== 'Leasing') {
             handleNext(); 
        }
    };
    const setVehicleUse = (value: string | null) => {
        updateState({ vehicleUse: value });
        handleNext();
    };
    
    const setLicensePlate = (value: string) => updateState({ licensePlate: value });
    const setRegistrationYear = (value: number) => updateState({ registrationYear: value });
    const setRegistrationMonth = (value: number) => updateState({ registrationMonth: value });
    const setFoundPlateDate = (value: string | null) => updateState({ foundPlateDate: value });
    const setSalePrice = (value: number) => updateState({ salePrice: value });
    const setDownPayment = (value: number) => updateState({ downPayment: value });
    const setTerm = (value: number) => updateState({ term: value });
    const setFinalValuePercentage = (value: number) => updateState({ finalValuePercentage: value });
    const setInterestRate = (value: number) => updateState({ interestRate: value });
    const setInsuranceType = (value: string) => updateState({ insuranceType: value });

     useEffect(() => {
        if (!isInsuranceAvailable) {
            setInsuranceType('Sin Protección');
        } else if ((clientType === 'Asalariados' || clientType === 'Autónomos') && productType !== 'Leasing') {
            // Default insurance for Particulares/Autonomos
            setInsuranceType('Vida + Desempleo / IT');
        }
    }, [isInsuranceAvailable, clientType, productType]);

    useEffect(() => {
        if (isLeasing) {
            if (interestRate < 5.99 || interestRate > 9.99) updateState({ interestRate: 5.99 });
            setInterestRateLimits({ min: 5.99, max: 9.99, step: 0.50 });
        } else if (isCuotaSolucion) {
             if (![7.49, 8.49, 9.49].includes(interestRate)) {
                updateState({ interestRate: 7.49 });
            }
            setOpeningFeePercentage(3.99);
        } else { // Financiación Lineal
            if (interestRate < 5.99 || interestRate > 10.99) updateState({ interestRate: 9.99 });
            setInterestRateLimits({ min: 5.99, max: 10.99, step: 0.50 });
            setOpeningFeePercentage(3.99);
        }
    }, [isLeasing, isCuotaSolucion]);

    // Defaults when switching products
    const prevProductTypeRef = useRef(productType);
    useEffect(() => {
        if (prevProductTypeRef.current !== productType) {
            if (productType === 'Financiación Lineal') {
                updateState({ downPayment: 0, term: 84 });
            } else if (productType === 'Resicuota') {
                const defaultDown = salePrice * 0.10;
                updateState({ downPayment: defaultDown });
                if (![24, 36, 48, 60].includes(term)) {
                    updateState({ term: 36 });
                }
            } else if (productType === 'Leasing') {
                updateState({ term: 60, downPayment: 0 });
            }
            prevProductTypeRef.current = productType;
        }
    }, [productType, salePrice]);
    
    // Limit Enforcement
    useEffect(() => {
        let newMin = 0;
        let newMax = salePrice;
        if (isLeasing) {
            newMax = salePrice * 0.30; 
        } else if (isCuotaSolucion) {
            newMin = salePrice * 0.10; 
            newMax = salePrice * 0.5; 
        } else {
            newMax = salePrice * 0.8; 
        }
        setDownPaymentLimits({ min: newMin, max: newMax });

        if (downPayment > newMax) updateState({downPayment: newMax});
        if (downPayment < newMin) updateState({downPayment: newMin});

    }, [isLeasing, isCuotaSolucion, salePrice, downPayment]);
    
    useEffect(() => {
        if (isCuotaSolucion) {
            switch (term) {
                case 24: setFinalValuePercentage(55); break;
                case 36: setFinalValuePercentage(50); break;
                case 48: setFinalValuePercentage(45); break;
                case 60: setFinalValuePercentage(38); break;
                default: break;
            }
        }
    }, [isCuotaSolucion, term]);
    
    const [offerData, setOfferData] = useState<OfferDetailsData | null>(null);

    useEffect(() => {
        // More stable Bisection method for calculating IRR
        const calculateTae = (pv: number, pmt: number, nper: number): number => {
            if (pv <= 0 || pmt <= 0 || nper <= 0 || pmt * nper <= pv) {
                return 0.0;
            }

            let low = 0.0;
            let high = 1.0; 
            let mid = 0.0;
            const tolerance = 1.0e-7;

            for (let i = 0; i < 100; i++) { 
                mid = (low + high) / 2;
                if (mid <= 0) mid = tolerance;

                const presentValue = pmt * (1 - Math.pow(1 + mid, -nper)) / mid;

                if (Math.abs(presentValue - pv) < tolerance) {
                    const annualRate = Math.pow(1 + mid, 12) - 1;
                    return parseFloat((annualRate * 100).toFixed(2));
                }

                if (presentValue > pv) {
                    low = mid;
                } else {
                    high = mid;
                }
            }
            return 0;
        };

        const calculateOffer = () => {
             const principal = salePrice - downPayment;
            if (principal <= 0 || term === 0) {
                updateState({ monthlyPayment: 0, tae: 0, valorResidual: null, openingFeeValue: 0 });
                setOfferData(null);
                return;
            }
            
            const monthlyRate = interestRate / 100 / 12;
            const calculatedOpeningFeeValue = principal * (openingFeePercentage / 100);
            
            let pmt = 0;
            let pmtCalculationAmount = 0;
            let pvForTae = 0; 
            let finalValue = 0;
            let finalPmt = 0;
            let calculatedOpeningFeeValueFinal = calculatedOpeningFeeValue;

            if (isLeasing) {
                const baseImponible = salePrice;
                // Entrada for leasing is usually IVA included in user input logic, so we need net for calc
                const entradaNet = downPayment / 1.21;
                
                let principalNet = baseImponible - entradaNet; 
                
                // Add Registration Tax if applicable
                if (vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && financeRegistrationTax && registrationTaxRate > 0) {
                    const regTaxAmount = baseImponible * (registrationTaxRate / 100);
                    principalNet += regTaxAmount;
                }

                calculatedOpeningFeeValueFinal = principalNet * (openingFeePercentage / 100);
                const financedAmountNet = principalNet + calculatedOpeningFeeValueFinal;
                
                // Formula for Leasing (Prepayable Annuity / Payment in Advance)
                // PMT = (PV * r) / (1 - (1+r)^-n) / (1+r)
                // Where n = term (installments) + 1 (residual)
                if (financedAmountNet > 0 && term > 0) {
                    const n = term + 1;
                    const numerator = financedAmountNet * monthlyRate;
                    const denominator = (1 - Math.pow(1 + monthlyRate, -n)) * (1 + monthlyRate);
                    const netPmt = numerator / denominator;
                    finalPmt = netPmt * 1.21; 
                    
                    // TAE Estimation for Prepayable:
                    // Flows: Inflow = PrincipalNet (Without Fee, since fee is a cost).
                    // Outflows: term+1 payments of FinalPmt/1.21 (Net). First at t=0.
                    // This approximates TAE.
                    pvForTae = principalNet;
                }
            } else if (isCuotaSolucion) {
                calculatedOpeningFeeValueFinal = principal * (openingFeePercentage / 100);
                finalValue = salePrice * (finalValuePercentage / 100);
                const capitalToAmortize = salePrice - downPayment - finalValue;
                pmtCalculationAmount = capitalToAmortize + calculatedOpeningFeeValueFinal;
                pvForTae = capitalToAmortize;

                if(pmtCalculationAmount > 0) {
                    const numerator = pmtCalculationAmount * monthlyRate;
                    const denominator = 1 - Math.pow(1 + monthlyRate, -term);
                    const amortizationPmt = numerator / denominator;
                    const interestOnBalloon = finalValue * monthlyRate;
                    pmt = amortizationPmt + interestOnBalloon;
                }
                const finalPmtWithoutInsurance = pmt > 0 ? (Math.ceil(pmt * 100) / 100) - 0.01 : 0;
                let insuranceCostPerMonth = 0;
                if (isInsuranceAvailable && insuranceType !== 'Sin Protección') {
                    const amountForInsuranceCalc = principal;
                    const thousandsFinanced = amountForInsuranceCalc / 1000;
                    switch (insuranceType) {
                        case 'Vida + Desempleo / IT': insuranceCostPerMonth = thousandsFinanced * 1.49; break;
                        case 'Vida': insuranceCostPerMonth = thousandsFinanced * 1.20; break;
                        case 'Vida Senior': insuranceCostPerMonth = thousandsFinanced * 1.40; break;
                    }
                }
                finalPmt = finalPmtWithoutInsurance + insuranceCostPerMonth;
            } else { // Financiación Lineal
                calculatedOpeningFeeValueFinal = principal * (openingFeePercentage / 100);
                pvForTae = principal;
                pmtCalculationAmount = principal + calculatedOpeningFeeValueFinal;
                if(pmtCalculationAmount > 0) {
                    const numerator = pmtCalculationAmount * monthlyRate;
                    const denominator = 1 - Math.pow(1 + monthlyRate, -term);
                    pmt = numerator / denominator;
                }
                const finalPmtWithoutInsurance = pmt > 0 ? (Math.ceil(pmt * 100) / 100) - 0.01 : 0;
                let insuranceCostPerMonth = 0;
                if (isInsuranceAvailable && insuranceType !== 'Sin Protección') {
                    const amountForInsuranceCalc = principal;
                    const thousandsFinanced = amountForInsuranceCalc / 1000;
                    switch (insuranceType) {
                        case 'Vida + Desempleo / IT': insuranceCostPerMonth = thousandsFinanced * 1.49; break;
                        case 'Vida': insuranceCostPerMonth = thousandsFinanced * 1.20; break;
                        case 'Vida Senior': insuranceCostPerMonth = thousandsFinanced * 1.40; break;
                    }
                }
                finalPmt = finalPmtWithoutInsurance + insuranceCostPerMonth;
            }

            // Calculate TAE
            // For Leasing: PV = Net Principal. PMT = Net Payment. N = Term + 1. Type = 1 (Advance).
            // For Linear: PV = Principal. PMT = Final Payment. N = Term. Type = 0 (Arrears).
            
            // Note: calculateTae helper function assumes Type 0 (Arrears).
            // We need to adjust inputs or function for Leasing (Type 1).
            // Approximation: If Type 1, effective N is roughly N-1 for discounting?
            // Actually, for Type 1: PV = PMT + PMT * (1-(1+r)^-(n-1))/r.
            // Let's use the provided calculateTae but adjust PV for first payment if leasing.
            
            let estimatedTae = 0;
            if (isLeasing) {
                 const netPmt = finalPmt / 1.21;
                 const n = term + 1;
                 // IRR for: -PV, +PMT, +PMT... (n times).
                 // Equivalent to: - (PV - PMT), +PMT ... (n-1 times).
                 // So use calculateTae with PV' = PV - PMT, and n' = n - 1.
                 if (pvForTae > netPmt) {
                    estimatedTae = calculateTae(pvForTae - netPmt, netPmt, n - 1);
                 }
            } else {
                 estimatedTae = calculateTae(pvForTae, finalPmt, term);
            }
            
            let importeAFinanciar, importeTotalCredito, totalIntereses, importeTotalAdeudado, costeTotalCredito, precioTotalAPlazos;
            
            if (isLeasing) {
                let baseToFinance = salePrice - (downPayment / 1.21); // Net Principal Basis
                if (vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && financeRegistrationTax && registrationTaxRate > 0) {
                    baseToFinance += salePrice * (registrationTaxRate / 100);
                }
                importeAFinanciar = baseToFinance;
                
                // Leasing cost structure
                // Total Financed = Principal + Fee
                const netPmt = finalPmt / 1.21;
                const n = term + 1;
                importeTotalCredito = importeAFinanciar + calculatedOpeningFeeValueFinal;
                importeTotalAdeudado = finalPmt * term; // Client pays Term installments + Residual (usually equal to installment). 
                // Wait, client pays "term" installments + "1" residual. Total n=term+1 payments.
                // In Simulator, 'term' is usually 60 months. So 60 payments + 1 residual? 
                // Standard Leasing offer says "Plazo 84". It usually implies 83 + 1 or 84 + 1. 
                // The math above assumed n = term + 1 (e.g. 85).
                importeTotalAdeudado = finalPmt * (term + 1);
                
                // Interests = Total Net Payments - Total Financed Net
                totalIntereses = (netPmt * (term + 1)) - importeTotalCredito;
                costeTotalCredito = totalIntereses + calculatedOpeningFeeValueFinal;
                precioTotalAPlazos = importeTotalAdeudado + downPayment; 

            } else {
                importeAFinanciar = principal;
                importeTotalCredito = importeAFinanciar + calculatedOpeningFeeValueFinal;
                importeTotalAdeudado = finalPmt * term;
                totalIntereses = importeTotalAdeudado - importeTotalCredito; 
                costeTotalCredito = totalIntereses + calculatedOpeningFeeValueFinal;
                precioTotalAPlazos = importeTotalAdeudado + downPayment;
            }

            updateState({ monthlyPayment: finalPmt, tae: estimatedTae, openingFeeValue: calculatedOpeningFeeValueFinal });
            setOfferData({ pvp: salePrice, entrada: downPayment, importeAFinanciar, plazo: term, gastosApertura: calculatedOpeningFeeValueFinal, importeTotalCredito, totalIntereses, importeTotalAdeudado, costeTotalCredito, precioTotalAPlazos });
        };
        calculateOffer();
    }, [salePrice, downPayment, term, interestRate, insuranceType, productType, clientType, vehicleType, vehicleUse, finalValuePercentage, isInsuranceAvailable, openingFeePercentage, registrationTaxRate, financeRegistrationTax]);

     useEffect(() => {
        let newLimits = { min: 12, max: 120 };
        let newMinYear = 2000;

        // Apply same term restrictions as Simulator.tsx logic
        if (vehicleType === 'Matriculado') {
            if (isCuotaSolucion) {
                newMinYear = currentYear - 3;
            } else if (productType === 'Financiación Lineal') {
                if (clientType === 'Sociedades') {
                    const isIndustrial = vehicleUse === 'Industrial';
                    const maxAge = isIndustrial ? 48 : 60;
                    newMinYear = currentYear - Math.floor(maxAge / 12) - 1;
                } else {
                    newMinYear = currentYear - 13;
                }
            }
        }
        
        // Limits from vehicleAgeInfo are authoritative
        if (vehicleAgeInfo.isFinanciable) {
             newLimits = { min: 12, max: vehicleAgeInfo.maxTerm };
        }
        
        setTermLimits(newLimits);
        setRegistrationYearMin(newMinYear);
        // Ensure term is within new limits
        if (term > newLimits.max) setTerm(newLimits.max);
        if (term < newLimits.min) setTerm(newLimits.min);
        
    }, [productType, clientType, vehicleType, vehicleUse, registrationYear, registrationMonth, isCuotaSolucion, vehicleAgeInfo]);


    const handleSearchByPlate = () => {
        setFoundPlateDate(null);
        const letters = licensePlate.replace(/[^A-Z]/g, '').toUpperCase();
        if (letters.length !== 3) return;
        const found = licensePlateData.find(entry => entry.series >= letters);
        if (found) {
            const [year, month] = found.date.split('-').map(Number);
            updateState({ registrationYear: year, registrationMonth: month, foundPlateDate: new Date(found.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) });
        } else {
            updateState({ registrationYear: currentYear, registrationMonth: currentMonth });
        }
    };
    
     const formatNumberWithDot = (num: number) => {
        if(isNaN(num)) return '0,00';
        const parts = num.toFixed(2).toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };
    
    // Helper Modals
    const InsuranceInfoModal = ({ title, content, onClose }: { title: string; content: React.ReactNode; onClose: () => void; }) => (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-none shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors rounded-none bg-slate-50 p-1 hover:bg-slate-200">
                    <XIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-6 text-black border-b border-slate-200 pb-4">
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-none"><InfoIcon className="w-5 h-5" /></div>
                    <h3 className="text-xl font-bold uppercase tracking-widest">{title}</h3>
                </div>
                <div className="prose prose-sm max-w-none text-slate-600 max-h-[60vh] overflow-y-auto pr-2 mb-6">
                    {content}
                </div>
                <button onClick={onClose} className="w-full text-center font-bold text-[10px] bg-black text-white hover:bg-slate-800 py-3 px-6 rounded-none transition-colors uppercase tracking-widest">
                    Entendido
                </button>
            </div>
        </div>
    );

     const VidaSeniorModal = ({ onClose, onConfirm }: { onClose: () => void, onConfirm: (maxTerm: number) => void }) => {
        const [birthMonthYear, setBirthMonthYear] = useState(() => {
            const d = new Date();
            d.setFullYear(d.getFullYear() - 60);
            return d.toISOString().substring(0, 7); 
        });
        const [error, setError] = useState('');

        const handleVerify = () => {
            if (!birthMonthYear) {
                setError('Por favor, introduce el mes y año de nacimiento.');
                return;
            }
            const today = new Date();
            const [year, month] = birthMonthYear.split('-').map(Number);
            const birth = new Date(year, month - 1, 1);

            if (birth > today) {
                setError('La fecha de nacimiento no puede ser en el futuro.');
                return;
            }

            let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12;
            ageInMonths -= birth.getMonth();
            ageInMonths += today.getMonth();
            
            if (ageInMonths <= 0) ageInMonths = 0;

            const maxTotalMonths = 924;
            const minTermMonths = 36;
            const maxAllowedTerm = maxTotalMonths - ageInMonths;

            if (maxAllowedTerm < minTermMonths) {
                setError('Es necesario cotitular más joven para obtener más plazos.');
            } else {
                setError('');
                onConfirm(maxAllowedTerm);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center relative animate-fade-in-up">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Verificar Edad para Vida Senior</h2>
                    <p className="text-gray-600 mb-6">Introduce el mes y año de nacimiento del cliente para calcular el plazo máximo de financiación.</p>
                    <div className="my-4">
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 text-left mb-1">Mes y Año de Nacimiento</label>
                        <input type="month" id="birthdate" value={birthMonthYear} onChange={(e) => setBirthMonthYear(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-caixa-blue" />
                    </div>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    <button onClick={handleVerify} className="w-full mt-6 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors disabled:opacity-50" disabled={!birthMonthYear}>Verificar y Aplicar</button>
                </div>
            </div>
        );
    };

    const NoInsuranceWarningModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-fade-in-up">
                <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <WarningIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Estás dejando a tu cliente desprotegido.</h2>
                <div className="text-gray-600 space-y-3 text-sm">
                    <p className="font-bold text-red-600">Atención: La comisión a terceros es inferior.</p>
                    <p className="font-semibold">Las solicitudes sin seguro son solo para Titular pensionista por incapacidad.</p>
                    <p>Si quieres que la solicitud lleve seguro, por favor, añade un cotitular sin Incapacidad para asignarle seguro/s.</p>
                </div>
                <div className="mt-6 flex gap-4">
                    <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-none hover:bg-gray-300">Cancelar</button>
                    <button onClick={onConfirm} className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">Continuar</button>
                </div>
            </div>
        </div>
    );

    const NotFinanciableModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-fade-in-up">
                 <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><XIcon className="w-8 h-8" /></div>
                <h2 className="text-xl font-bold text-red-600 mb-4">Vehículo No Financiable</h2>
                <p className="text-gray-600 mb-6">{vehicleAgeInfo.message}</p>
                <button onClick={onClose} className="w-full bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-none hover:bg-slate-300">Entendido</button>
            </div>
        </div>
    );
    
    const AgeExceededModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-fade-in-up">
                 <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4"><WarningIcon className="w-8 h-8" /></div>
                <h2 className="text-xl font-bold text-yellow-600 mb-4">Aviso de Antigüedad</h2>
                <p className="text-gray-600 mb-6">{vehicleAgeInfo.message || 'La antigüedad del vehículo limita el plazo máximo.'}</p>
                <button onClick={onClose} className="w-full bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">Aceptar</button>
            </div>
        </div>
    );

    const openInsuranceModal = (type: string) => {
        setInsuranceModal({ title: 'Info', content: `Details for ${type}` });
    };
    
    const renderStep = () => {
        switch (currentStep) {
            case 0: // Product Type
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">1. Selecciona Tipo de Producto Financiero</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <ToggleButton label="Financiación Lineal" selected={productType === 'Financiación Lineal'} onClick={() => setProductType('Financiación Lineal')} />
                            <ToggleButton label="Leasing" selected={productType === 'Leasing'} onClick={() => setProductType('Leasing')} />
                        </div>
                    </div>
                );
            case 1: // Client Type
                return (
                     <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">2. Selecciona Tipo de Cliente</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {productType !== 'Leasing' && (
                                <ToggleButton label="Asalariado" selected={clientType === 'Asalariados'} onClick={() => setClientType('Asalariados')} />
                            )}
                            <ToggleButton label="Autónomos" selected={clientType === 'Autónomos'} onClick={() => setClientType('Autónomos')} />
                            {(isLeasing || productType === 'Financiación Lineal') && <ToggleButton label="Sociedades" selected={clientType === 'Sociedades'} onClick={() => setClientType('Sociedades')} />}
                        </div>
                        <div className="mt-6 flex gap-4"><button onClick={handleBack} className="flex-1 bg-caixa-yellow text-slate-800 font-bold py-3 rounded-none">Atrás</button></div>
                    </div>
                );
            case 2: // Vehicle Type
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">3. Selecciona Tipo de Vehículo</h3>
                        <div className="flex gap-4">
                            <ToggleButton label="Nuevo" selected={vehicleType === 'Nuevo'} onClick={() => setVehicleType('Nuevo')} />
                            <ToggleButton label="Matriculado" selected={vehicleType === 'Matriculado'} onClick={() => setVehicleType('Matriculado')} />
                        </div>
                        {((productType === 'Leasing') || (productType === 'Financiación Lineal' && clientType === 'Sociedades')) && vehicleType && (
                            <div className="mt-6 animate-fade-in-up border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3">Uso del Vehículo</h4>
                                <div className="flex gap-4">
                                    <ToggleButton label="Turismo" selected={vehicleUse === 'Turismo'} onClick={() => setVehicleUse('Turismo')} />
                                    <ToggleButton label="Industrial" selected={vehicleUse === 'Industrial'} onClick={() => setVehicleUse('Industrial')} />
                                </div>
                            </div>
                        )}
                         <div className="mt-6 flex gap-4"><button onClick={handleBack} className="flex-1 bg-caixa-yellow text-slate-800 font-bold py-3 rounded-none">Atrás</button></div>
                    </div>
                );
            case 3: // Matricula / Age Selection
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">4. Seleccionar Fecha de Matriculación</h3>
                        <div className="max-w-md mx-auto space-y-6">
                            <div>
                                <label htmlFor="licensePlate" className="block text-sm font-semibold text-gray-800 mb-2">Consulta por Matrícula (Opcional)</label>
                                <div className="relative"><input type="text" id="licensePlate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} className="w-full px-4 py-2 border rounded-lg" placeholder="1234BBB"/><button type="button" onClick={handleSearchByPlate} className="absolute inset-y-0 right-0 pr-3 text-caixa-blue"><SearchIcon className="w-5 h-5" /></button></div>
                                {foundPlateDate && <div className="mt-2 text-sm text-center bg-blue-50 p-2 rounded-lg">{foundPlateDate}</div>}
                            </div>
    
                            <div className="pt-6 border-t border-slate-200">
                                <p className="text-sm font-bold text-gray-800 mb-4 text-center">Antigüedad del Vehículo</p>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-gray-500">Año Matriculación</label>
                                        <span className="text-sm font-bold">{registrationYear}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={minAllowedYear} 
                                        max={currentYear} 
                                        value={registrationYear} 
                                        onChange={(e) => setRegistrationYear(Number(e.target.value))} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-caixa-blue" 
                                    />
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-gray-500">Mes</label>
                                        <span className="text-sm font-bold">{registrationMonth}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="12" 
                                        value={registrationMonth} 
                                        onChange={(e) => setRegistrationMonth(Number(e.target.value))} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-caixa-blue" 
                                    />
                                </div>

                                <div className={`mt-4 p-4 border rounded-none space-y-2 ${!vehicleAgeInfo.isFinanciable ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className="text-xs font-semibold uppercase opacity-70">Fecha Matriculación</span>
                                        <span className="text-sm font-bold">{String(registrationMonth).padStart(2, '0')}/{registrationYear}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className={`text-xs font-semibold uppercase ${!vehicleAgeInfo.isFinanciable ? 'text-red-600' : 'text-blue-600'}`}>Edad del Vehículo</span>
                                        <span className={`text-sm font-bold ${!vehicleAgeInfo.isFinanciable ? 'text-red-900' : 'text-blue-900'}`}>{vehicleAgeInfo.ageText}</span>
                                    </div>
                                    {vehicleAgeInfo.isFinanciable ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-blue-600 font-semibold uppercase">Plazo Máximo Financiable</span>
                                            <span className="text-sm font-bold text-blue-900">{vehicleAgeInfo.maxTerm} meses</span>
                                        </div>
                                    ) : (
                                        <div className="text-center font-bold text-red-600 text-xs uppercase pt-1">
                                            {vehicleAgeInfo.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 flex gap-4">
                                <button onClick={handleBack} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors">Atrás</button>
                                <button onClick={handleNext} disabled={!vehicleAgeInfo.isFinanciable} className={`flex-1 text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors ${!vehicleAgeInfo.isFinanciable ? 'bg-slate-300 cursor-not-allowed' : 'bg-black hover:bg-slate-800'}`}>Continuar</button>
                            </div>
                        </div>
                    </div>
                );
             case 4: // Financial Sliders
                // Ensure term is restricted by the calculated maxTerm from vehicle age
                const maxTerm = vehicleAgeInfo.maxTerm;
                
                const displaySalePrice = isLeasing ? salePrice : salePrice;
                const displayDownPayment = isLeasing ? downPayment : downPayment;
                const showRegistrationTax = isLeasing && vehicleType === 'Nuevo' && vehicleUse === 'Turismo';

                return (
                    <div className="bg-white p-8 rounded-none shadow-lg space-y-6 animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800">5. Introduce Datos Económicos</h3>
                        
                        {showRegistrationTax && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-bold text-gray-700">Impuesto de Matriculación (CO2)</label>
                                    <span className="text-[10px] bg-blue-100 text-caixa-blue px-2 py-1 rounded-full font-bold uppercase tracking-wider">Financiado</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {[0, 4.75, 9.75, 14.75].map(rate => (
                                        <button
                                            key={rate}
                                            onClick={() => updateState({ registrationTaxRate: rate })}
                                            className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-lg border ${
                                                registrationTaxRate === rate 
                                                ? 'bg-black text-white border-black' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'
                                            }`}
                                        >
                                            {rate === 0 ? '0,0% ECO' : `${rate}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {isLeasing ? 'Precio Base (Sin IVA)' : 'Precio de Venta (PVP)'}
                            </label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="1000" max="150000" step="100" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value))} className="w-full workflow-slider" tabIndex={-1} />
                                <div className="border rounded-lg w-36 flex items-center bg-white">
                                    <input 
                                        type="text" 
                                        value={new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(displaySalePrice)} 
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replace(/\./g, ''));
                                            setSalePrice(val);
                                        }} 
                                        className="w-full p-2 border-none rounded-l-lg text-right font-mono"
                                    />
                                    <span className="bg-gray-100 p-2 rounded-r-lg border-l text-gray-500">€</span>
                                </div>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-semibold mb-2">
                                {isLeasing ? 'Entrada (IVA Incluido)' : 'Entrada'}
                            </label>
                            {isCuotaSolucion && (
                                <p className="text-xs text-gray-500 mb-2 -mt-1">Mínimo 10%, Máximo 50% sobre Importe Factura de Venta.</p>
                            )}
                            {productType === 'Leasing' && (
                                <p className="text-xs text-gray-500 mb-2 -mt-1">Máximo 30% en Leasing.</p>
                            )}
                            <div className="flex items-center gap-4">
                                <input type="range" min={downPaymentLimits.min} max={downPaymentLimits.max} step={100} value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value))} className="w-full workflow-slider" tabIndex={-1} />
                                <div className="border rounded-lg w-36 flex items-center bg-white">
                                    <input 
                                        type="text" 
                                        value={new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(displayDownPayment)} 
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replace(/\./g, ''));
                                            setDownPayment(val);
                                        }} 
                                        className="w-full p-2 border-none rounded-l-lg text-right font-mono"
                                    />
                                    <span className="bg-gray-100 p-2 rounded-r-lg border-l text-gray-500">€</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Plazo</label>
                            {isCuotaSolucion ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[24, 36, 48, 60].filter(t => t <= maxTerm).map(t => <ToggleButton key={t} label={`${t}m`} selected={term === t} onClick={() => setTerm(t)} />)}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <input type="range" min={termLimits.min} max={maxTerm} step={12} value={term} onChange={(e) => setTerm(parseInt(e.target.value, 10))} className="w-full workflow-slider" tabIndex={-1} />
                                    <div className="border rounded-lg w-44 flex items-center">
                                        <input type="number" value={termInputValue} onChange={e => setTermInputValue(e.target.value)} onBlur={e => {let t = parseInt(e.target.value, 10); if(isNaN(t)) t=termLimits.min; setTerm(Math.max(termLimits.min, Math.min(maxTerm, t)))}} className="w-full p-2 border-none rounded-l-lg text-right"/>
                                        <span className="bg-gray-100 p-2 rounded-r-lg">meses</span>
                                    </div>
                                </div>
                            )}
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Tipo de Interés (TIN)</label>
                            {isCuotaSolucion ? (
                                <div className="mt-2 grid grid-cols-3 gap-4">
                                    <ToggleButton label="7,49%" selected={interestRate === 7.49} onClick={() => updateState({interestRate: 7.49})} />
                                    <ToggleButton label="8,49%" selected={interestRate === 8.49} onClick={() => updateState({interestRate: 8.49})} />
                                    <ToggleButton label="9,49%" selected={interestRate === 9.49} onClick={() => updateState({interestRate: 9.49})} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <input type="range" min={interestRateLimits.min} max={interestRateLimits.max} step={interestRateLimits.step} value={interestRate} onChange={(e) => updateState({interestRate: parseFloat(e.target.value)})} className="w-full workflow-slider" tabIndex={-1} />
                                    <div className="border rounded-lg w-36 flex items-center">
                                        <input type="text" value={String(interestRate).replace('.',',')} onChange={(e) => {
                                            const val = parseFloat(e.target.value.replace(',','.'));
                                            if (!isNaN(val)) updateState({interestRate: val});
                                        }} className="w-full p-2 border-none rounded-l-lg text-right"/>
                                        <span className="bg-gray-100 p-2 rounded-r-lg">%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-gray-800">Gastos de Apertura ({openingFeePercentage.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</label>
                                <button onClick={() => setShowOpeningFeeSlider(!showOpeningFeeSlider)} className="text-caixa-blue hover:underline text-xs">Ajustar</button>
                            </div>
                            {showOpeningFeeSlider && (
                                <div className="flex items-center gap-4 mt-2">
                                    <input type="range" min="0" max="5" step="0.01" value={openingFeePercentage} onChange={(e) => setOpeningFeePercentage(parseFloat(e.target.value))} className="w-full workflow-slider" tabIndex={-1} />
                                    <div className="border rounded-lg w-36 flex items-center">
                                        <input type="text" value={String(openingFeePercentage).replace('.',',')} onChange={(e) => {
                                            const val = parseFloat(e.target.value.replace(',','.'));
                                            if (!isNaN(val)) setOpeningFeePercentage(val);
                                        }} className="w-full p-2 border-none rounded-l-lg text-right focus:ring-0" />
                                        <span className="bg-gray-100 p-2 rounded-r-lg">%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex gap-4"><button onClick={handleBack} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors">Atrás</button><button onClick={handleNext} className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">Continuar</button></div>
                    </div>
                );
            case 5: // Insurance
                 return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">6. Selecciona Protección de Pagos</h3>
                        {(productType === 'Leasing' || clientType === 'Sociedades') ? (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                                <p className="text-sm text-gray-600 font-semibold">Seguro de Protección de Pagos no disponible para {productType === 'Leasing' ? 'Leasing' : 'Empresas'}.</p>
                                <p className="text-xs text-gray-500">Se aplicará "Sin Protección".</p>
                            </div>
                        ) : isInsuranceAvailable ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InsuranceCard label="Vida + Desempleo/IT" sublabel="18-60 años" selected={insuranceType === 'Vida + Desempleo / IT'} onClick={() => setInsuranceType('Vida + Desempleo / IT')} onInfoClick={() => openInsuranceModal('Vida + Desempleo / IT')} />
                                <InsuranceCard label="Vida" sublabel="18-60 años" selected={insuranceType === 'Vida'} onClick={() => setInsuranceType('Vida')} onInfoClick={() => openInsuranceModal('Vida')} />
                                <InsuranceCard label="Vida Senior" sublabel="+60 años" selected={insuranceType === 'Vida Senior'} onClick={() => setShowVidaSeniorModal(true)} onInfoClick={() => openInsuranceModal('Vida Senior')} />
                                <InsuranceCard label="Sin Protección" sublabel="Casos específicos" selected={insuranceType === 'Sin Protección'} onClick={() => setShowNoInsuranceWarningModal(true)} onInfoClick={() => openInsuranceModal('Sin Protección')} />
                            </div>
                        ) : ( <p>Protección de pagos no disponible.</p> )}
                        <div className="mt-6 flex gap-4"><button onClick={handleBack} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors">Atrás</button><button onClick={handleNext} className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">Ver Resumen</button></div>
                    </div>
                 );
            case 6: // Confirmation
                const importeAFinanciar = salePrice - downPayment;
                const years = Math.floor(term / 12);
                const yearsText = years > 0 ? ` (${years} ${years === 1 ? 'año' : 'años'})` : '';
                let isNotaryNeeded = false;
                
                if (clientType === 'Sociedades') {
                    if (importeAFinanciar >= 30000) isNotaryNeeded = true;
                } else {
                    if (importeAFinanciar >= 40000) isNotaryNeeded = true;
                }

                let displayMonthlyPayment = monthlyPayment;
                let displayImporteFinanciar = importeAFinanciar;
                
                if (isLeasing) {
                    displayImporteFinanciar = (salePrice) - (downPayment); 
                    if (vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && financeRegistrationTax && registrationTaxRate > 0) {
                        displayImporteFinanciar += salePrice * (registrationTaxRate / 100);
                    }
                }

                return (
                    <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
                        {showSuccess ? (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg text-center">
                                <p className="font-bold">¡Datos Económicos Guardados!</p>
                                <p className="text-sm">Serás redirigido al siguiente paso...</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold text-gray-800 mb-4">7. Confirmación de Datos Económicos</h3>
                                <div className="bg-black text-white p-6 rounded-xl relative space-y-4">
                                    {isNotaryNeeded && (
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold p-1 rounded-md shadow">
                                            <WarningIcon className="w-4 h-4" />
                                            <span>Intervención Notarial</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div>
                                            <p className="text-sm">Cuota Mensual {isLeasing ? '(Con IVA)' : ''}</p>
                                            <p className="text-5xl font-bold">{monthlyPayment ? formatNumberWithDot(monthlyPayment) : '0,00'} €/mes</p>
                                            <p className="text-sm font-semibold mt-1">Plazo: {term} {isLeasing ? '+ 1' : ''} meses{yearsText}</p>
                                            {isInsuranceAvailable && insuranceType !== 'Sin Protección' && (
                                                <p className="text-xs text-blue-100 mt-2">Prima de Seguro No Financiado, Incluido en Cuota Mensual.</p>
                                            )}
                                        </div>
                                         <div className="flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white/20 p-2 rounded-md backdrop-blur-sm text-center">
                                                    <p className="text-xs font-bold">T.I.N.</p>
                                                    <p className="text-lg font-bold">{interestRate.toLocaleString('es-ES')}%</p>
                                                </div>
                                                <div className="bg-black p-3 rounded-md backdrop-blur-sm text-center">
                                                    <p className="text-base font-bold text-white"><span className="underline">(*) T.A.E.</span></p>
                                                    <p className="text-2xl font-bold text-white"><span className="underline">{tae?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '...'}%</span></p>
                                                </div>
                                            </div>
                                            {isCuotaSolucion && (
                                                <div className="bg-white/20 p-2 rounded-md backdrop-blur-sm text-center mt-2">
                                                    <p className="text-xs font-bold text-blue-100">Última Cuota (V.F.G)</p>
                                                    <p className="text-lg font-bold">{formatNumberWithDot(salePrice * (finalValuePercentage / 100))} €</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-4 pt-4 border-t border-white/20">
                                        <div className="bg-white/10 p-2 rounded-md"><p className="text-xs opacity-80">PVP</p><p className="font-bold">{formatCurrency(salePrice)}</p></div>
                                        <div className="bg-white/10 p-2 rounded-md"><p className="text-xs opacity-80">Entrada</p><p className="font-bold">{formatCurrency(downPayment)}</p></div>
                                        <div className="bg-white/10 p-2 rounded-md"><p className="text-xs opacity-80">A Financiar {isLeasing ? '(Neto)' : ''}</p><p className="font-bold">{formatCurrency(displayImporteFinanciar)}</p></div>
                                        <div className="bg-white/10 p-2 rounded-md"><p className="text-xs opacity-80">Seguro</p><p className="font-bold text-xs">{insuranceType === 'Sin Protección' ? 'No' : insuranceType}</p></div>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <button onClick={handleBack} disabled={showSuccess} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors disabled:opacity-50">Atrás</button>
                                    <button onClick={handleSaveAndContinue} disabled={showSuccess} className="flex-1 bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors disabled:opacity-50">Guardar y Continuar</button>
                                </div>
                            </>
                        )}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="w-full">
             <style>{`
                .workflow-slider { -webkit-appearance: none; width: 100%; background: transparent; }
                .workflow-slider:focus { outline: none; }
                .workflow-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #00a1e0; cursor: pointer; margin-top: -8px; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
                .workflow-slider::-moz-range-thumb { height: 20px; width: 20px; border-radius: 50%; background: #00a1e0; cursor: pointer; box-shadow: 0 0 2px rgba(0,0,0,0.2); }
                .workflow-slider::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: #e2e8f0; border-radius: 5px; }
                .workflow-slider::-moz-range-track { width: 100%; height: 4px; cursor: pointer; background: #e2e8f0; border-radius: 5px; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
            
            {renderStep()}

            {showNotFinanciableModal && <NotFinanciableModal onClose={() => setShowNotFinanciableModal(false)} />}
            {showAgeExceededModal && <AgeExceededModal onClose={() => setShowAgeExceededModal(false)} />}
            {insuranceModal && (
                <InsuranceInfoModal
                    title={insuranceModal.title}
                    content={insuranceModal.content}
                    onClose={() => setInsuranceModal(null)}
                />
            )}
             {showNoInsuranceWarningModal && (
                <NoInsuranceWarningModal 
                    onConfirm={() => {
                        setInsuranceType('Sin Protección');
                        setShowNoInsuranceWarningModal(false);
                    }}
                    onCancel={() => setShowNoInsuranceWarningModal(false)}
                />
            )}
            {showVidaSeniorModal && (
                <VidaSeniorModal
                    onClose={() => setShowVidaSeniorModal(false)}
                    onConfirm={(maxTerm) => {
                        const newMaxTerm = Math.floor(maxTerm);
                        if (newMaxTerm >= termLimits.min) {
                            setTermLimits(prev => ({ ...prev, max: newMaxTerm }));
                            if (term > newMaxTerm) {
                                setTerm(newMaxTerm);
                            }
                            setInsuranceType('Vida Senior');
                        }
                        setShowVidaSeniorModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default WorkflowSimulator;
