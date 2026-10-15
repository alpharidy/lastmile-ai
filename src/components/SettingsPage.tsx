import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Server, 
  Database, 
  Cpu, 
  Code2, 
  Copy, 
  Check, 
  Trash2, 
  RotateCcw,
  ExternalLink,
  Layers
} from 'lucide-react';
import { getSystemHealth, resetDemoOrders } from '../services/apiClient';
import { SystemHealthStatus } from '../types';

interface SettingsPageProps {
  onResetData: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetData }) => {
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [clearingStorage, setClearingStorage] = useState(false);

  const checkStatus = async () => {
    setTesting(true);
    try {
      const res = await getSystemHealth();
      setHealth(res);
      setTestResult(`Health check completed successfully at ${new Date().toLocaleTimeString()} (Roundtrip ~${res.nipostApi.lastPingMs || 15}ms)`);
    } catch (e: any) {
      setTestResult('Health check failed: unable to connect to backend server.');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleCopyEnvSnippet = () => {
    const snippet = `# LASTMILE AI CONFIGURATION
PORT=3000
GEMINI_API_KEY="your-gemini-api-key"
NIPOST_API_URL="https://api.nipost.gov.ng/v1/postcodes"
NIPOST_API_KEY="your-server-side-nipost-token"
NIPOST_CLIENT_ID="your-merchant-client-id"`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleClearAllStorage = () => {
    if (confirm('Clear all local order storage and restore fresh initial state?')) {
      setClearingStorage(true);
      try {
        localStorage.clear();
        onResetData();
      } finally {
        setClearingStorage(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-800 text-slate-300">
                <Settings className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white">Settings & Integrations</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Live service status, NIPOST API credentials guide, NDPA data governance, and developer documentation.
            </p>
          </div>

          <button
            onClick={checkStatus}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>Test System Connections</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{testResult}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Node / Express Server
          </span>
        </div>
      )}

      {/* Integration Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NIPOST API Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              NIPOST API
            </span>
            {health?.nipostApi.hasCredentials ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CONFIGURED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                DEMONSTRATION
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-white">
            Official Postcode API
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            {health?.nipostApi.hasCredentials
              ? 'External NIPOST production endpoint connected.'
              : 'Operating in demonstration showcase mode with verified sample directory.'}
          </p>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            Endpoint: <span className="text-slate-300 truncate block">{health?.nipostApi.apiUrl}</span>
          </div>
        </div>

        {/* Gemini AI Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              AI ENGINE
            </span>
            {health?.geminiAi.hasApiKey ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                READY
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                RULE ENGINE ACTIVE
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-white">
            Google Gemini 3.8 Flash
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Executes server-side address completeness diagnostics and operational pattern explanations.
          </p>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            Model: <span className="text-slate-300">gemini-3.8-flash</span>
          </div>
        </div>

        {/* Database & Storage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              STORAGE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <h3 className="text-sm font-bold text-white">
            Order Persistence Engine
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            In-memory server store with client-side localStorage fallback for offline resilience.
          </p>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            Records: <span className="text-slate-300 font-bold">{health?.storage.recordCount || 12} orders</span>
          </div>
        </div>

        {/* App Mode */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              APP RUNTIME
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              v1.0 PILOT
            </span>
          </div>

          <h3 className="text-sm font-bold text-white">
            Showcase Prototype
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Configured for the FMCIDE & NIPOST "Built on Nigeria's Postcode" national showcase.
          </p>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            Security: <span className="text-emerald-400">Server-side secrets</span>
          </div>
        </div>
      </div>

      {/* Developer API & Configuration Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span>NIPOST Official API Environment Variables</span>
              </h3>
              <button
                onClick={handleCopyEnvSnippet}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy .env Template</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When production credentials are provided by NIPOST or the Ministry, configure them in your environment. Secrets are kept strictly on the backend and are never sent to the browser.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-emerald-400">
                    NIPOST_API_URL
                  </code>
                  <span className="text-[10px] text-slate-400">Required for live lookup</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  The base endpoint for NIPOST's official postcode resolution API (e.g. <code className="text-slate-300 font-mono">https://api.nipost.gov.ng/v1/postcodes</code>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-emerald-400">
                    NIPOST_API_KEY
                  </code>
                  <span className="text-[10px] text-rose-400 font-mono">Secret (Server Only)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Private bearer token or API key issued by NIPOST. Never committed to source code or exposed in frontend bundles.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-emerald-400">
                    NIPOST_CLIENT_ID
                  </code>
                  <span className="text-[10px] text-slate-400">Merchant Identification</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Merchant ID for auditing and rate-limiting across national logistics queries.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-purple-400">
                    GEMINI_API_KEY
                  </code>
                  <span className="text-[10px] text-rose-400 font-mono">Secret (Server Only)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Google Gemini AI key used exclusively on the server for address parsing and operations commentary.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NDPA 2023 Data Governance & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>NDPA 2023 Data Governance</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Designed in alignment with the Nigeria Data Protection Act (NDPA 2023):
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white block">1. Data Minimisation:</strong>
                <span>We do not collect customer email, social handles, or national ID numbers. Only essential delivery handover details are stored.</span>
              </li>

              <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white block">2. Purpose Limitation:</strong>
                <span>Address coordinates and building postcodes are used strictly for parcel routing and logistics planning.</span>
              </li>

              <li className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white block">3. Right to Erasure:</strong>
                <span>Merchants can instantly wipe local order history and reset store records at any time.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={onResetData}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Orders to Initial State</span>
              </button>

              <button
                onClick={handleClearAllStorage}
                disabled={clearingStorage}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-900/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Local Storage (Right to Erasure)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
