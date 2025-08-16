export interface AIInsight {
  summary: string;
  keyTrends: string[];
  recommendations: string[];
  riskAlerts?: string[];
  crossMetricImpact?: string[];
}

export interface SectionInsights {
  whatHappened: string;
  whyItHappened: string[];
  whatToDoNext: string;
}

export interface MetricInsights {
  overTime: string;
  highImpactFactors: string[];
  keyRecommendations: string;
  contextualNote?: string;
}

// Section-level AI insights
export const sectionInsights: Record<string, SectionInsights> = {
  "Core Revenue Metrics": {
    whatHappened: "Revenue jumped 18% this month following your Black Friday product launch on 11/15 and the team's decision to increase email frequency from 3x to 5x per week starting 11/1.",
    whyItHappened: [
      "New 'Winter Bundle' products from your 11/10 team meeting are driving 34% higher AOV",
      "Shopify data shows your inventory optimization from last month improved conversion by 12%"
    ],
    whatToDoNext: "Scale the Winter Bundle promotion through SMS (currently only 23% of email revenue) and test the 5x frequency on your VIP segment identified in your retention reports."
  },
  "Performance Metrics": {
    whatHappened: "Open rates improved 5% since implementing the subject line templates from your 10/28 marketing review, but click rates plateaued at 3.2% despite higher opens.",
    whyItHappened: [
      "Your Slack discussion on 11/5 about mobile optimization is spot-on - 72% mobile traffic with 8% lower engagement",
      "Shopify heat map data shows customers are engaging but not converting on mobile checkout"
    ],
    whatToDoNext: "Implement the mobile-first email templates discussed in your agency call and A/B test the one-click checkout feature your dev team proposed."
  },
  "Send Volume Metrics": {
    whatHappened: "Email volume increased 35% after your team decided to scale from 4 to 6 campaigns weekly starting 10/20, with no deliverability issues detected in your monitoring dashboard.",
    whyItHappened: [
      "Q4 planning session on 10/15 identified under-utilization of your 47K engaged subscribers",
      "Your retention analysis showed customers want more frequent communication during holiday season"
    ],
    whatToDoNext: "Test 7x weekly frequency for your VIP segment (2,400 subscribers) identified in last week's retention report while monitoring the deliverability metrics dashboard daily."
  },
  "List Growth Metrics": {
    whatHappened: "List growth accelerated 22% this month after implementing the TikTok lead magnet strategy from your 10/25 growth meeting, adding 3,200 new engaged subscribers.",
    whyItHappened: [
      "The 'Holiday Gift Guide' lead magnet you launched on 11/1 is converting 40% higher than previous offers",
      "Your influencer partnership from last month's campaign is still driving organic sign-ups"
    ],
    whatToDoNext: "Double down on the TikTok strategy and implement the Instagram Reels version your social team proposed in yesterday's Slack thread."
  },
  "Subscription Metrics": {
    whatHappened: "MRR grew 12% to $47K after launching the 'Subscribe & Save 15%' program from your 10/30 retention strategy meeting, adding 197 new active subscriptions.",
    whyItHappened: [
      "Your Shopify data shows customers were asking for subscription options in support tickets",
      "The email series you launched targeting one-time buyers converted 8.3% to subscriptions"
    ],
    whatToDoNext: "Scale the subscription upsell flow to your SMS channel and implement the annual pricing tier your finance team modeled in last week's planning doc."
  }
};

