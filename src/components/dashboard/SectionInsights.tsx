import React, { useState } from 'react';
import { ChevronDown, Sparkles, Brain, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sectionInsights } from '@/data/aiInsights';

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
  
  const handleToggle = async () => {
    if (!isOpen) {
      setIsLoading(true);
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsLoading(false);
    }
    setIsOpen(!isOpen);
  };

  if (!insights) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`w-full ${className}`}>
      <CollapsibleTrigger asChild>
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Insights</span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        {isLoading ? (
          <div className="glass-panel p-3 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Generating AI Insights</h3>
                <p className="text-xs text-muted-foreground">Analyzing recent events and performance...</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
              <div className="h-3 bg-muted/50 rounded animate-pulse w-5/6" />
            </div>
          </div>
        ) : (
          <div className="glass-panel p-4 md:p-6 w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
                <p className="text-xs text-muted-foreground">{sectionName} analysis</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* What Happened */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <h4 className="text-sm font-semibold text-foreground">What Happened</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insights.whatHappened}
                </p>
              </div>

              {/* Why It Happened */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  <h4 className="text-sm font-semibold text-foreground">Why It Happened</h4>
                </div>
                <ul className="space-y-2">
                  {insights.whyItHappened.map((reason, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="flex-1">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What To Do Next */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <h4 className="text-sm font-semibold text-foreground">What To Do Next</h4>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-accent/5 to-purple-500/5 border border-accent/20">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insights.whatToDoNext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};