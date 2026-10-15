import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Copy, 
  ArrowRight, 
  ShieldAlert, 
  Lightbulb, 
  FileEdit, 
  MessageSquare,
  Building,
  Check
} from 'lucide-react';
import { analyzeAddress } from '../services/apiClient';
import { AddressAnalysisResult } from '../types';

interface AddressAssistantProps {
  onUseDraftForOrder?: (draft: AddressAnalysisResult['structuredDraft']) => void;
}

export const AddressAssistant: React.FC<AddressAssistantProps> = ({
  onUseDraftForOrder,
}) => {
  const [inputText, setInputText] = useState(
    'Pepple street, inside Computer village Ikeja, enter through the gate near the transformer, yellow building beside the chemist.'
  );
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AddressAnalysisResult | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleAnalyze = async (overrideText?: string) => {
    const text = overrideText || inputText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeAddress(text);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInquiry = () => {
    if (!analysis) return;
    const msg = analysis.structuredDraft.recommendedPostcodeInquiry || 
      `Hello! To ensure our delivery courier arrives directly at your gate without delay, please provide your official 11-character NIPOST building postcode. Thank you!`;
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white">Smart Address Assistant</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              AI-assisted address entry guidance, courier ambiguity diagnostics, and structured draft generation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Server-side Gemini 3.8 Flash + Rule Engine</span>
          </div>
        </div>
      </div>

      {/* Strict Ethical AI Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block">Integrity & Grounding Guarantee:</strong>
          <p className="text-slate-400 leading-relaxed">
            The assistant identifies missing address components and explains why subjective directions cause delivery failures. It will <strong>never invent an official postcode</strong>, claim to have verified an address without an official NIPOST API response, or fabricate exact GPS coordinates from vague descriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <label className="block text-sm font-semibold text-slate-200">
              Paste or Type Descriptive Address:
            </label>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Lagos, near the market, beside a pharmacy, second gate on the left..."
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {inputText.length} characters
              </span>

              <button
                onClick={() => handleAnalyze()}
                disabled={loading || !inputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Diagnose Address</span>
              </button>
            </div>

            {/* Nigerian descriptive examples */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Try common Nigerian delivery descriptions:
              </span>
              <div className="space-y-2">
                {[
                  {
                    title: 'Ikeja Tech Corridor (Subjective landmarks)',
                    text: 'Pepple street, inside Computer village Ikeja, enter through the gate near the transformer, yellow building beside the chemist.',
                  },
                  {
                    title: 'Wuse 2 Commercial (Missing door/suite)',
                    text: 'Wuse 2 Abuja, behind Banex plaza, turn left after the shawarma spot, gate painted black with green spikes.',
                  },
                  {
                    title: 'Lekki Admiralty Way (Vague intersection)',
                    text: 'Lekki phase 1, around Admiralty way near the roundabout, opposite the big grocery store.',
                  },
                ].map((eg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(eg.text);
                      handleAnalyze(eg.text);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 transition-colors"
                  >
                    <span className="font-semibold text-white block">{eg.title}</span>
                    <span className="text-slate-400 text-[11px] truncate block mt-0.5">
                      "{eg.text}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Action Column */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
              {/* Score Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Address Completeness Diagnostics</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({analysis.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Rule Engine Fallback'})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluation of routing viability for last-mile couriers
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Completeness</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      {analysis.completenessScore}/100
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400">
                    {analysis.completenessScore}%
                  </div>
                </div>
              </div>

              {/* Missing Components Alert */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-2">
                <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Missing Essential Delivery Components:</span>
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 pl-5 list-disc">
                  {analysis.missingComponents.map((item, idx) => (
                    <li key={idx} className="text-rose-200/90 font-medium">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Why Descriptive Directions Fail */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Why This Description Fails Nigerian Couriers:</span>
                </h4>
                <div className="space-y-2">
                  {analysis.risksForCouriers.map((risk, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Draft For Review */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <FileEdit className="w-4 h-4 text-teal-400" />
                    <span>Structured Order Draft:</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Pending Official Postcode
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-500 block">Identified State:</span>
                    <span className="font-medium text-white">{analysis.structuredDraft.state || 'Unspecified'}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-500 block">Identified LGA/Area:</span>
                    <span className="font-medium text-white">{analysis.structuredDraft.lga || 'Unspecified'}</span>
                  </div>
                  <div className="col-span-2 p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-500 block">Landmark Reference Notes:</span>
                    <span className="font-medium text-slate-200">{analysis.structuredDraft.landmarkReference}</span>
                  </div>
                </div>
              </div>

              {/* Customer Follow-up Message Template */}
              <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <span>Customer WhatsApp / SMS Request Template:</span>
                  </span>
                  <button
                    onClick={handleCopyInquiry}
                    className="text-xs text-teal-300 hover:text-white flex items-center gap-1 bg-teal-900/40 px-2.5 py-1 rounded border border-teal-700/50 transition-colors"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="p-3 rounded bg-slate-950 border border-teal-900/50 text-xs text-slate-300 italic font-mono leading-relaxed">
                  "{analysis.structuredDraft.recommendedPostcodeInquiry || 
                    'Hello! To ensure our delivery courier arrives directly at your gate without delay, please provide your official 11-character NIPOST building postcode. Thank you!'}"
                </p>
              </div>

              {/* Action Button */}
              {onUseDraftForOrder && (
                <button
                  onClick={() => onUseDraftForOrder(analysis.structuredDraft)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Create Delivery Order With This Draft</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Enter an address description to begin
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                The Smart Assistant will parse landmark notes, explain why subjective directions cause couriers to fail, and prepare a customer follow-up request.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
