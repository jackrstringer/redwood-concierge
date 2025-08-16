import React, { useState } from 'react';
import { Calendar, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZoomControls } from './ZoomControls';
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
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onDateRangeChange, 
  onCompareToggle,
  zoomLevel = 2,
  onZoomIn = () => {},
  onZoomOut = () => {}
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
    <header className="dashboard-card border-b border-dashboard-border p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold dashboard-text">Account Overview</h1>
          <p className="text-xs sm:text-sm dashboard-text-muted mt-1">
            Timezone: UTC-8 (Pacific Time)
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Mobile Zoom Controls */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <span className="text-sm dashboard-text-muted">Layout:</span>
            <ZoomControls
              zoomLevel={zoomLevel}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
            />
          </div>
          
          {/* Desktop Zoom Controls */}
          <div className="hidden sm:flex">
            <ZoomControls
              zoomLevel={zoomLevel}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 dashboard-text border-dashboard-border bg-dashboard-card hover:bg-muted/50 text-xs sm:text-sm"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{selectedRangeLabel}</span>
                <span className="sm:hidden">Range</span>
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
            className="gap-2 dashboard-text hover:bg-muted/50 text-xs sm:text-sm px-2 sm:px-4"
          >
            {compareEnabled ? (
              <ToggleRight className="h-3 w-3 sm:h-4 sm:w-4 text-dashboard-accent" />
            ) : (
              <ToggleLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">Compare to previous period</span>
            <span className="sm:hidden">Compare</span>
          </Button>
        </div>
      </div>
    </header>
  );
};