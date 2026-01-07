
import React, { useState, useEffect } from 'react';
import { DEFAULT_QUEST, HeartIcon, BRAND_CONFIG, FIXED_BRAND_QUESTIONS } from './constants';
import { QuestConfig, AppState } from './types';
import CreatorView from './components/CreatorView';
import PlayerView from './components/PlayerView';
import VictoryView from './components/VictoryView';
import { Sparkles, Lock, Settings, CheckCircle, Copy, X, Globe, LayoutDashboard, Link as LinkIcon, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'HOME',
    quest: DEFAULT_QUEST,
    isAdmin: false,
    brand: BRAND_CONFIG
  });

  const [adminPassInput, setAdminPassInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const encodeQuest = (obj: QuestConfig) => {
    try {
      const str = JSON.stringify(obj);
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return "";
    }
  };

  const decodeQuest = (base64: string): QuestConfig | null => {
    try {
      const str = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && hash.length > 20) {
      const sharedQuest = decodeQuest(hash);
      if (sharedQuest) {
        // Asegurarse de que las preguntas de marca siempre estén presentes incluso en links viejos
        const hasBrandQuestions = sharedQuest.questions.some(q => q.id.startsWith('brand-'));
        const updatedQuest = hasBrandQuestions 
          ? sharedQuest 
          : { ...sharedQuest, questions: [...FIXED_BRAND_QUESTIONS, ...sharedQuest.questions] };
          
        setState(prev => ({ ...prev, quest: updatedQuest, view: 'PLAYER' }));
      }
    }
  }, []);

  const handleAdminLogin = () => {
    if (adminPassInput.toLowerCase() === 'admin') {
      setState(prev => ({ ...prev, view: 'ADMIN_PANEL', isAdmin: true }));
      setAdminPassInput('');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 800);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {}
  };

  const saveAndGenerateLink = async (newQuest: QuestConfig) => {
    // Garantizar que las preguntas fijas no se pierdan al guardar
    const brandIds = FIXED_BRAND_QUESTIONS.map(q => q.id);
    const userQuestions = newQuest.questions.filter(q => !brandIds.includes(q.id));
    const finalQuest = { ...newQuest, questions: [...FIXED_BRAND_QUESTIONS, ...userQuestions] };

    localStorage.setItem('love_quest_data', JSON.stringify(finalQuest));
    const hash = encodeQuest(finalQuest);
    const newUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    window.history.replaceState(null, '', newUrl);
    setGeneratedLink(newUrl);
    await copyToClipboard(newUrl);
    setState(prev => ({ ...prev, quest: finalQuest }));
  };

  const handleTest = (currentQuest: QuestConfig) => {
    setState(prev => ({ ...prev, quest: currentQuest, view: 'PLAYER' }));
  };

  const BrandHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-rose-100 z-[100] px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-rose-50 rounded-xl">
          <img src={state.brand.logoUrl} alt={state.brand.name} className="h-10 object-contain" />
        </div>
        <div className="hidden md:block h-8 w-[1px] bg-rose-100"></div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">
            {state.brand.campaignTitle}
          </p>
          <h2 className="text-xs font-bold text-slate-800">{state.brand.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-rose-500 px-3 py-1.5 rounded-full shadow-lg shadow-rose-200">
          <Globe size={12} className="text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Demo Comercial</span>
        </div>
        {state.view === 'HOME' && (
          <button 
            onClick={() => setState(prev => ({ ...prev, view: 'ADMIN_LOGIN' }))} 
            className="p-2.5 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#fff5f5] pt-24 overflow-x-hidden">
      {/* Elementos flotantes decorativos */}
      <div className="fixed top-20 left-10 opacity-20 animate-float text-rose-300"><HeartIcon className="w-20" /></div>
      <div className="fixed bottom-20 right-10 opacity-20 animate-float-delayed text-rose-300"><HeartIcon className="w-16" /></div>

      <BrandHeader />

      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
          <div className="bg-rose-600 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white">
            <CheckCircle size={18} />
            <span className="font-bold text-xs uppercase tracking-widest">Enlace Copiado</span>
          </div>
        </div>
      )}

      {generatedLink && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md px-6">
          <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-md w-full p-8 md:p-10 space-y-8 animate-float relative border-8 border-rose-50">
            <button 
              onClick={() => setGeneratedLink(null)} 
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X size={28} />
            </button>
            
            <div className="text-center space-y-4">
              <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <LinkIcon className="text-rose-600" size={36} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">¡Enlace Listo!</h3>
                <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Compártelo con tu pareja</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] ml-2">Vista previa del link:</p>
              <div className="bg-rose-50 p-5 rounded-3xl border-2 border-rose-100 flex items-center gap-3 group hover:border-rose-300 transition-all overflow-hidden">
                <div className="bg-white p-2 rounded-xl text-rose-500 shadow-sm shrink-0">
                  <ExternalLink size={16} />
                </div>
                <p className="text-xs font-mono text-rose-700 font-bold truncate flex-1 select-all">
                  {generatedLink}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <button 
                onClick={() => copyToClipboard(generatedLink)} 
                className="w-full py-6 bg-rose-600 text-white font-black rounded-[2rem] shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all transform active:scale-95 text-lg flex items-center justify-center gap-3 border-b-4 border-rose-800"
              >
                <Copy size={22} /> COPIAR ENLACE
              </button>
              
              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                El enlace contiene toda la configuración de tu aventura.
              </p>
            </div>
          </div>
        </div>
      )}

      {state.view === 'HOME' && (
        <div className="max-w-md w-full text-center space-y-8 glass p-10 md:p-14 rounded-[4rem] shadow-2xl border-4 border-white animate-float relative z-10">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-rose-100 p-6 rounded-full border-4 border-rose-200 shadow-xl shadow-rose-100">
                <HeartIcon className="w-20 h-20 text-rose-600 animate-pulse-heart" />
              </div>
            </div>
            <h1 className="text-6xl font-love text-rose-600 leading-tight drop-shadow-sm">{state.quest.title}</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Alianza exclusiva con {state.brand.name}</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setState(prev => ({ ...prev, view: 'PLAYER' }))}
              className="w-full py-6 bg-rose-600 text-white font-black rounded-3xl shadow-[0_15px_30px_-5px_rgba(225,29,72,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-xl"
            >
              <Sparkles size={24} /> EMPEZAR JUEGO
            </button>

            <button 
              onClick={() => setState(prev => ({ ...prev, view: 'ADMIN_LOGIN' }))}
              className="w-full py-5 bg-white text-rose-600 border-4 border-rose-50 font-black rounded-3xl shadow-lg hover:bg-rose-50 transition-all flex items-center justify-center gap-3 text-sm"
            >
              <LayoutDashboard size={20} /> PANEL DE CONFIGURACIÓN
            </button>
          </div>

          <div className="pt-4 flex flex-col items-center gap-2">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Campaña de San Valentín 2026</p>
            <div className="h-1 w-12 bg-rose-200 rounded-full"></div>
          </div>
        </div>
      )}

      {state.view === 'ADMIN_LOGIN' && (
        <div className="max-w-xs w-full glass p-12 rounded-[3.5rem] text-center space-y-8 shadow-2xl border-4 border-white relative">
          <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-rose-200 rotate-3">
            <Lock size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Acceso B2B</h2>
            <div className="bg-rose-50 py-2 rounded-full border border-rose-100">
              <p className="text-[10px] text-rose-500 font-black">Password Demo: <span className="bg-rose-600 text-white px-2 py-0.5 rounded ml-1">admin</span></p>
            </div>
          </div>
          <div className="space-y-4">
            <input 
              type="password"
              placeholder="Contraseña"
              className={`w-full p-5 rounded-2xl border-4 text-center outline-none transition-all font-bold text-lg ${loginError ? 'border-red-400 animate-shake' : 'border-rose-50 focus:border-rose-600'}`}
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <button onClick={handleAdminLogin} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all">ACCEDER AL PANEL</button>
            <button onClick={() => setState(prev => ({ ...prev, view: 'HOME' }))} className="text-[10px] text-slate-400 hover:text-rose-600 uppercase font-black tracking-widest transition-colors">Volver al Inicio</button>
          </div>
        </div>
      )}

      {state.view === 'ADMIN_PANEL' && (
        <CreatorView initialQuest={state.quest} onSave={saveAndGenerateLink} onTest={handleTest} onCancel={() => setState(prev => ({ ...prev, view: 'HOME' }))} />
      )}

      {state.view === 'PLAYER' && (
        <PlayerView quest={state.quest} onVictory={() => setState(prev => ({ ...prev, view: 'VICTORY' }))} onQuit={() => setState(prev => ({ ...prev, view: 'HOME' }))} />
      )}

      {state.view === 'VICTORY' && (
        <VictoryView quest={state.quest} onRestart={() => setState(prev => ({ ...prev, view: 'HOME' }))} brand={state.brand} />
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default App;
