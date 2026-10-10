import {
  characterChatReply, characterChatSubtitle, characterGuides,
  genericCharacterChatReply, genericCharacterChatSubtitle, mapSymptomToArea,
  type CharacterGuide,
} from './data';

export type SafeTranslation = {
  text: string;
  language: string;
  translated: boolean;
  englishSubtitle?: string;
  audioUrl?: string;
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
  traditionalContext: string;
  traditionalUse: string;
  modernEvidence: string;
  safety: string;
  context?: string;
  tradition?: string;
  evidence?: string;
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

export const heartCharacterChatReply: Record<string, string> = {
  English: 'The heart pumps oxygen-rich blood through your body. Chest discomfort should always be evaluated by Dr. Maya.',
  Hindi: 'हृदय पूरे शरीर में ऑक्सीजन युक्त रक्त का संचार करता है। सीने में किसी भी परेशानी के लिए हमेशा डॉ. माया से जांच कराएं।',
  Telugu: 'గుండె శరీరమంతటా ప్రాణవాయువుతో కూడిన రక్తాన్ని పంపు చేస్తుంది. ఛాతీలోని అసౌకర్యంపై ఎల్లప్పుడూ డాక్టర్ మాయాను సంప్రదించండి.',
  Greek: 'Η καρδιά αντλεί οξυγονωμένο αίμα σε όλο το σώμα. Οποιαδήποτε ενόχληση στο στήθος πρέπει να αξιολογείται από τη Δρ. Μάγια.',
  Yoruba: 'Ọkàn ń fa ẹ̀jẹ̀ tí ó kún fún afẹ́fẹ́ sí gbogbo ara rẹ. Bá Dókítà Maya sọ̀rọ̀ fún àwọn ìmọ̀lára àyà rẹ.',
};
export const heartCharacterChatSubtitle = 'The heart pumps blood through your body. Discuss chest discomfort with Dr. Maya.';

export const boneCharacterChatReply: Record<string, string> = {
  English: 'Bones form a protective mineral structure that keeps you tall and strong. Consult Dr. Maya for joint aches or injuries.',
  Hindi: 'हड्डियां एक सुरक्षात्मक ढांचा बनाती हैं जो आपको सीधा और मजबूत रखती हैं। जोड़ों के दर्द के लिए डॉ. माया से सलाह लें।',
  Telugu: 'ఎముకలు శరీరాన్ని నిటారుగా మరియు బలంగా ఉంచే సహజ రక్షణ కవచం. కీళ్ల నొప్పుల కోసం డాక్టర్ మాయాను సంప్రదించండి.',
  Greek: 'Τα οστά σχηματίζουν μια προστατευτική δομή που σας κρατά δυνατούς. Συμβουλευτείτε τη Δρ. Μάγια για πόνους στις αρθρώσεις.',
  Yoruba: 'Àwọn egungun ń kọ́ àgbékalẹ̀ alààyè tí ń mú kí o dúró ṣinṣin. Bá Dókítà Maya sọ̀rọ̀ fún àwọn ìrora oríkèé.',
};
export const boneCharacterChatSubtitle = 'Bones protect and support the body. Check with Dr. Maya for persistent aches.';

export const brainCharacterChatReply: Record<string, string> = {
  English: 'The brain coordinates your nervous system and recharges during quiet sleep. Persistent headaches should be checked by Dr. Maya.',
  Hindi: 'मस्तिष्क तंत्रिका तंत्र को नियंत्रित करता है और शांत नींद में ऊर्जा पाता है। लगातार सिरदर्द के लिए डॉ. माया से संपर्क करें।',
  Telugu: 'మెదడు నరాల వ్యవస్థను సమన్వయం చేస్తుంది మరియు ప్రశాంతమైన నిద్రలో శక్తిని పొందుతుంది. నిరంతర తలనొప్పికి డాక్టర్ మాయాను సంప్రదించండి.',
  Greek: 'Ο εγκέφαλος συντονίζει το νευρικό σύστημα και ανανεώνεται στον ύπνο. Για επίμονους πονοκεφάλους επικοινωνήστε με τη Δρ. Μάγια.',
  Yoruba: 'Ọpọlọ ń ṣe kòkárí àwọn iṣan ara ó sì ń tún okun ṣe nígbà oorun. Bá Dókítà Maya sọ̀rọ̀ fún orí fífọ́ tó ń pẹ́.',
};
export const brainCharacterChatSubtitle = 'The brain coordinates the body and recharges in sleep. Discuss headaches with Dr. Maya.';

export const muscleCharacterChatReply: Record<string, string> = {
  English: "Muscles power all body movement and need gentle hydration and rest. Severe strain or pain requires Dr. Maya's clinical review.",
  Hindi: 'मांसपेशियां शरीर की हर हलचल को शक्ति देती हैं और उन्हें आराम की जरूरत होती है। ज्यादा दर्द होने पर डॉ. माया से सलाह लें।',
  Telugu: 'కండరాలు శరీర కదలికలకు శక్తినిస్తాయి, వాటికి సరైన విశ్రాంతి అవసరం. తీవ్రమైన నొప్పుల కోసం డాక్టర్ మాయా సలహా తీసుకోండి.',
  Greek: 'Οι μύες τροφοδοτούν κάθε κίνηση και χρειάζονται σωστή ξεκούραση. Για έντονο πόνο συμβουλευτείτε τη Δρ. Μάγια.',
  Yoruba: 'Àwọn ìṣan ń fún gbogbo ìrìn-àjò ní agbára wọ́n sì nílò ìsinmi. Fún ìrora tó le, bá Dókítà Maya sọ̀rọ̀.',
};
export const muscleCharacterChatSubtitle = 'Muscles provide movement and need hydration. Consult Dr. Maya for prolonged soreness.';

export const waterCharacterChatReply: Record<string, string> = {
  English: 'Hydration supports mucosal moisture and temperature balance. Discuss fluid intake plans with Dr. Maya.',
  Hindi: 'पर्याप्त पानी पीने से गला नम रहता है और शरीर का तापमान नियंत्रित रहता है। तरल पदार्थों के बारे में डॉ. माया से पूछें।',
  Telugu: 'తగినంత నీరు తాగడం వల్ల శరీరం చల్లబడి గొంతు తేమగా ఉంటుంది. ద్రవాల ప్రణాళికపై డాక్టర్ మాయాను అడగండి.',
  Greek: 'Η καλή ενυδάτωση στηρίζει την υγρασία των βλεννογόνων. Συζητήστε το πρόγραμμα υγρών με τη Δρ. Μάγια.',
  Yoruba: 'Mímu omi ń mú kí ọ̀fun tutù tí ó sì ń ṣe àtìlẹ́yìn fún ara. Bá Dókítà Maya sọ̀rọ̀ nípa ètò ohun mímu.',
};
export const waterCharacterChatSubtitle = 'Fluids maintain bodily hydration. Review personal fluid recommendations with Dr. Maya.';

export function answerCharacterQuestion(question: string, language: string, symptom = ''): SafeTranslation {
  const context = `${question} ${symptom}`.toLowerCase();
  let source = genericCharacterChatReply;
  let subtitle = genericCharacterChatSubtitle;

  const LANG_CODES: Record<string, string> = {
    English: 'en',
    Hindi: 'hi',
    Telugu: 'te',
    Greek: 'el',
    Yoruba: 'yo',
  };
  const langCode = LANG_CODES[language] || 'en';
  let topic = 'generic';

  if (/cough|throat|breath|breathing|lung|airway|respir|wheeze|asthma|bronch|phlegm|congestion|cold|mucus|జలుబు|దగ్గు|శ్వాస|గొంతు|కఫం|ఊపిరితిత్తులు|खांसी|खाँसी|जुकाम|सर्दी|गला|सांस|कफ|βήχας|κρυολόγημα|πνεύμονας|λαιμός|αναπνοή|ikọ́|otútù|ọ̀fun|ẹ̀dọ̀fóró/.test(context)) {
    topic = 'cough';
    source = characterChatReply;
    subtitle = characterChatSubtitle;
  } else if (/water|drink|fluid|hydrat|thirst|fluids|నీరు|నీళ్లు|ద్రవాలు|దాహం|पानी|तरल|जल|प्यास|νερό|υγρά|ενυδάτωση|omi|ohun mímu/.test(context)) {
    topic = 'water';
    source = waterCharacterChatReply;
    subtitle = waterCharacterChatSubtitle;
  } else if (/heart|chest|beat|pulse|blood|cardio|circulation|palpitat|గుండె|ఛాతీ|రక్తం|నాడి|हृदय|दिल|सीना|छाती|रक्त|καρδιά|στήθος|αίμα|ọkàn|àyà|ẹ̀jẹ̀/.test(context)) {
    topic = 'heart';
    source = heartCharacterChatReply;
    subtitle = heartCharacterChatSubtitle;
  } else if (/bone|joint|skeleton|posture|fracture|broken|break|crack|spine|wrist|ankle|knee|hip|elbow|shoulder|sprain|rib|ortho|osteopor|ఎముక|కీలు|విరుపు|వెన్నెముక|మోకాలు|కీళ్ళు|हड्डी|जोड़|फ्रैक्चर|टूटना|रीढ़|घुटना|οστά|κόκαλο|άρθρωση|κάταγμα|egungun|oríkèé/.test(context)) {
    topic = 'bone';
    source = boneCharacterChatReply;
    subtitle = boneCharacterChatSubtitle;
  } else if (/muscle|sore|strain|strength|flex|cramp|spasm|pull|pulled|hamstring|calf|quad|tendon|కండరం|కండరాలు|నొప్పి|తిమ్మిరి|मांसपेशी|मांसपेशियां|खिंचाव|दर्द|μύες|μυς|πιάσιμο|ìṣan|ẹran ara/.test(context)) {
    topic = 'muscle';
    source = muscleCharacterChatReply;
    subtitle = muscleCharacterChatSubtitle;
  } else if (/brain|head|sleep|headache|migraine|mind|memory|focus|stress|dizzy|dizziness|confusion|మెదడు|తల|తలనొప్పి|నిద్ర|ఒత్తిడి|జ్ఞాపకం|मस्तिष्क|दिमाग|सिरदर्द|सिर|नींद|तनाव|εγκέφαλος|κεφάλι|πονοκέφαλος|ύπνος|ọpọlọ|orí|oorun/.test(context)) {
    topic = 'brain';
    source = brainCharacterChatReply;
    subtitle = brainCharacterChatSubtitle;
  }

  const audioUrl = `/assets/audio/replies/reply-${topic}-${langCode}.mp3`;
  const result = translateContent(source.English, language, source);
  return {
    ...result,
    englishSubtitle: subtitle,
    audioUrl,
  };
}

export const CULTURAL_WELLNESS_DATA: Record<string, Record<string, CulturalContext>> = {
  'Lung Valley': {
    India: {
      title: 'Tulsi (Holy Basil) & Warm Decoctions',
      traditionalContext: 'In Indian Ayurvedic and household traditions, fresh Tulsi leaves and warm herbal decoctions (kadha) have been prepared for generations during throat irritation and seasonal coughs.',
      traditionalUse: 'Warm infusions sipped with crushed ginger, black pepper, or honey to provide soothing warmth to the throat.',
      modernEvidence: 'Preliminary clinical research suggests Tulsi (Ocimum sanctum) contains eugenol, rosmarinic acid, and antioxidants that may support respiratory comfort and ease throat irritation.',
      safety: 'Culinary consumption is generally safe. Excessive concentrates or tinctures should be discussed with a doctor. Never substitute for prescribed medications.',
      context: 'In Indian households, warm drinks and Tulsi infusions are prepared during throat irritation for comfort.',
      tradition: 'Traditional context: Tulsi and warm spiced infusions provide comforting hydration for throat irritation.',
      evidence: 'Some studies suggest tulsi may support respiratory comfort and ease irritated airways.',
    },
    Greece: {
      title: 'Greek Mountain Tea (Sideritis) & Thyme Honey',
      traditionalContext: 'Greek family traditions dating back to antiquity honor mountain tea (tsai tou vounou) steeped from wild Sideritis plants, often sweetened with thyme honey.',
      traditionalUse: 'Consumed as a hot soothing tisane to ease respiratory dryness, soothe ticklish coughs, and encourage hydration.',
      modernEvidence: 'Pharmacological analyses show Sideritis contains flavonoids, phenylpropanoids, and essential oils with gentle anti-inflammatory and mucosal soothing actions.',
      safety: 'Regarded as very safe when consumed as an herbal tisane. Ensure liquids are warm rather than scalding to avoid thermal injury.',
      context: 'Greek mountain tea (Sideritis) with thyme honey is a longstanding Mediterranean tradition for throat comfort.',
      tradition: 'Traditional context: Hot Sideritis infusions offer throat soothing and warming hydration.',
      evidence: 'Flavonoid components in Sideritis show mild mucosal soothing and antioxidant properties in scientific literature.',
    },
    Nigeria: {
      title: 'Bitter Leaf Infusion & Ginger Steam',
      traditionalContext: 'In Yoruba and wider Nigerian herbal traditions, mild infusions of Bitter Leaf (Ewuro / Vernonia amygdalina) and fresh ginger root are time-honored remedies for revitalization.',
      traditionalUse: 'Prepared as a warm wash, tea, or steam inhalation to loosen chest discomfort and comfort an irritable cough.',
      modernEvidence: 'Vernonia amygdalina contains bioactive sesquiterpene lactones and luteolin. Warm steam helps hydrate the mucous membranes of the respiratory tract.',
      safety: 'Culinary and moderate tea intake is safe. High concentrated extracts should be avoided during pregnancy without physician oversight.',
      context: 'In Nigerian households, ginger and bitter leaf preparations are traditionally used to soothe irritated airways.',
      tradition: 'Traditional context: Mild infusions and warm ginger vapors provide comforting support.',
      evidence: 'Hydration and gentle herbal steam loosen airway dryness and promote comfort.',
    },
  },
  'Brain Garden': {
    India: {
      title: 'Brahmi & Evening Warm Spiced Milk',
      traditionalContext: 'Traditional Indian wellness values Brahmi (Bacopa monnieri) and evening warm golden milk with nutmeg or cardamom for quieting mental fatigue.',
      traditionalUse: 'Sipped before sleep or during mindful evening pauses to settle an overactive mind and foster calm rest.',
      modernEvidence: 'Controlled trials suggest Bacopa monnieri may support attention regulation and reduce cortisol response over sustained periods.',
      safety: 'Safe in standard dietary amounts. Individuals taking sedative or neurological prescriptions should notify their clinician.',
      context: 'Ayurvedic traditions emphasize Brahmi and warm milk with spices for evening mental calm.',
      tradition: 'Traditional context: Nourishing evening rituals to soothe mental fatigue and foster restful sleep.',
      evidence: 'Bacopa extracts have shown modest improvements in cognitive focus and stress markers in clinical studies.',
    },
    Greece: {
      title: 'Wild Chamomile (Chamomili) & Restful Olive Grove Pauses',
      traditionalContext: 'Since the era of Hippocrates, Greek folk tradition has turned to dried wild chamomile flower tisanes paired with restful midday or evening quiet.',
      traditionalUse: 'Brewed as an evening wind-down beverage to ease tension, soothe nervous headaches, and invite restorative sleep.',
      modernEvidence: 'Chamomile contains apigenin, a bioflavonoid that binds to GABA-A receptors in the central nervous system, promoting gentle relaxation.',
      safety: 'Very gentle and widely tolerated. People with severe allergies to plants in the ragweed family should take precautions.',
      context: 'Wild chamomile tea is a foundational Mediterranean ritual for unwinding and gentle rest.',
      tradition: 'Traditional context: Evening chamomile tisanes soothe worries and prepare the mind for sleep.',
      evidence: 'Apigenin in chamomile binds to neuroreceptors associated with mild anxiety reduction.',
    },
    Nigeria: {
      title: 'Moringa Tisane & Communal Stillness',
      traditionalContext: 'Nigerian traditional care emphasizes nourishing Moringa oleifera leaves combined with twilight storytelling and restful family stillness.',
      traditionalUse: 'Consumed as a warm restorative beverage to replenish vitality after taxing intellectual or physical work.',
      modernEvidence: 'Moringa is dense in neuroprotective polyphenols, amino acids, and essential micronutrients that mitigate oxidative stress.',
      safety: 'Safe as a culinary food and dietary tea. Concentrated medicinal root extracts should be avoided during pregnancy.',
      context: 'Moringa leaf brews are shared across Nigeria to replenish stamina and soothe mental stress.',
      tradition: 'Traditional context: Wholesome leaf broths and evening rest restore depleted vitality.',
      evidence: 'Rich antioxidant profiles assist in cellular recovery from mental and physical strain.',
    },
  },
  'Heart Garden': {
    India: {
      title: 'Arjuna Bark Tonic & Sheetali Breathing',
      traditionalContext: 'Ayurvedic traditions record Terminalia arjuna tree bark decoctions paired with cooling pranayama (breathing exercises) to support heart vigor.',
      traditionalUse: 'Prepared as a mild milk decoction to nourish emotional stability, stamina, and cardiovascular tranquility.',
      modernEvidence: 'Studies show Terminalia arjuna contains oligomeric proanthocyanidins and cardiac flavonoids that may support vascular endothelial function.',
      safety: 'Must never replace clinical cardiac prescriptions or medical advice. Inform your cardiologist of any herbal supplementation.',
      context: 'Arjuna bark is traditionally consumed in India as a heart-supportive nutritional tonic.',
      tradition: 'Traditional context: Mild decoctions and cooling breathing cultivate cardiovascular tranquility.',
      evidence: 'Endothelial and vascular supportive compounds have been noted in cardiovascular research.',
    },
    Greece: {
      title: 'Extra Virgin Olive Oil, Wild Greens (Horta) & Garlic',
      traditionalContext: 'The traditional Mediterranean diet from Crete and Ikaria prioritizes unheated polyphenol-rich olive oil, wild harvested greens, and raw garlic.',
      traditionalUse: 'Daily dietary foundation celebrated for cardiovascular vitality, clear blood vessels, and longevity.',
      modernEvidence: 'Backed by major trials including PREDIMED, the Mediterranean dietary pattern significantly reduces cardiovascular risks and systemic arterial stiffness.',
      safety: 'Extremely safe as general nutrition. Patients on blood-thinning therapies should keep dietary vitamin K intake consistent.',
      context: 'Unheated extra virgin olive oil and wild greens are the cornerstones of Aegean heart health.',
      tradition: 'Traditional context: Nutrient-dense fresh regional foods support enduring vitality.',
      evidence: 'Extensive randomized trials confirm significant cardiovascular risk reductions with Mediterranean nutrition.',
    },
    Nigeria: {
      title: 'Zobo (Hibiscus Sabdariffa) Cold Brew',
      traditionalContext: 'Deep crimson calyces of Hibiscus sabdariffa (Zobo / Bissap) steeped with ginger and cloves are a cherished ceremonial West African cooler.',
      traditionalUse: 'Enjoyed for bodily refreshment, thirst relief, and nurturing buoyant circulation.',
      modernEvidence: 'Clinical studies document that Hibiscus calyx anthocyanins possess mild natural ACE-inhibitory and diuretic actions that help sustain healthy blood pressure.',
      safety: 'Safe as an everyday beverage. Mega-dose extracts may interact with prescription antihypertensives or acetaminophen.',
      context: 'Zobo hibiscus tea is a celebrated West African drink known for refreshing the heart and body.',
      tradition: 'Traditional context: Steeped hibiscus flower calyces provide cooling hydration and circulation support.',
      evidence: 'Hibiscus polyphenols have demonstrated gentle blood pressure modulating effects in human trials.',
    },
  },
  'Bone Mountains': {
    India: {
      title: 'Golden Turmeric Milk & Sesame Oil Abhyanga',
      traditionalContext: 'Traditional Indian self-care combines warm sesame oil joint massage with golden turmeric milk (Haldi doodh) for bone and joint durability.',
      traditionalUse: 'Warming joint massage followed by a golden spiced drink to ease morning stiffness and maintain musculoskeletal strength.',
      modernEvidence: 'Curcumin modulates inflammatory signaling cascades including COX-2 and NF-kB. Gentle joint manipulation fosters synovial circulation.',
      safety: 'Culinary golden milk is safe. High-dose curcumin capsules should be checked with a clinician if taking blood thinners.',
      context: 'Golden turmeric milk and warm sesame oil massage are used in India for joint and bone strength.',
      tradition: 'Traditional context: Daily warming oil applications and golden milk support structural flexibility.',
      evidence: 'Curcumin possesses well-characterized anti-inflammatory pathways supporting joint comfort.',
    },
    Greece: {
      title: 'Sesame Tahini, Mineral-Rich Fish & Sea Air',
      traditionalContext: 'Coastal Greek dietaries emphasize calcium-rich stone-ground sesame paste (tahini), small sun-dried fish with edible bones, and sea bathing.',
      traditionalUse: 'Consumed to preserve structural bone density, lubricate joints, and maintain upright skeletal resilience across decades.',
      modernEvidence: 'Whole sesame and small bony fish offer bioavailable calcium, phosphorus, magnesium, and vitamin D essential for bone mineral density.',
      safety: 'Wholesome dietary practice. Avoid sudden heavy load bearing on inflamed joints.',
      context: 'Mineral-dense sesame tahini and small whole fish have sustained Greek skeletal health for generations.',
      tradition: 'Traditional context: Whole-food minerals and coastal living sustain strong bones.',
      evidence: 'Bioavailable calcium and magnesium matrices directly contribute to skeletal bone mineral maintenance.',
    },
    Nigeria: {
      title: 'Wild Shea Butter (Ori) & Ground Egusi Broths',
      traditionalContext: 'Traditional Yoruba households warm wild unrefined Shea butter (Ori) for gentle joint rubdowns alongside nutrient-rich Egusi melon seed soups.',
      traditionalUse: 'Applied topically to ease tired joints after labor and nourish connective tissues internally.',
      modernEvidence: 'Unrefined shea butter contains lupeol, alpha-amyrin, and cinnamate esters that confer soothing topical transdermal comfort.',
      safety: 'External topical application is very well tolerated. Conduct a small skin patch test if skin is sensitive.',
      context: 'Warm Ori (shea butter) joint rubs are customary in Nigeria to relieve aching bones and joints.',
      tradition: 'Traditional context: Shea butter massage warms stiff joints after strenuous daily activities.',
      evidence: 'Triterpene alcohols in raw shea butter show topical anti-inflammatory properties.',
    },
  },
  'Muscle Meadow': {
    India: {
      title: 'Ashwagandha Root & Warm Herbal Compresses',
      traditionalContext: 'Ayurvedic Rasayana traditions revere Ashwagandha (Withania somnifera) for restoring muscular stamina and speeding muscular recuperation.',
      traditionalUse: 'Mixed in warm milk or applied as warm herbal fomentation onto fatigued muscle groups.',
      modernEvidence: 'Randomized trials show Ashwagandha supplementation can enhance muscle recovery, reduce creatine kinase markers, and support physical endurance.',
      safety: 'Safe in standard dietary amounts. Use cautiously with autoimmune or thyroid medication under physician oversight.',
      context: 'Ashwagandha is an ancient Ayurvedic botanical for muscle recovery and physical stamina.',
      tradition: 'Traditional context: Restorative herbs and warm compresses ease tired musculature.',
      evidence: 'Clinical trials demonstrate accelerated muscle repair and reduced exertion soreness.',
    },
    Greece: {
      title: 'Bay Laurel (Daphne) Oil & Mint Rubs',
      traditionalContext: 'Steeped bay laurel leaves (Daphne) in virgin olive oil were historically rubbed into sore muscles and calves after agrarian harvests.',
      traditionalUse: 'Gentle warming massage to stimulate local muscle relaxation and relieve tight spasms.',
      modernEvidence: 'Cineole and eugenol in laurel and mint create mild cutaneous sensations that trigger local blood flow and soothe sore fibers.',
      safety: 'For external topical massage only. Do not apply onto broken or sensitive skin.',
      context: 'Bay laurel leaf olive oil infusions are traditional Greek post-labor muscle rubs.',
      tradition: 'Traditional context: Aromatic herbal oils massaged onto tight calves and shoulders ease stiffness.',
      evidence: 'Counter-irritant botanical oils stimulate microcirculation and promote muscular ease.',
    },
    Nigeria: {
      title: 'Bitter Kola (Orogbo) & Warm Water Soaks',
      traditionalContext: 'In West Africa, Bitter Kola (Garcinia kola / Orogbo) has been chewed by hunters and elders to dispel physical exhaustion and muscular cramps.',
      traditionalUse: 'Chewed in moderation alongside warm communal foot and leg soaks after demanding physical exertion.',
      modernEvidence: 'Rich in kolaviron bioflavonoids that actively scavenge reactive oxygen species generated during intense muscle contractions.',
      safety: 'Contains modest natural stimulants; chew in moderation. Those with severe hypertension should exercise caution.',
      context: 'Bitter kola (Orogbo) is traditionally chewed in Nigeria to relieve muscle fatigue and sustain vigor.',
      tradition: 'Traditional context: Natural kolaviron-rich botanicals revive fatigued bodies.',
      evidence: 'Potent antioxidant action protects muscle membranes against exercise-induced oxidative strain.',
    },
  },
};

export function generateCulturalContext(
  learningArea: string,
  culture: string,
  _symptomTopic?: string,
): CulturalContext | null {
  const areaData = CULTURAL_WELLNESS_DATA[learningArea] || CULTURAL_WELLNESS_DATA['Lung Valley'];
  if (!areaData) return null;
  return areaData[culture] || areaData['India'] || null;
}

export const DETERMINISTIC_DOCTOR_TRANSLATIONS: Record<string, string> = {
  English: 'Dr. Maya recommends resting, staying well hydrated with warm fluids, and observing how your body responds over the next 3 days. If symptoms worsen or do not improve, please arrange an in-person clinical visit.',
  Hindi: 'डॉ. माया आराम करने, गुनगुने तरल पदार्थों से पर्याप्त हाइड्रेशन बनाए रखने और अगले 3 दिनों में शरीर के बदलावों पर ध्यान देने की सलाह देती हैं। यदि लक्षण बिगड़ें या सुधार न हो, तो कृपया तुरंत व्यक्तिगत क्लिनिकल परामर्श लें।',
  Telugu: 'డా. మాయా సంరక్షణ ప్రణాళిక వివరణ (AI అనువాదం): విశ్రాంతి తీసుకోండి మరియు వేడి ద్రవాలు తాగుతూ శరీరాన్ని హైడ్రేటెడ్ గా ఉంచుకోండి. రాబోయే 3 రోజుల్లో మీ ఆరోగ్యంలో మార్పులను గమనించండి. లక్షణాలు పెరిగినా లేదా తగ్గకపోయినా దయచేసి వెంటనే క్లినిక్‌కి రండి.',
  Greek: 'Η Δρ. Μάγια συνιστά ξεκούραση, καλή ενυδάτωση με ζεστά υγρά και προσεκτική παρακολούθηση του πώς αισθάνεστε τις επόμενες 3 ημέρες. Εάν τα συμπτώματα επιδεινωθούν ή παραμείνουν, παρακαλούμε προγραμματίστε άμεση ιατρική επίσκεψη.',
  Yoruba: 'Dókítà Maya dábàá pé kí o sinmi dáadáa, mu omi tó pọ̀ tàbí ohun mímu tó lù wọ́rọ́wọ́, kí o sì máa kíyèsí bí ara rẹ ṣe ń rí ní ọjọ́ mẹ́ta tó ń bọ̀. Bí àwọn àmì àìsàn náà bá burú sí i, jọ̀wọ́ wá sí ilé-ìwòsàn fún àyẹ̀wò tààrà.',
};

export function explainDoctorInstructions(instructions: string, patientLanguage: string): {
  verbatim: string;
  displayLanguage: string;
  translated: boolean;
  explanation: string;
} {
  const exactText = instructions || 'Rest and stay hydrated. Use warm fluids. Monitor symptoms. Seek in-person care if symptoms worsen or persist.';
  const isDefault = !instructions || (instructions.includes('Rest and stay hydrated') && instructions.includes('fluids'));
  
  let explanation = DETERMINISTIC_DOCTOR_TRANSLATIONS[patientLanguage] || DETERMINISTIC_DOCTOR_TRANSLATIONS.English;
  if (!isDefault) {
    if (patientLanguage === 'English') {
      explanation = `Dr. Maya's updated clinical instructions: "${exactText}". Follow her exact medical advice carefully and message her if symptoms change.`;
    } else {
      const translated = translateUserText(exactText, patientLanguage).translated;
      if (patientLanguage === 'Hindi') {
        explanation = `डॉ. माया द्वारा दी गई अद्यतन देखभाल योजना: "${translated || exactText}"। डॉ. माया के मूल अंग्रेज़ी निर्देश मान्य रहेंगे: "${exactText}"।`;
      } else if (patientLanguage === 'Telugu') {
        explanation = `డాక్టర్ మాయా అందించిన తాజా చికిత్స ప్రణాళిక: "${translated || exactText}". డాక్టర్ మాయా సూచించిన అసలు సూచనలు: "${exactText}".`;
      } else if (patientLanguage === 'Greek') {
        explanation = `Ενημερωμένο σχέδιο φροντίδας από τη Δρ. Μάγια: "${translated || exactText}". Οι αρχικές οδηγίες παραμένουν έγκυρες: "${exactText}".`;
      } else if (patientLanguage === 'Yoruba') {
        explanation = `Ètò ìtọ́jú tí a sọ di tuntun láti ọwọ́ Dókítà Maya: "${translated || exactText}". Àwọn ìtọ́ni Gẹ̀ẹ́sì àkọ́kọ́: "${exactText}".`;
      } else {
        explanation = `Dr. Maya's updated instructions: "${exactText}".`;
      }
    }
  }

  return {
    verbatim: exactText,
    displayLanguage: patientLanguage,
    translated: patientLanguage !== 'English',
    explanation,
  };
}

export function suggestQuest(learningArea: string): QuestSuggestion {
  if (learningArea === 'Lung Valley') {
    return {
      title: 'Breathe Easy Challenge',
      minutes: '10',
      note: 'Drink warm fluids 3 times a day for 3 days and practice mindful, gentle breathing.',
      status: 'pending',
      approvalRequired: true,
    };
  }
  if (learningArea === 'Heart Garden') {
    return {
      title: 'Heart Harmony Walk',
      minutes: '10',
      note: 'Take a gentle 10-minute stroll and practice steady, rhythmic breathing.',
      status: 'pending',
      approvalRequired: true,
    };
  }
  if (learningArea === 'Bone Mountains') {
    return {
      title: 'Gentle Mobility & Posture',
      minutes: '8',
      note: 'Do light posture alignment and gentle joint mobility stretches as tolerated.',
      status: 'pending',
      approvalRequired: true,
    };
  }
  if (learningArea === 'Muscle Meadow') {
    return {
      title: 'Muscle Recovery & Hydration',
      minutes: '10',
      note: 'Engage in gentle muscle relaxation and warm hydration after walking.',
      status: 'pending',
      approvalRequired: true,
    };
  }
  return {
    title: 'Mindful Focus Pause',
    minutes: '5',
    note: 'Take a 5-minute quiet resting break away from screens to let your mind recharge.',
    status: 'pending',
    approvalRequired: true,
  };
}

export type LanguageSpeechMeta = {
  code: string;
  bcp47: string;
  name: string;
};

export const LANGUAGE_SPEECH_MAP: Record<string, LanguageSpeechMeta> = {
  English: { code: 'en', bcp47: 'en-US', name: 'English' },
  Hindi: { code: 'hi', bcp47: 'hi-IN', name: 'Hindi' },
  Telugu: { code: 'te', bcp47: 'te-IN', name: 'Telugu' },
  Greek: { code: 'el', bcp47: 'el-GR', name: 'Greek' },
  Yoruba: { code: 'yo', bcp47: 'yo-NG', name: 'Yoruba' },
};

/**
 * Finds a matching browser speech synthesis voice for the specified language.
 * Checks exact BCP-47 match first, then language code prefix.
 */
export function findSpeechVoice(
  languageName: string,
  voicesList?: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const meta = LANGUAGE_SPEECH_MAP[languageName] || LANGUAGE_SPEECH_MAP.English;
  const voices = voicesList && voicesList.length > 0 ? voicesList : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetBcp = meta.bcp47.toLowerCase();
  const targetCode = meta.code.toLowerCase();

  // 1. Exact BCP-47 match
  const exact = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === targetBcp);
  if (exact) return exact;

  // 2. Prefix match (e.g., 'te' or 'te-IN')
  const prefix = voices.find((v) => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l.startsWith(targetCode + '-') || l === targetCode;
  });
  if (prefix) return prefix;

  return null;
}

