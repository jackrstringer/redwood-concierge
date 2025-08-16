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
  const [compareEnabled, setCompareEnabled] = useState(false);

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
    <div className="dashboard-card border-b dashboard-border sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold dashboard-text">
            Account Overview
          </h1>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 dashboard-text border-dashboard-border bg-dashboard-card hover:bg-muted/50"
                >
                  <Calendar className="h-4 w-4" />
                  {selectedRangeLabel}
                  <ChevronDown className="h-4 w-4" />
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
              className="gap-2 dashboard-text hover:bg-muted/50"
            >
              {compareEnabled ? (
                <ToggleRight className="h-4 w-4 text-dashboard-accent" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              Compare to previous period
            </Button>
          </div>
        </div>
        
        <p className="mt-2 text-sm dashboard-text-muted">
          Account timezone: UTC-8 (Pacific Standard Time)
        </p>
      </div>
    </div>
  );
};