import React, { useState } from 'react';
import { Calendar, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Week-to-date', value: 'wtd' },
  { label: 'Month-to-date', value: 'mtd' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Custom', value: 'custom' },
];

interface DashboardHeaderProps {
  onDateRangeChange: (range: string) => void;
  onCompareToggle: (enabled: boolean) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onDateRangeChange,
  onCompareToggle
}) => {
  const [selectedRange, setSelectedRange] = useState('last_30_days');
  const [compareEnabled, setCompareEnabled] = useState(true);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange(range);
  };

  const handleCompareToggle = () => {
    const newState = !compareEnabled;
    setCompareEnabled(newState);
    onCompareToggle(newState);
  };

  const selectedRangeLabel = dateRangeOptions.find(
    option => option.value === selectedRange
  )?.label || 'Last 30 days';

  return (
    <div className="dashboard-card border-b dashboard-border sticky top-0 z-10 overflow-x-hidden">
      <div className="px-4 sm:px-6 py-4 max-w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold dashboard-text">
              Redwood Concierge
            </h1>
            <p className="text-sm dashboard-text-muted">Account Overview</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 dashboard-text border-dashboard-border bg-dashboard-card hover:bg-muted/50 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{selectedRangeLabel}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 dashboard-card border-dashboard-border"
              >
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleRangeChange(option.value)}
                    className={`dashboard-text hover:bg-muted/50 ${
                      selectedRange === option.value ? 'bg-muted/30' : ''
                    }`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={handleCompareToggle}
              className="gap-2 dashboard-text hover:bg-muted/50 text-xs sm:text-sm w-full sm:w-auto justify-start sm:justify-center"
            >
              {compareEnabled ? (
                <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-dashboard-accent" />
              ) : (
                <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="truncate">Compare to previous period</span>
            </Button>
          </div>
        </div>
        
        <p className="mt-2 text-xs sm:text-sm dashboard-text-muted">
          Account timezone: UTC-8 (Pacific Standard Time)
        </p>
      </div>
    </div>
  );
};