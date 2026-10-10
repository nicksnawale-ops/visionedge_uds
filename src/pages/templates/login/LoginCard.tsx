import React from 'react';
import { Logo } from '../../../components/brand/Logo';
import type { UseCaseConfig } from './backgrounds';
import { COPY } from './loginStates';

interface LoginCardProps {
  useCase: UseCaseConfig;
  /** Spacing below the logo block (32px on Login). */
  headerClassName?: string;
  children: React.ReactNode;
}

/**
 * The sign-in card: 440px wide (full width minus 32px on mobile), white, 16px radius,
 * 1px Gray 200 border, soft navy shadow, 40px padding (24px on mobile).
 */
export const LoginCard: React.FC<LoginCardProps> = ({ useCase, headerClassName = 'mb-8', children }) => (
  <div className="relative w-full bg-white rounded-[16px] border border-[#DDE2EA] shadow-[0_12px_32px_rgba(11,45,107,0.12)] p-6 @min-[640px]:p-10">
    <div className={`flex flex-col items-center ${headerClassName}`}>
      <div className="flex items-center gap-2">
        <Logo size={40} />
        <span className="text-[20px] leading-[28px] font-semibold text-[#121722]">{COPY.brandName}</span>
      </div>
      {useCase.chip && (
        <span className="mt-3 inline-flex items-center h-6 px-2.5 rounded-full bg-[#1E63FF]/[0.08] text-[11px] leading-[16px] font-medium uppercase tracking-[0.08em] text-[#1E63FF]">
          {useCase.chip}
        </span>
      )}
    </div>
    {children}
  </div>
);
