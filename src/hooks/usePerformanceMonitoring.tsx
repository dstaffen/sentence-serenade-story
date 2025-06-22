
import { useEffect } from 'react';

interface PerformanceMetrics {
  name: string;
  duration: number;
  startTime: number;
}

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          
          // In production, send to analytics service
          if (process.env.NODE_ENV === 'production') {
            // Example: analytics.track('performance_metric', {
            //   name: entry.name,
            //   duration: entry.duration,
            //   timestamp: Date.now()
            // });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, []);

  const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
    const startTime = performance.now();
    performance.mark(`${name}-start`);
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      });
    } else {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      return result;
    }
  };

  return { measurePerformance };
};
