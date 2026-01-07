
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRomanticEncouragement = async (step: number, partnerName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe una frase muy corta y romántica (máximo 15 palabras) para animar a ${partnerName} a seguir en un juego de preguntas sobre su relación. Están en el paso ${step} de un camino hacia un gran corazón. En español.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    // Accessing .text as a property, not a method.
    return response.text || "¡Vas por buen camino, mi amor! ❤️";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "¡Cada paso nos acerca más! Sigue adelante.";
  }
};

export const getFinalLovePoem = async (partnerName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe un poema de amor extremadamente corto (4 versos) dedicado a ${partnerName} celebrando que completó el 'Camino del Corazón'. En español, dulce y emotivo.`,
    });
    // Accessing .text as a property, not a method.
    return response.text || "Mi corazón late por ti...";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "En cada latido, mi amor por ti crece sin medida.";
  }
};
