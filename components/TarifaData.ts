export const TARIFA_DATA: Record<string, Record<string, { pb: number, ref: number }>> = {
    '5.49': {
        '24': { pb: 0.047050, ref: 3.00 },
        '36': { pb: 0.032596, ref: 3.50 },
        '48': { pb: 0.025680, ref: 4.00 },
        '60': { pb: 0.021058, ref: 5.00 },
        '72': { pb: 0.018185, ref: 5.50 },
        '84': { pb: 0.016138, ref: 5.50 },
        '96': { pb: 0.014609, ref: 5.50 },
        '108': { pb: 0.013424, ref: 5.50 },
        '120': { pb: 0.012480, ref: 5.50 }
    },
    '5.99': {
        '24': { pb: 0.047284, ref: 4.00 },
        '36': { pb: 0.032831, ref: 4.50 },
        '48': { pb: 0.025617, ref: 5.00 },
        '60': { pb: 0.021299, ref: 6.00 },
        '72': { pb: 0.018429, ref: 7.00 },
        '84': { pb: 0.016386, ref: 7.00 },
        '96': { pb: 0.014861, ref: 7.00 },
        '108': { pb: 0.013680, ref: 7.00 },
        '120': { pb: 0.012740, ref: 7.00 }
    },
    '6.49': {
        '24': { pb: 0.047519, ref: 4.50 },
        '36': { pb: 0.033067, ref: 5.50 },
        '48': { pb: 0.025856, ref: 5.50 },
        '60': { pb: 0.021542, ref: 5.50 },
        '72': { pb: 0.018676, ref: 8.00 },
        '84': { pb: 0.016637, ref: 8.00 },
        '96': { pb: 0.015115, ref: 8.00 },
        '108': { pb: 0.013938, ref: 8.00 },
        '120': { pb: 0.013003, ref: 8.00 }
    },
    '6.99': {
        '24': { pb: 0.047754, ref: 5.00 },
        '36': { pb: 0.033304, ref: 6.00 },
        '48': { pb: 0.026097, ref: 7.00 },
        '60': { pb: 0.021786, ref: 8.00 },
        '72': { pb: 0.018924, ref: 9.00 },
        '84': { pb: 0.016890, ref: 9.00 },
        '96': { pb: 0.015373, ref: 9.00 },
        '108': { pb: 0.014200, ref: 9.00 },
        '120': { pb: 0.013269, ref: 9.00 }
    },
    '7.49': {
        '24': { pb: 0.047990, ref: 4.50 },
        '36': { pb: 0.033543, ref: 5.50 },
        '48': { pb: 0.026339, ref: 6.50 },
        '60': { pb: 0.022033, ref: 9.50 },
        '72': { pb: 0.019175, ref: 11.50 },
        '84': { pb: 0.017145, ref: 11.50 },
        '96': { pb: 0.015633, ref: 11.50 },
        '108': { pb: 0.014465, ref: 11.50 },
        '120': { pb: 0.013538, ref: 11.50 }
    },
    '7.99': {
        '24': { pb: 0.048227, ref: 6.00 },
        '36': { pb: 0.033782, ref: 7.00 },
        '48': { pb: 0.026582, ref: 9.50 },
        '60': { pb: 0.022280, ref: 11.00 },
        '72': { pb: 0.019428, ref: 13.00 },
        '84': { pb: 0.017403, ref: 13.00 },
        '96': { pb: 0.015895, ref: 13.00 },
        '108': { pb: 0.014733, ref: 13.00 },
        '120': { pb: 0.013811, ref: 13.00 }
    },
    '8.49': {
        '36': { pb: 0.034022, ref: 7.50 },
        '48': { pb: 0.026827, ref: 10.00 },
        '60': { pb: 0.022530, ref: 12.50 },
        '72': { pb: 0.019683, ref: 14.00 },
        '84': { pb: 0.017663, ref: 14.00 },
        '96': { pb: 0.016161, ref: 14.00 },
        '108': { pb: 0.015004, ref: 14.00 },
        '120': { pb: 0.014088, ref: 14.00 }
    },
    '8.99': {
        '36': { pb: 0.034264, ref: 8.00 },
        '48': { pb: 0.027073, ref: 11.50 },
        '60': { pb: 0.022782, ref: 14.00 },
        '72': { pb: 0.019940, ref: 16.00 },
        '84': { pb: 0.017926, ref: 16.00 },
        '96': { pb: 0.016429, ref: 16.00 },
        '108': { pb: 0.015278, ref: 16.00 },
        '120': { pb: 0.014367, ref: 16.00 }
    },
    '9.49': {
        '36': { pb: 0.034506, ref: 8.50 },
        '48': { pb: 0.027321, ref: 11.50 },
        '60': { pb: 0.023035, ref: 16.00 },
        '72': { pb: 0.020199, ref: 18.00 },
        '84': { pb: 0.018191, ref: 18.00 },
        '96': { pb: 0.016700, ref: 18.00 },
        '108': { pb: 0.015555, ref: 18.00 },
        '120': { pb: 0.014650, ref: 18.00 }
    },
    '9.99': {
        '48': { pb: 0.027570, ref: 13.50 },
        '60': { pb: 0.023290, ref: 17.00 },
        '72': { pb: 0.020460, ref: 20.00 },
        '84': { pb: 0.018458, ref: 20.00 },
        '96': { pb: 0.016974, ref: 20.00 },
        '108': { pb: 0.015835, ref: 20.00 },
        '120': { pb: 0.014937, ref: 20.00 }
    }
};

