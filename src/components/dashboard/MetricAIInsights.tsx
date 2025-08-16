import React, { useState } from 'react';
import { Brain, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { metricInsights, MetricInsights } from '@/data/aiInsights';

interface MetricAIInsightsProps {
  metricTitle: string;
  className?: string;
}

export const MetricAIInsights: React.FC<MetricAIInsightsProps> = ({ 
  metricTitle, 
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const insights = metricInsights[metricTitle];
  
  // Simulate loading for AI insights
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [metricTitle]);
  
  if (!insights) return null;

  if (isLoading) {
    return (
      <div className={`glass-panel p-3 md:p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Analyzing recent events...</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="space-y-3">
          <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
          <div className="h-3 bg-muted/50 rounded animate-pulse w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-3 md:p-6 max-w-full ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
          <Brain className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Analysis for {metricTitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* What Happened */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">What Happened</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights.whatHappened}
          </p>
        </div>

        {/* Why It Happened */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Why It Happened</h4>
          </div>
          <ul className="space-y-1.5">
            {insights.whyItHappened.map((reason, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* What To Do Next */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">What To Do Next</h4>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-accent/5 to-purple-500/5 border border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insights.whatToDoNext}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};