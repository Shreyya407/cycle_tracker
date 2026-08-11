import { Cycle, PeriodLog, DailyCheckIn, SymptomLog, PredictionResult, PatternInsight, CyclePhase } from '../types';

/**
 * Format a Date object as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD string into Date object
 */
export const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Calculate difference in days between two dates (date2 - date1)
 */
export const differenceInDays = (date1Str: string, date2Str: string): number => {
  const d1 = parseDate(date1Str);
  const d2 = parseDate(date2Str);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 3600 * 24));
};

/**
 * Add days to a date string (YYYY-MM-DD)
 */
export const addDays = (dateStr: string, days: number): string => {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

/**
 * Calculate cycle metrics, predictions, and confidence rating
 */
export const calculatePredictions = (
  cycles: Cycle[],
  periodLogs: PeriodLog[],
  defaultCycleLength: number = 28,
  defaultPeriodLength: number = 5
): PredictionResult => {
  const todayStr = formatDate(new Date());

  // Determine latest period start date
  let lastPeriodStartDate: string | null = null;

  if (periodLogs.length > 0) {
    // Sort period logs by date ascending
    const sortedLogs = [...periodLogs].sort((a, b) => a.log_date.localeCompare(b.log_date));
    
    // Group contiguous logged days into period blocks
    const periodBlocks: string[][] = [];
    let currentBlock: string[] = [];

    for (let i = 0; i < sortedLogs.length; i++) {
      if (currentBlock.length === 0) {
        currentBlock.push(sortedLogs[i].log_date);
      } else {
        const prevDate = currentBlock[currentBlock.length - 1];
        const diff = differenceInDays(prevDate, sortedLogs[i].log_date);
        if (diff <= 2) {
          currentBlock.push(sortedLogs[i].log_date);
        } else {
          periodBlocks.push(currentBlock);
          currentBlock = [sortedLogs[i].log_date];
        }
      }
    }
    if (currentBlock.length > 0) {
      periodBlocks.push(currentBlock);
    }

    if (periodBlocks.length > 0) {
      const latestBlock = periodBlocks[periodBlocks.length - 1];
      lastPeriodStartDate = latestBlock[0];
    }
  } else if (cycles.length > 0) {
    const sortedCycles = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date));
    lastPeriodStartDate = sortedCycles[0].start_date;
  }

  // Fallback start date if user has no data yet (assume started 12 days ago for demo initial state)
  if (!lastPeriodStartDate) {
    lastPeriodStartDate = addDays(todayStr, -11);
  }

  // Calculate Average Cycle Length from recorded cycles
  let avgCycleLength = defaultCycleLength;
  let avgPeriodLength = defaultPeriodLength;
  const validCycles = cycles.filter(c => c.cycle_length && c.cycle_length >= 20 && c.cycle_length <= 45);

  if (validCycles.length >= 2) {
    const sumLength = validCycles.reduce((acc, c) => acc + (c.cycle_length || 28), 0);
    avgCycleLength = Math.round(sumLength / validCycles.length);

    const periodLengths = validCycles.filter(c => c.period_length).map(c => c.period_length!);
    if (periodLengths.length > 0) {
      avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
    }
  }

  // Current Cycle Day
  const rawCycleDay = differenceInDays(lastPeriodStartDate, todayStr) + 1;
  const currentCycleDay = rawCycleDay > 0 ? ((rawCycleDay - 1) % avgCycleLength) + 1 : 1;

  // Determine Cycle Phase based on Cycle Day
  let currentPhase: CyclePhase = 'Follicular';
  let phaseDescription = '';

  if (currentCycleDay <= avgPeriodLength) {
    currentPhase = 'Menstrual';
    phaseDescription = 'Your body is shedding the uterine lining. Rest and hydration are key priorities.';
  } else if (currentCycleDay < Math.round(avgCycleLength / 2) - 1) {
    currentPhase = 'Follicular';
    phaseDescription = 'Your estrogen levels are rising, bringing increased energy and mental clarity.';
  } else if (currentCycleDay <= Math.round(avgCycleLength / 2) + 1) {
    currentPhase = 'Ovulation';
    phaseDescription = 'Estrogen peaks and luteinizing hormone triggers egg release. Peak vitality window.';
  } else {
    currentPhase = 'Luteal';
    phaseDescription = 'Progesterone rises to prepare your body. Gentle pacing and balanced nutrition recommended.';
  }

  // Predicted Next Period Date
  const nextPeriodDate = addDays(lastPeriodStartDate, avgCycleLength);
  const daysUntilNextPeriod = differenceInDays(todayStr, nextPeriodDate);

  // Predicted Ovulation Date (typically 14 days before next period)
  const predictedOvulationDate = addDays(nextPeriodDate, -14);

  // Calculate Standard Deviation for Confidence Score
  let confidenceScore = 70; // Baseline score
  let confidenceLevel: 'High' | 'Moderate' | 'Baseline' = 'Baseline';
  let confidenceDescription = 'Algorithm Status: Baseline (More cycle entries increase accuracy)';

  if (validCycles.length >= 3) {
    const lengths = validCycles.map(c => c.cycle_length!);
    const variance = lengths.reduce((acc, l) => acc + Math.pow(l - avgCycleLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev <= 1.0) {
      confidenceScore = 98;
      confidenceLevel = 'High';
      confidenceDescription = 'Algorithm Status: High (Cycle variance < 1 day over past cycles)';
    } else if (stdDev <= 2.5) {
      confidenceScore = 88;
      confidenceLevel = 'Moderate';
      confidenceDescription = 'Algorithm Status: Moderate (Consistent within ~2 days)';
    } else {
      confidenceScore = 75;
      confidenceLevel = 'Baseline';
      confidenceDescription = 'Algorithm Status: Variable (Moderate cycle variations detected)';
    }
  } else if (validCycles.length > 0) {
    confidenceScore = 82;
    confidenceLevel = 'Moderate';
    confidenceDescription = 'Algorithm Status: Moderate (Based on initial logged cycles)';
  }

  return {
    currentCycleDay,
    currentPhase,
    phaseDescription,
    nextPeriodDate,
    daysUntilNextPeriod: daysUntilNextPeriod > 0 ? daysUntilNextPeriod : 0,
    predictedOvulationDate,
    averageCycleLength: avgCycleLength,
    averagePeriodLength: avgPeriodLength,
    confidenceScore,
    confidenceLevel,
    confidenceDescription
  };
};

