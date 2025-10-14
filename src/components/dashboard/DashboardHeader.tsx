import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, toZonedTime } from 'date-fns-tz';

const dateRangeOptions = [
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
];

interface DashboardHeaderProps {
  onDateRangeChange: (range: string) => void;
  onCompareToggle: (enabled: boolean) => void;
  lastJobTime?: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onDateRangeChange,
  onCompareToggle,
  lastJobTime
}) => {
  const [selectedRange, setSelectedRange] = useState('last_7_days');
  const [compareEnabled, setCompareEnabled] = useState(true);

  useEffect(() => {
    onDateRangeChange('last_7_days');
  }, []);

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
  )?.label || 'Last 7 days';

  const formatJobTime = (jobTime: string | null) => {
    if (!jobTime) {
      return 'No recent job runs';
    }

    try {
      // Ensure DB string is treated as UTC
      const utcDate = new Date(jobTime.endsWith('Z') ? jobTime : jobTime + 'Z');

      // Detect user local timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const zonedDate = toZonedTime(utcDate, timeZone);

      // Format with timezone abbreviation
      const formatted = format(zonedDate, "MMM d, yyyy h:mm a ", { timeZone });

      return `Last updated: ${formatted}`;
    } catch {
      return 'Invalid job time';
    }
  };

  return (
    <div className="dashboard-card border-b dashboard-border sticky top-0 z-10 overflow-x-hidden backdrop-blur-lg bg-background/90">
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
                  className="gap-2 dashboard-text border-dashboard-border bg-dashboard-card hover:bg-white hover:text-black text-xs sm:text-sm w-full sm:w-auto"
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
                    className={`dashboard-text hover:bg-white hover:text-black ${
                      selectedRange === option.value ? 'bg-muted/30' : ''
                    }`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={handleCompareToggle}
              className="gap-2 dashboard-text hover:bg-white hover:text-black text-xs sm:text-sm w-full sm:w-auto justify-start sm:justify-center group border-dashboard-border bg-dashboard-card"
            >
              {compareEnabled ? (
                <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-dashboard-accent group-hover:text-black" />
              ) : (
                <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4 group-hover:text-black" />
              )}
              <span className="truncate">Compare to previous period</span>
            </Button>
          </div>
        </div>
        
        <p className="mt-2 text-xs sm:text-sm dashboard-text-muted">
          {formatJobTime(lastJobTime)}
        </p>
      </div>
    </div>
  );
};