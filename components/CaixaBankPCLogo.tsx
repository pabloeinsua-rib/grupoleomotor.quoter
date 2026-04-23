import React from 'react';

interface CaixaBankPCLogoProps {
  className?: string;
}

const CaixaBankPCLogo: React.FC<CaixaBankPCLogoProps> = ({ className }) => {
  const logoUrl = "https://storage.googleapis.com/bucket_quoter_auto2/fortos/CaixaBank_Logo_Payments-Consumer_RGB_4.png";

  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <span className="font-bold text-[#00A0E3] text-xl">CaixaBank Payments & Consumer</span>
    </div>
  );
};

export default CaixaBankPCLogo;