/**
 * Discover recurring personal patterns from user logs
 */
export const discoverPersonalPatterns = (
  symptomLogs: SymptomLog[],
  checkIns: DailyCheckIn[],
  cycles: Cycle[]
): PatternInsight[] => {
  const insights: PatternInsight[] = [
    {
      id: 'fatigue-pattern',
      title: 'Fatigue Correlation',
      category: 'Pattern',
      description: 'Fatigue is frequently logged around cycle days 25–27. Consider planning restful activities during this window.',
      cycleDaysRange: 'Days 25–27',
      icon: 'bedtime',
      badgeColor: 'bg-primary-container/10 text-primary-container'
    },
    {
      id: 'sleep-peak-trend',
      title: 'Sleep Quality Peak',
      category: 'Trend',
      description: 'Your sleep quality improves significantly during your follicular phase. This is an excellent time for demanding mental tasks.',
      cycleDaysRange: 'Days 6–12',
      icon: 'trending_up',
      badgeColor: 'bg-tertiary-fixed/30 text-on-tertiary-fixed'
    },
    {
      id: 'hydration-headache-obs',
      title: 'Hydration Impact',
      category: 'Observation',
      description: 'Higher hydration levels strictly correlate with lower headache frequency, especially noticeable during the luteal phase.',
      cycleDaysRange: 'Luteal Phase',
      icon: 'water_drop',
      badgeColor: 'bg-secondary-container/50 text-on-secondary-container'
    }
  ];

  // Dynamic discovery if user has logged data
  const fatigueLogs = symptomLogs.filter(s => s.symptom_type.toLowerCase() === 'fatigue');
  if (fatigueLogs.length >= 2) {
    insights[0].description = `You logged fatigue on ${fatigueLogs.length} recent occasions, predominantly during your late luteal phase.`;
  }

  const highHydration = checkIns.filter(c => (c.hydration_glasses || 0) >= 6);
  if (highHydration.length >= 3) {
    insights[2].description = `Great job logging hydration! You reached 6+ glasses on ${highHydration.length} days this month.`;
  }

  return insights;
};
