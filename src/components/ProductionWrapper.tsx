
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

interface ProductionWrapperProps {
  children: React.ReactNode;
}

const ProductionWrapper: React.FC<ProductionWrapperProps> = ({ children }) => {
  usePerformanceMonitoring();

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default ProductionWrapper;
