
import React from 'react';

// FIX: Added IconProps export and defined a base interface for all icons.
export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const createIcon = (path: React.ReactNode) => {
    const IconComponent: React.FC<IconProps> = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            {path}
        </svg>
    );
    IconComponent.displayName = 'Icon';
    return IconComponent;
};

// FIX: Replaced the old spinner with a new circular, spinning one for a more modern look.
export const SpinnerIcon: React.FC<IconProps> = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(30 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.083s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(60 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.166s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(90 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.249s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(120 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.332s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(150 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.415s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(180 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.498s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(210 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.581s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(240 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.664s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(270 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.747s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(300 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.83s" />
            </rect>
            <rect x="11" y="2" width="2" height="5" rx="1" fill="currentColor" opacity="0.1" transform="rotate(330 12 12)">
                <animate attributeName="opacity" values="1;0.1" dur="1s" repeatCount="indefinite" begin="0.913s" />
            </rect>
        </g>
    </svg>
);

export const HeadphonesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75v-2.25a3.375 3.375 0 00-3.375-3.375h-1.5A3.375 3.375 0 007.5 16.5v2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75a3.375 3.375 0 003.375-3.375V11.25a3.375 3.375 0 00-3.375-3.375h-1.5A3.375 3.375 0 007.5 11.25v3.375a3.375 3.375 0 003.375 3.375M7.5 18.75v-2.25" />
    </svg>
);


export const ClassicMicrophoneIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const ClassicSpeakerIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

export const ClassicSpeakerMuteIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 9l5 5m0-5l-5 5" />
    </svg>
);

// Police Light Icon for Fraud Alerts
export const PoliceLightIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4Zm6 8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h12Zm-6-2a6 6 0 0 0-6 6v8h12v-8a6 6 0 0 0-6-6Z" opacity="0.3" />
        <path d="M12 2a4 4 0 0 1 4 4v2h-2V6a2 2 0 0 0-4 0v2H8V6a4 4 0 0 1 4-4Z" />
        <path fillRule="evenodd" d="M12 9a5 5 0 0 0-5 5v7h10v-7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v2H9v-2Z" clipRule="evenodd" />
    </svg>
);


// FIX: Created and exported all missing icon components.
export const ChatbotIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />);
export const RotateIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />);
export const SimulatorIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 21V5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25V21M4.5 21H21" />);
export const ShieldCheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />);
export const PersonIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />);
export const XIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />);
export const WarningIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />);
export const ExclamationTriangleIcon = WarningIcon;
export const EditIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />);
export const CheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />);
export const CheckCircleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const CaixaBankLogoIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />); // Placeholder
export const SearchIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />);
export const InfoIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />);
export const FileTextIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />);
export const ExternalLinkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.125c.621 0 1.125.504 1.125 1.125V10.5m-4.5 0l4.5-4.5" />);
export const PrintIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />);
export const DownloadIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />);
export const ArrowLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />);
export const ArrowRightIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />);
export const ArrowUturnLeftIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />);
export const PhoneIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />);
export const EmailIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />);
export const UsersIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.152-1.293a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.152-1.293v-2.136a2.25 2.25 0 00-2.25-2.25H13.5m-3 0v2.136m0 0a2.25 2.25 0 002.25 2.25h1.5m-6.38-5.042A2.25 2.25 0 019 13.5h.008v.008H9v-.008zm5.25 0A2.25 2.25 0 0115 13.5h.008v.008h-.008v-.008z" />);
export const TeamIcon = UsersIcon;
export const TrainingIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-1.07-1.07a53.836 53.836 0 012.658-.814m15.482 0l1.07 1.07a53.836 53.836 0 002.658-.814m-15.482 0l-1.07-1.07" />);
export const EuroIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 010 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const StarIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />);
export const LightbulbIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-3.75 0M12 10.5h.008v.008H12V10.5z" />);
export const DigitalSignatureIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />);
export const ManualsIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.485 0 4.847-.655 6.879-1.804M12 6.042V18.75m0-12.708a8.967 8.967 0 016 2.292c1.052.332 2.062.512 3 .512v-14.25a8.987 8.987 0 00-3-1.288c-2.485 0-4.847.655-6.879 1.804M12 6.042L12 3.75m0 2.292l-2.121-2.121" />);
export const BellIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.033A23.847 23.847 0 008.143 17.082M12 21a2.25 2.25 0 01-2.25-2.25H14.25A2.25 2.25 0 0112 21z" />);
export const HomeIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />);
export const CustomerSupportIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a6 6 0 00-6 6v1.5a6 6 0 006 6z M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.5 4.5m0-4.5l-4.5 4.5" />);
export const ListIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />);
export const ChevronDownIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />);
export const CaixaStarIcon = StarIcon; // Placeholder
export const CogIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />);
export const LeafIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18a4.5 4.5 0 00-1.88-3.593l-3.62-3.62a4.5 4.5 0 10-6.364-6.364l-3.62 3.62A4.5 4.5 0 003 12.75v2.25a4.5 4.5 0 004.5 4.5h2.25a4.5 4.5 0 003.593-1.88l3.62-3.62a4.5 4.5 0 001.88-3.593M16.5 18a4.5 4.5 0 00-1.88-3.593m1.88 3.593v-2.25m0 2.25h-2.25" />);
export const MapIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-6.998l-6.878 2.292m6.878-2.292l-6.878 2.292m6.878-2.292L21 9m-9 6l-6.878-2.292M12 15L5.122 12.708M12 15l6.878 2.292m-6.878-2.292L5.122 12.708" />);
export const MapPinIcon = createIcon(<><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>);
export const OperationsManagerIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6V4.5m0 0h1.5m-1.5 0h.75m0 0h7.5m-7.5 0h7.5m3-3v1.5m0 0h1.5m-1.5 0h.75m0 0h7.5" />);
export const DocumentSubmissionIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />);
export const MicrophoneIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a6 6 0 00-6 6v1.5a6 6 0 006 6zM21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.75 12H4.5m15 0h.75" />);
export const SendIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />);
export const SpeakerWaveIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.5 4.5m0-4.5l-4.5 4.5M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a6 6 0 00-6 6v1.5a6 6 0 006 6z" />);
export const SpeakerXMarkIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a6 6 0 00-6 6v1.5a6 6 0 006 6zM6.75 8.25l4.5 4.5m0-4.5l-4.5 4.5" />);
export const ShareIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0-16l-4 4m4-4l4 4M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6" />);
export const UploadIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />);
export const CopyIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75m9.06-4.938l3.375-3.375a1.125 1.125 0 011.591 0l3.375 3.375c.44.44.44 1.151 0 1.591L15.82 8.41a1.125 1.125 0 01-1.591 0l-3.375-3.375a1.125 1.125 0 010-1.591z" />);
export const ChartBarIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />);
export const ComputerDesktopIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />);
export const DevicePhoneMobileIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3 14.25h.008v.008h-.008v-.008z" />);
export const AndroidIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M16 8v5a2 2 0 01-2 2H8a2 2 0 01-2-2V8m10 0l-1-4-1 4m0 0H6m4 0l1-4 1 4m-4-6h.01M14 2h.01" />);
export const AppleIcon = createIcon(<path d="M8.28,21.99C9.28,22,10.2,22,11,22c1.13,0,2.28-0.01,3.44-0.08c1.36-0.08,2.7-0.34,3.92-0.94 c2.31-1.15,3.46-3.09,3.58-5.63c0.01-0.2,0.01-0.4,0.01-0.6c0-1.87-0.78-3.64-2.2-4.9c-1.3-1.15-2.93-1.74-4.82-1.74 c-0.96,0-1.89,0.14-2.78,0.42c-1.7,0.54-3.15,1.58-4.14,3.05c-1.11,1.66-1.63,3.39-1.57,5.32c0.05,1.6,0.64,3.13,1.69,4.4 C7.03,21.23,7.63,21.65,8.28,21.99z M12.5,2C11.53,2.02,10.7,2.5,10.08,3.28c-1.51,1.88-2.2,4.2-1.92,6.5 c0.54-0.04,1.08-0.06,1.62-0.06c1.16,0,2.28,0.1,3.34,0.31c1.88,0.36,3.48,1.4,4.54,2.94c0.3,0.43,0.57,0.88,0.81,1.35 c-0.02-0.56-0.12-1.12-0.3-1.66c-0.66-1.93-1.91-3.55-3.6-4.66c-1.3-0.85-2.8-1.28-4.42-1.28c-0.34,0-0.68,0.02-1.02,0.05 C8.96,5.36,9.59,3.74,10.8,2.57C11.31,2.1,11.9,1.96,12.5,2z" />);
export const GooglePlayIcon = createIcon(<path d="M3.5,21.49l11.45-11.45l-11.45-11.45C3.25-1.16,3-0.89,3-0.49v22.98 C3,22.89,3.25,23.16,3.5,21.49z M20.55,10.45l-4.46-4.46L4.64-5.46c-0.33-0.33-0.86-0.33-1.19,0s-0.33,0.86,0,1.19 L14.9,7.18 M16.09,8.37l4.46,4.46c1.19,1.19,1.19,3.12,0,4.31l-4.46,4.46M14.9,14.82l-11.45,11.45 c-0.33,0.33-0.33,0.86,0,1.19s0.86,0.33,1.19,0l11.45-11.45" />);
export const WindowsIcon = createIcon(<path d="M3,12l8-1v8l-8-1V12z M3,3.5l8,1v7l-8-1V3.5z M13,11V3l8,1v7L13,11z M13,13l8,1v7l-8-1V13z" />);
export const ChromeIcon = createIcon(<><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="2.5" x2="19.07" y2="15.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="2.5" x2="4.93" y2="15.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><line x1="2.5" y1="9" x2="21.5" y2="9" fill="none" stroke="currentColor" strokeWidth="1.5" /></>);
export const SafariIcon = createIcon(<><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m12 12 5.2-5.2m-5.2 5.2-5.2 5.2m5.2-5.2 5.2 5.2m-5.2-5.2-5.2-5.2" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r=".75" fill="currentColor" /></>);
export const EdgeIcon = createIcon(<path d="M21.92,12.08c0-5.45-4.43-9.88-9.88-9.88S2.16,6.63,2.16,12.08s4.43,9.88,9.88,9.88c5.15,0,9.4-3.95,9.82-8.99 h-9.82V3.12c4.8,0.42,8.74,4.3,8.74,9.13s-3.94,8.71-8.74,9.13v-8.1h8.74c0.04-0.12,0.06-0.24,0.06-0.37Z" />);
export const CameraIcon = createIcon(
    <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </>
);
export const SunIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />);
export const MoonIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />);
export const ArrowRightOnRectangleIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />);
export const SparklesIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />);
export const PuzzlePieceIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.638 1.638 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.663-.657v0c0-.355-.186-.676-.401-.959a1.638 1.638 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84 2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />);
export const StopIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />);
export const EyeIcon = createIcon(
    <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
);
export const BriefcaseIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />);
export const BuildingOfficeIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />);
export const DocumentCheckIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />);
export const ClockIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />);
export const HeartIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />);
export const PlusIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />);
export const WifiOffIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 10.5a5.25 5.25 0 017.424 0M5.106 11.856c1.173-1.173 2.614-2.022 4.183-2.482m3.89-.377c1.996.177 3.86.99 5.715 2.859M1.924 8.674c1.745-1.745 3.73-3.085 5.92-3.858m4.238-.38c2.474.07 4.8.85 7 2.39 1.01.706 1.95 1.516 2.816 2.422M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />);
export const FingerprintIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3m-9 0c0-3.314 2.686-6 6-6s6 2.686 6 6M9 11c0-4.97 4.03-9 9-9s9 4.03 9 9m-12 3a3 3 0 00-3-3m0 0a3 3 0 013 3m0 3a3 3 0 003-3m0 0a3 3 0 013 3m-9 3a3 3 0 00-3-3m0 0a3 3 0 013 3m0 3a3 3 0 003-3m0 0a3 3 0 013 3" />);
export const FaceIdIcon = createIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5m1.125 10.125a2.25 2.25 0 002.25 2.25h1.125m-4.5 0h4.5m-5.625-1.125a2.25 2.25 0 01-2.25-2.25V9.75m10.125 4.5a2.25 2.25 0 002.25-2.25V9.75M19.125 4.875c0-.621-.504-1.125-1.125-1.125h-4.5m0 16.5h4.5c.621 0 1.125-.504 1.125-1.125v-4.5m-16.5 0v4.5c0 .621.504 1.125 1.125 1.125h4.5" />);
