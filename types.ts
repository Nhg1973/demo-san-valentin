
export enum QuestionType {
  YES_NO = 'YES_NO',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  COLOR = 'COLOR',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

export interface BrandConfig {
  name: string;
  logoUrl: string;
  primaryColor: string; // Hex code para botones y acentos
  accentColor: string;
  campaignTitle: string;
  rewardValue: string;
  rewardDisclaimer: string;
  discountCode: string;
}

export interface QuestConfig {
  title: string;
  creatorName: string;
  partnerName: string;
  accessCode: string;
  finalMessage: string;
  finalImageUrl?: string;
  questions: Question[];
}

export interface AppState {
  view: 'HOME' | 'ADMIN_LOGIN' | 'ADMIN_PANEL' | 'PLAYER' | 'VICTORY';
  quest: QuestConfig;
  isAdmin: boolean;
  brand: BrandConfig;
}
