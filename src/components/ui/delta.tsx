import React from 'react';
import { DeltaResult } from '@/utils/deltaCalculations';

interface DeltaProps {
  delta: DeltaResult | null;
  className?: string;
  isBadMetric?: boolean; // For metrics where lower is better
}

export const Delta: React.FC<DeltaProps> = ({ 
  delta, 
  className = "",
  isBadMetric = false
}) => {
  if (!delta) {
    return null;
  }

  const { value, isPositive, isZero } = delta;

  // Format delta similar to KPICard
  const formatDelta = (deltaValue: number) => {
    const sign = deltaValue >= 0 ? '+' : '';
    return `${sign}${deltaValue.toFixed(1)}%`;
  };

  // Use same logic as KPICard for styling
  const deltaClass = isZero ? 'text-muted-foreground' : 
    isBadMetric 
      ? (isPositive ? 'delta-negative' : 'delta-positive')
      : (isPositive ? 'delta-positive' : 'delta-negative');

  return (
    <div className={`flex items-start text-xs font-medium whitespace-nowrap flex-shrink-0 ${deltaClass} ${className}`}>
      <span className="tabular-nums">
        {formatDelta(value)}
      </span>
    </div>
  );
};
