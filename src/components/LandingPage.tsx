import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Layers, 
  Compass, 
  Building2, 
  Fuel, 
  Clock, 
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { NavTab } from './Navbar';
import { lookupPostcode } from '../services/apiClient';
import { PostcodeLookupResult } from '../types';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenCreateOrder: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenCreateOrder,
}) => {
  const [testPostcode, setTestPostcode] = useState('LA10001B019');
  const [lookupResult, setLookupResult] = useState<PostcodeLookupResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickLookup = async (codeToTest?: string) => {
    const code = codeToTest || testPostcode;
    setLoading(true);
    try {
      const res = await lookupPostcode(code);
      setLookupResult(res);
    } catch (e) {
      // handled in apiClient
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Vision & Value */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>National Digital Postcode Live • 1 October 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Your postcode is more than an address.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  It's the beginning of a smarter Nigeria.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                LastMile AI helps Nigerian businesses validate building-level postcodes, organise deliveries, and make better operational decisions.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Explore Merchant Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('postcodes')}
                  className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Verify an 11-Digit Code</span>
                </button>
              </div>

              {/* Tagline & Assurance */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Building-level precision (11 chars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero invented coordinates or routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NDPA 2023 privacy aligned</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Tester Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h3 className="text-sm font-semibold text-white">
                      Live Postcode Verification Simulator
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    NIPOST Specs
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block text-xs font-medium text-slate-300">
                    Enter Nigeria 11-Character Building Postcode:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        maxLength={11}
                        value={testPostcode}
                        onChange={(e) => setTestPostcode(e.target.value.toUpperCase())}
                        placeholder="e.g. LA10001B019"
                        className="w-full pl-3 pr-8 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-mono text-slate-500">
                        {testPostcode.length}/11
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickLookup()}
                      disabled={loading || testPostcode.length === 0}
                      className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Verify</span>
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400">Try commercial test codes:</span>
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                      {[
                        { code: 'LA10001B019', label: 'Ikeja (Lagos)' },
                        { code: 'AB90001B008', label: 'Secretariat (Abuja)' },
                        { code: 'KN70001B012', label: 'Kurmi (Kano)' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          onClick={() => {
                            setTestPostcode(item.code);
                            handleQuickLookup(item.code);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          {item.code} <span className="text-slate-400">({item.label})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  {lookupResult && (
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-emerald-400 font-semibold">
                          {lookupResult.postcode}
                        </span>
                        {lookupResult.isDemonstration ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            DEMONSTRATION RECORD
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            OFFICIAL NIPOST API VERIFIED
                          </span>
                        )}
                      </div>

                      {/* Prompt constraint banner */}
                      <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-800/40 leading-snug">
                        {lookupResult.message}
                      </p>

                      {lookupResult.components && (
                        <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300 text-[11px]">
                          <div>
                            <span className="text-slate-400 block">State:</span>
                            <span className="font-medium text-white">{lookupResult.components.state}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">LGA:</span>
                            <span className="font-medium text-white">{lookupResult.components.lga}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block">Building & District:</span>
                            <span className="font-medium text-white">
                              {lookupResult.components.buildingName || lookupResult.components.buildingId} • {lookupResult.components.district}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => onNavigate('postcodes')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Open Complete Postcode Intelligence Tool</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5-Stage Delivery Workflow Illustration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
            End-to-End Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How LastMile AI Coordinates Deliveries With Official Postcodes
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Eliminating descriptive confusion before parcels leave your store or fulfillment hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Merchant Creates Order',
              desc: 'Logistics operator or store clerk records package weight, recipient, and reference.',
              icon: Layers,
            },
            {
              step: '02',
              title: 'Customer Supplies Postcode',
              desc: 'Recipient enters their official 11-character digital building code.',
              icon: MapPin,
            },
            {
              step: '03',
              title: 'NIPOST API Validation',
              desc: 'System calls official NIPOST endpoint to verify building identifier and LGA hierarchy.',
              icon: FileCheck,
            },
            {
              step: '04',
              title: 'AI Completeness Check',
              desc: 'Smart assistant reviews address structure, detects missing unit notes, and flags risks.',
              icon: Sparkles,
            },
            {
              step: '05',
              title: 'Dispatch & Outcome Log',
              desc: 'Merchant groups orders by verified LGA, dispatches couriers, and logs final delivery.',
              icon: Truck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      STEP {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Anatomy of Nigeria's 11-Character Digital Postcode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Official Standard Structure
              </span>
              <h2 className="text-2xl font-bold text-white">
                Understanding Nigeria's 11-Character Digital Postcode
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Launched by NIPOST on 1 October 2026, Nigeria's new national postcode system is structured hierarchically from state to building door.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="text-slate-200 font-semibold block">Architectural Principle:</span>
                <p>
                  No more guessing whether "beside the yellow gate" is the first or second compound. Every addressable structure possesses a unique, verifiable digital identifier.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
                <div className="text-center font-mono">
                  <span className="text-xs text-slate-400 block mb-2">Example Postcode (Otigba St, Ikeja):</span>
                  <div className="inline-flex items-center gap-1 text-xl sm:text-2xl font-bold tracking-widest bg-slate-900 p-3 rounded-xl border border-slate-800 text-white">
                    <span className="text-emerald-400">LA</span>
                    <span className="text-teal-300">100</span>
                    <span className="text-blue-400">01</span>
                    <span className="text-purple-400">B019</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/20">
                    <span className="text-[10px] font-mono text-emerald-400 block font-bold">POS 1-2 (LA)</span>
                    <strong className="text-white block mt-0.5">State Code</strong>
                    <span className="text-slate-400 text-[11px]">Lagos State</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-teal-500/20">
                    <span className="text-[10px] font-mono text-teal-300 block font-bold">POS 3-5 (100)</span>
                    <strong className="text-white block mt-0.5">LGA / District</strong>
                    <span className="text-slate-400 text-[11px]">Ikeja Municipality</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/20">
                    <span className="text-[10px] font-mono text-blue-400 block font-bold">POS 6-7 (01)</span>
                    <strong className="text-white block mt-0.5">Delivery Area</strong>
                    <span className="text-slate-400 text-[11px]">Computer Village</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-purple-500/20">
                    <span className="text-[10px] font-mono text-purple-400 block font-bold">POS 8-11 (B019)</span>
                    <strong className="text-white block mt-0.5">Building ID</strong>
                    <span className="text-slate-400 text-[11px]">Exact Structure Door</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits for Nigerian Merchants & Couriers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
            Practical Business Value
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Built for Nigerian Commerce & Logistics Reality
          </h2>
          <p className="text-sm text-slate-400">
            Solving real pain points for retailers, food delivery, e-commerce, and logistics operators across Lagos, Abuja, Kano, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Fuel className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Prevent Wasted Courier Fuel & Calls
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatch riders waste up to 45 minutes and ₦3,000 in fuel roaming streets looking for ambiguous landmarks. An 11-character code leads directly to the registered building gate.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Higher First-Attempt Delivery Success
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Incomplete addresses are the #1 reason for failed deliveries and costly returns in Nigeria. Quarantining orders without postcodes protects your business margins.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Administrative LGA Grouping
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize daily dispatch manifests by verified Local Government Area and District. Couriers handle parcels within a verified perimeter without crossing congested urban chokepoints.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-2xl mx-auto">
            Ready to test address intelligence for your Nigerian delivery operations?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience the working merchant dashboard, test AI address structuring, and review operational delivery insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              Open Merchant Dashboard
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
            >
              Test Smart Address AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
