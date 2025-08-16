import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { sectionInsights, SectionInsights as SectionInsightsType } from '@/data/aiInsights';

interface SectionInsightsProps {
  sectionName: string;
  className?: string;
}

export const SectionInsights: React.FC<SectionInsightsProps> = ({ 
  sectionName, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const insights = sectionInsights[sectionName];
  
  if (!insights) return null;

  const handleToggle = async () => {
    if (!isOpen && !isLoading) {
      setIsLoading(true);
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleToggle}
            className="h-auto p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group glass-panel"
          >
            <Sparkles className="h-4 w-4 mr-2 text-accent" />
            AI Insights
            {isLoading ? (
              <div className="ml-2 h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            ) : (
              <div className="ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180">
                <ChevronDown className="h-4 w-4" />
              </div>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="mt-4 glass-panel p-6 space-y-6">
            {/* Performance Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h4 className="text-sm font-semibold text-foreground">Performance Summary</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insights.performanceSummary}
              </p>
            </div>

            {/* Key Trends */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <h4 className="text-sm font-semibold text-foreground">Key Trends</h4>
              </div>
              <ul className="space-y-2">
                {insights.keyTrends.map((trend, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h4 className="text-sm font-semibold text-foreground">Recommendations</h4>
              </div>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Alerts */}
            {insights.riskAlerts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <h4 className="text-sm font-semibold text-foreground">Risk Alerts</h4>
                </div>
                <ul className="space-y-2">
                  {insights.riskAlerts.map((alert, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cross-Metric Relationships */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-accent to-purple-500" />
                <h4 className="text-sm font-semibold text-foreground">Cross-Metric Impact</h4>
              </div>
              <ul className="space-y-2">
                {insights.crossMetricRelationships.map((relationship, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    {relationship}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};