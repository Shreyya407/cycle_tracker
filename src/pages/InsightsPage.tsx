import React from 'react';
import { useData } from '../context/DataContext';

export const InsightsPage: React.FC = () => {
  const { patterns, prediction } = useData();

  return (
    <div className="p-4 lg:p-8 max-w-container-max mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium">Personal Pattern Discovery</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-on-surface-variant bg-surface-variant/40 px-3 py-1.5 rounded-full text-xs font-label-md">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>These are personal tracking observations, not medical diagnoses.</span>
          </div>

          <div className="flex items-center gap-1.5 text-secondary font-label-md text-xs bg-secondary-container/40 px-3 py-1.5 rounded-full border border-secondary-container">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Prediction Confidence: {prediction.confidenceScore}% based on historical consistency</span>
          </div>
        </div>
      </header>

      {/* Pattern Cards Grid */}
      {patterns.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-tier-1 border border-outline-variant/10 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-secondary text-[32px]">insights</span>
          </div>
          <h3 className="font-serif text-2xl text-primary mb-2">No Patterns Yet</h3>
          <p className="font-sans text-body-md text-on-surface-variant max-w-md mx-auto">
            Personal patterns will appear here once you've logged a few cycles, symptoms, and daily check-ins. Start tracking to unlock personalized insights.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map((item) => (
          <article
            key={item.id}
            className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 flex flex-col gap-4 border border-outline-variant/10 hover:shadow-tier-2 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <span className={`px-3 py-1 rounded-full font-label-sm text-xs uppercase tracking-wider ${item.badgeColor}`}>
                {item.category}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-primary mb-2">{item.title}</h3>
              <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-auto pt-3 border-t border-outline-variant/10 flex justify-between items-center text-xs font-label-md text-on-surface-variant">
              <span>Relevant Range</span>
              <span className="font-semibold text-primary">{item.cycleDaysRange}</span>
            </div>
          </article>
        ))}

        {/* Holistic Summary Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-tier-1 flex flex-col justify-between border border-outline-variant/10 md:col-span-2 lg:col-span-3 min-h-[220px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/20 to-tertiary-fixed/20 pointer-events-none"></div>

          <div className="relative z-10 space-y-3">
            <h3 className="font-serif text-3xl text-primary">Holistic Pattern Summary</h3>
            <p className="font-sans text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Your overall wellbeing tracking displays steady balance across recent cycles. Continuing your current sleep routine and hydration practices supports ongoing physical and emotional equilibrium.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs font-label-md text-secondary mt-4">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Algorithms update dynamically as you log more check-ins.</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default InsightsPage;
