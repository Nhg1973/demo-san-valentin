
import React, { useState, useEffect } from 'react';
import { QuestConfig, QuestionType } from '../types';
import { COLORS, HeartIcon } from '../constants';
import { getRomanticEncouragement } from '../geminiService';
import { ChevronRight, Sparkles, HelpCircle, ArrowLeft, Lock, Unlock, Key } from 'lucide-react';

interface PlayerViewProps {
  quest: QuestConfig;
  onVictory: () => void;
  onQuit: () => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ quest, onVictory, onQuit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>("¡Prepárate para una aventura de amor!");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const currentQuestion = quest.questions[currentStep];

  useEffect(() => {
    if (!isLocked) {
      const fetchAi = async () => {
        const msg = await getRomanticEncouragement(currentStep + 1, quest.partnerName);
        setAiMessage(msg);
      };
      fetchAi();
    }
  }, [currentStep, isLocked, quest.partnerName]);

  const handleUnlock = () => {
    if (accessInput.trim().toLowerCase() === quest.accessCode.trim().toLowerCase()) {
      setIsLocked(false);
    } else {
      setAccessError(true);
      setTimeout(() => setAccessError(false), 800);
    }
  };

  const handleCheckAnswer = async () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setIsSuccess(true);
      setIsJumping(true);
      setTimeout(async () => {
        setIsSuccess(false);
        setIsJumping(false);
        setSelectedAnswer(null);
        setShowHint(false);
        if (currentStep + 1 < quest.questions.length) {
          setCurrentStep(currentStep + 1);
        } else {
          onVictory();
        }
      }, 1500);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 800);
    }
  };

  if (isLocked) {
    return (
      <div className="max-w-md w-full glass p-12 rounded-[4rem] shadow-2xl text-center space-y-8 animate-float border-4 border-white relative z-10">
        <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-rose-200 border-4 border-white">
          <Lock className="text-white w-10 h-10" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-love text-rose-600">Entrada Secreta</h2>
          <p className="text-slate-500 text-sm font-medium">Hola {quest.partnerName}, ingresa la clave de acceso para ver la sorpresa que {quest.creatorName} preparó para ti.</p>
          
          <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border-2 border-rose-100">
            <Key size={14} className="text-rose-400" />
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Pista Demo: <span className="text-rose-700 bg-rose-200 px-2 py-0.5 rounded font-mono">{quest.accessCode}</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Introduce el PIN secreto"
            className={`w-full p-5 bg-white border-4 rounded-3xl text-center font-bold text-2xl text-rose-900 outline-none transition-all placeholder:text-rose-100
              ${accessError ? 'border-red-400 animate-shake shadow-lg shadow-red-100' : 'border-rose-50 focus:border-rose-600 focus:shadow-2xl focus:shadow-rose-100'}
            `}
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          />
          
          <button 
            onClick={handleUnlock}
            className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <Unlock size={22} /> DESBLOQUEAR CAMINO
          </button>
          
          <button onClick={onQuit} className="text-rose-400 hover:text-rose-600 text-xs font-black uppercase tracking-widest pt-2 transition-colors">
            Cancelar y Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full flex flex-col items-center space-y-8 pb-10">
      <div className="w-full flex justify-between items-center px-4">
        <button onClick={onQuit} className="bg-white/80 backdrop-blur p-2 rounded-xl text-rose-400 hover:text-rose-600 flex items-center gap-1 text-xs font-black uppercase tracking-widest shadow-sm border border-rose-100">
          <ArrowLeft size={16} /> Salir
        </button>
        <div className="bg-rose-600 text-white px-6 py-2 rounded-full shadow-lg">
           <h2 className="text-lg font-love font-bold">{quest.title}</h2>
        </div>
        <div className="w-20" /> 
      </div>

      {/* Visual Path Restored */}
      <div className="w-full h-40 bg-white/90 backdrop-blur rounded-[3rem] relative overflow-hidden flex items-center px-8 shadow-2xl border-4 border-white">
         {/* Línea de conexión */}
         <div className="absolute top-1/2 left-0 right-0 h-3 bg-rose-50 -translate-y-1/2 mx-16 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 transition-all duration-1000" 
              style={{ width: `${(currentStep / (quest.questions.length)) * 100}%` }}
            ></div>
         </div>

         <div className="flex justify-between w-full z-10 items-center">
           {quest.questions.map((_, i) => (
             <div 
               key={i} 
               className={`w-14 h-12 stone transition-all duration-500 flex items-center justify-center text-sm font-black shadow-lg
                 ${i < currentStep 
                    ? 'bg-rose-500 text-white scale-90 border-4 border-rose-200' 
                    : i === currentStep 
                    ? 'bg-white text-rose-600 border-4 border-rose-500 scale-110 animate-bounce' 
                    : 'bg-rose-50 text-rose-200 border-2 border-rose-100'}
                 ${isJumping && i === currentStep ? 'animate-jump' : ''}
               `}
             >
               {i < currentStep ? '✓' : i + 1}
             </div>
           ))}
           <div className={`w-20 h-20 transition-all duration-1000 flex items-center justify-center relative 
              ${currentStep === quest.questions.length ? 'scale-125 opacity-100' : 'opacity-40 grayscale-[0.5]'}`}>
             <div className={`absolute inset-0 bg-rose-400 blur-2xl opacity-20 rounded-full ${currentStep === quest.questions.length ? 'animate-pulse' : ''}`}></div>
             <HeartIcon className={`w-full h-full drop-shadow-lg transition-colors duration-500 ${currentStep === quest.questions.length ? 'text-red-600 animate-pulse-heart' : 'text-rose-200'}`} />
           </div>
         </div>
      </div>

      {/* AI Message Bubble */}
      <div className="w-full bg-rose-600 text-white rounded-[2.5rem] p-6 border-b-8 border-rose-800 italic text-center relative shadow-2xl animate-float">
         <Sparkles className="absolute -top-4 -left-4 text-yellow-300 drop-shadow-md" size={32} />
         <p className="font-bold text-base leading-relaxed">"{aiMessage}"</p>
         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-600 rotate-45"></div>
      </div>

      {/* Question Card */}
      <div className={`w-full glass p-8 md:p-12 rounded-[4rem] shadow-2xl transition-all duration-300 transform border-8 
        ${isError ? 'bg-red-50 border-red-200 translate-x-1 shake' : isSuccess ? 'bg-emerald-50 border-emerald-200 scale-105' : 'border-white'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Desafío {currentStep + 1} de {quest.questions.length}</span>
          </div>
          <div className="flex gap-2">
             {[...Array(quest.questions.length)].map((_, i) => (
               <div key={i} className={`h-2 rounded-full transition-all ${i <= currentStep ? 'bg-rose-600 w-8' : 'bg-rose-100 w-3'}`}></div>
             ))}
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-10 leading-tight tracking-tight">{currentQuestion.text}</h3>

        <div className="space-y-4">
          {currentQuestion.type === QuestionType.YES_NO && (
            <div className="grid grid-cols-2 gap-5">
              {['Sí', 'No'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`py-6 rounded-[2.5rem] font-black text-2xl transition-all border-4 
                    ${selectedAnswer === opt 
                      ? 'bg-rose-600 text-white border-rose-400 shadow-xl shadow-rose-200 scale-105' 
                      : 'bg-white text-rose-600 border-rose-50 hover:border-rose-200 active:scale-95'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === QuestionType.COLOR && (
            <div className="grid grid-cols-3 gap-4">
              {COLORS.map(c => (
                <button 
                  key={c.hex}
                  onClick={() => setSelectedAnswer(c.hex)}
                  className={`h-24 rounded-[2rem] transition-all border-4 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group
                    ${selectedAnswer === c.hex ? 'border-rose-600 scale-110 shadow-2xl z-20' : 'border-white hover:border-rose-100'}
                  `}
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className={`text-[9px] font-black uppercase tracking-widest drop-shadow-md ${['#facc15', '#4ade80'].includes(c.hex) ? 'text-gray-800' : 'text-white'}`}>{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="grid gap-4">
              {(currentQuestion.options || []).map(opt => (
                <button 
                  key={opt}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`w-full p-6 text-center rounded-[2rem] font-bold text-lg transition-all border-4
                    ${selectedAnswer === opt 
                      ? 'bg-rose-600 text-white border-rose-400 shadow-xl' 
                      : 'bg-white text-slate-700 border-rose-50 hover:border-rose-200 active:scale-95'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 space-y-6">
          <button 
            disabled={!selectedAnswer || isSuccess}
            onClick={handleCheckAnswer}
            className={`w-full py-6 rounded-[2.5rem] font-black text-2xl text-white shadow-2xl flex items-center justify-center gap-4 transition-all transform
              ${!selectedAnswer ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-rose-600 hover:bg-rose-700 hover:-translate-y-2 active:translate-y-0'}
              ${isSuccess ? 'bg-emerald-500 shadow-emerald-200' : ''}
            `}
          >
            {isSuccess ? '¡GENIAL! ✓' : isError ? 'UPS, INTENTA DE NUEVO ✗' : 'VERIFICAR RESPUESTA'} <ChevronRight size={28} />
          </button>

          {currentQuestion.hint && (
            <button 
              onClick={() => setShowHint(!showHint)}
              className="w-full py-4 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-rose-600 bg-rose-50 rounded-2xl transition-all border-2 border-rose-100 border-dashed"
            >
              <HelpCircle size={18} /> {showHint ? currentQuestion.hint : 'Ver ayuda del experto'}
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes jump {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3) translateY(-10px); }
        }
        .animate-jump {
          animation: jump 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          75% { transform: translateX(15px); }
        }
      `}</style>
    </div>
  );
};

export default PlayerView;
