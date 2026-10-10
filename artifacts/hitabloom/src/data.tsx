export type Status = 'none' | 'pending' | 'active' | 'rejected' | 'completed';
export type AvatarStyle = {
  skin: string; hair: string; hairColor: string; face: string;
  outfit: string; glasses: boolean; accessory: string; expression: string;
};
export type DemoState = {
  id:string; name:string; email:string; assignedDoctor:string; onboardingComplete:boolean;
  language: string; avatar: string; symptom: string; analyzed: boolean; learningArea:string; followup: string;
  characterChats?: Record<string, string>;
  questStatus: Status; questTitle: string; questMinutes: string; questNote: string;
  carePlan: string; followUp: string; avatarStyle: AvatarStyle; xp: number; streak: number; recoveryTokens: number;
  brain:number; heart:number; lung:number; bone:number; muscle:number; cultural:number;
  lungUnlocked:boolean; boneUnlocked?: boolean; muscleUnlocked?: boolean;
  questsCompleted:number; badges:string[]; notification:string;
  justBloomedArea?: string; justUnlockedArea?: string;
};

export function advancePatientGarden(patient: DemoState): Partial<DemoState> {
  const targetArea = patient.learningArea || (patient.heart < 100 ? 'Heart Garden' : patient.lung < 100 ? 'Lung Valley' : 'Brain Garden');
  let patch: Partial<DemoState> = {
    xp: patient.xp + 50,
    streak: patient.streak + 1,
    questsCompleted: patient.questsCompleted + 1,
    questStatus: 'completed',
    notification: `🌸 Well done, ${patient.name}! Your garden grew with you today (+50 XP, +1 Streak Day).`,
    badges: patient.badges.includes('Care Explorer') ? patient.badges : [...patient.badges, 'Care Explorer'],
  };

  if (targetArea === 'Heart Garden' || (!patient.learningArea && patient.heart < 100)) {
    patch.heart = 100;
    patch.lungUnlocked = true;
    patch.lung = Math.max(patient.lung || 0, 18);
    patch.justBloomedArea = 'Heart Garden';
    patch.justUnlockedArea = 'Lung Valley';
  } else if (targetArea === 'Lung Valley') {
    const nextVal = (patient.lung || 0) < 50 ? 50 : 100;
    patch.lung = nextVal;
    patch.lungUnlocked = true;
    if (nextVal >= 100) {
      patch.boneUnlocked = true;
      patch.bone = Math.max(patient.bone || 0, 20);
      patch.justBloomedArea = 'Lung Valley';
      patch.justUnlockedArea = 'Bone Mountains';
    } else {
      patch.justBloomedArea = 'Lung Valley';
    }
  } else if (targetArea === 'Brain Garden') {
    patch.brain = 100;
    patch.heart = Math.max(patient.heart || 0, 18);
    patch.justBloomedArea = 'Brain Garden';
    patch.justUnlockedArea = 'Heart Garden';
  } else if (targetArea === 'Bone Mountains') {
    const nextVal = (patient.bone || 0) < 50 ? 50 : 100;
    patch.bone = nextVal;
    patch.boneUnlocked = true;
    if (nextVal >= 100) {
      patch.muscleUnlocked = true;
      patch.muscle = Math.max(patient.muscle || 0, 20);
      patch.justBloomedArea = 'Bone Mountains';
      patch.justUnlockedArea = 'Muscle Meadow';
    } else {
      patch.justBloomedArea = 'Bone Mountains';
    }
  } else if (targetArea === 'Muscle Meadow') {
    patch.muscle = Math.min(100, (patient.muscle || 0) + 50);
    patch.muscleUnlocked = true;
    patch.justBloomedArea = 'Muscle Meadow';
  } else if (targetArea === 'Cultural Garden') {
    patch.cultural = Math.min(100, (patient.cultural || 36) + 30);
    patch.justBloomedArea = 'Cultural Garden';
  }

  return patch;
}
export const languages=['English','Hindi','Telugu','Greek','Yoruba'];
export function mapSymptomToArea(text: string) {
  const t = text.toLowerCase();
  if (/fracture|broken|break|bone|joint|knee|back|spine|wrist|ankle|hip|elbow|shoulder|rib|skeleton|sprain|ortho|calcium|osteopor|crack|ligament|cartilage/.test(t)) return 'Bone Mountains';
  if (/muscle|strain|soreness|sore after walking|cramp|spasm|pull|pulled|hamstring|calf|bicep|tricep|quad|tendon|body ache/.test(t)) return 'Muscle Meadow';
  if (/cough|throat|breath|breathing|lung|airway|respir|wheeze|asthma|bronch|phlegm|congestion/.test(t)) return 'Lung Valley';
  if (/heart|chest|pulse|heartbeat|palpitation|cardio|blood pressure|circulation/.test(t)) return 'Heart Garden';
  if (/head|headache|migraine|memory|focus|brain|think|thought|sleep|insomnia|dizzy|dizziness|confusion|stress|mental|neurolog/.test(t)) return 'Brain Garden';
  return 'Brain Garden';
}
export const careExplanations:Record<string,string>={
  English:'Dr. Maya recommends giving your body time to rest, keeping up with fluids, and noticing how you feel over time. If things get worse or are not improving, check in with her.',
  Hindi:'डॉ. माया आराम करने, पर्याप्त तरल पदार्थ लेने और समय के साथ अपने स्वास्थ्य पर ध्यान देने की सलाह देती हैं। लक्षण बिगड़ें या सुधार न हो, तो उनसे संपर्क करें।',
  Telugu:'డా. మాయా విశ్రాంతి తీసుకోవాలని, ద్రవాలు తాగాలని, మీ ఆరోగ్యంలో మార్పులను గమనించాలని సూచిస్తున్నారు. లక్షణాలు పెరిగినా లేదా తగ్గకపోయినా ఆమెను సంప్రదించండి.',
  Greek:'Η Δρ. Μάγια προτείνει ξεκούραση, επαρκή υγρά και παρακολούθηση του πώς αισθάνεστε. Αν τα συμπτώματα χειροτερέψουν ή δεν βελτιωθούν, επικοινωνήστε μαζί της.',
  Yoruba:'Dókítà Maya dábàá pé kí o sinmi, mu omi tó, kí o sì máa kíyèsí bí ara rẹ ṣe rí. Bí àwọn àmì bá burú sí i tàbí tí wọn kò bá yá, bá a sọ̀rọ̀.'
};
export type CharacterGuide={name:string;videoUrl?:string;line:string;subtitle:string;translations:Record<string,string>};
export const characterGuides:Record<string,CharacterGuide> = {
  "Lung Valley": {
    "name": "Luma",
    "line": "Your lungs help bring air into your body. A cough can happen for many reasons, so only your doctor can help understand what’s behind yours.",
    "subtitle": "Your lungs help you breathe; a cough can have many causes.",
    "translations": {
      "English": "Your lungs help bring air into your body. A cough can happen for many reasons, so only your doctor can help understand what’s behind yours.",
      "Hindi": "नमस्ते! मैं हूँ लूमा, आपके फेफड़ों की सबसे अच्छी दोस्त! क्या खाँसी आ रही है? वो तो फेफड़ों का अपना वैक्यूम क्लीनर है जो कचरा बाहर निकालता है! लेकिन अगर खाँसी रुकने का नाम न ले, तो गूगल करने के बजाय सीधे डॉ. माया से पूछिए!",
      "Telugu": "హలో! నేను లూమాని, మీ ఊపిరితిత్తుల బెస్ట్ ఫ్రెండ్‌ని! దగ్గు వస్తుందా? లోపలి ధూళిని బయటకు నెట్టేసే నా సూపర్-పవర్ అది! కానీ అదే పనిగా దగ్గుతుంటే.. గూగుల్ సెర్చ్ చేయకుండా డాక్టర్ మాయాను కలవండి!",
      "Greek": "Γεια σας! Είμαι η Λούμα, η καλύτερη φίλη των πνευμόνων σας! Βήχετε; Αυτή είναι η φυσική μας ηλεκτρική σκούπα που καθαρίζει τη σκόνη! Αλλά αν ο βήχας επιμένει, αφήστε τις μαντεψιές και ρωτήστε κατευθείαν τη Δρ. Μάγια!",
      "Yoruba": "Ẹ ńlẹ́ o! Èmi ni Luma, ọ̀rẹ́ kòríkòsùn àwọn ẹ̀dọ̀fóró rẹ! Ṣé ikọ́ ń gbé e dé? Ọ̀nà tí ara fi ń lé eruku jáde nìyẹn! Ṣùgbọ́n tí ikọ́ náà kò bá dánudúró, má fọwọ́ rọ́rọ́ pẹ̀lú àròsọ, bá Dókítà Maya sọ̀rọ̀ tààrà!"
    }
  },
  "Brain Garden": {
    "name": "Bri",
    "line": "Hello explorer! I'm Bri, your Brain Garden guide! Thoughts buzzing like fireflies? That's just my brilliant neurons at work! But if stress or confusion won't quit, skip late-night searching and ask Dr. Maya!",
    "subtitle": "Your brain helps you think and remember; consult Dr. Maya for personal concerns.",
    "translations": {
      "English": "Hello explorer! I'm Bri, your Brain Garden guide! Thoughts buzzing like fireflies? That's just my brilliant neurons at work! But if stress or confusion won't quit, skip late-night searching and ask Dr. Maya!",
      "Hindi": "नमस्ते खोजी! मैं हूँ ब्री, आपके ब्रेन गार्डन का गाइड! दिमाग में विचार जुगनुओं की तरह चमक रहे हैं? ये तो मेरे नन्हें न्यूरॉन्स का कमाल है! लेकिन अगर तनाव परेशान करे, तो इंटरनेट पर भटकने के बजाय सीधे डॉ. माया से पूछिए!",
      "Telugu": "హలో ఎక్స్‌ప్లోరర్! నేను బ్రీ, మీ బ్రెయిన్ గార్డెన్ గైడ్‌ని! ఆలోచనలు మెరుపుల్లా మెరుస్తున్నాయా? అది నా బుల్లి న్యూరాన్ల చమత్కారం! కానీ ఒత్తిడి లేదా అయోమయం వేధిస్తుంటే, అర్థరాత్రి గూగుల్ చేయకుండా నేరుగా డాక్టర్ మాయాను అడగండి!",
      "Greek": "Γεια σου εξερευνητή! Είμαι ο Μπρι, ο οδηγός του Κήπου του Εγκεφάλου σου! Σκέψεις που πετούν σαν πυγολαμπίδες; Είναι οι πανέξυπνοι νευρώνες μου! Αν όμως το άγχος επιμένει, άσε το ψάξιμο στο διαδίκτυο και ρώτα κατευθείαν τη Δρ. Μάγια!",
      "Yoruba": "Ẹ ńlẹ́ o, olùṣàwárí! Èmi ni Bri, olùtọ́sọ́nà Ọgbọ́n Orí rẹ! Ṣé àwọn èrò ń tàn bí iná nínú ọpọlọ rẹ? Iṣẹ́ àwọn nọ́ọ̀vù mi ni! Ṣùgbọ́n tí àníyàn bá kọjá ààlà, dẹ́kun wíwá orí ayélujára, bá Dókítà Maya sọ̀rọ̀ tààrà!"
    }
  },
  "Heart Garden": {
    "name": "Cora",
    "line": "Thump-thump! I'm Cora, your Heart Guardian! Pumping 24/7 without a single vacation day—now that's love! If your ticker feels fluttery or tired, don't play detective online—check in with Dr. Maya!",
    "subtitle": "Your heart moves blood and oxygen; check with Dr. Maya for any heart concerns.",
    "translations": {
      "English": "Thump-thump! I'm Cora, your Heart Guardian! Pumping 24/7 without a single vacation day—now that's love! If your ticker feels fluttery or tired, don't play detective online—check in with Dr. Maya!",
      "Hindi": "धक-धक! मैं हूँ कोरा, आपके दिल की रखवाली! बिना छुट्टी के चौबीसों घंटे धड़कना—इसे कहते हैं असली प्यार! लेकिन अगर दिल की धड़कन घबराए या थकावट लगे, तो ऑनलाइन जासूस बनने के बजाय सीधे डॉ. माया से मिलिए!",
      "Telugu": "ధక్-ధక్! నేను కోరా, మీ గుండె గార్డియన్‌ని! ఒక్క రోజు సెలవు లేకుండా నిరంతరం రక్తం పంప్ చేస్తుంటా—అదీ నా నిబద్ధత! గుండె దడగా అనిపించినా లేదా అలసటగా ఉన్నా, ఆన్‌లైన్ డిటెక్టివ్‌లా మారకుండా డాక్టర్ మాయాను సంప్రదించండి!",
      "Greek": "Ντακ-ντακ! Είμαι η Κόρα, ο φύλακας της καρδιάς σου! Χτυπάω όλο το 24ωρο χωρίς ρεπό—αυτό θα πει αφοσίωση! Αν νιώθεις την καρδιά σου να τρέχει ή να κουράζεται, μην κάνεις τον ντετέκτιβ στο ίντερνετ—μιλήστε με τη Δρ. Μάγια!",
      "Yoruba": "Lùkù-lùkù! Èmi ni Cora, olùṣọ́ ọkàn rẹ! Mo ń lù láìsinmi ní gbogbo ọjọ́—ìyẹn ni ìfẹ́ tòótọ́! Tí ọkàn rẹ bá ń lù kíákíá tàbí tí àárẹ̀ bá mú ọ, má ṣe wá ìdáhùn lórí ayélujára, bá Dókítà Maya sọ̀rọ̀!"
    }
  },
  "Bone Mountains": {
    "name": "Bony",
    "line": "Stand tall! I'm Bony, your skeleton's chief architect! Keeping you upright and strong since day one! Got joint clicks or aches? Don't ignore the creaks—ask Dr. Maya for the real tune-up!",
    "subtitle": "Bones provide structure and protection; ask Dr. Maya about bone or joint discomfort.",
    "translations": {
      "English": "Stand tall! I'm Bony, your skeleton's chief architect! Keeping you upright and strong since day one! Got joint clicks or aches? Don't ignore the creaks—ask Dr. Maya for the real tune-up!",
      "Hindi": "सीधे खड़े हो जाइए! मैं हूँ बोनी, आपकी हड्डियों का चीफ आर्किटेक्ट! पहले ही दिन से आपको सीधा और मज़बूत रखना मेरा काम है! जोड़ों में खट-खट या दर्द हो रहा है? तो इसे अनदेखा मत कीजिए, असली सलाह के लिए डॉ. माया से मिलिए!",
      "Telugu": "నిటారుగా నిలబడండి! నేను బోనీ, మీ ఎముకల చీఫ్ ఆర్కిటెక్ట్‌ని! మొదటి రోజు నుంచే మిమ్మల్ని నిటారుగా, దృఢంగా ఉంచడమే నా డ్యూటీ! కీళ్ల నొప్పులు లేదా చప్పుడు వస్తున్నాయా? లైట్ తీసుకోకుండా డాక్టర్ మాయా దగ్గర చెకప్ చేయించుకోండి!",
      "Greek": "Στάσου όρθιος! Είμαι ο Μπόνι, ο επικεφαλής αρχιτέκτονας των οστών σου! Σε κρατάω δυνατό και όρθιο από την πρώτη μέρα! Πονάνε οι αρθρώσεις σου; Μην αγνοείς τα τριξίματα—ρώτα τη Δρ. Μάγια για τη σωστή φροντίδα!",
      "Yoruba": "Dúró ṣinṣin! Èmi ni Bony, ọ̀gá àwọn egungun rẹ! Mo ń mú kí o dúró lágbára láti ọjọ́ kìíní! Ṣé oríkèé rẹ ń dun ọ? Má ṣe fojú fo ìrora náà dá, bá Dókítà Maya sọ̀rọ̀ fún àbójútó tòótọ́!"
    }
  },
  "Muscle Meadow": {
    "name": "Milo",
    "line": "Flex time! I'm Milo, the muscle power-sprout! Fueling every jump, sprint, and high-five! Feeling sore or stiff? Put down the heavy weights and let Dr. Maya check your recovery!",
    "subtitle": "Muscles support posture and motion; check with Dr. Maya for soreness or fatigue.",
    "translations": {
      "English": "Flex time! I'm Milo, the muscle power-sprout! Fueling every jump, sprint, and high-five! Feeling sore or stiff? Put down the heavy weights and let Dr. Maya check your recovery!",
      "Hindi": "बॉडी बनाने का वक़्त! मैं हूँ माइलो, आपकी मांसपेशियों की ताक़त! हर छलांग, दौड़ और हाई-फाइव मेरी ही देन है! अगर बदन दर्द या जकड़न हो, तो भारी वज़न छोड़कर डॉ. माया से रिकवरी की सलाह लीजिए!",
      "Telugu": "మజిల్ పవర్ టైమ్! నేను మైలో, మీ కండరాల స్ప్రౌట్‌ని! మీ పరుగులు, గంతులు, హై-ఫైవ్‌లకు నేనే సూపర్ పవర్! కండరాలు పట్టేసినా లేదా నొప్పులున్నా, మొండిగా కసరత్తులు చేయకుండా డాక్టర్ మాయాను సంప్రదించండి!",
      "Greek": "Ώρα για ενέργεια! Είμαι ο Μάιλο, η δύναμη των μυών σου! Δίνω ώθηση σε κάθε σου άλμα και τρέξιμο! Νιώθεις πιάσιμο ή κούραση; Άσε τα βάρη και συμβουλεύσου τη Δρ. Μάγια για ασφαλή αποθεραπεία!",
      "Yoruba": "Àkókò agbára! Èmi ni Milo, agbára àwọn ìṣan ara rẹ! Èmi ló ń fún ọ ní okun láti fo àti láti sáré! Tí ara bá ń ro ọ́ tàbí tí ó le, dánu kọ́ dídáwọ́lé tí ó le, kí o sì bá Dókítà Maya sọ̀rọ̀!"
    }
  }
};