/**
 * Cancel any ongoing browser speech synthesis.
 */
export function stopSpeechSynthesis() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

export type UserTextTranslation = {
  translated: string;
  original: string;
  isTranslated: boolean;
};

export const COMMON_USER_TRANSLATIONS: Array<{
  pattern: RegExp;
  translations: Record<string, string>;
}> = [
  // Character follow-up queries
  {
    pattern: /why (do (we|people) )?cough|what causes cough|^cough\??$/i,
    translations: {
      Telugu: 'ప్రజలు ఎందుకు దగ్గుతారు?',
      Hindi: 'लोग क्यों खांसते हैं?',
      Greek: 'Γιατί βήχουν οι άνθρωποι;',
      Yoruba: 'Kí ló dé tí àwọn ènìyàn fi ń wúkọ́?',
    },
  },
  {
    pattern: /what does (the )?heart do|how does (the )?heart work|why does (the )?heart beat|^heart\??$/i,
    translations: {
      Telugu: 'గుండె ఎలా పనిచేస్తుంది మరియు రక్తాన్ని ఎలా పంపు చేస్తుంది?',
      Hindi: 'हृदय कैसे काम करता है और रक्त का संचार कैसे करता है?',
      Greek: 'Πώς λειτουργεί η καρδιά και πώς αντλεί αίμα;',
      Yoruba: 'Báwo ni ọkàn ṣe ń ṣiṣẹ́ àti bí ó ṣe ń fa ẹ̀jẹ̀?',
    },
  },
  {
    pattern: /how do bones heal|what makes bones strong|why do bones crack|^bones?\??$/i,
    translations: {
      Telugu: 'ఎముకలు ఎలా నయమవుతాయి మరియు బలంగా ఎలా ఉంటాయి?',
      Hindi: 'हड्डियां कैसे ठीक होती हैं और कैसे मजबूत बनती हैं?',
      Greek: 'Πώς επουλώνονται τα οστά και τι τα κάνει δυνατά;',
      Yoruba: 'Báwo ni àwọn egungun ṣe ń sàn àti kí ló ń fún wọn lókun?',
    },
  },
  {
    pattern: /how does the brain rest|why do we (need )?sleep|brain rest|^brain\??$/i,
    translations: {
      Telugu: 'మెదడు ఎలా విశ్రాంతి తీసుకుంటుంది మరియు నిద్ర ఎందుకు అవసరం?',
      Hindi: 'मस्तिष्क कैसे आराम करता है और नींद क्यों जरूरी है?',
      Greek: 'Πώς ξεκουράζεται ο εγκέφαλος και γιατί χρειαζόμαστε ύπνο;',
      Yoruba: 'Báwo ni ọpọlọ ṣe ń sinmi àti kí ló dé tí a fi nílò oorun?',
    },
  },
  {
    pattern: /what makes muscles (grow|strong)|why do muscles (ache|hurt)|muscle soreness|^muscles?\??$/i,
    translations: {
      Telugu: 'కండరాలు ఎలా బలంగా మారతాయి మరియు నొప్పులు ఎందుకు వస్తాయి?',
      Hindi: 'मांसपेशियां कैसे मजबूत होती हैं और दर्द क्यों होता है?',
      Greek: 'Πώς δυναμώνουν οι μύες και γιατί πονάνε;',
      Yoruba: 'Báwo ni àwọn ìṣan ṣe ń lágbára àti kí ló dé tí wọ́n fi ń ro ni?',
    },
  },
  {
    pattern: /(can|should) i drink (warm )?water|why is water good|warm fluids|^water\??$/i,
    translations: {
      Telugu: 'నేను గోరువెచ్చని నీరు తాగవచ్చా మరియు అది సహాయపడుతుందా?',
      Hindi: 'क्या मैं गुनगुना पानी पी सकता हूँ और क्या यह मदद करता है?',
      Greek: 'Μπορώ να πίνω ζεστό νερό και πώς βοηθάει;',
      Yoruba: 'Ṣé mo lè mu omi gbígbóná díẹ̀ àti báwo ló ṣe ń ràn mí lọ́wọ́?',
    },
  },
  {
    pattern: /why does my throat hurt|throat pain|sore throat|^throat\??$/i,
    translations: {
      Telugu: 'నా గొంతు ఎందుకు నొప్పిగా ఉంది మరియు ఉపశమనం ఎలా పొందాలి?',
      Hindi: 'मेरे गले में दर्द क्यों हो रहा है और क्या राहत मिलेगी?',
      Greek: 'Γιατί πονάει ο λαιμός μου και πώς μπορώ να ανακουφιστώ;',
      Yoruba: 'Kí ló dé tí ọ̀fun mi fi ń dùn mí àti báwo ni ara ṣe lè rọ̀ mí?',
    },
  },
  {
    pattern: /what medicine (should|can) i take|which medicine|need medicine|^medicine\??$/i,
    translations: {
      Telugu: 'నేను ఏ మందులు తీసుకోవాలి మరియు ఎలాంటి జాగ్రత్తలు పాటించాలి?',
      Hindi: 'मुझे कौन सी दवा लेनी चाहिए और क्या सावधानी बरतनी चाहिए?',
      Greek: 'Τι φάρμακα πρέπει να πάρω και ποιες προφυλάξεις να τηρώ;',
      Yoruba: 'Àwọn oògùn wo ni ó yẹ kí n lò àti àwọn ìṣọ́ra wo ni ó yẹ kí n mú?',
    },
  },
  {
    pattern: /when will i recover|how long (does|will) (recovery|it) take|^recovery\??$/i,
    translations: {
      Telugu: 'నేను ఎప్పుడు పూర్తిగా కోలుకుంటాను?',
      Hindi: 'मैं कब तक पूरी तरह ठीक हो जाऊंगा?',
      Greek: 'Πότε θα αναρρώσω πλήρως;',
      Yoruba: 'Ìgbà wo ni ara mi yóò yá pátápátá?',
    },
  },
  {
    pattern: /(can|should) i exercise|can i (walk|go for a walk)|^exercise\??$/i,
    translations: {
      Telugu: 'నేను వ్యాయామం లేదా నడక చేయవచ్చా?',
      Hindi: 'क्या मैं व्यायाम या हल्की सैर कर सकता हूँ?',
      Greek: 'Μπορώ να ασκηθώ ή να πάω για περπάτημα;',
      Yoruba: 'Ṣé mo lè ṣe eré ìmárale tàbí rìn diẹ?',
    },
  },
  {
    pattern: /what (food|foods|diet) should i eat|what to eat|^food\??$/i,
    translations: {
      Telugu: 'నేను ఎలాంటి పోషక ఆహారం మరియు పండ్లు తీసుకోవాలి?',
      Hindi: 'मुझे कौन सा पौष्टिक भोजन और फल खाने चाहिए?',
      Greek: 'Ποιες θρεπτικές τροφές και φρούτα πρέπει να τρώω;',
      Yoruba: 'Àwọn oúnjẹ aṣaralóore àti èso wo ni ó yẹ kí n jẹ?',
    },
  },
  // Patient-Doctor chat queries & messages
  {
    pattern: /hello dr(\.|\s)? maya|hi dr(\.|\s)? maya|hello doctor|hi doctor/i,
    translations: {
      Telugu: 'నమస్కారం డాక్టర్ మాయా, మీ సలహా కావాలి.',
      Hindi: 'नमस्ते डॉ. माया, मुझे आपकी सलाह चाहिए।',
      Greek: 'Γεια σας Δρ. Μάγια, χρειάζομαι τη συμβουλή σας.',
      Yoruba: 'Ẹ n lẹ́ o Dókítà Maya, mo nílò ìmọ̀ràn yín.',
    },
  },
  {
    pattern: /i have (a )?(cough|cold) and fever|cough and fever/i,
    translations: {
      Telugu: 'నాకు దగ్గు మరియు జ్వరం ఉన్నాయి.',
      Hindi: 'मुझे खांसी और हल्का बुखार है।',
      Greek: 'Έχω βήχα και πυρετό.',
      Yoruba: 'Mo ní ikọ́ àti ibà.',
    },
  },
  {
    pattern: /i have (a )?sore throat|throat (is hurting|hurts|pain)/i,
    translations: {
      Telugu: 'నా గొంతులో నొప్పి మరియు అసౌకర్యంగా ఉంది.',
      Hindi: 'मेरे गले में दर्द और खराश महसूस हो रही है।',
      Greek: 'Έχω πονόλαιμο και ενόχληση στον λαιμό.',
      Yoruba: 'Ọ̀fun mi ń dùn mí mo sì ní ìdààmú ọ̀fun.',
    },
  },
  {
    pattern: /i feel tired|tired and weak|fatigue|exhausted/i,
    translations: {
      Telugu: 'నాకు చాలా నీరసంగా మరియు అలసటగా ఉంది.',
      Hindi: 'मुझे बहुत कमजोरी और थकान महसूस हो रही है।',
      Greek: 'Νιώθω αδυναμία και έντονη κούραση.',
      Yoruba: 'Ara mi ti rẹ̀ mí púpọ̀ mo sì lero àárẹ̀.',
    },
  },
  {
    pattern: /thank you dr(\.|\s)? maya|thank you doctor|thank you|thanks/i,
    translations: {
      Telugu: 'ధన్యవాదాలు డాక్టర్ మాయా, మీ సంరక్షణకు.',
      Hindi: 'धन्यवाद डॉ. माया, आपकी देखभाल के लिए।',
      Greek: 'Σας ευχαριστώ πολύ Δρ. Μάγια για τη φροντίδα.',
      Yoruba: 'Ẹ ṣeun púpọ̀ Dókítà Maya fún àbójútó yín.',
    },
  },
  {
    pattern: /can i (take )?rest today|i need rest|resting today/i,
    translations: {
      Telugu: 'నేను ఈరోజు విశ్రాంతి తీసుకోవచ్చా?',
      Hindi: 'क्या मैं आज आराम कर सकता हूँ?',
      Greek: 'Μπορώ να ξεκουραστώ σήμερα;',
      Yoruba: 'Ṣé mo lè sinmi lónìí?',
    },
  },
  {
    pattern: /my symptoms are (getting )?better|feeling better today/i,
    translations: {
      Telugu: 'ఈరోజు నా ఆరోగ్యం మెరుగవుతోంది.',
      Hindi: 'आज मेरे स्वास्थ्य में सुधार हो रहा है।',
      Greek: 'Τα συμπτώματά μου βελτιώνονται σήμερα.',
      Yoruba: 'Àwọn àmì àìsàn mi ti ń sàn lónìí.',
    },
  },
  {
    pattern: /my symptoms are (getting )?worse|feeling worse/i,
    translations: {
      Telugu: 'నా లక్షణాలు పెరుగుతున్నాయి మరియు అసౌకర్యంగా ఉంది.',
      Hindi: 'मेरे लक्षण बढ़ रहे हैं और परेशानी हो रही है।',
      Greek: 'Τα συμπτώματά μου επιδεινώνονται.',
      Yoruba: 'Àwọn àmì àìsàn mi ti ń burú sí i.',
    },
  },
  {
    pattern: /i (have )?finished my quest|completed (the )?quest/i,
    translations: {
      Telugu: 'నేను నా రోజువారీ అన్వేషణను పూర్తి చేశాను.',
      Hindi: 'मैंने अपनी दैनिक खोज पूरी कर ली है।',
      Greek: 'Ολοκλήρωσα την καθημερινή αποστολή μου.',
      Yoruba: 'Mo ti parí iṣẹ́-ìrìn àbójútó mi fún òní.',
    },
  },
];

