import React, { useState } from 'react';
import { Info, Flag, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KPICard } from './KPICard';
import { useToast } from '@/hooks/use-toast';
import { metricEducation } from '@/data/metricEducation';

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    title: string;
    value: string | number;
    delta?: {
      value: number;
      isPositive: boolean;
    };
    format?: 'currency' | 'percentage' | 'number';
    sparkline?: number[];
    isHighPerformance?: boolean;
  } | null;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  isOpen,
  onClose,
  metric
}) => {
  const [flagNotes, setFlagNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const education = metric ? metricEducation[metric.title] : null;

  const handleFlagSubmit = async () => {
    if (!metric) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "🚀 Review Request Submitted!",
      description: "Your Redwood specialist has been notified and will respond in your shared channel within minutes. You're in great hands!",
      duration: 6000,
      className: "border-border bg-card text-card-foreground shadow-2xl backdrop-blur-sm",
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        maxWidth: '320px',
        width: '85vw'
      }
    });
    
    setIsSubmitting(false);
    setFlagNotes('');
    onClose();
  };

  if (!metric) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-2xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <h2 className="text-xl font-semibold text-foreground mb-4">Metric Review</h2>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metric Preview */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <KPICard
                title={metric.title}
                value={metric.value}
                delta={metric.delta}
                format={metric.format}
                sparkline={metric.sparkline}
                isHighPerformance={metric.isHighPerformance}
                className="pointer-events-none"
              />
            </div>
          </div>

          {/* Flag for Review Section - Primary Focus */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Flag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Flag for Review?</h3>
                <p className="text-sm text-muted-foreground">Submit a review request to automatically flag this metric for review in our shared channel, and notify your Redwood Account Specialist.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Additional Context <span className="text-xs text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  placeholder="e.g., 'This seems unusually low compared to last month' or 'Need help optimizing this metric'"
                  value={flagNotes}
                  onChange={(e) => setFlagNotes(e.target.value)}
                  rows={3}
                  className="resize-none glass-input"
                  autoFocus={false}
                  data-no-autofocus="true"
                />
                <p className="text-xs text-muted-foreground">
                  {flagNotes.length}/500 characters
                </p>
              </div>

              <Button
                onClick={handleFlagSubmit}
                disabled={isSubmitting}
                className="w-full glass-submit-button"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Request Specialist Review
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Educational Content - Compact */}
          {education && (
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">Quick Reference</h4>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong>Definition:</strong> {education.definition}</p>
                {education.benchmark && (
                  <p><strong>Benchmark:</strong> {education.benchmark}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};