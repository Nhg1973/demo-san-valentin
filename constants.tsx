
import React from 'react';
import { BrandConfig, Question, QuestionType } from './types';

export const COLORS = [
  { name: 'Rojo Pasión', hex: '#ef4444' },
  { name: 'Rosa Amor', hex: '#f472b6' },
  { name: 'Azul Cielo', hex: '#60a5fa' },
  { name: 'Verde Esperanza', hex: '#4ade80' },
  { name: 'Amarillo Sol', hex: '#facc15' },
  { name: 'Morado Mágico', hex: '#a855f7' },
];

// CONFIGURACIÓN FIJA PARA LA MARCA (EJEMPLO: FARMACIA)
export const BRAND_CONFIG: BrandConfig = {
  name: "FARMACIA SAN VALENTÍN",
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png", // Icono de farmacia/salud
  primaryColor: "#e11d48", // Rose 600
  accentColor: "#fb7185",  // Rose 400
  campaignTitle: "Campaña Salud & Amor 2026",
  rewardValue: "25% DESCUENTO",
  rewardDisclaimer: "Válido en dermocosmética y perfumes presentando este QR en caja.",
  discountCode: "FARMACIA-AMOR-2026"
};

// PREGUNTAS FIJAS QUE LA MARCA SIEMPRE QUIERE HACER
export const FIXED_BRAND_QUESTIONS: Question[] = [
  {
    id: 'brand-1',
    text: "¿Sabías que en nuestra farmacia tenemos el pack 'Piel Radiante' para San Valentín?",
    type: QuestionType.YES_NO,
    options: ['Sí', 'No'],
    correctAnswer: 'Sí',
    hint: "¡Visítanos y descúbrelo!"
  },
  {
    id: 'brand-2',
    text: "¿Cuál es nuestro horario especial de San Valentín?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['8:00 a 20:00', 'Abierto 24hs', 'Cerrado'],
    correctAnswer: 'Abierto 24hs',
    hint: "¡Siempre estamos para cuidarte!"
  }
];

export const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.726 4 2.022C12.454 3.726 13.943 3 15.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
  </svg>
);

export const DEFAULT_QUEST: any = {
  title: "El Camino de Nuestra Historia",
  creatorName: "Tu Nombre",
  partnerName: "Tu Pareja",
  accessCode: "1234",
  finalMessage: "¡Te amo infinitamente! Gracias por ser mi compañera de vida.",
  questions: [
    ...FIXED_BRAND_QUESTIONS,
    {
      id: 'user-1',
      text: "¿Donde fue nuestra primera cena?",
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['En el parque', 'En un restaurante', 'En casa'],
      correctAnswer: 'En un restaurante',
      hint: "Había mucha música..."
    }
  ]
};
