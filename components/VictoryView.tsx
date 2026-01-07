
import React, { useEffect, useState } from 'react';
import { QuestConfig, BrandConfig } from '../types';
import { HeartIcon } from '../constants';
import { getFinalLovePoem } from '../geminiService';
import { RefreshCw, Sparkles, Heart, ImageIcon, Gift, CheckCircle, Smartphone, Camera } from 'lucide-react';
import QRCode from 'react-qr-code';

interface VictoryViewProps {
  quest: QuestConfig;
  onRestart: () => void;
  brand: BrandConfig;
}

const VictoryView: React.FC<VictoryViewProps> = ({ quest, onRestart, brand }) => {
  const [poem, setPoem] = useState<string>("");
  const [loadingPoem, setLoadingPoem] = useState(true);

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        setLoadingPoem(true);
        const text = await getFinalLovePoem(quest.partnerName);
        setPoem(text);
      } catch (err) {
        setPoem("En cada latido, mi amor por ti crece,\nun camino de vida que juntos florece.");
      } finally {
        setLoadingPoem(false);
      }
    };
    fetchPoem();
  }, [quest.partnerName]);

  return (
    <div className="max-w-4xl w-full text-center space-y-12 p-6 min-h-screen flex flex-col items-center py-12">
      
      {/* SECCIÓN ROMÁNTICA PRINCIPAL */}
      <div className="glass p-10 rounded-[4rem] shadow-2xl space-y-8 max-w-2xl border-8 border-white w-full animate-float relative z-10">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="bg-white p-5 rounded-full shadow-2xl border-4 border-rose-100">
                <HeartIcon className="w-14 h-14 text-rose-600 animate-pulse-heart" />
            </div>
        </div>

        <div className="pt-8 space-y-2">
          <h2 className="text-6xl font-love text-rose-600 drop-shadow-sm">¡Lo Lograste!</h2>
          <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.4em]">Felicidades {quest.partnerName}</p>
        </div>

        {/* IMAGEN FINAL (SORPRESA) */}
        {quest.finalImageUrl && (
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-rose-200 to-rose-100 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white p-4 pb-16 shadow-2xl rounded-sm transform -rotate-2 hover:rotate-0 transition-all duration-500 border border-slate-100">
                <div className="aspect-square w-full overflow-hidden bg-slate-100 rounded-sm">
                    <img 
                        src={quest.finalImageUrl} 
                        alt="Nuestra Sorpresa" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop";
                        }}
                    />
                </div>
                <div className="absolute bottom-4 left-0 right-0">
                    <p className="font-love text-2xl text-slate-400 italic">Nuestra Historia ❤️</p>
                </div>
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm">
                    <Camera size={16} className="text-rose-500" />
                </div>
            </div>
          </div>
        )}

        <div className="bg-rose-50/50 p-8 rounded-[3rem] italic text-slate-700 border-2 border-rose-100 relative shadow-inner">
          <Sparkles className="absolute -top-3 -left-3 text-yellow-400" size={28} />
          {loadingPoem ? (
            <div className="flex flex-col items-center gap-3 py-4 text-rose-300">
                <RefreshCw className="animate-spin" size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Inspirando al poeta...</span>
            </div>
          ) : (
            <p className="font-bold text-xl leading-relaxed text-rose-800">"{poem}"</p>
          )}
        </div>
        
        <div className="space-y-4">
            <div className="h-1 w-20 bg-rose-200 mx-auto rounded-full"></div>
            <p className="text-3xl text-slate-800 font-black italic leading-tight">"{quest.finalMessage}"</p>
        </div>
      </div>

      {/* SECCIÓN DE REGALO CORPORATIVO (GIFT CARD) */}
      <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(225,29,72,0.2)] overflow-hidden border-4 border-white transform transition-all hover:scale-[1.02] relative">
        <div style={{ backgroundColor: brand.primaryColor }} className="px-12 py-10 flex justify-between items-center text-white relative overflow-hidden">
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '24px 24px'}}></div>
            </div>
            
            <div className="flex items-center gap-5 relative z-10">
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                    <img src={brand.logoUrl} alt={brand.name} className="h-10 object-contain" />
                </div>
                <div className="h-10 w-[2px] bg-white/30 rounded-full"></div>
                <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-90 block mb-0.5">Beneficio Exclusivo</span>
                    <h4 className="font-black text-lg leading-none">SAN VALENTÍN 2026</h4>
                </div>
            </div>
            <CheckCircle className="text-white/40" size={40} />
        </div>

        <div className="p-12 flex flex-col md:flex-row items-center gap-12 text-left bg-gradient-to-b from-white to-rose-50/30">
            <div className="flex-1 space-y-8">
                <div className="space-y-2">
                    <div className="inline-block bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Cupón de Regalo</div>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{brand.rewardValue}</h3>
                    <p className="text-rose-500 font-black text-lg uppercase tracking-widest">En perfumes y cosmética</p>
                </div>
                
                <div className="space-y-4">
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                        {brand.rewardDisclaimer}
                    </p>
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-rose-100 shadow-sm">
                        <Smartphone size={20} className="text-rose-400" />
                        <span className="text-sm font-mono font-black text-slate-700 tracking-wider">{brand.discountCode}</span>
                    </div>
                </div>
            </div>

            <div className="shrink-0 space-y-4 text-center">
                <div className="bg-white p-6 rounded-[3rem] shadow-xl border-4 border-rose-50 flex flex-col items-center gap-4 group">
                    <div className="p-4 bg-rose-50 rounded-2xl transition-transform group-hover:scale-105">
                        <QRCode 
                            value={brand.discountCode} 
                            size={140} 
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            fgColor={brand.primaryColor}
                        />
                    </div>
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">Escanear en caja</span>
                </div>
            </div>
        </div>

        <div className="px-12 py-6 bg-rose-100/20 border-t border-rose-100 text-center">
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.4em]">Válido en sucursales {brand.name}</p>
        </div>
      </div>

      {/* BOTÓN REINICIAR */}
      <div className="pt-6">
          <button onClick={onRestart} className="px-12 py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-2xl transition-all transform active:scale-95 flex items-center gap-4 text-lg border-b-4 border-slate-700">
            <RefreshCw size={24} /> VOLVER A EMPEZAR
          </button>
      </div>

      <div className="flex flex-col items-center gap-2 opacity-40">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Campaña desarrollada por Love Quest SaaS</p>
        <div className="flex gap-1">
            <Heart size={8} className="text-rose-400" fill="currentColor"/>
            <Heart size={8} className="text-rose-400" fill="currentColor"/>
            <Heart size={8} className="text-rose-400" fill="currentColor"/>
        </div>
      </div>
    </div>
  );
};

export default VictoryView;
