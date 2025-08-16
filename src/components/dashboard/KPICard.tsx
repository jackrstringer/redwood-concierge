import React from 'react';
import { Card } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  format?: 'currency' | 'percentage' | 'number';
  sparkline?: number[];
  className?: string;
  subtitle?: string | React.ReactNode; // For showing sub-percentages
  isHighPerformance?: boolean; // For subtle performance indicators
  isBadMetric?: boolean; // For metrics where down is good (unsubs, spam, bounces)
}

interface KPICardClickHandler {
  onCardClick?: (metric: {
    title: string;
    value: string | number;
    delta?: {
      value: number;
      isPositive: boolean;
    };
    format?: 'currency' | 'percentage' | 'number';
    sparkline?: number[];
    isHighPerformance?: boolean;
    isBadMetric?: boolean;
  }) => void;
}

export const KPICard: React.FC<KPICardProps & KPICardClickHandler> = ({
  title,
  value,
  delta,
  format = 'number',
  sparkline,
  className = '',
  subtitle,
  isHighPerformance = false,
  isBadMetric = false,
  onCardClick
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(val >= 10000000 ? 1 : 2)}M`;
        } else if (val >= 1000) {
          return `$${(val / 1000).toFixed(val >= 100000 ? 0 : 1)}k`;
        }
        return `$${val.toFixed(2)}`;
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`;
      default:
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(0)}k`;
        }
        return val.toLocaleString('en-US');
    }
  };

  const formatDelta = (deltaValue: number) => {
    const sign = deltaValue >= 0 ? '+' : '';
    return `${sign}${(deltaValue * 100).toFixed(1)}%`;
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({
        title,
        value,
        delta,
        format,
        sparkline,
        isHighPerformance,
        isBadMetric
      });
    }
  };

  return (
    <Card 
      className={`dashboard-card p-4 hover-lift relative overflow-hidden ${isHighPerformance ? 'performance-highlight' : ''} ${onCardClick ? 'cursor-pointer kpi-card-clickable' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <div className="space-y-2">
        <p className="metric-label">{title}</p>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <p className="metric-value dashboard-text leading-tight break-all tabular-nums">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs dashboard-text-muted mt-1 truncate tabular-nums">
                {subtitle}
              </p>
            )}
          </div>
          {delta && (
            <div className={`flex items-start text-xs font-medium whitespace-nowrap flex-shrink-0 mt-1 ${
              isBadMetric 
                ? (delta.isPositive ? 'delta-negative' : 'delta-positive')
                : (delta.isPositive ? 'delta-positive' : 'delta-negative')
            }`}>
              <span className="tabular-nums">
                {formatDelta(delta.value)}
              </span>
            </div>
          )}
        </div>
        
        {sparkline && sparkline.length > 0 && (
          <div className="mt-4 h-8 flex items-end justify-between gap-0.5">
            {sparkline.map((point, index) => {
              const height = Math.max(2, (point / Math.max(...sparkline)) * 24);
              return (
                <div
                  key={index}
                  className="bg-dashboard-accent/30 rounded-sm flex-1"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};