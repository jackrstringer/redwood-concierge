import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
  subtitle?: string; // For showing sub-percentages
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  delta,
  format = 'number',
  sparkline,
  className = '',
  subtitle
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`;
      default:
        return val.toLocaleString('en-US');
    }
  };

  const formatDelta = (deltaValue: number) => {
    const sign = deltaValue >= 0 ? '+' : '';
    return `${sign}${(deltaValue * 100).toFixed(1)}%`;
  };

  return (
    <Card className={`dashboard-card p-3 sm:p-4 hover-lift mobile-optimized ${className}`}>
      <div className="space-y-2">
        <p className="metric-label">{title}</p>
        <div className="flex items-end justify-between">
          <div className="flex flex-col min-w-0 flex-1">
            <p className="metric-value dashboard-text truncate">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-xs dashboard-text-muted mt-1 hide-on-mobile">
                {subtitle}
              </p>
            )}
          </div>
          {delta && (
            <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ml-2 ${
              delta.isPositive ? 'delta-positive' : 'delta-negative'
            }`}>
              {delta.isPositive ? (
                <TrendingUp className="h-3 w-3 flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 flex-shrink-0" />
              )}
              <span className="tabular-nums">
                {formatDelta(delta.value)}
              </span>
            </div>
          )}
        </div>
        
        {sparkline && sparkline.length > 0 && (
          <div className="mt-3 sm:mt-4 h-6 sm:h-8 flex items-end justify-between gap-0.5 hide-on-mobile">
            {sparkline.map((point, index) => {
              const height = Math.max(2, (point / Math.max(...sparkline)) * (window.innerWidth < 640 ? 16 : 24));
              return (
                <div
                  key={index}
                  className="bg-dashboard-accent/30 rounded-sm flex-1 transition-all duration-300"
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