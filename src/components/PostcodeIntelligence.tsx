import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  History, 
  Trash2, 
  Building2, 
  ExternalLink, 
  ShieldAlert, 
  Compass, 
  Sparkles, 
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  lookupPostcode, 
  getLookupHistory, 
  clearLookupHistory 
} from '../services/apiClient';
import { PostcodeLookupResult } from '../types';
import { validatePostcodeFormat } from '../data/samplePostcodes';

export const PostcodeIntelligence: React.FC = () => {
  const [inputCode, setInputCode] = useState('LA10001B019');
  const [currentResult, setCurrentResult] = useState<PostcodeLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [history, setHistory] = useState<PostcodeLookupResult[]>([]);

  useEffect(() => {
    setHistory(getLookupHistory());
    // Run initial lookup for display
    handleLookup('LA10001B019');
  }, []);

  const handleInputChange = (val: string) => {
    const formatted = val.toUpperCase().replace(/[\s-]/g, '').slice(0, 11);
    setInputCode(formatted);
    if (formatted.length > 0 && formatted.length < 11) {
      setFormatError(`11 characters required (currently ${formatted.length})`);
    } else {
      setFormatError(null);
    }
  };

  const handleLookup = async (codeOverride?: string) => {
    const code = (codeOverride || inputCode).trim().toUpperCase();
    if (!code) {
      setFormatError('Please enter an 11-character postcode');
      return;
    }

    const val = validatePostcodeFormat(code);
    if (!val.isValid) {
      setFormatError(val.error || 'Invalid Nigerian postcode format');
      return;
    }

    setFormatError(null);
    setLoading(true);
    try {
      const res = await lookupPostcode(code);
      setCurrentResult(res);
      setHistory(getLookupHistory());
    } catch (err: any) {
      setCurrentResult({
        postcode: code,
        isValidFormat: true,
        isLiveVerified: false,
        isDemonstration: true,
        status: 'error',
        message: 'Could not connect to postcode validation service.',
        lookupTimestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearLookupHistory();
    setHistory([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white">Postcode Intelligence</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Verify Nigeria's official 11-character digital building postcodes through the dedicated NIPOST integration adapter.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Standard: 2-State | 5-District | 4-Building</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lookup Form & Result Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lookup Input Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <label className="block text-sm font-semibold text-slate-200">
              Enter 11-Character Building Postcode
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={11}
                  value={inputCode}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="e.g. LA10001B019"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-base text-white font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="absolute right-3 top-3.5 flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <span>{inputCode.length}/11</span>
                </div>
              </div>

              <button
                onClick={() => handleLookup()}
                disabled={loading || inputCode.length !== 11}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Verify Building</span>
              </button>
            </div>

            {formatError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{formatError}</span>
              </p>
            )}

            {/* Quick Demo Pre-sets */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Try verified demonstration postcodes across Nigeria:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'LA10001B019', label: 'Ikeja Computer Village (Lagos)' },
                  { code: 'LA10101B042', label: 'Broad St / Marina (Lagos Island)' },
                  { code: 'LA10502B088', label: 'Admiralty Way (Lekki Phase 1)' },
                  { code: 'AB90001B008', label: 'Federal Secretariat (Abuja CBD)' },
                  { code: 'KN70001B012', label: 'Kurmi Market (Kano Municipal)' },
                  { code: 'RV50001B031', label: 'Aba Expressway (Port Harcourt)' },
                  { code: 'OY20001B015', label: 'Cocoa House / Dugbe (Ibadan)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setInputCode(item.code);
                      handleLookup(item.code);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      inputCode === item.code
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold text-white">{item.code}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({item.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          {currentResult && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-mono text-emerald-400 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-mono">
                      {currentResult.postcode}
                    </h2>
                    <span className="text-xs text-slate-400">
                      Query executed at {new Date(currentResult.lookupTimestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Badge distinction: Live vs Demonstration */}
                <div>
                  {currentResult.isDemonstration ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      DEMONSTRATION RECORD
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      OFFICIAL NIPOST API VERIFIED
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Prompt Required Warning Banner */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-amber-300 block">Integration Notice:</strong>
                  <p className="leading-relaxed">
                    "Live postcode verification is not configured. You can explore the demonstration interface, but this result has not been verified against NIPOST."
                  </p>
                </div>
              </div>

              {/* Structured Address Breakdown */}
              {currentResult.components ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Structured Building Components Returned:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block">State / Region</span>
                      <strong className="text-sm text-white block mt-0.5">
                        {currentResult.components.state} ({currentResult.components.stateCode})
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Local Government Area (LGA)</span>
                      <strong className="text-sm text-white block mt-0.5">
                        {currentResult.components.lga}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block">District / Ward</span>
                      <strong className="text-sm text-white block mt-0.5">
                        {currentResult.components.district}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Delivery Area / Street Axis</span>
                      <strong className="text-sm text-white block mt-0.5">
                        {currentResult.components.streetName || currentResult.components.area}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
                      <span className="text-xs text-slate-400 block">Registered Building Identification</span>
                      <strong className="text-sm text-emerald-400 block mt-0.5">
                        {currentResult.components.buildingName || `Building Identifier: ${currentResult.components.buildingId}`}
                      </strong>
                      <span className="text-xs text-slate-400 block mt-1">
                        Building Key: <code className="font-mono text-slate-300">{currentResult.components.buildingId}</code>
                      </span>
                    </div>
                  </div>

                  {/* Approximate coordinates notice */}
                  {currentResult.components.approxCoordinates && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Approximate Coordinates: {currentResult.components.approxCoordinates.lat.toFixed(4)}°N, {currentResult.components.approxCoordinates.lng.toFixed(4)}°E
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {currentResult.components.approxCoordinates.source === 'official_demo' ? 'Demonstration Coordinates' : 'Official Geocode'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  No address components could be parsed for this postcode.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: History & Technical Integration Guide */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dedicated NIPOST API Isolation Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>NIPOST API Architecture</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Isolated Module
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This module operates in an isolated service layer (<code className="text-slate-300">server.ts</code> &rarr; <code className="text-slate-300">/api/postcode/lookup</code>).
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Live Configuration Point:</span>
                <code className="text-emerald-300 font-mono text-[11px] block mt-0.5">
                  process.env.NIPOST_API_URL
                </code>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Server-Side Secret:</span>
                <code className="text-emerald-300 font-mono text-[11px] block mt-0.5">
                  process.env.NIPOST_API_KEY
                </code>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Never exposed to frontend code or browser bundles.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300 block mb-1">Production Handshake:</strong>
              When official credentials are set in environment variables, the adapter seamlessly routes lookups to NIPOST without any frontend redesign.
            </div>
          </div>

          {/* Privacy-Safe Lookup History */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" />
                <span>Recent Lookups</span>
              </h3>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent lookups recorded yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {history.map((item, idx) => (
                  <div
                    key={`${item.postcode}-${idx}`}
                    onClick={() => {
                      setInputCode(item.postcode);
                      handleLookup(item.postcode);
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {item.postcode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.lookupTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {item.components && (
                      <p className="text-[11px] text-slate-300 truncate">
                        {item.components.buildingName || item.components.lga} • {item.components.state}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              Privacy protected: Lookup history is stored locally in your current browser session only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