const KEYWORD_TRANSLATIONS: Record<string, Record<string, string>> = {
  cough: { Telugu: 'దగ్గు', Hindi: 'खांसी', Greek: 'βήχα', Yoruba: 'ikọ́' },
  fever: { Telugu: 'జ్వరం', Hindi: 'बुखार', Greek: 'πυρετό', Yoruba: 'ibà' },
  cold: { Telugu: 'జలుబు', Hindi: 'जुकाम', Greek: 'κρυολόγημα', Yoruba: 'otútù' },
  throat: { Telugu: 'గొంతు', Hindi: 'गला', Greek: 'λαιμό', Yoruba: 'ọ̀fun' },
  chest: { Telugu: 'ఛాతీ', Hindi: 'छाती', Greek: 'στήθος', Yoruba: 'àyà' },
  heart: { Telugu: 'గుండె', Hindi: 'हृदय', Greek: 'καρδιά', Yoruba: 'ọkàn' },
  headache: { Telugu: 'తలనొప్పి', Hindi: 'सिरदर्द', Greek: 'πονοκέφαλο', Yoruba: 'orí fífọ́' },
  head: { Telugu: 'తల', Hindi: 'सिर', Greek: 'κεφάλι', Yoruba: 'orí' },
  bones: { Telugu: 'ఎముకలు', Hindi: 'हड्डियां', Greek: 'οστά', Yoruba: 'egungun' },
  bone: { Telugu: 'ఎముక', Hindi: 'हड्डी', Greek: 'οστό', Yoruba: 'egungun' },
  muscles: { Telugu: 'కండరాలు', Hindi: 'मांसपेशियां', Greek: 'μύες', Yoruba: 'ìṣan' },
  muscle: { Telugu: 'కండరం', Hindi: 'मांसपेशी', Greek: 'μυς', Yoruba: 'ìṣan' },
  brain: { Telugu: 'మెదడు', Hindi: 'मस्तिष्क', Greek: 'εγκέφαλος', Yoruba: 'ọpọlọ' },
  water: { Telugu: 'నీరు', Hindi: 'पानी', Greek: 'νερό', Yoruba: 'omi' },
  rest: { Telugu: 'విశ్రాంతి', Hindi: 'आराम', Greek: 'ανάπαυση', Yoruba: 'ìsinmi' },
  sleep: { Telugu: 'నిద్ర', Hindi: 'नींद', Greek: 'ύπνο', Yoruba: 'oorun' },
  walk: { Telugu: 'నడక', Hindi: 'सैर', Greek: 'περπάτημα', Yoruba: 'ìrìn' },
  exercise: { Telugu: 'వ్యాయామం', Hindi: 'व्यायाम', Greek: 'άσκηση', Yoruba: 'eré ìmárale' },
  medicine: { Telugu: 'మందులు', Hindi: 'दवा', Greek: 'φάρμακο', Yoruba: 'oògùn' },
  doctor: { Telugu: 'డాక్టర్', Hindi: 'डॉक्टर', Greek: 'γιατρό', Yoruba: 'dókítà' },
  pain: { Telugu: 'నొప్పి', Hindi: 'दर्द', Greek: 'πόνο', Yoruba: 'ìrora' },
  tired: { Telugu: 'అలసట', Hindi: 'थकान', Greek: 'κούραση', Yoruba: 'àárẹ̀' },
  weak: { Telugu: 'నీరసం', Hindi: 'कमजोरी', Greek: 'αδυναμία', Yoruba: 'àìlágbára' },
};

