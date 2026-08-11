import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Radar, Line } from 'react-chartjs-2';
import { useData } from '../context/DataContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsPage: React.FC = () => {
  const { prediction, cycles } = useData();

  // Chart 1: Cycle History Data
  const historyData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Follicular & Luteal (Days)',
        data: [23, 22, 23, 23, 23, 23],
        backgroundColor: '#d0e8d9',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 }
      },
      {
        label: 'Period (Days)',
        data: [5, 5, 6, 4, 5, 5],
        backgroundColor: '#ffdad6',
        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 }
      }
    ]
  };

  const historyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, suggestedMax: 35 }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Chart 2: Symptom Frequency Radar Data
  const symptomData = {
    labels: ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Mood Swings'],
    datasets: [
      {
        label: 'Frequency',
        data: [8, 3, 6, 9, 2, 5],
        backgroundColor: 'rgba(21, 45, 53, 0.15)',
        borderColor: '#152d35',
        pointBackgroundColor: '#4e6357',
        borderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const symptomOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: '#e3e2df' },
        grid: { color: '#e3e2df' },
        pointLabels: { font: { size: 12 }, color: '#42484a' },
        ticks: { display: false, max: 10 }
      }
    },
    plugins: { legend: { display: false } }
  };

  // Chart 3: Wellness Trends Line Data
  const trendsData = {
    labels: ['Day 1', 'Day 5', 'Day 10', 'Day 14', 'Day 20', 'Day 25', 'Day 28'],
    datasets: [
      {
        label: 'Mood',
        data: [3, 5, 7, 8, 6, 4, 3],
        borderColor: '#4e6357',
        backgroundColor: 'rgba(78, 99, 87, 0.15)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Energy',
        data: [2, 4, 8, 9, 7, 5, 3],
        borderColor: '#152d35',
        backgroundColor: 'rgba(21, 45, 53, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const trendsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { min: 1, max: 10, ticks: { stepSize: 2 } }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-1">Cycle Analytics</h1>
        <p className="font-sans text-body-lg text-on-surface-variant">
          Insights and mathematical trends based strictly on your historical data.
        </p>
      </header>

      {/* Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-label-md text-sm text-on-surface-variant">Average Cycle Length</h3>
            <div className="bg-secondary-container/30 p-2 rounded-full">
              <span className="material-symbols-outlined text-secondary text-sm">cycle</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl text-primary">{prediction.averageCycleLength}</span>
            <span className="font-sans text-sm text-on-surface-variant">days</span>
          </div>
          <div className="mt-4 text-xs text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">trending_flat</span>
            <span>Consistent with last 3 cycles</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-label-md text-sm text-on-surface-variant">Average Period Duration</h3>
            <div className="bg-error-container/30 p-2 rounded-full">
              <span className="material-symbols-outlined text-error text-sm">water_drop</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl text-primary">{prediction.averagePeriodLength}</span>
            <span className="font-sans text-sm text-on-surface-variant">days</span>
          </div>
          <div className="mt-4 text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Normal baseline range</span>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="md:col-span-2 bg-primary text-on-primary rounded-2xl p-6 shadow-tier-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 opacity-10">
            <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-2xl font-bold mb-2">Your Cycle is Stable</h3>
            <p className="font-sans text-body-md text-primary-fixed opacity-90 max-w-md">
              Your cycle variation is less than 2 days over historical data. Your next period is predicted for {prediction.nextPeriodDate}.
            </p>
          </div>
        </div>
      </section>

      {/* Main Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cycle History Bar Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20">
          <header className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-primary">Cycle History</h2>
            <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
              Last 6 Months
            </span>
          </header>
          <div className="h-[300px] w-full relative">
            <Bar data={historyData} options={historyOptions} />
          </div>
        </div>

        {/* Symptom Frequency Radar Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20 flex flex-col">
          <header className="mb-4">
            <h2 className="font-serif text-2xl text-primary">Symptom Frequency</h2>
            <p className="font-sans text-xs text-on-surface-variant">Most frequently reported</p>
          </header>
          <div className="flex-1 flex items-center justify-center relative h-[260px]">
            <Radar data={symptomData} options={symptomOptions} />
          </div>
        </div>
      </section>

      {/* Line Chart & Table Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellness Trends */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20">
          <header className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-primary">Wellness Trends</h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 font-sans text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4e6357]"></span> Mood
              </span>
              <span className="flex items-center gap-1.5 font-sans text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-[#152d35]"></span> Energy
              </span>
            </div>
          </header>
          <div className="h-[280px] w-full relative">
            <Line data={trendsData} options={trendsOptions} />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/20 flex flex-col">
          <header className="mb-4">
            <h2 className="font-serif text-2xl text-primary">Cycle Comparison</h2>
          </header>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="py-3 px-2 font-label-sm text-xs text-on-surface-variant uppercase">Start Date</th>
                  <th className="py-3 px-2 font-label-sm text-xs text-on-surface-variant uppercase">Length</th>
                  <th className="py-3 px-2 font-label-sm text-xs text-on-surface-variant uppercase">Period</th>
                  <th className="py-3 px-2 font-label-sm text-xs text-on-surface-variant uppercase">Variance</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-on-surface">
                {[
                  { date: 'Sep 15, 2026', length: '28 days', period: '5 days', var: '0' },
                  { date: 'Aug 18, 2026', length: '27 days', period: '4 days', var: '-1' },
                  { date: 'Jul 20, 2026', length: '29 days', period: '6 days', var: '+1' },
                  { date: 'Jun 21, 2026', length: '28 days', period: '5 days', var: '0' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-2">{row.date}</td>
                    <td className="py-3 px-2">{row.length}</td>
                    <td className="py-3 px-2">{row.period}</td>
                    <td className="py-3 px-2 font-semibold text-secondary">{row.var} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
