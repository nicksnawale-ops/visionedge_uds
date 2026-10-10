import React from 'react';
import logo from '../../assets/images/logo.png';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <img
      src={logo}
      alt="VisionEdge logo"
      draggable={false}
      style={{ height: size, width: 'auto', objectFit: 'contain' }}
      className={`shrink-0 ${className}`}
    />
  );
};

export { logo as logoSrc };

export default Logo;
