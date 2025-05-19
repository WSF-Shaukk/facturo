export type Language = "en" | "fr" | "sw" | "ar";

export interface Translations {
  direction: "ltr" | "rtl";
  header: {
    title: string;
    pricing: string;
    dashboard: string;
    login: string;
    signup: string;
  };
  dashboard: {
    title: string;
    signOut: string;
    subscription: {
      title: string;
      currentPlan: string;
      free: string;
      pro: string;
      upgradeToPro: string;
    };
  };
  landing: {
    title: string;
    subtitle: string;
    cta: string;
    features: {
      quick: {
        title: string;
        description: string;
      };
      professional: {
        title: string;
        description: string;
      };
      share: {
        title: string;
        description: string;
      };
    };
  };
  invoice: {
    create: string;
    form: {
      invoiceNumber: string;
      date: string;
      clientName: string;
      items: string;
      description: string;
      quantity: string;
      price: string;
      subtotal: string;
      addItem: string;
      removeItem: string;
      currency: string;
      total: string;
      notes: string;
      notesPlaceholder: string;
      generate: string;
      generating: string;
    };
    preview: {
      title: string;
      download: string;
      share: string;
      new: string;
      billTo: string;
      thankYou: string;
      generatedWith: string;
    };
  };
  languages: {
    en: string;
    fr: string;
    sw: string;
    ar: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    direction: "ltr",
    header: {
      title: "Facturo.africa",
      pricing: "Pricing",
      dashboard: "Dashboard",
      login: "Login",
      signup: "Sign Up",
    },
    dashboard: {
      title: "Dashboard",
      signOut: "Sign Out",
      subscription: {
        title: "Subscription Status",
        currentPlan: "Current plan:",
        free: "Free",
        pro: "Pro",
        upgradeToPro: "Upgrade to Pro",
      },
    },
    landing: {
      title: "Generate a professional invoice in 1 minute",
      subtitle:
        "Create, download, and share professional invoices instantly. No account required.",
      cta: "Create Invoice",
      features: {
        quick: {
          title: "Quick & Easy",
          description: "Fill a simple form and get your invoice in seconds",
        },
        professional: {
          title: "Professional PDF",
          description: "Get a clean, professional invoice ready to share",
        },
        share: {
          title: "Share Instantly",
          description: "Download or share via WhatsApp in seconds",
        },
      },
    },
    invoice: {
      create: "Create Your Invoice",
      form: {
        invoiceNumber: "Invoice Number",
        date: "Date",
        clientName: "Client Name",
        items: "Items",
        description: "Description",
        quantity: "Quantity",
        price: "Price",
        subtotal: "Subtotal",
        addItem: "Add Item",
        removeItem: "Remove",
        currency: "Currency",
        total: "Total",
        notes: "Notes (Optional)",
        notesPlaceholder: "Add any additional notes or payment instructions",
        generate: "Generate Invoice PDF",
        generating: "Generating Invoice...",
      },
      preview: {
        title: "Invoice Preview",
        download: "Download PDF",
        share: "Share via WhatsApp",
        new: "Create New Invoice",
        billTo: "Bill To:",
        thankYou: "Thank you for your business!",
        generatedWith: "Generated with Facturo.africa",
      },
    },
    languages: {
      en: "English",
      fr: "Français",
      sw: "Kiswahili",
      ar: "العربية",
    },
  },
  fr: {
    direction: "ltr",
    header: {
      title: "Facturo.africa",
      pricing: "Tarifs",
      dashboard: "Tableau de bord",
      login: "Connexion",
      signup: "S'inscrire",
    },
    dashboard: {
      title: "Tableau de bord",
      signOut: "Déconnexion",
      subscription: {
        title: "Statut de l'abonnement",
        currentPlan: "Plan actuel :",
        free: "Gratuit",
        pro: "Pro",
        upgradeToPro: "Passer à Pro",
      },
    },
    landing: {
      title: "Générez une facture professionnelle en 1 minute",
      subtitle:
        "Créez, téléchargez et partagez des factures professionnelles instantanément. Aucun compte requis.",
      cta: "Créer une Facture",
      features: {
        quick: {
          title: "Rapide & Facile",
          description:
            "Remplissez un formulaire simple et obtenez votre facture en quelques secondes",
        },
        professional: {
          title: "PDF Professionnel",
          description:
            "Obtenez une facture propre et professionnelle prête à partager",
        },
        share: {
          title: "Partagez Instantanément",
          description:
            "Téléchargez ou partagez via WhatsApp en quelques secondes",
        },
      },
    },
    invoice: {
      create: "Créez Votre Facture",
      form: {
        invoiceNumber: "Numéro de Facture",
        date: "Date",
        clientName: "Nom du Client",
        items: "Articles",
        description: "Description",
        quantity: "Quantité",
        price: "Prix",
        subtotal: "Sous-total",
        addItem: "Ajouter un Article",
        removeItem: "Supprimer",
        currency: "Devise",
        total: "Total",
        notes: "Notes (Optionnel)",
        notesPlaceholder:
          "Ajoutez des notes supplémentaires ou des instructions de paiement",
        generate: "Générer la Facture PDF",
        generating: "Génération de la Facture...",
      },
      preview: {
        title: "Aperçu de la Facture",
        download: "Télécharger PDF",
        share: "Partager via WhatsApp",
        new: "Créer une Nouvelle Facture",
        billTo: "Facturer à:",
        thankYou: "Merci pour votre confiance!",
        generatedWith: "Généré avec Facturo.africa",
      },
    },
    languages: {
      en: "English",
      fr: "Français",
      sw: "Kiswahili",
      ar: "العربية",
    },
  },
  sw: {
    direction: "ltr",
    header: {
      title: "Facturo.africa",
      pricing: "Bei",
      dashboard: "Dashibodi",
      login: "Ingia",
      signup: "Jisajili",
    },
    dashboard: {
      title: "Dashibodi",
      signOut: "Toka",
      subscription: {
        title: "Hali ya Usajili",
        currentPlan: "Mpango wa sasa:",
        free: "Bure",
        pro: "Pro",
        upgradeToPro: "Panda daraja hadi Pro",
      },
    },
    landing: {
      title: "Tengeneza ankara ya kitaalamu kwa dakika 1",
      subtitle:
        "Unda, pakua, na shiriki ankara za kitaalamu mara moja. Hakuna akaunti inayohitajika.",
      cta: "Tengeneza Ankara",
      features: {
        quick: {
          title: "Haraka & Rahisi",
          description: "Jaza fomu rahisi na upate ankara yako kwa sekunde",
        },
        professional: {
          title: "PDF ya Kitaalamu",
          description: "Pata ankara safi na ya kitaalamu tayari kushiriki",
        },
        share: {
          title: "Shiriki Mara Moja",
          description: "Pakua au shiriki kupitia WhatsApp kwa sekunde",
        },
      },
    },
    invoice: {
      create: "Tengeneza Ankara Yako",
      form: {
        invoiceNumber: "Nambari ya Ankara",
        date: "Tarehe",
        clientName: "Jina la Mteja",
        items: "Bidhaa",
        description: "Maelezo",
        quantity: "Kiasi",
        price: "Bei",
        subtotal: "Jumla ndogo",
        addItem: "Ongeza Bidhaa",
        removeItem: "Ondoa",
        currency: "Sarafu",
        total: "Jumla",
        notes: "Maelezo (Hiari)",
        notesPlaceholder: "Ongeza maelezo yoyote ya ziada au maagizo ya malipo",
        generate: "Tengeneza PDF ya Ankara",
        generating: "Inatengeneza Ankara...",
      },
      preview: {
        title: "Hakiki Ankara",
        download: "Pakua PDF",
        share: "Shiriki kupitia WhatsApp",
        new: "Tengeneza Ankara Mpya",
        billTo: "Lipia kwa:",
        thankYou: "Asante kwa biashara yako!",
        generatedWith: "Imetengenezwa na Facturo.africa",
      },
    },
    languages: {
      en: "English",
      fr: "Français",
      sw: "Kiswahili",
      ar: "العربية",
    },
  },
  ar: {
    direction: "rtl",
    header: {
      title: "فاكتورو.أفريكا",
      pricing: "الأسعار",
      dashboard: "لوحة التحكم",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
    },
    dashboard: {
      title: "لوحة التحكم",
      signOut: "تسجيل الخروج",
      subscription: {
        title: "حالة الاشتراك",
        currentPlan: "الخطة الحالية:",
        free: "مجاني",
        pro: "محترف",
        upgradeToPro: "الترقية إلى محترف",
      },
    },
    landing: {
      title: "إنشاء فاتورة احترافية في دقيقة واحدة",
      subtitle:
        "إنشاء وتنزيل ومشاركة الفواتير الاحترافية على الفور. لا حساب مطلوب.",
      cta: "إنشاء فاتورة",
      features: {
        quick: {
          title: "سريع وسهل",
          description: "املأ نموذجًا بسيطًا واحصل على فاتورتك في ثوانٍ",
        },
        professional: {
          title: "PDF احترافي",
          description: "احصل على فاتورة نظيفة واحترافية جاهزة للمشاركة",
        },
        share: {
          title: "مشاركة فورية",
          description: "تنزيل أو مشاركة عبر واتساب في ثوانٍ",
        },
      },
    },
    invoice: {
      create: "إنشاء الفاتورة الخاصة بك",
      form: {
        invoiceNumber: "رقم الفاتورة",
        date: "التاريخ",
        clientName: "اسم العميل",
        items: "العناصر",
        description: "الوصف",
        quantity: "الكمية",
        price: "السعر",
        subtotal: "المجموع الفرعي",
        addItem: "إضافة عنصر",
        removeItem: "إزالة",
        currency: "العملة",
        total: "المجموع",
        notes: "ملاحظات (اختياري)",
        notesPlaceholder: "أضف أي ملاحظات إضافية أو تعليمات الدفع",
        generate: "إنشاء فاتورة PDF",
        generating: "جاري إنشاء الفاتورة...",
      },
      preview: {
        title: "معاينة الفاتورة",
        download: "تنزيل PDF",
        share: "مشاركة عبر واتساب",
        new: "إنشاء فاتورة جديدة",
        billTo: "فاتورة إلى:",
        thankYou: "شكرا لعملك!",
        generatedWith: "تم إنشاؤها بواسطة فاكتورو.أفريكا",
      },
    },
    languages: {
      en: "English",
      fr: "Français",
      sw: "Kiswahili",
      ar: "العربية",
    },
  },
};