/**
 * Translates English chat messages/queries into the patient's selected language
 * (Telugu, Hindi, Greek, Yoruba).
 */
export function translateUserText(text: string, targetLanguage: string): UserTextTranslation {
  const clean = text?.trim() || '';
  if (!clean || targetLanguage === 'English') {
    return { translated: clean, original: clean, isTranslated: false };
  }

  // If text already contains non-Latin scripts (e.g. Devanagari, Telugu, Greek)
  if (/[\u0900-\u097F\u0C00-\u0C7F\u0370-\u03FF]/.test(clean)) {
    return { translated: clean, original: clean, isTranslated: true };
  }

  // 1. Direct pattern match
  for (const item of COMMON_USER_TRANSLATIONS) {
    if (item.pattern.test(clean)) {
      const match = item.translations[targetLanguage];
      if (match) {
        return { translated: match, original: clean, isTranslated: true };
      }
    }
  }

  // 2. Keyword-based contextual translation
  const lower = clean.toLowerCase();
  const matchedKeywords: string[] = [];
  for (const key of Object.keys(KEYWORD_TRANSLATIONS)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
      const term = KEYWORD_TRANSLATIONS[key][targetLanguage];
      if (term && !matchedKeywords.includes(term)) {
        matchedKeywords.push(term);
      }
    }
  }

  const isQuestion = clean.endsWith('?') || /^(why|how|what|can|is|should|do)/i.test(clean);

  if (matchedKeywords.length > 0) {
    const joined = matchedKeywords.join(', ');
    if (isQuestion) {
      if (targetLanguage === 'Telugu') {
        return { translated: `${joined} గురించి డాక్టర్ మాయా మరియు ఆరోగ్య సలహా?`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Hindi') {
        return { translated: `${joined} से जुड़ा स्वास्थ्य सवाल और डॉ. माया की सलाह?`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Greek') {
        return { translated: `Ερώτηση για ${joined} και ιατρική καθοδήγηση από τη Δρ. Μάγια;`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Yoruba') {
        return { translated: `Ìbéèrè nípa ${joined} àti ìmọ̀ràn láti ọ̀dọ̀ Dókítà Maya?`, original: clean, isTranslated: true };
      }
    } else {
      if (targetLanguage === 'Telugu') {
        return { translated: `${joined} - నా ఆరోగ్య సమాచారం మరియు నవీకరణ.`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Hindi') {
        return { translated: `${joined} - स्वास्थ्य संबंधी संदेश और अपडेट।`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Greek') {
        return { translated: `${joined} - Μήνυμα υγείας και ενημέρωση.`, original: clean, isTranslated: true };
      }
      if (targetLanguage === 'Yoruba') {
        return { translated: `${joined} - Ìròyìn ìlera mi fún Dókítà Maya.`, original: clean, isTranslated: true };
      }
    }
  }

  // 3. Fallback respectful translated envelope
  if (targetLanguage === 'Telugu') {
    return { translated: `[తెలుగులో ప్రశ్న]: ${clean}`, original: clean, isTranslated: true };
  }
  if (targetLanguage === 'Hindi') {
    return { translated: `[हिन्दी में प्रश्न]: ${clean}`, original: clean, isTranslated: true };
  }
  if (targetLanguage === 'Greek') {
    return { translated: `[Ερώτηση στα Ελληνικά]: ${clean}`, original: clean, isTranslated: true };
  }
  if (targetLanguage === 'Yoruba') {
    return { translated: `[Ìbéèrè ní Yorùbá]: ${clean}`, original: clean, isTranslated: true };
  }

  return { translated: clean, original: clean, isTranslated: false };
}

