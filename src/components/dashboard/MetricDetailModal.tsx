import React, { useState } from 'react';
import { X, Info, Flag, Send } from 'lucide-react';
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
  const [showFlagForm, setShowFlagForm] = useState(false);
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
      title: "Metric flagged for review",
      description: "A Redwood specialist will review this metric and follow up in your shared agency channel.",
    });
    
    setIsSubmitting(false);
    setShowFlagForm(false);
    setFlagNotes('');
    onClose();
  };

  if (!metric) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Metric Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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

          {/* Educational Content */}
          {education && (
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Understanding This Metric</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Definition</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {education.definition}
                  </p>
                </div>

                {education.calculation && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">How It's Calculated</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {education.calculation}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-foreground mb-1">Why It Matters</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {education.importance}
                  </p>
                </div>

                {education.benchmark && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Industry Benchmark</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {education.benchmark}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flag for Review Section */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-medium text-foreground">Flag for Review</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFlagForm(!showFlagForm)}
                className="glass-button"
              >
                {showFlagForm ? 'Cancel' : 'Request Review'}
              </Button>
            </div>

            {!showFlagForm && (
              <p className="text-sm text-muted-foreground">
                Need help understanding this metric or see something unusual? 
                A Redwood specialist can provide personalized insights.
              </p>
            )}

            {showFlagForm && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    A Redwood specialist will be notified and will reach out via your shared agency channel 
                    with personalized insights about this metric.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Additional Context (Optional)
                  </label>
                  <Textarea
                    placeholder="Any specific questions or concerns about this metric?"
                    value={flagNotes}
                    onChange={(e) => setFlagNotes(e.target.value)}
                    rows={3}
                    className="resize-none glass-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    {flagNotes.length}/500 characters
                  </p>
                </div>

                <Button
                  onClick={handleFlagSubmit}
                  disabled={isSubmitting}
                  className="glass-submit-button w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review Request
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};