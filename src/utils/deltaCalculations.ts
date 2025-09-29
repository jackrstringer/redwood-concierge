export interface DeltaResult {
  value: number;
  formatted: string;
  isPositive: boolean;
  isZero: boolean;
  colorClass: string;
}

/**
 * Calculate percentage delta between current and previous values
 * @param current - Current value
 * @param previous - Previous value  
 * @returns DeltaResult object with formatted percentage and styling information
 */
export const calculateDelta = (current: number, previous: number): DeltaResult | null => {
  // Return null if previous value is not available or both values are zero
  if (previous === undefined || previous === null) {
    return null;
  }

  // Handle special case where both values are zero
  if (current === 0 && previous === 0) {
    return {
      value: 0,
      formatted: "0.0%",
      isPositive: true,
      isZero: true,
      colorClass: "text-muted-foreground"
    };
  }

  // Handle case where previous is zero but current is not
  if (previous === 0 && current !== 0) {
    return {
      value: Infinity,
      formatted: "∞%",
      isPositive: current > 0,
      isZero: false,
      colorClass: current > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    };
  }

  // Calculate percentage change
  const deltaPercentage = ((current - previous) / previous) * 100;
  const isPositive = deltaPercentage >= 0;
  const isZero = Math.abs(deltaPercentage) < 0.1; // Consider values < 0.1% as effectively zero

  // Format the percentage with appropriate sign and precision
  const formattedValue = `${isPositive && !isZero ? '+' : ''}${deltaPercentage.toFixed(1)}%`;

  return {
    value: deltaPercentage,
    formatted: formattedValue,
    isPositive,
    isZero,
    colorClass: isZero 
      ? "text-muted-foreground"
      : isPositive 
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400"
  };
};

/**
 * Calculate delta for metrics that should be treated as "good when lower" (like bounce rate, spam rate)
 * @param current - Current value
 * @param previous - Previous value
 * @returns DeltaResult object where positive change (increase) is marked as negative/bad
 */
export const calculateInverseDelta = (current: number, previous: number): DeltaResult | null => {
  const delta = calculateDelta(current, previous);
  if (!delta) return null;

  // For inverse metrics, flip the positive/negative interpretation
  return {
    ...delta,
    isPositive: !delta.isPositive && !delta.isZero,
    colorClass: delta.isZero 
      ? "text-muted-foreground"
      : !delta.isPositive  // Inverted logic
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400"
  };
};

/**
 * Get appropriate metrics for delta calculation based on field name
 * @param campaign - Campaign or Flow object
 * @param field - Field name to get delta for
 * @returns Object with current and previous values
 */
export const getMetricValues = (campaign: any, field: string): { current: number | undefined, previous: number | undefined } => {
  const currentValue = campaign[field];
  const previousField = `previous_${field}`;
  const previousValue = campaign[previousField];

  return {
    current: currentValue,
    previous: previousValue
  };
};

/**
 * Determine if a metric should use inverse delta calculation (good when lower)
 * @param field - Field name
 * @returns boolean indicating if inverse calculation should be used
 */
export const isInverseMetric = (field: string): boolean => {
  const inverseMetrics = [
    'bounce_rate', 
    'spam_complaint_rate', 
    'unsubscribe_rate',
    'failed_rate',
    'bounced_or_failed_rate',
    'churn_rate',
    'skip_rate'
  ];
  return inverseMetrics.includes(field);
};

/**
 * Create a complete delta object for a specific field
 * @param campaign - Campaign or Flow object
 * @param field - Field name
 * @returns Complete delta result or null if not available
 */
export const createFieldDelta = (campaign: any, field: string): DeltaResult | null => {
  const { current, previous } = getMetricValues(campaign, field);
  
  if (current === undefined || previous === undefined) {
    return null;
  }

  const calculateFn = isInverseMetric(field) ? calculateInverseDelta : calculateDelta;
  return calculateFn(current, previous);
};
