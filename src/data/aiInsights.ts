export interface AIInsight {
  summary: string;
  keyTrends: string[];
  recommendations: string[];
  riskAlerts?: string[];
  crossMetricImpact?: string[];
}

export interface SectionInsights {
  sectionName: string;
  performanceSummary: string;
  keyTrends: string[];
  recommendations: string[];
  riskAlerts: string[];
  crossMetricRelationships: string[];
}

export interface MetricInsights {
  metricName: string;
  performanceContext: string;
  contributingFactors: string[];
  optimizationOpportunities: string[];
  relatedMetricsImpact: string[];
  trendPrediction: string;
}

// Section-level AI insights
export const sectionInsights: Record<string, SectionInsights> = {
  "Core Revenue Metrics": {
    sectionName: "Core Revenue Metrics",
    performanceSummary: "Strong revenue performance with total revenue up 18.5% versus last period. Email channel driving 34% of total revenue, exceeding industry benchmarks.",
    keyTrends: [
      "Email revenue share increasing steadily (+2.1% this period)",
      "Campaign revenue outpacing flow revenue growth (24% vs 15%)",
      "Average order value trending upward (+$12 average)",
      "Revenue per recipient improving across all segments"
    ],
    recommendations: [
      "Increase campaign frequency during high-performance windows",
      "Test premium product positioning to boost AOV further",
      "Expand high-performing segments to similar audiences",
      "Optimize flow sequences for better revenue capture"
    ],
    riskAlerts: [
      "Revenue concentration risk: 68% from top 3 campaigns",
      "Seasonal dependency showing in trend analysis"
    ],
    crossMetricRelationships: [
      "Higher email sends correlating with increased revenue (+15% send volume = +8% revenue)",
      "Open rate improvements directly impact RPR (1% open rate = $0.12 RPR increase)",
      "AOV increases when campaign frequency optimized (sweet spot: 3.2 campaigns/week)"
    ]
  },
  "Performance Metrics": {
    sectionName: "Performance Metrics",
    performanceSummary: "Email engagement showing mixed signals. Strong open rates (28.4%) but click rates declining slightly (-0.8%). Deliverability remains excellent with low spam/bounce rates.",
    keyTrends: [
      "Open rates maintaining above-industry performance",
      "Click rates showing gradual decline over 8 weeks",
      "Mobile engagement outperforming desktop (+12%)",
      "Weekend sends showing higher engagement rates"
    ],
    recommendations: [
      "A/B test email content format and CTA placement",
      "Segment by device type for optimized experiences",
      "Increase weekend campaign allocation",
      "Review content strategy for click-through optimization"
    ],
    riskAlerts: [
      "Click rate decline may impact future revenue if not addressed",
      "Engagement concentration in specific segments may indicate list fatigue"
    ],
    crossMetricRelationships: [
      "Open rate improvements correlate with 3x revenue impact versus click rate improvements",
      "Placed order rate heavily influenced by landing page experience (not just email)",
      "Unsubscribe spikes follow high-frequency campaign periods"
    ]
  },
  "Send Volume Metrics": {
    sectionName: "Send Volume Metrics",
    performanceSummary: "Healthy send volume growth with 2.4M emails sent this period. Campaign sends up 22% while maintaining deliverability standards.",
    keyTrends: [
      "Total send volume growing faster than list size (indicates higher frequency)",
      "Campaign sends increasing, flow sends steady",
      "Send frequency optimization showing positive ROI",
      "Deliverability maintaining 98.2% despite volume increases"
    ],
    recommendations: [
      "Continue gradual frequency increases for engaged segments",
      "Expand flow automation to capture more lifecycle moments",
      "Test send time optimization for different segments",
      "Monitor list health metrics closely with volume growth"
    ],
    riskAlerts: [
      "Rapid send volume growth may impact long-term deliverability",
      "Campaign-heavy strategy may lead to subscriber fatigue"
    ],
    crossMetricRelationships: [
      "Send volume increases correlate with revenue but with diminishing returns after 3.5 sends/week",
      "Higher campaign sends impact flow performance negatively if not properly spaced",
      "List growth rate needs to match send volume growth to maintain engagement"
    ]
  },
  "List Growth Metrics": {
    sectionName: "List Growth Metrics",
    performanceSummary: "Steady list growth with 1,247 new subscribers this period. Net growth positive at 3.8% monthly rate, driven by improved opt-in conversion.",
    keyTrends: [
      "New subscriber acquisition accelerating (+28% vs last period)",
      "Unsubscribe rate remaining low and stable",
      "Engagement rate among new subscribers trending up",
      "Reactivation campaigns showing improved performance"
    ],
    recommendations: [
      "Scale successful acquisition channels (social, content)",
      "Implement progressive profiling for new subscribers",
      "Expand reactivation campaign reach",
      "Test multi-step opt-in processes for quality improvement"
    ],
    riskAlerts: [
      "Monitor new subscriber engagement quality as volume scales",
      "Seasonal acquisition patterns may impact Q4 growth"
    ],
    crossMetricRelationships: [
      "New subscriber quality inversely correlated with acquisition speed",
      "List growth rate impacts overall engagement metrics (dilution effect)",
      "Active profile ratio directly impacts deliverability and revenue per send"
    ]
  },
  "Subscription Metrics": {
    sectionName: "Subscription Metrics",
    performanceSummary: "Subscription business showing strong fundamentals with 4.2% monthly churn and $47K MRR. New subscription starts up 31% with improving retention metrics.",
    keyTrends: [
      "Monthly recurring revenue growing consistently",
      "Churn rate trending downward (-0.8% vs last quarter)",
      "Average subscription cycles increasing (6.8 cycles)",
      "Dunning success rate improving with new recovery flows"
    ],
    recommendations: [
      "Invest in onboarding experience to extend lifecycle",
      "Expand dunning recovery automation",
      "Test subscription frequency options",
      "Develop retention campaigns for at-risk subscribers"
    ],
    riskAlerts: [
      "Seasonal subscription patterns may impact Q1 performance",
      "Payment method diversity needed to reduce dunning failures"
    ],
    crossMetricRelationships: [
      "Email engagement strongly predicts subscription retention (3x impact)",
      "Subscription customers show 2.4x higher email revenue per recipient",
      "Churn prevention campaigns reduce overall list unsubscribe rates"
    ]
  }
};

