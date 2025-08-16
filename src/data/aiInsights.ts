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
  whatHappened: string;
  whyItHappened: string[];
  whatToDoNext: string;
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
    whatHappened: "Revenue hit $89K this month (+18%) after launching Winter Bundles on 11/15 and increasing email frequency following your growth strategy meeting on 10/28.",
    whyItHappened: [
      "Your Shopify analytics show the Bundle strategy increased AOV by $24 per order",
      "The 5x weekly email frequency you tested is driving 31% more repeat purchases"
    ],
    whatToDoNext: "Implement the SMS upsell flows discussed in yesterday's team call and test the VIP pricing tier your finance team proposed."
  },
  "Email Rev Share": {
    whatHappened: "Email revenue share grew from 32% to 38% since implementing the advanced segmentation strategy your team discussed in the 11/8 marketing optimization call.",
    whyItHappened: [
      "The behavioral triggers you set up in Klaviyo are capturing 23% more post-purchase opportunities",
      "Your retention data shows email subscribers have 2.3x higher LTV than other channels"
    ],
    whatToDoNext: "Scale the winning email templates to SMS (currently only 12% revenue share) and implement the predictive segmentation model your data team built."
  },
  "Campaigns Sent": {
    whatHappened: "Campaign volume increased 50% to 42 sends this month following your Q4 strategy session on 10/20 where the team decided to maximize holiday shopping opportunities.",
    whyItHappened: [
      "Your content calendar from the 11/1 planning meeting required daily sends for Black Friday week",
      "A/B testing different send times means double campaigns for your top-performing segments"
    ],
    whatToDoNext: "Implement the automated campaign scheduler your tech team proposed and prepare the post-holiday engagement recovery campaigns for January."
  },
  "Open Rate": {
    whatHappened: "Open rates improved to 28.5% (+5%) after implementing the subject line templates your copywriter created following the 10/28 creative review meeting.",
    whyItHappened: [
      "Your A/B tests show personalized subject lines perform 12% better than generic ones",
      "Send time optimization from your engagement analysis is hitting inboxes at peak open windows"
    ],
    whatToDoNext: "Scale the personalization strategy to include location and purchase history data from your Shopify integration as discussed in last week's tech roadmap."
  },
  "Click Rate": {
    whatHappened: "Click rate plateaued at 3.2% despite 5% higher opens, indicating a disconnect between subject line promises and email content as identified in your 11/8 performance review.",
    whyItHappened: [
      "Mobile optimization issues are hurting 72% of your traffic - your dev team's heatmap analysis confirms poor mobile CTA performance",
      "Product recommendations aren't using the behavioral data from your Shopify integration yet"
    ],
    whatToDoNext: "Implement the mobile-first templates from your design sprint and activate the dynamic product recommendation engine your team built last month."
  },
  "Unsubscribe Rate": {
    whatHappened: "Unsubscribe rate increased to 0.8% from 0.6% since increasing frequency to 5x weekly on 11/1, matching the pattern your team predicted in the frequency testing plan.",
    whyItHappened: [
      "Your retention analysis shows unsubscribes are concentrated among low-engagement subscribers who weren't purchasing anyway",
      "No preference center exists yet for subscribers to reduce frequency instead of leaving entirely"
    ],
    whatToDoNext: "Launch the subscriber preference center your UX team designed and implement the engagement-based frequency caps discussed in yesterday's retention strategy call."
  }
};