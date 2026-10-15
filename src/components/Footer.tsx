import React from 'react';
import { ShieldCheck, MapPin, Code2, Heart, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-mono tracking-tight">
                LASTMILE<span className="text-emerald-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm italic font-medium">
              "Every building has an address. Every delivery deserves to find it."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Nigeria's Address Intelligence Network built on the official 11-character digital building postcode launched on 1 October 2026. Empowering merchants, couriers, and platforms to verify locations, eliminate ambiguous directions, and reduce failed deliveries.
            </p>

            {/* Founder Story */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Code2 className="w-3.5 h-3.5" />
                <span>Founder & Technical Architect</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Built by <strong className="text-white">Yusuf Ridwanulahi Adeleke</strong>, a young Nigerian developer interested in using technology to solve practical problems.
              </p>
            </div>
          </div>

          {/* Infrastructure Context */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              National Infrastructure
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Launched 1 October 2026 by NIPOST</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>11-character addressable building codes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>State & LGA administrative hierarchy</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Building-level delivery precision</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>REST API developer integration point</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NDPA 2023 Principles</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed with Nigeria Data Protection Act (NDPA 2023) standards in mind:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Data Minimisation: No surplus contact fields</li>
              <li>• Purpose Limitation: Strictly for delivery routing</li>
              <li>• Transparent local & isolated storage</li>
              <li>• Complete right to erasure available in Settings</li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Prototype Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-300">Independent Prototype Disclaimer:</strong> LastMile AI is an independent technical prototype created for the <em>"Built on Nigeria's Postcode"</em> showcase convened by the Federal Ministry of Communications, Innovation and Digital Economy (FMCIDE) and NIPOST. It is not owned, operated, certified, or endorsed by NIPOST or the Federal Ministry. All sample records and operational figures are labeled clearly to preserve statistical integrity.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 pt-2">
            <span>© 2026 LastMile AI • Developed by Yusuf Ridwanulahi Adeleke</span>
            <span>Federal Republic of Nigeria • Digital Economy Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