// Individual metric AI insights
export const metricInsights: Record<string, MetricInsights> = {
  "Total Revenue": {
    metricName: "Total Revenue",
    performanceContext: "Exceptional performance with $1.24M total revenue, representing 18.5% growth versus the previous period. This puts you in the top 15% of similar e-commerce brands and significantly above the 8-12% industry average.",
    contributingFactors: [
      "Email marketing driving 34% of total revenue (above 25-30% benchmark)",
      "Strong campaign performance during promotional periods",
      "Improved average order value (+8.2% vs last period)",
      "Higher conversion rates from optimized product pages"
    ],
    optimizationOpportunities: [
      "Increase email frequency during peak performance windows to capture more revenue",
      "Test upselling sequences for recent purchasers to boost AOV further",
      "Expand successful campaign strategies to similar audience segments",
      "Implement dynamic product recommendations in email content"
    ],
    relatedMetricsImpact: [
      "Email Rev Share: 34% of total revenue shows strong email program health",
      "AOV: $127 average indicates healthy customer spending patterns",
      "Campaign Revenue: Strong performance suggests good product-market fit"
    ],
    trendPrediction: "Revenue trajectory suggests potential to reach $1.45M next period if current growth patterns continue. Key risk factors: seasonal dependency and email deliverability maintenance."
  },
  "Email Rev Share": {
    metricName: "Email Rev Share",
    performanceContext: "Outstanding 34.2% email revenue share, well above the 20-30% industry benchmark. This indicates a highly effective email marketing program and strong customer engagement with your email content.",
    contributingFactors: [
      "High-quality email content driving strong engagement",
      "Effective segmentation strategies targeting the right audiences",
      "Optimized send timing and frequency",
      "Strong brand relationship encouraging email engagement"
    ],
    optimizationOpportunities: [
      "Push email share toward 40% with more aggressive automation",
      "Test personalized product recommendations to increase click-through",
      "Expand email-exclusive offers to drive more attribution",
      "Optimize flow sequences for better revenue capture"
    ],
    relatedMetricsImpact: [
      "Total Revenue: Email's strong performance is a key driver of overall revenue growth",
      "Open Rate: 28.4% open rate directly supports high revenue attribution",
      "RPR: Higher email share typically correlates with better RPR performance"
    ],
    trendPrediction: "Email revenue share trending upward (+2.1% vs last period) suggests continued growth potential. Monitor for plateau around 40% where additional gains become harder to achieve."
  },
  "Campaigns Sent": {
    metricName: "Campaigns Sent",
    performanceContext: "Strong campaign activity with 47 campaigns sent this period, representing a 22% increase in campaign frequency. This higher frequency appears to be driving revenue without significantly impacting engagement metrics.",
    contributingFactors: [
      "Expanded promotional calendar with more frequent offers",
      "Improved campaign planning and execution efficiency",
      "Testing of higher frequency on engaged segments",
      "Seasonal promotional opportunities being maximized"
    ],
    optimizationOpportunities: [
      "Continue testing frequency increases on high-engagement segments",
      "Implement dynamic content to reduce campaign creation time",
      "Test automated campaign triggers based on user behavior",
      "Optimize campaign scheduling for maximum engagement windows"
    ],
    relatedMetricsImpact: [
      "Campaign Revenue: 22% increase in sends driving proportional revenue growth",
      "Open Rate: Maintaining 28.4% despite frequency increase is excellent",
      "Unsubscribe Rate: Monitor closely as frequency increases"
    ],
    trendPrediction: "Campaign frequency optimization appears sustainable at current levels. Test gradual increases to find optimal frequency ceiling before engagement degradation."
  },
  "Open Rate": {
    metricName: "Open Rate",
    performanceContext: "Excellent 28.4% open rate, significantly above the 20-25% e-commerce industry average. This indicates strong subject line performance, good sender reputation, and engaged subscriber base.",
    contributingFactors: [
      "Strong brand recognition and trust with subscribers",
      "Effective subject line testing and optimization",
      "Good list hygiene maintaining engagement quality",
      "Optimal send timing for your audience"
    ],
    optimizationOpportunities: [
      "Test advanced personalization in subject lines (beyond first name)",
      "Implement send time optimization for individual subscribers",
      "A/B test emoji usage and subject line length variations",
      "Experiment with preview text optimization for better inbox display"
    ],
    relatedMetricsImpact: [
      "Click Rate: Strong opens provide foundation for click optimization",
      "Revenue: High open rates directly correlate with revenue performance",
      "Deliverability: Excellent opens support strong sender reputation"
    ],
    trendPrediction: "Open rates showing stability with slight upward trend. Continued optimization could push rates toward 30%+ for this audience quality."
  },
  "Click Rate": {
    metricName: "Click Rate",
    performanceContext: "Click rate at 3.2% is within industry range but showing slight decline (-0.8% vs last period). While not concerning yet, this trend bears monitoring as it directly impacts revenue conversion.",
    contributingFactors: [
      "Increased campaign frequency may be impacting individual campaign performance",
      "Content fatigue possible with certain subscriber segments",
      "Mobile vs desktop experience differences",
      "Landing page experience may not be optimized for email traffic"
    ],
    optimizationOpportunities: [
      "A/B test email content format and layout variations",
      "Implement dynamic content based on past purchase behavior",
      "Optimize CTA placement and design for better visibility",
      "Test mobile-first email design approach"
    ],
    relatedMetricsImpact: [
      "Placed Order Rate: Click rate decline may impact conversion if not addressed",
      "Revenue: Lower clicks could reduce overall email revenue contribution",
      "Engagement Score: Click rates are key component of overall engagement"
    ],
    trendPrediction: "Stabilizing click rates should be priority to maintain revenue growth. Target improvement back to 3.8-4.0% range within next period."
  },
  "Unsubscribe Rate": {
    metricName: "Unsubscribe Rate",
    performanceContext: "Excellent 0.18% unsubscribe rate, well below the 0.5% benchmark. This low rate indicates good content-audience fit and appropriate sending frequency, despite recent frequency increases.",
    contributingFactors: [
      "High-quality, relevant content maintaining subscriber interest",
      "Gradual frequency increases allowing audience adaptation",
      "Strong segmentation preventing irrelevant content delivery",
      "Good preference center allowing customization instead of unsubscribes"
    ],
    optimizationOpportunities: [
      "Continue monitoring as send frequency increases",
      "Implement win-back sequences for at-risk subscribers",
      "Test preference center improvements to reduce unsubscribes",
      "Survey recent unsubscribers to understand pain points"
    ],
    relatedMetricsImpact: [
      "List Growth: Low unsubscribe rates support positive net growth",
      "Engagement Rate: Lower unsubscribes help maintain engaged audience ratio",
      "Deliverability: Low unsubscribe rates support strong sender reputation"
    ],
    trendPrediction: "Unsubscribe rates likely to remain low with current content strategy. Monitor for increases if campaign frequency continues to grow."
  }
};