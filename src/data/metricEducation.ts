export interface MetricEducation {
  definition: string;
  calculation?: string;
  importance: string;
  benchmark?: string;
}

export const metricEducation: Record<string, MetricEducation> = {
  "Total Revenue": {
    definition: "The total amount of revenue generated across all channels and campaigns within the selected time period.",
    calculation: "Sum of all completed orders and transactions, including email campaigns, flows, and other marketing initiatives.",
    importance: "This is your primary growth indicator, showing the direct financial impact of your marketing efforts and overall business performance.",
    benchmark: "Growth of 15-25% month-over-month is typical for healthy e-commerce businesses."
  },

  "Email Revenue": {
    definition: "Revenue directly attributed to email marketing campaigns and automated flows.",
    calculation: "Total revenue from orders where the customer's last click was from an email campaign or flow.",
    importance: "Email marketing typically generates 25-30% of total e-commerce revenue and has the highest ROI of all digital marketing channels.",
    benchmark: "Email should contribute 20-40% of total revenue for most e-commerce brands."
  },

  "Campaign Revenue": {
    definition: "Revenue generated specifically from one-time email campaigns (not including automated flows).",
    calculation: "Revenue from orders attributed to campaign emails within the attribution window.",
    importance: "Campaigns drive immediate revenue and are essential for product launches, promotions, and seasonal sales.",
    benchmark: "Campaign revenue should make up 40-60% of total email revenue."
  },

  "Flow Revenue": {
    definition: "Revenue generated from automated email sequences triggered by customer behavior.",
    calculation: "Revenue from orders attributed to flow emails like welcome series, abandoned cart, and post-purchase sequences.",
    importance: "Flows provide consistent, automated revenue generation and often have higher conversion rates than campaigns.",
    benchmark: "Flow revenue should represent 40-60% of total email revenue."
  },

  "Revenue Per Recipient (RPR)": {
    definition: "The average amount of revenue generated per email recipient.",
    calculation: "Total Email Revenue ÷ Total Email Recipients",
    importance: "RPR helps you understand the true value of your email list and optimize for high-value segments.",
    benchmark: "RPR varies by industry but $0.50-$2.00 per recipient is common for e-commerce."
  },

  "Placed Order Rate": {
    definition: "The percentage of email recipients who placed an order after receiving an email.",
    calculation: "(Number of Recipients Who Placed Orders ÷ Total Recipients) × 100",
    importance: "This metric shows how effectively your emails drive actual purchasing behavior, beyond just clicks.",
    benchmark: "A good placed order rate ranges from 1-5% depending on your industry and email type."
  },

  "Average Order Value (AOV)": {
    definition: "The average dollar amount spent per order from email recipients.",
    calculation: "Total Email Revenue ÷ Number of Orders from Email",
    importance: "AOV helps you understand customer spending patterns and optimize for higher-value transactions.",
    benchmark: "AOV should ideally increase over time as you better segment and target customers."
  },

  "Open Rate": {
    definition: "The percentage of delivered emails that were opened by recipients.",
    calculation: "(Emails Opened ÷ Emails Delivered) × 100",
    importance: "Open rates indicate subject line effectiveness and sender reputation. Low open rates suggest deliverability issues.",
    benchmark: "25-30% is typical for e-commerce, though this varies significantly by industry and list quality."
  },

  "Click Rate": {
    definition: "The percentage of delivered emails where recipients clicked on at least one link.",
    calculation: "(Emails Clicked ÷ Emails Delivered) × 100",
    importance: "Click rates show how engaging your email content is and how well it drives traffic to your website.",
    benchmark: "2-5% is typical for e-commerce emails, with higher rates for targeted segments."
  },

  "Unsubscribe Rate": {
    definition: "The percentage of delivered emails that resulted in an unsubscribe.",
    calculation: "(Unsubscribes ÷ Emails Delivered) × 100",
    importance: "Monitor this to ensure your content strategy isn't driving people away from your list.",
    benchmark: "Keep this below 0.5% per campaign. Higher rates indicate content or frequency issues."
  },

  "Spam Rate": {
    definition: "The percentage of emails marked as spam by recipients.",
    calculation: "(Spam Complaints ÷ Emails Delivered) × 100",
    importance: "High spam rates can severely damage your sender reputation and email deliverability.",
    benchmark: "Keep this below 0.1%. Even small increases can impact deliverability significantly."
  },

  "Bounce Rate": {
    definition: "The percentage of emails that couldn't be delivered to the recipient's inbox.",
    calculation: "(Bounced Emails ÷ Total Emails Sent) × 100",
    importance: "High bounce rates indicate list quality issues and can hurt your sender reputation.",
    benchmark: "Keep bounce rates below 2%. Regularly clean your list to maintain good deliverability."
  },

  "Total Emails Sent": {
    definition: "The total number of emails sent across all campaigns and flows in the time period.",
    calculation: "Sum of all email sends including campaigns, flows, and any other email communications.",
    importance: "This volume metric helps you understand your email program scale and identify sending trends.",
    benchmark: "Volume should grow sustainably with list growth, typically 4-8 emails per subscriber per month."
  },

  "Campaign Sends": {
    definition: "The number of emails sent through one-time campaigns (excluding automated flows).",
    calculation: "Total sends from campaign emails only, not including flow emails.",
    importance: "Tracking campaign volume helps optimize sending frequency and prevent subscriber fatigue.",
    benchmark: "1-3 campaigns per week is typical, depending on your industry and audience preferences."
  },

  "Active Profiles": {
    definition: "The number of email subscribers who are currently subscribed and have engaged recently.",
    calculation: "Subscribers who have opened or clicked an email in the last 90-180 days.",
    importance: "Active profiles represent your truly engaged audience and are most valuable for revenue generation.",
    benchmark: "30-50% of your total list should be active profiles for a healthy email program."
  },

  "New Subscribers": {
    definition: "The number of new email addresses that subscribed during the time period.",
    calculation: "Count of new opt-ins through all subscription sources (website, social, campaigns, etc.)",
    importance: "Consistent subscriber growth is essential for long-term email marketing success and revenue growth.",
    benchmark: "Aim for 5-10% list growth per month, though this varies greatly by business model."
  },

  "Unsubscribers": {
    definition: "The number of subscribers who opted out of your email list during the time period.",
    calculation: "Count of unsubscribe actions across all email communications.",
    importance: "Natural churn is expected, but spikes indicate potential content or frequency issues.",
    benchmark: "Monthly churn of 2-5% is normal, but monitor for sudden increases."
  },

  "Net Growth": {
    definition: "The net change in your email list size after accounting for new subscribers and unsubscribes.",
    calculation: "New Subscribers - Unsubscribers - Bounces",
    importance: "Net growth shows the true health of your list building efforts and retention strategies.",
    benchmark: "Positive net growth is ideal, with 3-8% monthly growth being excellent."
  },

  "Engagement Rate": {
    definition: "The percentage of your active list that regularly engages with your emails.",
    calculation: "Engaged Subscribers ÷ Total Active Subscribers × 100",
    importance: "High engagement rates improve deliverability and indicate strong content-audience fit.",
    benchmark: "40-60% engagement rate among active subscribers indicates a healthy, engaged list."
  },

  "Subscriptions Started": {
    definition: "The number of new subscription orders initiated during the time period.",
    calculation: "Count of customers who started a subscription, regardless of whether they completed the first payment.",
    importance: "This metric shows the effectiveness of your subscription acquisition efforts and funnel performance.",
    benchmark: "Growth in subscription starts should align with your customer acquisition goals and marketing spend."
  },

  "Active Subscriptions": {
    definition: "The number of subscriptions currently active and generating recurring revenue.",
    calculation: "Count of subscriptions with upcoming billing cycles that haven't been cancelled or paused.",
    importance: "Active subscriptions represent your recurring revenue base and business stability.",
    benchmark: "Steady growth in active subscriptions indicates healthy retention and acquisition balance."
  },

  "Average Subscription Cycles": {
    definition: "The average number of billing cycles a customer completes before cancelling their subscription.",
    calculation: "Total Billing Cycles Completed ÷ Number of Cancelled Subscriptions",
    importance: "Longer subscription lifecycles indicate better product-market fit and customer satisfaction.",
    benchmark: "Average of 6+ cycles is good for most subscription businesses, though this varies by billing frequency."
  },

  "Monthly Recurring Revenue (MRR)": {
    definition: "The predictable revenue generated from active subscriptions each month.",
    calculation: "Sum of monthly subscription values for all active subscriptions, normalized to monthly amounts.",
    importance: "MRR is the key metric for subscription business health and growth tracking.",
    benchmark: "Consistent MRR growth of 10-20% month-over-month indicates a healthy subscription business."
  },

  "Churn Rate": {
    definition: "The percentage of subscribers who cancelled their subscription during the time period.",
    calculation: "(Cancelled Subscriptions ÷ Active Subscriptions at Period Start) × 100",
    importance: "Low churn rates are critical for subscription business profitability and growth.",
    benchmark: "Monthly churn below 5-7% is good for most subscription businesses, though this varies by industry."
  },

  "Reactivation Rate": {
    definition: "The percentage of previously cancelled subscribers who restarted their subscription.",
    calculation: "(Reactivated Subscriptions ÷ Total Cancelled Subscriptions) × 100",
    importance: "High reactivation rates indicate strong win-back strategies and product value perception.",
    benchmark: "5-15% reactivation rate is typical, with higher rates achievable through targeted win-back campaigns."
  },

  "Dunning Success Rate": {
    definition: "The percentage of failed payment attempts that were successfully recovered.",
    calculation: "(Recovered Failed Payments ÷ Total Failed Payments) × 100",
    importance: "Effective dunning management directly impacts revenue retention and customer experience.",
    benchmark: "40-60% dunning success rate is achievable with proper payment retry sequences and customer communication."
  },

  "Skip Rate": {
    definition: "The percentage of subscription orders that customers chose to skip rather than receive.",
    calculation: "(Skipped Orders ÷ Total Scheduled Orders) × 100",
    importance: "Skip rates can indicate inventory issues, seasonal preferences, or customer satisfaction concerns.",
    benchmark: "Skip rates vary widely by product type, but sudden increases warrant investigation."
  },

  "Avg Time to Cancel": {
    definition: "The average number of days between subscription start and cancellation.",
    calculation: "Sum of (Cancellation Date - Start Date) ÷ Number of Cancelled Subscriptions",
    importance: "Longer time to cancel indicates better customer onboarding and product satisfaction.",
    benchmark: "Varies by billing frequency and product type, but 90+ days is generally positive for monthly subscriptions."
  },

  "Email Rev Share": {
    definition: "The percentage of total revenue that comes from email marketing efforts.",
    calculation: "Email Revenue ÷ Total Revenue × 100",
    importance: "This shows how much your business depends on email marketing and helps justify email marketing investments.",
    benchmark: "20-40% email revenue share is typical for e-commerce businesses with mature email programs."
  },

  "New Email Subscribers": {
    definition: "The number of new email addresses that subscribed during the time period.",
    calculation: "Count of new email opt-ins through all subscription sources (website, social, campaigns, etc.)",
    importance: "Email subscriber growth is essential for long-term email marketing success and revenue growth.",
    benchmark: "Aim for 5-10% list growth per month, though this varies greatly by business model."
  },

  "New SMS Subscribers": {
    definition: "The number of new phone numbers that opted in to SMS marketing during the time period.",
    calculation: "Count of new SMS opt-ins through all subscription sources.",
    importance: "SMS has higher engagement rates than email and provides an additional revenue channel.",
    benchmark: "SMS growth of 10-20% of email growth is typical for businesses with active SMS programs."
  },

  "Email Unsubscribes": {
    definition: "The number of email subscribers who opted out during the time period.",
    calculation: "Count of unsubscribe actions from email communications.",
    importance: "Natural email churn is expected, but spikes indicate potential content or frequency issues.",
    benchmark: "Monthly email churn of 2-5% is normal, but monitor for sudden increases."
  },

  "% Engaged (30d)": {
    definition: "The percentage of subscribers who opened or clicked an email in the last 30 days.",
    calculation: "Engaged Subscribers (30d) ÷ Total Active Subscribers × 100",
    importance: "High engagement rates improve deliverability and indicate strong content-audience fit.",
    benchmark: "40-60% engagement rate indicates a healthy, engaged email list."
  },

  "Net Subscriber Growth": {
    definition: "The net change in email list size after accounting for new subscribers and unsubscribes.",
    calculation: "New Email Subscribers - Email Unsubscribers",
    importance: "Net growth shows the true health of your list building efforts and retention strategies.",
    benchmark: "Positive net growth is ideal, with 3-8% monthly growth being excellent."
  },

  "Total Active Profiles": {
    definition: "The total number of email and SMS subscribers who are currently subscribed and engaged.",
    calculation: "Sum of active email and SMS subscribers who have engaged recently.",
    importance: "Active profiles represent your reachable audience and revenue potential.",
    benchmark: "Active profiles should grow consistently with your marketing efforts and customer acquisition."
  },
  "Flow Placed Order Rate": {
    definition: "The percentage of flow email recipients who placed an order after receiving an automated email.",
    calculation: "(Number of Flow Recipients Who Placed Orders ÷ Total Flow Recipients) × 100",
    importance: "Shows how effectively your automated email sequences drive purchasing behavior beyond just engagement metrics.",
    benchmark: "Flow placed order rates are typically 2-6% higher than campaign rates due to behavioral targeting."
  }
};