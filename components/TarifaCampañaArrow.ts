export const CAMPAIGN_ARROW_EXPIRY = '2026-05-18T23:59:59';

export const isCampaignArrowActive = () => {
    const now = new Date();
    const expiry = new Date(CAMPAIGN_ARROW_EXPIRY);
    return now <= expiry;
};

export interface CampaignData {
    rate: string;
    label: string;
    terms: Record<string, {
        pb: number;
        pbDesempleo: number;
        sinProteccion: number;
        ref: number;
    }>;
}

export const CAMPAIGN_ARROW_DATA: Record<string, CampaignData> = {
    '5.95': {
        rate: '5.95',
        label: 'RQV',
        terms: {
            '60': { pb: 0.021280, pbDesempleo: 0.021580, sinProteccion: 0.020080, ref: 7.00 },
            '72': { pb: 0.018410, pbDesempleo: 0.018710, sinProteccion: 0.017210, ref: 8.00 },
            '84': { pb: 0.016367, pbDesempleo: 0.016667, sinProteccion: 0.015167, ref: 9.00 },
            '96': { pb: 0.014840, pbDesempleo: 0.015140, sinProteccion: 0.013640, ref: 9.00 },
            '108': { pb: 0.013659, pbDesempleo: 0.013959, sinProteccion: 0.012459, ref: 9.00 },
            '120': { pb: 0.012719, pbDesempleo: 0.013019, sinProteccion: 0.011519, ref: 9.00 }
        }
    },
    '7.95': {
        rate: '7.95',
        label: 'RQW',
        terms: {
            '60': { pb: 0.022261, pbDesempleo: 0.022561, sinProteccion: 0.021061, ref: 15.00 },
            '72': { pb: 0.019407, pbDesempleo: 0.019707, sinProteccion: 0.018207, ref: 16.00 },
            '84': { pb: 0.017382, pbDesempleo: 0.017682, sinProteccion: 0.016182, ref: 17.00 },
            '96': { pb: 0.015874, pbDesempleo: 0.016174, sinProteccion: 0.014674, ref: 17.00 },
            '108': { pb: 0.014711, pbDesempleo: 0.015011, sinProteccion: 0.013511, ref: 17.00 },
            '120': { pb: 0.013789, pbDesempleo: 0.014089, sinProteccion: 0.012589, ref: 17.00 }
        }
    },
    '8.95': {
        rate: '8.95',
        label: 'RQX',
        terms: {
            '60': { pb: 0.022761, pbDesempleo: 0.023061, sinProteccion: 0.021561, ref: 18.00 },
            '72': { pb: 0.019919, pbDesempleo: 0.020219, sinProteccion: 0.018719, ref: 19.00 },
            '84': { pb: 0.017905, pbDesempleo: 0.018205, sinProteccion: 0.016705, ref: 20.00 },
            '96': { pb: 0.016408, pbDesempleo: 0.016708, sinProteccion: 0.015208, ref: 20.00 },
            '108': { pb: 0.015256, pbDesempleo: 0.015556, sinProteccion: 0.014056, ref: 20.00 },
            '120': { pb: 0.014345, pbDesempleo: 0.014645, sinProteccion: 0.013145, ref: 20.00 }
        }
    },
    '9.45': {
        rate: '9.45',
        label: 'RQY',
        terms: {
            '60': { pb: 0.023014, pbDesempleo: 0.023314, sinProteccion: 0.021814, ref: 19.00 },
            '72': { pb: 0.020178, pbDesempleo: 0.020478, sinProteccion: 0.018978, ref: 20.00 },
            '84': { pb: 0.018169, pbDesempleo: 0.018469, sinProteccion: 0.016969, ref: 21.00 },
            '96': { pb: 0.016679, pbDesempleo: 0.016979, sinProteccion: 0.015479, ref: 21.00 },
            '108': { pb: 0.015533, pbDesempleo: 0.015833, sinProteccion: 0.014333, ref: 21.00 },
            '120': { pb: 0.014628, pbDesempleo: 0.014928, sinProteccion: 0.013428, ref: 21.00 }
        }
    },
    '9.95': {
        rate: '9.95',
        label: 'RQZ',
        terms: {
            '60': { pb: 0.023269, pbDesempleo: 0.023569, sinProteccion: 0.022069, ref: 21.00 },
            '72': { pb: 0.020439, pbDesempleo: 0.020739, sinProteccion: 0.019239, ref: 22.00 },
            '84': { pb: 0.018437, pbDesempleo: 0.018737, sinProteccion: 0.017237, ref: 23.00 },
            '96': { pb: 0.016952, pbDesempleo: 0.017252, sinProteccion: 0.015752, ref: 23.00 },
            '108': { pb: 0.015812, pbDesempleo: 0.016112, sinProteccion: 0.014612, ref: 23.00 },
            '120': { pb: 0.014914, pbDesempleo: 0.015214, sinProteccion: 0.013714, ref: 23.00 }
        }
    },
    '10.45': {
        rate: '10.45',
        label: 'RR0',
        terms: {
            '60': { pb: 0.023526, pbDesempleo: 0.023826, sinProteccion: 0.022326, ref: 23.00 },
            '72': { pb: 0.020702, pbDesempleo: 0.021002, sinProteccion: 0.019502, ref: 24.00 },
            '84': { pb: 0.018706, pbDesempleo: 0.019006, sinProteccion: 0.017506, ref: 25.00 },
            '96': { pb: 0.017228, pbDesempleo: 0.017528, sinProteccion: 0.016028, ref: 25.00 },
            '108': { pb: 0.016095, pbDesempleo: 0.016395, sinProteccion: 0.014895, ref: 25.00 },
            '120': { pb: 0.015203, pbDesempleo: 0.015503, sinProteccion: 0.014003, ref: 25.00 }
        }
    }
};
