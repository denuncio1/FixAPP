"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className }) => {
  return (
    <img 
      src="/imagem 1.png" 
      alt="FixApp Logo" 
      className={cn("h-24 w-auto", className)} // Mantendo o tamanho h-24 e largura automática
    />
  );
};

export default AppLogo;