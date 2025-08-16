import React, { useState } from 'react';
import { Sparkles, Brain, TrendingUp, Lightbulb, GitBranch, Target } from 'lucide-react';
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
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [metricTitle]);
  
  if (!insights) return null;

  if (isLoading) {
    return (
      <div className={`glass-panel p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Analyzing metric performance...</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/50 rounded animate-pulse w-full" />
            <div className="h-3 bg-muted/50 rounded animate-pulse w-5/6" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-muted/50 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
          <Brain className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground">Personalized analysis for {metricTitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Performance Context */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Performance Context</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insights.performanceContext}
          </p>
        </div>

        {/* Contributing Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Contributing Factors</h4>
          </div>
          <ul className="space-y-2">
            {insights.contributingFactors.map((factor, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>

        {/* Optimization Opportunities */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Optimization Opportunities</h4>
          </div>
          <ul className="space-y-2">
            {insights.optimizationOpportunities.map((opportunity, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                {opportunity}
              </li>
            ))}
          </ul>
        </div>

        {/* Related Metrics Impact */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Related Metrics Impact</h4>
          </div>
          <ul className="space-y-2">
            {insights.relatedMetricsImpact.map((impact, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                {impact}
              </li>
            ))}
          </ul>
        </div>

        {/* Trend Prediction */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Trend Prediction</h4>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-accent/5 to-purple-500/5 border border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insights.trendPrediction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};