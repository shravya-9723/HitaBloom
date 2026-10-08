import {
  characterChatReply, characterGuides, genericCharacterChatReply, mapSymptomToArea,
  type CharacterGuide,
} from './data';

export type SafeTranslation = {
  text: string;
  language: string;
  translated: boolean;
};

export type SymptomAnalysis = {
  learningArea: string;
  educationalOnly: true;
  diagnosis: null;
  message: string;
};

export type QuestSuggestion = {
  title: string;
  minutes: string;
  note: string;
  status: 'pending';
  approvalRequired: true;
};

export type CulturalContext = {
  title: string;
  context: string;
  tradition: string;
  evidence: string;
};

export function translateContent(
  sourceText: string,
  language: string,
  reviewedTranslations: Record<string, string> = {},
): SafeTranslation {
  if (language === 'English') return { text: sourceText, language: 'English', translated: false };
  const reviewed = reviewedTranslations[language];
  return reviewed
    ? { text: reviewed, language, translated: true }
    : { text: sourceText, language: 'English', translated: false };
}

export function analyzeSymptom(text: string): SymptomAnalysis | null {
  const cleaned = text.trim();
  if (!cleaned) return null;
  return {
    learningArea: mapSymptomToArea(cleaned),
    educationalOnly: true,
    diagnosis: null,
    message: 'This is an educational topic match only. It does not identify a cause or diagnose a condition.',
  };
}

export function generateBodyExplanation(area: string, language: string): {
  guide: CharacterGuide;
  text: string;
  englishSubtitle: string;
  displayLanguage: string;
  translated: boolean;
} {
  const guide = characterGuides[area] ?? characterGuides['Brain Garden'];
  const result = translateContent(guide.line, language, guide.translations);
  return {
    guide,
    text: result.text,
    englishSubtitle: guide.subtitle,
    displayLanguage: result.language,
    translated: result.translated,
  };
}

export function answerCharacterQuestion(question: string, language: string, symptom = ''): SafeTranslation {
  const context = `${question} ${symptom}`.toLowerCase();
  const source = /cough|throat|breath|lung/.test(context)
    ? characterChatReply
    : genericCharacterChatReply;
  return translateContent(source.English, language, source);
}

const reviewedCulturalContexts: Record<string, CulturalContext> = {
  India: {
    title: 'Warm drinks and rest',
    context: 'In some Indian households, warm drinks may be offered as comfort during throat irritation. Customs vary by region, family, and individual.',
    tradition: 'Traditional context: a warm drink may be shared for comfort and hydration; this is not a treatment recommendation.',
    evidence: 'Warm fluids may soothe a throat and support hydration. They do not treat every cause of cough.',
  },
  Greece: {
    title: 'Comforting herbal infusions',
    context: 'Herbal infusions are part of some Greek family traditions as a comforting drink. Plants, preparation, and beliefs vary widely.',
    tradition: 'Traditional context: a warm infusion may be shared for comfort. No specific herb is recommended here.',
    evidence: 'Evidence depends on the plant and preparation. A warm drink may soothe, but does not treat the cause of a cough.',
  },
  Nigeria: {
    title: 'Community care',
    context: 'In some Nigerian communities, family and community support can be an important part of everyday wellbeing. Practices are diverse and personal.',
    tradition: 'Traditional context: companionship and practical support may help someone feel cared for; this is not a medical treatment.',
    evidence: 'Supportive relationships can contribute to wellbeing, but do not treat the cause of a cough.',
  },
};

export function generateCulturalContext(culture: string): CulturalContext | null {
  return reviewedCulturalContexts[culture] ?? null;
}

export function explainDoctorInstructions(instructions: string, patientLanguage: string): {
  verbatim: string;
  displayLanguage: string;
  translated: false;
  explanation: string;
} {
  const exactText = instructions;
  return {
    verbatim: exactText,
    displayLanguage: 'English',
    translated: false,
    explanation: patientLanguage === 'English'
      ? 'These are Dr. Maya’s exact instructions.'
      : 'A verified translation of this doctor-authored text is not available. The original English instructions remain unchanged.',
  };
}

export function suggestQuest(_learningArea: string): QuestSuggestion {
  return {
    title: 'A gentle 5-minute pause',
    minutes: '5',
    note: 'Take a short break at a comfortable pace. Skip it if it does not feel right for you.',
    status: 'pending',
    approvalRequired: true,
  };
}
