import React from 'react';

const StatItem: React.FC<{ value: string, label: string }> = ({ value, label }) => (
  <div className="text-center p-6 border-r border-white/10 last:border-none">
    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{value}</div>
    <div className="text-sm text-blue-200 uppercase tracking-widest font-medium">{label}</div>
  </div>
);

const Stats: React.FC = () => {
  return (
    <section className="bg-unp-primary py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem value="100+" label="Unit PC Workstation" />
          <StatItem value="350m²" label="Luas Area Lab" />
          <StatItem value="50+" label="Lisensi Software" />
          <StatItem value="1Gbps" label="Koneksi Intranet" />
        </div>
      </div>
    </section>
  );
};

export default Stats;