// Individual metric AI insights
export const metricInsights: Record<string, MetricInsights> = {
  "Total Revenue": {
    overTime: "Revenue has grown 18% this month to $89K, with acceleration since your Winter Bundle launch on 11/15 and frequency increase to 5x weekly starting 11/1.",
    highImpactFactors: [
      "Winter Bundle strategy increased AOV by $24 per order based on Shopify analytics",
      "5x weekly email frequency driving 31% more repeat purchases from existing customers"
    ],
    keyRecommendations: "Scale Winter Bundle promotion through SMS channel (currently only 23% of email revenue) and test VIP pricing tier your finance team modeled.",
    contextualNote: "Following your 10/28 growth strategy meeting decisions"
  },
  "Email Revenue": {
    overTime: "Email revenue reached $34K this month (+22%) since implementing advanced segmentation from your 11/8 marketing optimization call.",
    highImpactFactors: [
      "Behavioral triggers in Klaviyo capturing 23% more post-purchase opportunities",
      "Email subscribers showing 2.3x higher LTV than other acquisition channels"
    ],
    keyRecommendations: "Implement predictive segmentation model your data team built and scale winning email templates to SMS to boost that channel from 12% revenue share."
  },
  "Flow Revenue": {
    overTime: "Flow revenue increased 15% to $19K after optimizing your welcome series and abandoned cart sequences based on October's retention analysis.",
    highImpactFactors: [
      "New 3-email welcome series converting 28% higher than previous single email",
      "Mobile-optimized abandoned cart flow recovering 18% more revenue on mobile devices"
    ],
    keyRecommendations: "Expand flow strategy to SMS and implement the browse abandonment flow your team designed for holiday shoppers."
  },
  "Campaign Revenue": {
    overTime: "Campaign revenue grew 25% to $15K driven by increased frequency and your Black Friday promotional calendar from the 11/1 planning session.",
    highImpactFactors: [
      "Daily campaign sends during Black Friday week generated 40% of monthly campaign revenue",
      "Product bundling strategy in campaigns increasing average order values by 31%"
    ],
    keyRecommendations: "Implement automated campaign scheduler your tech team proposed and prepare post-holiday re-engagement campaigns for January slowdown."
  },
  "Revenue Per Recipient (RPR)": {
    overTime: "RPR improved 12% to $1.32 since implementing behavioral segmentation and send time optimization from your October engagement analysis.",
    highImpactFactors: [
      "VIP segment (identified in retention reports) generating 3.2x higher RPR than average subscribers",
      "Send time optimization hitting peak engagement windows increased RPR by 18%"
    ],
    keyRecommendations: "Scale VIP segment strategy and implement the purchase prediction model to send targeted offers to highest-value prospects."
  },
  "Placed Order Rate": {
    overTime: "Order rate increased to 2.8% (+0.4%) following implementation of urgency messaging and social proof elements in your email templates.",
    highImpactFactors: [
      "Mobile checkout optimization from last month's dev sprint reducing friction for 72% of traffic",
      "Product recommendation engine using Shopify behavioral data increasing relevance"
    ],
    keyRecommendations: "Implement one-click checkout feature your dev team proposed and expand urgency messaging to SMS campaigns."
  },
  "Average Order Value (AOV)": {
    overTime: "AOV from email increased 16% to $78 since launching bundling strategy and upsell flows from your 11/10 merchandising meeting.",
    highImpactFactors: [
      "Winter Bundle products driving 34% higher AOV compared to individual product purchases",
      "Post-purchase upsell emails converting 12% of customers to additional purchases"
    ],
    keyRecommendations: "Expand bundle strategy to SMS channel and implement the subscription upsell flow your team designed for one-time buyers."
  },
  "Open Rate": {
    overTime: "Open rates improved to 28.5% (+5%) after implementing subject line templates from your 10/28 creative review and send time optimization.",
    highImpactFactors: [
      "Personalized subject lines performing 12% better than generic templates in A/B tests",
      "Send time optimization hitting subscriber peak engagement windows"
    ],
    keyRecommendations: "Scale personalization to include location and purchase history data from Shopify integration as outlined in your tech roadmap."
  },
  "Click Rate": {
    overTime: "Click rate plateaued at 3.2% despite improved opens, indicating content-subject line disconnect identified in your 11/8 performance review.",
    highImpactFactors: [
      "Mobile optimization issues affecting 72% of traffic with poor CTA performance on mobile",
      "Product recommendations not yet using behavioral data from Shopify integration"
    ],
    keyRecommendations: "Implement mobile-first templates from design sprint and activate dynamic product recommendation engine your team built."
  },
  "Unsubscribe Rate": {
    overTime: "Unsubscribe rate increased to 0.8% from 0.6% since frequency increase to 5x weekly, matching your team's frequency testing predictions.",
    highImpactFactors: [
      "Unsubscribes concentrated among low-engagement subscribers who weren't purchasing",
      "No preference center available for subscribers to reduce frequency instead of leaving"
    ],
    keyRecommendations: "Launch subscriber preference center your UX team designed and implement engagement-based frequency caps from retention strategy."
  },
  "Spam Rate": {
    overTime: "Spam rate maintained at 0.05% despite increased frequency, indicating strong sender reputation and content quality.",
    highImpactFactors: [
      "Consistent list hygiene practices keeping engagement rates high",
      "Send time optimization and personalization improving subscriber satisfaction"
    ],
    keyRecommendations: "Continue current practices and implement the engagement scoring system to identify at-risk subscribers before they report spam."
  },
  "Bounce Rate": {
    overTime: "Bounce rate decreased to 1.2% after implementing the automated list cleaning process your team set up in October.",
    highImpactFactors: [
      "Weekly automated removal of hard bounces preventing reputation damage",
      "Email validation on signup forms catching invalid addresses before they enter your list"
    ],
    keyRecommendations: "Implement the real-time email validation API your dev team proposed and set up suppression list syncing with SMS platform."
  },
  "Total Emails Sent": {
    overTime: "Total sends increased 35% to 847K emails after scaling to 5x weekly frequency and launching daily Black Friday campaigns.",
    highImpactFactors: [
      "Frequency increase from 3x to 5x weekly adding 280K additional sends monthly",
      "Black Friday daily campaigns contributing extra 150K sends during peak week"
    ],
    keyRecommendations: "Implement automated send scheduling to maintain volume while preventing subscriber fatigue through smart frequency caps."
  },
  "Campaign Sends": {
    overTime: "Campaign sends grew 50% to 425K following your Q4 content calendar and daily Black Friday promotional strategy.",
    highImpactFactors: [
      "Daily sends during Black Friday week generated 40% of monthly campaign volume",
      "A/B testing send times requiring duplicate campaigns for optimal timing"
    ],
    keyRecommendations: "Implement automated campaign scheduler and prepare reduced-frequency post-holiday strategy to prevent list fatigue."
  },
  "Campaigns Sent": {
    overTime: "Campaign count increased 40% to 42 campaigns following your aggressive Q4 promotional calendar from the 10/20 strategy session.",
    highImpactFactors: [
      "Daily campaign requirement during Black Friday week adding 7 extra campaigns",
      "A/B testing different segments requiring multiple campaign versions"
    ],
    keyRecommendations: "Prepare post-holiday engagement recovery campaigns and implement the automated scheduler to optimize future campaign timing."
  },
  "Active Profiles": {
    overTime: "Active profiles grew 8% to 47K after implementing the re-engagement campaign series your team launched in October.",
    highImpactFactors: [
      "TikTok lead magnet strategy bringing in highly engaged younger demographics",
      "Re-engagement flows reactivating 1,200 previously dormant subscribers"
    ],
    keyRecommendations: "Scale TikTok strategy to Instagram Reels as your social team proposed and implement behavioral scoring to identify engagement risk early."
  },
  "New Subscribers": {
    overTime: "New subscriber growth accelerated 22% to 3,200 additions since launching the TikTok lead magnet strategy from your 10/25 growth meeting.",
    highImpactFactors: [
      "Holiday Gift Guide lead magnet converting 40% higher than previous offers",
      "Influencer partnership from last month's campaign driving organic sign-ups"
    ],
    keyRecommendations: "Double down on TikTok strategy and implement Instagram Reels version your social team proposed in yesterday's Slack discussion."
  },
  "Unsubscribers": {
    overTime: "Unsubscribes increased to 380 (+33%) since frequency increase, but concentrated among low-value segments as your retention analysis predicted.",
    highImpactFactors: [
      "Frequency-sensitive subscribers leaving rather than adjusting preferences",
      "Low-engagement segments showing higher churn rates but minimal revenue impact"
    ],
    keyRecommendations: "Launch preference center to give subscribers frequency control and implement win-back campaigns for high-value unsubscribes."
  },
  "Net Growth": {
    overTime: "Net growth improved to 2,820 subscribers (+18%) driven by strong acquisition from TikTok strategy outpacing frequency-related churn.",
    highImpactFactors: [
      "TikTok lead magnet bringing 3,200 highly engaged new subscribers",
      "Re-engagement campaigns reactivating 580 dormant subscribers"
    ],
    keyRecommendations: "Maintain current acquisition momentum while launching preference center to reduce unnecessary churn from frequency sensitivity."
  },
  "Engagement Rate": {
    overTime: "Engagement rate held steady at 52% despite increased frequency, showing strong content-audience fit from your recent optimization efforts.",
    highImpactFactors: [
      "Behavioral segmentation keeping content highly relevant to subscriber interests",
      "Send time optimization ensuring emails arrive when subscribers are most active"
    ],
    keyRecommendations: "Implement engagement-based frequency caps and expand successful segmentation strategies to SMS channel."
  },
  "Subscriptions Started": {
    overTime: "New subscriptions increased 25% to 197 starts after launching the 'Subscribe & Save 15%' program from your 10/30 retention meeting.",
    highImpactFactors: [
      "Customer support tickets showing demand for subscription options before launch",
      "Email series targeting one-time buyers converting 8.3% to subscriptions"
    ],
    keyRecommendations: "Scale subscription upsell flow to SMS and implement annual pricing tier your finance team modeled for higher LTV."
  },
  "Active Subscriptions": {
    overTime: "Active subscription base grew 12% to 1,847 subscribers, with strong retention from the onboarding improvements made in October.",
    highImpactFactors: [
      "New subscriber onboarding flow reducing early churn by 23%",
      "Subscription preference portal allowing customization reducing cancellation requests"
    ],
    keyRecommendations: "Implement the loyalty rewards program for long-term subscribers and launch family plan options your team discussed."
  },
  "Average Subscription Cycles": {
    overTime: "Average cycles increased to 7.2 (+0.8) after implementing customer success initiatives and product education flows.",
    highImpactFactors: [
      "Proactive customer success outreach preventing cancellations at risk indicators",
      "Educational content helping subscribers maximize product value and satisfaction"
    ],
    keyRecommendations: "Expand customer success program and implement the predictive churn model to identify at-risk subscribers earlier."
  },
  "Monthly Recurring Revenue (MRR)": {
    overTime: "MRR grew 12% to $47K driven by new subscription launches and successful retention initiatives from your October strategy review.",
    highImpactFactors: [
      "Subscribe & Save program adding $5.6K in new MRR monthly",
      "Reduced churn from improved onboarding protecting $2.1K in recurring revenue"
    ],
    keyRecommendations: "Launch annual subscription plans for 20% discount to improve cash flow and implement upsell flows for subscription plan upgrades."
  },
  "Churn Rate": {
    overTime: "Churn rate decreased to 4.2% from 5.8% after implementing proactive customer success and preference management systems.",
    highImpactFactors: [
      "Customer success team preventing 47 cancellations through proactive outreach",
      "Subscription preference portal reducing cancellations by allowing plan modifications"
    ],
    keyRecommendations: "Expand retention program to include loyalty rewards and implement the predictive model to identify churn risk 30 days earlier."
  },
  "Reactivation Rate": {
    overTime: "Reactivation rate improved to 11.3% (+2.1%) since launching the targeted win-back campaign series in October.",
    highImpactFactors: [
      "Personalized win-back offers based on previous purchase history increasing response rates",
      "Limited-time discount strategy creating urgency for re-subscription"
    ],
    keyRecommendations: "Implement behavioral trigger win-back campaigns and test the annual plan offer for previous subscribers as discussed."
  },
  "Dunning Success Rate": {
    overTime: "Payment recovery improved to 52% (+7%) after implementing the smart retry sequence and customer communication flow.",
    highImpactFactors: [
      "Multi-channel payment retry notifications (email + SMS) improving customer response",
      "Flexible payment date options reducing failed payments due to timing"
    ],
    keyRecommendations: "Implement the alternative payment method options your team researched and add automated payment update reminders."
  },
  "Skip Rate": {
    overTime: "Skip rate stabilized at 8.5% after implementing the inventory notification system and flexible scheduling options.",
    highImpactFactors: [
      "Proactive inventory notifications allowing customers to modify orders before shipping",
      "Flexible delivery scheduling reducing skips due to travel or timing conflicts"
    ],
    keyRecommendations: "Implement the product preference learning algorithm to reduce unwanted shipments and add gift options for skip periods."
  },
  "Avg Time to Cancel": {
    overTime: "Time to cancel extended to 127 days (+18 days) since improving onboarding and implementing customer success touchpoints.",
    highImpactFactors: [
      "Enhanced onboarding sequence educating customers on product value and usage",
      "Proactive customer success check-ins at day 30, 60, and 90 preventing early churn"
    ],
    keyRecommendations: "Implement loyalty rewards at 6-month milestone and expand customer success program to include product education workshops."
  },
  "Email Rev Share": {
    overTime: "Email's share of total revenue increased to 38% (+6%) since implementing advanced segmentation and behavioral triggers from your 11/8 optimization call.",
    highImpactFactors: [
      "Behavioral triggers in Klaviyo capturing 23% more post-purchase opportunities",
      "Email subscribers showing 2.3x higher LTV than other acquisition channels"
    ],
    keyRecommendations: "Scale winning email templates to SMS to boost that channel from 12% revenue share and implement predictive segmentation model."
  },
  "New Email Subscribers": {
    overTime: "Email subscriber growth accelerated 22% to 27,412 additions since launching TikTok lead magnet strategy from your 10/25 growth meeting.",
    highImpactFactors: [
      "Holiday Gift Guide lead magnet converting 40% higher than previous offers",
      "Influencer partnership from last month's campaign driving organic sign-ups"
    ],
    keyRecommendations: "Double down on TikTok strategy and implement Instagram Reels version your social team proposed in yesterday's Slack discussion."
  },
  "New SMS Subscribers": {
    overTime: "SMS subscriber growth increased 28% to 10,433 new subscribers after implementing SMS-specific lead magnets and cross-promotion in email.",
    highImpactFactors: [
      "SMS-exclusive discount offers in email campaigns driving 34% higher opt-in rates",
      "Checkout SMS opt-in optimization increasing conversion by 18%"
    ],
    keyRecommendations: "Implement SMS preference center for frequency control and launch SMS-exclusive flash sales to boost engagement."
  },
  "Email Unsubscribes": {
    overTime: "Email unsubscribes increased to 8,122 (+5% decrease in rate) since frequency optimization, with unsubscribes concentrated among low-value segments.",
    highImpactFactors: [
      "Frequency-sensitive subscribers leaving rather than adjusting preferences",
      "Low-engagement segments showing higher churn but minimal revenue impact"
    ],
    keyRecommendations: "Launch preference center to give subscribers frequency control and implement win-back campaigns for high-value unsubscribes."
  },
  "% Engaged (30d)": {
    overTime: "30-day engagement rate held steady at 41% despite increased frequency, showing strong content-audience fit from recent optimization efforts.",
    highImpactFactors: [
      "Behavioral segmentation keeping content highly relevant to subscriber interests",
      "Send time optimization ensuring emails arrive when subscribers are most active"
    ],
    keyRecommendations: "Implement engagement-based frequency caps and expand successful segmentation strategies to SMS channel."
  },
  "Net Subscriber Growth": {
    overTime: "Net growth improved to 27,443 subscribers (+16%) driven by strong acquisition from TikTok strategy outpacing frequency-related churn.",
    highImpactFactors: [
      "TikTok lead magnet bringing highly engaged new subscribers",
      "Re-engagement campaigns reactivating dormant subscribers"
    ],
    keyRecommendations: "Maintain current acquisition momentum while launching preference center to reduce unnecessary churn from frequency sensitivity."
  },
  "Total Active Profiles": {
    overTime: "Active profiles grew 9% to 1.85M after implementing re-engagement campaign series and TikTok acquisition strategy.",
    highImpactFactors: [
      "TikTok lead magnet strategy bringing in highly engaged younger demographics",
      "Re-engagement flows reactivating previously dormant subscribers"
    ],
    keyRecommendations: "Scale TikTok strategy to Instagram Reels and implement behavioral scoring to identify engagement risk early."
  }
};