export const characterChatReply:Record<string,string>={English:'People cough for many reasons. Coughing is a protective reflex that can help clear the airways. Dr. Maya can help with your own symptoms.',Hindi:'खांसी कई कारणों से हो सकती है। यह एक प्राकृतिक प्रतिक्रिया है जो सांस की नलियों को साफ करने में मदद कर सकती है। आपके लक्षणों के लिए डॉ. माया से पूछें।',Telugu:'వివిధ కారణాల వల్ల దగ్గు రావచ్చు. ఇది శ్వాసనాళాలను శుభ్రం చేయడంలో సహాయపడే సహజ ప్రతిచర్య. మీ లక్షణాల గురించి డా. మాయాను అడగండి.',Greek:'Ο βήχας μπορεί να έχει πολλές αιτίες. Είναι ένα αντανακλαστικό που μπορεί να βοηθήσει στον καθαρισμό των αεραγωγών. Ρωτήστε τη Δρ. Μάγια για τα δικά σας συμπτώματα.',Yoruba:'Ọ̀pọ̀ nǹkan ló lè fa ikọ́. Ikọ́ jẹ́ ìdáhùn àdáyébá tó lè ran ọ̀nà ẹ̀mí lọ́wọ́ láti mọ́. Bá Dókítà Maya sọ̀rọ̀ nípa àmì àìsàn tìrẹ.'};
export const characterChatSubtitle='People cough for many reasons. It can help clear the airways. Ask Dr. Maya about your symptoms.';
export const genericCharacterChatReply:Record<string,string>={English:'Body systems have many connected roles. What someone notices can have different explanations, so Dr. Maya is the right person to discuss your own symptoms.',Hindi:'शरीर के अंग आपस में मिलकर काम करते हैं। लक्षणों के कई कारण हो सकते हैं, इसलिए अपने लक्षणों के बारे में डॉ. माया से बात करें।',Telugu:'శరీరంలోని వ్యవస్థలు అనుసంధానమై పనిచేస్తాయి. లక్షణాలకు వేర్వేరు కారణాలు ఉండవచ్చు; మీ లక్షణాల గురించి డా. మాయాతో మాట్లాడండి.',Greek:'Τα συστήματα του σώματος συνεργάζονται και τα συμπτώματα μπορεί να έχουν διαφορετικές εξηγήσεις. Μιλήστε με τη Δρ. Μάγια για τα δικά σας.',Yoruba:'Àwọn ètò ara ń ṣiṣẹ́ papọ̀, àwọn àmì àìsàn sì lè ní onírúurú ìdí. Bá Dókítà Maya sọ̀rọ̀ nípa tìrẹ.'};
export const genericCharacterChatSubtitle='Body systems work together. Personal symptoms can have different explanations; ask your clinician.';
export const culturalGuideDialogues: Record<string, { line: string; subtitle: string }> = {
  English: {
    line: "Welcome, curious explorer! Around the world, families have their own wellness traditions. Let's discover the stories behind them—because culture makes every journey more interesting!",
    subtitle: 'Around the world, families have their own wellness traditions. Culture enriches every journey.',
  },
  Hindi: {
    line: 'नमस्ते, जिज्ञासु खोजी! दुनिया भर में परिवारों की अपनी सेहत से जुड़ी परंपराएँ हैं। आइए, इन परंपराओं की कहानियाँ जानें—क्योंकि संस्कृति हर सफ़र को खास बनाती है!',
    subtitle: 'दुनिया भर के परिवारों की अपनी सेहत से जुड़ी परंपराएँ हैं; संस्कृति हर सफ़र को खास बनाती है।',
  },
  Telugu: {
    line: 'నమస్కారం, ఆసక్తిగల అన్వేషకులారా! ప్రపంచవ్యాప్తంగా ప్రతి కుటుంబానికి ఆరోగ్యానికి సంబంధించిన ప్రత్యేక సంప్రదాయాలు ఉన్నాయి. ఆ సంప్రదాయాల కథలను తెలుసుకుందాం—మన సంస్కృతి ప్రతి ప్రయాణాన్ని ప్రత్యేకంగా మారుస్తుంది!',
    subtitle: 'ప్రపంచవ్యాప్తంగా కుటుంబాలకు ఆరోగ్య సంప్రదాయాలు ఉన్నాయి; సంస్కృతి ప్రయాణాన్ని ప్రత్యేకంగా మారుస్తుంది.',
  },
  Greek: {
    line: 'Καλώς ήρθες, περίεργε εξερευνητή! Σε όλο τον κόσμο, οι οικογένειες έχουν τις δικές τους παραδόσεις ευεξίας. Ας ανακαλύψουμε τις ιστορίες τους, γιατί ο πολιτισμός κάνει κάθε ταξίδι ξεχωριστό!',
    subtitle: 'Σε όλο τον κόσμο, οι οικογένειες έχουν παραδόσεις ευεξίας· ο πολιτισμός κάνει κάθε ταξίδι ξεχωριστό.',
  },
  Yoruba: {
    line: 'Ẹ káàbọ̀, olùṣàwárí onítara! Ní gbogbo àgbáyé, àwọn ìdílé ní àṣà ìlera tiwọn. Ẹ jẹ́ ká ṣàwárí àwọn ìtàn wọ̀nyí, nítorí àṣà mú kí gbogbo ìrìn-àjò túbọ̀ lẹ́wà!',
    subtitle: 'Ní gbogbo àgbáyé, àwọn ìdílé ní àṣà ìlera tiwọn; àṣà mú kí gbogbo ìrìn-àjò lẹ́wà.',
  },
};
export const areas=[{name:'Brain Garden',icon:'brain',progress:100,unlocked:true},{name:'Heart Garden',icon:'heart',progress:18,unlocked:true},{name:'Lung Valley',icon:'wind',progress:0,unlocked:false},{name:'Bone Mountains',icon:'bone',progress:0,unlocked:false},{name:'Muscle Meadow',icon:'activity',progress:0,unlocked:false},{name:'Cultural Garden',icon:'flower',progress:36,unlocked:true}];
export { DemoProvider, demoAccounts, useDemo } from './store';
export type { DemoContextValue, DemoMessage, DemoRole, DemoSession } from './store';

