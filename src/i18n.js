// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Global
      translate: "Translate",
      selectLanguage: "Select language",
      english: "English",
      telugu: "Telugu",

      // Home
      marquee_default:
        "🌸 Hare Krishna Hare Rama — Chant the name of the Lord and find peace within your heart. 🌸",

      // Home - About Him (below marquee)
      home_subbarao_badge: "About Sri Vavilakolanu Subbarao",
      home_subbarao_title: "A Life of Service and Devotion",
      home_subbarao_subtitle:
        "A foremost devotee of Sri Kodandarama Swamy of the sacred Ontimitta shrine, remembered for devotion, compassion, and spiritual literature.",
      home_subbarao_meta_born: "Born: 23-01-1863",
      home_subbarao_meta_place: "Vavilakolanu, Ontimitta, Kadapa",
      home_subbarao_meta_mahasamadhi: "Attained salvation: 01-08-1936",
      home_subbarao_para_1:
        "Sri Vavilakolanu Subbarao lived as a great soul and a foremost devotee, serving continuously in the service of Sri Kodandarama Swamy, the presiding deity of the sacred Ontimitta shrine. Renowned as a prolific author of over a hundred books, he was born on 23.01.1863 in Vavilakolanu village, Ontimitta Mandal, Kadapa District.",
      home_subbarao_para_2:
        "His mother was Krishnamma, his father Venkateswararao, and his wife Gangamma. Living with ascetic discipline and a spirit of renunciation, he dedicated himself wholly to the service of Sri Rama, practicing compassion and following the path of non-violence.",
      home_subbarao_para_3:
        "He devoted his life to the sacred shrine by conducting continuous bhajans and worship. He imparted teachings of righteousness to devotees and explained the philosophy of the Ramayana. He became a spiritual guide who led many on the path of devotion, and he rendered invaluable service to the development of the Ontimitta Rama Temple.",
      home_subbarao_para_4:
        "Through his great literary works, he brought the paths of devotion, knowledge, and renunciation closer to the people, rendering immeasurable service to Telugu literature. His entire life was immersed in the constant remembrance of the name of Sri Rama.",
      home_subbarao_footer_note:
        "A gentle remembrance of a life dedicated to Sri Rama Seva.",

      // Gallery Section
      // gallery_badge: "Gallery",
      // gallery_title: "Spiritual Gallery",
      // gallery_desc:
      //   "Explore a divine collection of temple architectures, deities, and festivals that inspire devotion and peace.",

      // Videos Section
      videos_badge: "Videos",
      videos_title: "Devotional Videos",
      videos_desc:
        "Watch inspiring videos about teachings, rituals, and ancient stories that bring spiritual wisdom to life.",
      video_card_title: "Video Title {{n}}",
      video_card_desc: "Coming soon: Devotional content",

      // About Section Preview (Home)
      about_badge: "About Us",
      about_title: "About Sri Andhra Valmiki",
      about_desc:
        "Sri Andhra Valmiki is dedicated to spreading spiritual knowledge, devotion, and moral values inspired by ancient Indian scriptures. Join us on this divine journey of enlightenment.",
      learn_more: "Learn More",

      // Articles page
      back: "Back",
      page_articles_title: "Sacred Texts & Articles",
      page_articles_sub:
        "Browse our collection of sacred texts and devotional articles",
      page_chapters_sub: "Explore chapters in this article",
      page_topics_sub: "Discover topics within this chapter",
      page_contents_sub: "Read the devotional content",
      articles_available: "{{n}} Articles Available",
      chapters_count: "{{n}} Chapters",
      topics_count: "{{n}} Topics",
      contents_count: "{{n}} Content Blocks",
      no_articles: "No articles found. Please check back later.",
      no_chapters: "No chapters available for this article yet.",
      no_topics: "No topics available for this chapter yet.",
      no_contents: "No content blocks have been added for this topic yet.",
      no_description: "No description provided.",
      summary_not_added: "Summary not added yet.",
      description_not_added: "Description not added yet.",
      view_pdf: "View PDF",
      download: "Download",
      content_of: "Content {{i}} of {{n}}",

      // Gallery component
      no_images: "No Images Yet",
      no_images_desc:
        "The divine gallery is being prepared. Please check back soon or contact the admin to add sacred photos.",
      divine_image: "Divine Image {{n}}",
      sacred_collection: "Sacred Collection",

      // ✅ About Page
      about_hero_image_alt: "Spiritual Leader",
      about_hero_title: "Our Purpose & Vision",
      about_hero_subtitle:
        "Honoring Sri Andhra Valmiki Sree Vavilakolanu Subbarao Garu (Vasudasa Swamy)",

      about_para_1_prefix:
        "This website is created to honor the life and selfless devotion of",
      about_person_name: "Sri Andhra Valmiki-Sree Vavilakolanu Subbarao Garu (Vasudasa Swamy)",
      about_para_1_suffix:
        ", author of over a hundred books, who dedicated himself to the sacred service of Ontimitta Sri Kodanda Rama Swamy Temple.",

      about_para_2:
        "With humility and unwavering faith, he served Lord Rama without seeking recognition. Through this platform, we share his spiritual writings and compositions so that his thoughts may continue to guide and inspire future generations.",

      about_para_3_prefix:
        "The essence of the Ramayana flows through this website, reminding us that",
      about_value_1: "dharma gives strength",
      about_value_2: "truth leads to victory",
      about_para_3_mid: "and",
      about_value_3: "devotion brings inner peace",
      about_para_3_suffix:
        " These timeless values reflect the path lived and taught by Subbarao Garu.",

      about_para_4:
        "This platform stands as a bridge between sacred tradition and the present, carrying forward the eternal message of bhakti and righteous living.",

      about_quote: '"Dharma protects those who protect dharma."',

      about_signature_prefix: "— With divine blessings,",
      about_signature_line_1: "Sri Rama Sevalo",
      about_signature_line_2: "Raju Lakshmi Narayana Reddy",

      about_mission_badge: "Our Mission",
      about_mission_title: "Spreading Divine Knowledge",
      about_mission_desc:
        "Sri Andhra Valmiki is dedicated to preserving and sharing the eternal wisdom of the Bhagavad Gita, Vedas, and other sacred scriptures. Our mission is to help individuals discover their spiritual identity and cultivate a deep connection with the divine through:",

      about_card_1_title: "Sacred Teachings",
      about_card_1_desc:
        "Access authentic translations and commentaries on ancient scriptures",
      about_card_2_title: "Community",
      about_card_2_desc:
        "Join a vibrant community of spiritual seekers and practitioners",
      about_card_3_title: "Devotional Practices",
      about_card_3_desc:
        "Learn about kirtan, meditation, and other spiritual practices",
      about_card_4_title: "Cultural Events",
      about_card_4_desc:
        "Participate in festivals and celebrations throughout the year",

      about_values_title: "Our Core Values",
      about_value_card_1_title: "Devotion",
      about_value_card_1_desc: "Pure love and dedication",
      about_value_card_2_title: "Knowledge",
      about_value_card_2_desc: "Understanding eternal truths",
      about_value_card_3_title: "Compassion",
      about_value_card_3_desc: "Kindness to all beings",
      about_value_card_4_title: "Service",
      about_value_card_4_desc: "Selfless dedication",

      about_cta_title: "Begin Your Spiritual Journey Today",
      about_cta_desc:
        "Join thousands of seekers on the path to enlightenment and inner peace",
      about_cta_button: "Connect With Us",

      about_contact_title: "Contact Us",
      about_contact_subtitle: "With deep reverence and unwavering devotion",
      about_contact_name: "Raju Lakshmi Narayana Reddy",
      about_contact_relation: "S/o Venkata Subba Reddy",
      about_contact_org: "Sree Rama Seva",
      about_contact_org_subtitle: "With deep reverence and unwavering devotion",
      about_contact_address_title: "Address",
      about_contact_address: "Ontimitta, Cuddapah District, Andhra Pradesh",
      about_contact_email_title: "Email",
      about_contact_email: "sriandhravalmiki@gmail.com",
      about_contact_email_now: "Email Now",

      // Common
      close: "Close",
    },
  },

  te: {
    translation: {
      // Global
      translate: "అనువదించు",
      selectLanguage: "భాష ఎంపిక",
      english: "ఇంగ్లీష్",
      telugu: "తెలుగు",

      // Home
      marquee_default:
        "🌸 హరే కృష్ణ హరే రామ — భగవన్నామస్మరణ చేయండి, మీ హృదయంలో శాంతిని పొందండి. 🌸",

      // Home - About Him (below marquee)
      home_subbarao_badge: "శ్రీ వావిలకోలాను సుబ్బారావు గారి గురించి",
      home_subbarao_title: "సేవా–భక్తితో నిండిన మహాజీవితం",
      home_subbarao_subtitle:
        "ఒంటిమిట్ట శ్రీ కోదండరామ స్వామి క్షేత్రంలో అచంచల భక్తితో, కరుణతో, ఆధ్యాత్మిక సాహిత్యంతో నిలిచిన మహనీయుడు.",
      home_subbarao_meta_born: "జననం: 23-01-1863",
      home_subbarao_meta_place: "వావిలకోలాను, ఒంటిమిట్ట, కడప",
      home_subbarao_meta_mahasamadhi: "మోక్షప్రాప్తి: 01-08-1936",

      home_subbarao_para_1:
        "శ్రీ వావిలకోలాను సుబ్బారావు గారు మహాత్ముడిగా, ప్రముఖ రామభక్తుడిగా జీవించారు. ఒంటిమిట్ట పుణ్యక్షేత్రంలోని శ్రీ కోదండరామ స్వామి సేవలో నిరంతరం నిమగ్నమై ఉన్నారు. వందకు పైగా గ్రంథాలను రచించిన ‘ప్రఖ్యాత రచయిత’గా ఖ్యాతి గడించారు. ఆయన 23.01.1863 నాడు కడప జిల్లా, ఒంటిమిట్ట మండలం, వావిలకోలాను గ్రామంలో జన్మించారు.",

      home_subbarao_para_2:
        "ఆయన తల్లి కృష్ణమ్మ, తండ్రి వెంకటేశ్వరరావు, భార్య గంగమ్మ. త్యాగం–వైరాగ్యాలతో కూడిన తపోమయ జీవితం గడుపుతూ, తనను తాను పూర్తిగా శ్రీరామ సేవకు అంకితం చేసుకున్నారు. కరుణను ఆచరించి, అహింసా మార్గాన్ని అనుసరించిన మహనీయుడు.",

      home_subbarao_para_3:
        "శ్రీ కోదండరామ స్వామి ఆలయంలో నిరంతర భజనలు, పూజారాధనలు నిర్వహిస్తూ తన జీవితాన్ని క్షేత్రసేవకు అర్పించారు. భక్తులకు ధర్మబోధను అందించి, రామాయణ తత్త్వాన్ని వివరిస్తూ బోధనలు చేశారు. అనేక మందిని భక్తిమార్గంలో నడిపించిన ఆధ్యాత్మిక మార్గదర్శిగా పేరొందారు. ఒంటిమిట్ట రామాలయ అభివృద్ధికి అమూల్యమైన సేవలు అందించారు.",

      home_subbarao_para_4:
        "ఆయన మహత్తర సాహిత్య రచనల ద్వారా భక్తి, జ్ఞానం, వైరాగ్య మార్గాలను ప్రజలకు చేరువ చేశారు. తెలుగుసాహిత్యానికి అపారమైన సేవ చేశారు. శ్రీరామ నామస్మరణలో నిత్యం లీనమై జీవించి, చివరకు 01.08.1936 నాడు మోక్షాన్ని పొందారు.",

      home_subbarao_footer_note:
        "శ్రీరామ సేవకు అంకితమైన మహాజీవితానికి స్మరణార్థం.",

      // Gallery Section
      gallery_badge: "గ్యాలరీ",
      gallery_title: "ఆధ్యాత్మిక గ్యాలరీ",
      gallery_desc:
        "భక్తి మరియు శాంతిని ప్రేరేపించే మందిర నిర్మాణాలు, దేవతలు, పండుగల దివ్య సంగ్రహాన్ని వీక్షించండి.",

      // Videos Section
      videos_badge: "వీడియోలు",
      videos_title: "భక్తి వీడియోలు",
      videos_desc:
        "ఉపదేశాలు, ఆచారాలు, పురాణ కథలపై ప్రేరణాత్మక వీడియోలను వీక్షించండి.",
      video_card_title: "వీడియో శీర్షిక {{n}}",
      video_card_desc: "త్వరలో: భక్తి అంశాలు",

      // About Section Preview (Home)
      about_badge: "మా గురించి",
      about_title: "శ్రీ ఆంధ్ర వాల్మికి గురించి",
      about_desc:
        "శ్రీ ఆంధ్ర వాల్మికి ప్రాచీన భారత శాస్త్రాల ప్రేరణతో ఆధ్యాత్మిక జ్ఞానం, భక్తి, నీతిమూల్యాలను వ్యాప్తి చేయడానికి అంకితం. ఈ దివ్య జ్ఞానయాత్రలో మాతో చేరండి.",
      learn_more: "మరింత తెలుసుకోండి",

      // Articles page
      back: "వెనక్కి",
      page_articles_title: "పవిత్ర గ్రంథాలు & వ్యాసాలు",
      page_articles_sub:
        "పవిత్ర గ్రంథాలు మరియు భక్తి వ్యాసాల సేకరణను బ్రౌజ్ చేయండి",
      page_chapters_sub: "ఈ వ్యాసంలోని అధ్యాయాలను అన్వేషించండి",
      page_topics_sub: "ఈ అధ్యాయంలోని విషయాలను కనుగొనండి",
      page_contents_sub: "భక్తి కంటెంట్ చదవండి",
      articles_available: "{{n}} వ్యాసాలు అందుబాటులో ఉన్నాయి",
      chapters_count: "{{n}} అధ్యాయాలు",
      topics_count: "{{n}} విషయాలు",
      contents_count: "{{n}} కంటెంట్ బ్లాక్స్",
      no_articles: "వ్యాసాలు లభించలేదు. తర్వాత మళ్లీ ప్రయత్నించండి.",
      no_chapters: "ఈ వ్యాసానికి ఇంకా అధ్యాయాలు లేవు.",
      no_topics: "ఈ అధ్యాయానికి ఇంకా విషయాలు లేవు.",
      no_contents: "ఈ విషయానికి ఇంకా కంటెంట్ బ్లాక్స్ లేవు.",
      no_description: "వివరణ ఇవ్వలేదు.",
      summary_not_added: "సారాంశం ఇంకా జత కాలేదు.",
      description_not_added: "వివరణ ఇంకా జత కాలేదు.",
      view_pdf: "PDF చూడండి",
      download: "డౌన్‌లోడ్",
      content_of: "కంటెంట్ {{i}} / {{n}}",

      // Gallery component
      no_images: "ఇంకా చిత్రాలు లేవు",
      no_images_desc:
        "దివ్య గ్యాలరీ సిద్ధమవుతోంది. దయచేసి తర్వాత మళ్లీ చూడండి లేదా పవిత్ర చిత్రాలు జోడించడానికి అడ్మిన్‌ను సంప్రదించండి.",
      divine_image: "దివ్య చిత్రం {{n}}",
      sacred_collection: "పవిత్ర సంగ్రహం",

      // ✅ About Page
      about_hero_image_alt: "ఆధ్యాత్మిక నాయకుడు",
      about_hero_title: "మా ఉద్దేశ్యం & దృష్టి",
      about_hero_subtitle:
        "శ్రీ ఆంధ్ర వాల్మికి (శ్రీ వావిలకోలాను సుబ్బారావు గారు – వాసుదాస స్వామి) గారిని గౌరవిస్తూ",

      about_para_1_prefix: "ఈ వెబ్‌సైట్‌ను",
      about_person_name: "శ్రీ ఆంధ్ర వాల్మీకి శ్రీ వావిలకోలాను సుబ్బారావు గారు (వాసుదాస స్వామి)",
      about_para_1_suffix:
        " జీవితాన్ని, ఆయన నిరుపేక్ష భక్తిని గౌరవించడానికి రూపొందించాము. ఆయన వందకు పైగా పుస్తకాల రచయిత, ఒంటిమిట్ట శ్రీ కోదండ రామ స్వామి ఆలయానికి పవిత్ర సేవ అంకితం చేశారు.",

      about_para_2:
        "వినయంతో, అచంచలమైన విశ్వాసంతో ఆయన రామ సేవను కీర్తి ఆశించకుండా చేశారు. ఈ వేదిక ద్వారా ఆయన ఆధ్యాత్మిక రచనలు, సాహిత్యాన్ని పంచుతూ రాబోయే తరాలకు ప్రేరణ కలిగించాలనే ఉద్దేశ్యం.",

      about_para_3_prefix:
        "ఈ వెబ్‌సైట్‌లో రామాయణ సారం ప్రవహిస్తూ, మనకు గుర్తు చేస్తుంది —",
      about_value_1: "ధర్మం బలం ఇస్తుంది",
      about_value_2: "సత్యం విజయం ఇస్తుంది",
      about_para_3_mid: "మరియు",
      about_value_3: "భక్తి అంతరంగ శాంతిని ఇస్తుంది",
      about_para_3_suffix: ". ఇవే సుబ్బారావు గారు జీవించి నేర్పిన శాశ్వత విలువలు.",

      about_para_4:
        "ఈ వేదిక పవిత్ర సంప్రదాయం మరియు నేటి కాలం మధ్య ఒక వంతెనలా నిలిచి, భక్తి మరియు ధర్మ జీవన సందేశాన్ని కొనసాగిస్తుంది.",

      about_quote: '"ధర్మాన్ని కాపాడితే, ధర్మం మిమ్మల్ని కాపాడుతుంది."',

      about_signature_prefix: "— దివ్య ఆశీర్వాదాలతో,",
      about_signature_line_1: "శ్రీ రామ సేవలో",
      about_signature_line_2: "రాజు లక్ష్మీ నారాయణ రెడ్డి",

      about_mission_badge: "మా మిషన్",
      about_mission_title: "దివ్య జ్ఞానాన్ని వ్యాప్తి చేయడం",
      about_mission_desc:
        "శ్రీ ఆంధ్ర వాల్మికి భగవద్గీత, వేదాలు మరియు ఇతర పవిత్ర గ్రంథాల శాశ్వత జ్ఞానాన్ని పరిరక్షించి పంచేందుకు అంకితం. ఆధ్యాత్మిక గుర్తింపు మరియు దైవ సంబంధాన్ని పెంపొందించడానికి మేము సహాయం చేస్తాము:",

      about_card_1_title: "పవిత్ర బోధనలు",
      about_card_1_desc: "ప్రాచీన గ్రంథాల నిజమైన అనువాదాలు, వ్యాఖ్యానాలు పొందండి",
      about_card_2_title: "సమాజం",
      about_card_2_desc: "ఆధ్యాత్మిక సాధకుల సముదాయంలో భాగస్వామ్యం అవ్వండి",
      about_card_3_title: "భక్తి సాధనలు",
      about_card_3_desc: "కీర్తన, ధ్యానం వంటి సాధనలను తెలుసుకోండి",
      about_card_4_title: "సాంస్కృతిక కార్యక్రమాలు",
      about_card_4_desc: "పండుగలు, ఉత్సవాలలో పాల్గొనండి",

      about_values_title: "మా ప్రధాన విలువలు",
      about_value_card_1_title: "భక్తి",
      about_value_card_1_desc: "శుద్ధ ప్రేమ మరియు అంకితభావం",
      about_value_card_2_title: "జ్ఞానం",
      about_value_card_2_desc: "శాశ్వత సత్యాల అవగాహన",
      about_value_card_3_title: "కరుణ",
      about_value_card_3_desc: "అన్ని జీవులపై దయ",
      about_value_card_4_title: "సేవ",
      about_value_card_4_desc: "నిస్వార్థ అంకిత సేవ",

      about_cta_title: "ఈ రోజు మీ ఆధ్యాత్మిక ప్రయాణాన్ని ప్రారంభించండి",
      about_cta_desc:
        "జ్ఞానోదయం మరియు అంతరంగ శాంతి మార్గంలో వేలాది సాధకులతో చేరండి",
      about_cta_button: "మమ్మల్ని సంప్రదించండి",

      about_contact_title: "సంప్రదించండి",
      about_contact_subtitle: "గాఢ గౌరవంతో మరియు అచంచల భక్తితో",
      about_contact_name: "రాజు లక్ష్మీ నారాయణ రెడ్డి",
      about_contact_relation: "వెంకట సుబ్బ రెడ్డి గారి కుమారుడు",
      about_contact_org: "శ్రీ రామ సేవ",
      about_contact_org_subtitle: "గాఢ గౌరవంతో మరియు అచంచల భక్తితో",
      about_contact_address_title: "చిరునామా",
      about_contact_address: "ఒంటిమిట్ట, కడప జిల్లా, ఆంధ్రప్రదేశ్",
      about_contact_email_title: "ఈమెయిల్",
      about_contact_email: "sriandhravalmiki@gmail.com",
      about_contact_email_now: "ఈమెయిల్ పంపండి",

      // Common
      close: "మూసివేయి",
    },
  },
};

const savedLang = localStorage.getItem("appLang") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => localStorage.setItem("appLang", lng));

export default i18n;
