import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut
}) => {
  const getZoomLabel = (level: number) => {
    switch (level) {
      case 1: return '1 col';
      case 2: return '2 cols';
      case 3: return '3 cols';
      case 4: return '4 cols';
      case 5: return '5 cols';
      default: return `${level} cols`;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-dashboard-card border border-dashboard-border rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        disabled={zoomLevel <= 1}
        className="h-8 w-8 p-0 hover:bg-dashboard-accent/10"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <span className="text-xs font-medium dashboard-text-muted px-2 min-w-[50px] text-center">
        {getZoomLabel(zoomLevel)}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        disabled={zoomLevel >= 5}
        className="h-8 w-8 p-0 hover:bg-dashboard-accent/10"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};