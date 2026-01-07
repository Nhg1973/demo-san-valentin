
import React, { useState } from 'react';
import { QuestConfig, Question, QuestionType } from '../types';
import { COLORS, FIXED_BRAND_QUESTIONS } from '../constants';
import { Trash2, Check, X, Key, Gift, Play, CheckCircle2, Circle, Share2, Link as LinkIcon, Image as ImageIcon, Plus, Lock } from 'lucide-react';

interface CreatorViewProps {
  initialQuest: QuestConfig;
  onSave: (quest: QuestConfig) => void;
  onTest: (quest: QuestConfig) => void;
  onCancel: () => void;
}

const CreatorView: React.FC<CreatorViewProps> = ({ initialQuest, onSave, onTest, onCancel }) => {
  const [quest, setQuest] = useState<QuestConfig>(initialQuest);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `user-${Date.now()}`,
      text: "¿Nueva Pregunta Personal?",
      type: QuestionType.YES_NO,
      correctAnswer: "Sí",
      options: ["Sí", "No"],
      hint: ""
    };
    setQuest({ ...quest, questions: [...quest.questions, newQuestion] });
  };

  const removeQuestion = (id: string) => {
    // No permitir borrar preguntas de marca
    if (id.startsWith('brand-')) return;
    if (quest.questions.length <= 1) return;
    setQuest({ ...quest, questions: quest.questions.filter(q => q.id !== id) });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    // No permitir editar texto ni tipo de preguntas de marca
    if (id.startsWith('brand-')) return;
    
    setQuest({
      ...quest,
      questions: quest.questions.map(q => {
        if (q.id === id) {
          const updated = { ...q, ...updates };
          if (updates.type) {
            if (updates.type === QuestionType.YES_NO) {
              updated.options = ["Sí", "No"];
              updated.correctAnswer = "Sí";
            } else if (updates.type === QuestionType.COLOR) {
              updated.options = undefined;
              updated.correctAnswer = COLORS[0].hex;
            } else if (updates.type === QuestionType.MULTIPLE_CHOICE) {
              updated.options = ["Opción 1", "Opción 2"];
              updated.correctAnswer = "Opción 1";
            }
          }
          return updated;
        }
        return q;
      })
    });
  };

  const updateOptionText = (questionId: string, index: number, text: string) => {
    if (questionId.startsWith('brand-')) return;
    const q = quest.questions.find(q => q.id === questionId);
    if (q && q.options) {
      const newOptions = [...q.options];
      const oldVal = newOptions[index];
      newOptions[index] = text;
      updateQuestion(questionId, { 
        options: newOptions,
        correctAnswer: q.correctAnswer === oldVal ? text : q.correctAnswer
      });
    }
  };

  const addOption = (questionId: string) => {
    if (questionId.startsWith('brand-')) return;
    const q = quest.questions.find(q => q.id === questionId);
    if (q && q.options) {
      updateQuestion(questionId, { options: [...q.options, `Nueva Opción ${q.options.length + 1}`] });
    }
  };

  const removeOption = (questionId: string, index: number) => {
    if (questionId.startsWith('brand-')) return;
    const q = quest.questions.find(q => q.id === questionId);
    if (q && q.options && q.options.length > 2) {
      const newOptions = q.options.filter((_, i) => i !== index);
      updateQuestion(questionId, { 
        options: newOptions,
        correctAnswer: q.correctAnswer === q.options[index] ? newOptions[0] : q.correctAnswer
      });
    }
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl p-6 md:p-10 max-h-[92vh] overflow-hidden flex flex-col border-8 border-rose-50 relative z-10">
      {/* Header Fijo */}
      <div className="flex justify-between items-center mb-6 border-b-4 border-rose-50 pb-6 shrink-0">
        <div>
          <h2 className="text-4xl font-love text-rose-600">Editor de Campaña</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Configura la experiencia de San Valentín</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onTest(quest)} className="p-4 bg-rose-50 text-rose-600 rounded-3xl hover:bg-rose-600 hover:text-white transition-all active:scale-90 flex items-center gap-2 border border-rose-100">
            <Play size={22}/>
            <span className="hidden md:block font-black text-xs">PROBAR</span>
          </button>
          <button onClick={() => onSave(quest)} className="p-4 bg-rose-600 text-white rounded-3xl hover:bg-rose-700 transition-all active:scale-90 shadow-xl shadow-rose-100 flex items-center gap-2">
            <Share2 size={24}/>
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Generar Link Demo</span>
          </button>
          <button onClick={onCancel} className="p-4 bg-slate-100 text-slate-400 rounded-3xl hover:bg-slate-200 transition-all active:scale-90"><X size={24}/></button>
        </div>
      </div>

      {/* Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-12 custom-scrollbar pb-10">
        
        {/* Configuración General */}
        <section className="bg-rose-50/50 p-8 rounded-[3rem] space-y-6 border-4 border-white shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-3">Nombre del Creador</label>
              <input className="w-full p-5 rounded-[2rem] border-4 border-white focus:border-rose-200 outline-none font-bold text-slate-700 shadow-sm" value={quest.creatorName} onChange={e => setQuest({...quest, creatorName: e.target.value})} placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-3">Nombre del Jugador</label>
              <input className="w-full p-5 rounded-[2rem] border-4 border-white focus:border-rose-200 outline-none font-bold text-slate-700 shadow-sm" value={quest.partnerName} onChange={e => setQuest({...quest, partnerName: e.target.value})} placeholder="Nombre de tu pareja" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-3">PIN Secreto de Acceso</label>
            <input className="w-full p-5 rounded-[2rem] border-4 border-rose-100 text-center font-mono font-black text-rose-600 text-2xl shadow-inner bg-white/50" value={quest.accessCode} onChange={e => setQuest({...quest, accessCode: e.target.value})} placeholder="Ej: 1234" />
          </div>
        </section>

        {/* Sección de Sorpresa Final */}
        <section className="bg-rose-600 p-10 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Gift size={150}/></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl"><Gift size={32}/></div>
            <h3 className="font-black text-3xl uppercase tracking-tighter">Premio Final</h3>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-80 ml-4 tracking-widest">Dedicatoria Final Personalizada</label>
              <textarea 
                className="w-full p-6 bg-white/10 border-4 border-white/20 rounded-[2.5rem] text-white outline-none focus:bg-white/20 font-bold text-lg placeholder:text-rose-200"
                rows={3}
                placeholder="Escribe algo tierno para cuando gane..."
                value={quest.finalMessage}
                onChange={(e) => setQuest({...quest, finalMessage: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-80 ml-4 tracking-widest">URL de Imagen/Foto Sorpresa</label>
              <div className="flex gap-3 items-center bg-white/10 border-4 border-white/20 rounded-[2rem] p-3">
                <LinkIcon className="ml-3 text-rose-200" size={24} />
                <input 
                  className="flex-1 bg-transparent p-3 text-white outline-none text-sm font-mono placeholder:text-rose-200 font-bold"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={quest.finalImageUrl || ""}
                  onChange={(e) => setQuest({...quest, finalImageUrl: e.target.value})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Listado de Preguntas */}
        <section className="space-y-8 px-2">
          <div className="flex justify-between items-end border-b-4 border-rose-50 pb-4">
            <div>
              <h3 className="font-black text-slate-800 text-3xl tracking-tighter">Piedras del Camino</h3>
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mt-1">Marca + Personalización</p>
            </div>
            <button onClick={addQuestion} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-rose-100 flex items-center gap-2 transform active:scale-95 transition-all">
              <Plus size={18}/> AÑADIR PERSONALIZADA
            </button>
          </div>

          <div className="space-y-8">
            {quest.questions.map((q, idx) => {
              const isBrand = q.id.startsWith('brand-');
              return (
                <div key={q.id} className={`p-8 border-4 rounded-[3.5rem] bg-white relative hover:shadow-2xl transition-all group ${isBrand ? 'border-rose-200 bg-rose-50/30' : 'border-rose-50 hover:border-rose-200'}`}>
                  {isBrand ? (
                    <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1 bg-rose-100 rounded-full text-rose-500">
                      <Lock size={14}/>
                      <span className="text-[9px] font-black uppercase">Fijo de Marca</span>
                    </div>
                  ) : (
                    <button onClick={() => removeQuestion(q.id)} className="absolute top-6 right-8 text-rose-200 hover:text-rose-600 transition-colors p-2 bg-rose-50 rounded-xl"><Trash2 size={20}/></button>
                  )}
                  
                  <div className="space-y-6">
                    <div className="flex gap-6 items-start">
                      <div className={`w-14 h-14 rounded-3xl ${isBrand ? 'bg-slate-800' : 'bg-rose-600'} text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <input 
                          className={`w-full bg-transparent font-black text-2xl text-slate-800 border-b-4 outline-none pb-2 transition-colors ${isBrand ? 'border-transparent' : 'border-rose-50 focus:border-rose-400'}`}
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          placeholder="Texto de la pregunta..."
                          readOnly={isBrand}
                        />
                        <div className="flex flex-wrap gap-4">
                          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${isBrand ? 'bg-slate-100 text-slate-400 border-slate-100' : 'bg-rose-50 text-rose-400 border-rose-50'}`}>
                            {q.type === QuestionType.YES_NO ? 'SÍ / NO' : q.type === QuestionType.MULTIPLE_CHOICE ? 'Múltiple' : 'Color'}
                          </div>
                          {!isBrand && (
                            <input 
                              className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-400 outline-none border-2 border-slate-50 focus:border-rose-100" 
                              placeholder="Pista estratégica (opcional)..." 
                              value={q.hint || ""} 
                              onChange={(e) => updateQuestion(q.id, { hint: e.target.value })} 
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Opciones Interactivas */}
                    <div className="pl-20 space-y-4">
                      {q.type === QuestionType.YES_NO && (
                        <div className="flex gap-4">
                          {["Sí", "No"].map(val => (
                            <button key={val} disabled={isBrand} onClick={() => updateQuestion(q.id, { correctAnswer: val })} className={`flex-1 py-4 rounded-2xl font-black transition-all border-4 flex items-center justify-center gap-3 text-sm ${q.correctAnswer === val ? 'bg-rose-600 border-rose-700 text-white shadow-xl shadow-rose-100' : 'bg-white border-rose-50 text-rose-200'}`}>
                              {q.correctAnswer === val ? <CheckCircle2 size={18}/> : <Circle size={18}/>} {val}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === QuestionType.COLOR && (
                        <div className="grid grid-cols-6 gap-3">
                          {COLORS.map(c => (
                            <button key={c.hex} disabled={isBrand} onClick={() => updateQuestion(q.id, { correctAnswer: c.hex })} className={`h-12 rounded-xl border-4 transition-all flex items-center justify-center ${q.correctAnswer === c.hex ? 'border-rose-600 scale-110 shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: c.hex }}>
                              {q.correctAnswer === c.hex && <CheckCircle2 size={20} className={['#facc15', '#4ade80'].includes(c.hex) ? 'text-slate-800' : 'text-white'} />}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === QuestionType.MULTIPLE_CHOICE && (
                        <div className="space-y-3">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex gap-3 items-center">
                              <button disabled={isBrand} onClick={() => updateQuestion(q.id, { correctAnswer: opt })} className={`transition-all ${q.correctAnswer === opt ? 'text-rose-600 scale-110' : 'text-rose-100'}`}><CheckCircle2 size={24}/></button>
                              <input 
                                className={`flex-1 p-3 rounded-2xl border-4 text-sm font-black outline-none transition-all ${isBrand ? 'bg-slate-50 border-transparent text-slate-500' : q.correctAnswer === opt ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-50 bg-slate-50 text-slate-400 focus:border-rose-100'}`} 
                                value={opt} 
                                onChange={(e) => updateOptionText(q.id, oIdx, e.target.value)} 
                                readOnly={isBrand}
                              />
                              {!isBrand && q.options && q.options.length > 2 && (
                                <button onClick={() => removeOption(q.id, oIdx)} className="text-rose-100 hover:text-rose-500 transition-colors"><X size={18}/></button>
                              )}
                            </div>
                          ))}
                          {!isBrand && (
                            <button onClick={() => addOption(q.id)} className="text-rose-400 font-black text-[10px] uppercase tracking-widest py-3 px-6 hover:text-rose-600 flex items-center gap-2 bg-rose-50 rounded-xl transition-all w-fit">
                              <Plus size={14}/> Añadir Opción Personalizada
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreatorView;