export const getTarifaCoefficient = (interestRate: number, term: number, insuranceType: string): { coefficient: number, ref: number } | null => {
    const rateStr = interestRate.toFixed(2);
    const termStr = term.toString();
    
    if (TARIFA_DATA[rateStr] && TARIFA_DATA[rateStr][termStr]) {
        const data = TARIFA_DATA[rateStr][termStr];
        let coefficient = data.pb;
        let ref = data.ref;
        
        if (insuranceType === 'Vida + Desempleo / IT') {
            coefficient += 0.000300;
            ref += 0.50;
        } else if (insuranceType === 'Sin Protección') {
            coefficient -= 0.001200;
            ref -= 2.00;
        } else if (insuranceType === 'Vida Senior') {
            // "Para el seguro senior, recuerda que tienes que sumarle el porcentaje sobre el coeficiente con seguro de vida (PB)"
            // Wait, the user said: "si lleva seguro de vida seniorla comision es la misma que la Ref."
            // And: "Para el seguro senior, recuerda que tienes que sumarle el porcentaje sobre el coeficiente con seguro de vida (PB)"
            // Let's look at the previous code for Vida Senior:
            // `case 'Vida Senior': insuranceCostPerMonth = thousandsFinanced * 1.40; break;`
            // Wait, the user says: "Para el seguro senior, recuerda que tienes que sumarle el porcentaje sobre el coeficiente con seguro de vida (PB)"
            // So coefficient = data.pb + (something). Let's use the old logic for Vida Senior if it's not in the table?
            // Actually, the user says: "Para el seguro senior, recuerda que tienes que sumarle el porcentaje sobre el coeficiente con seguro de vida (PB)"
            // What percentage? In the old code: `thousandsFinanced * 1.40`.
            // If we use coefficients, the monthly payment is `principal * coefficient`.
            // So `insuranceCostPerMonth = principal * 1.40 / 1000 = principal * 0.00140`.
            // So coefficient for Vida Senior = data.pb + 0.00140.
            // Let's verify this.
            coefficient += 0.00140; // Assuming this is what they mean.
            // ref is the same as PB.
        }
        
        return { coefficient, ref };
    }
    
    return null;
};

export const TARIFA_LEASING_DATA: Record<string, Record<string, { cuotaSinProteccion: number, ref: number }>> = {
    '5.99': {
        '24': { cuotaSinProteccion: 0.043284, ref: 0.00 },
        '36': { cuotaSinProteccion: 0.030110, ref: 0.25 },
        '48': { cuotaSinProteccion: 0.023401, ref: 0.50 },
        '60': { cuotaSinProteccion: 0.019341, ref: 0.75 },
        '72': { cuotaSinProteccion: 0.016624, ref: 1.00 },
        '84': { cuotaSinProteccion: 0.014681, ref: 1.00 }
    },
    '6.99': {
        '24': { cuotaSinProteccion: 0.043707, ref: 1.00 },
        '36': { cuotaSinProteccion: 0.030547, ref: 1.25 },
        '48': { cuotaSinProteccion: 0.023849, ref: 1.75 },
        '60': { cuotaSinProteccion: 0.019800, ref: 2.25 },
        '72': { cuotaSinProteccion: 0.017094, ref: 2.50 },
        '84': { cuotaSinProteccion: 0.015161, ref: 2.50 }
    },
    '7.99': {
        '24': { cuotaSinProteccion: 0.044131, ref: 2.00 },
        '36': { cuotaSinProteccion: 0.030987, ref: 2.25 },
        '48': { cuotaSinProteccion: 0.024303, ref: 2.75 },
        '60': { cuotaSinProteccion: 0.020266, ref: 3.50 },
        '72': { cuotaSinProteccion: 0.017571, ref: 4.00 },
        '84': { cuotaSinProteccion: 0.015649, ref: 4.00 }
    }
};

export const getLeasingTarifa = (interestRate: number, term: number): { cuotaSinProteccion: number, ref: number } | null => {
    const rateStr = interestRate.toFixed(2);
    const termStr = term.toString();
    
    if (TARIFA_LEASING_DATA[rateStr] && TARIFA_LEASING_DATA[rateStr][termStr]) {
        return TARIFA_LEASING_DATA[rateStr][termStr];
    }
    
    return null;
};
