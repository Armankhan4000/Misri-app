export type Language = 'en' | 'bn' | 'hi' | 'es' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
    hi: string;
    es: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation Sidebar
  dashboard: {
    en: 'Overview Dashboard',
    bn: 'ড্যাশবোর্ড ওভারভিউ',
    hi: 'अवलोकन डैशबोर्ड',
    es: 'Panel de Control',
    ar: 'لوحة التحكم العامة'
  },
  customers: {
    en: 'Customers Directory',
    bn: 'গ্রাহক তালিকা',
    hi: 'ग्राहक निर्देशिका',
    es: 'Directorio de Clientes',
    ar: 'دليل العملاء'
  },
  technicians: {
    en: 'Technicians List',
    bn: 'মিস্ত্রি তালিকা',
    hi: 'तकनीशियन सूची',
    es: 'Lista de Técnicos',
    ar: 'قائمة الفنيين'
  },
  bookings: {
    en: 'Booking Dispatches',
    bn: 'বুকিং ডিসপ্যাচ',
    hi: 'बुकिंग प्रेषण',
    es: 'Gestión de Reservas',
    ar: 'إدارة الحجوزات'
  },
  locations: {
    en: 'Live GPS Locations',
    bn: 'লাইভ জিপিএস লোকেশন',
    hi: 'लाइव जीपीएस स्थान',
    es: 'Rastreo GPS en Vivo',
    ar: 'مواقع GPS الحية'
  },
  companion: {
    en: 'Companion Mistri App',
    bn: 'মিস্ত্রি অ্যাপ কন্ট্রোল',
    hi: 'मिस्त्री ऐप कंट्रोल',
    es: 'Aplicación de Compañero',
    ar: 'تطبيق ميستري المرافق'
  },
  banners: {
    en: 'Promo Ad Banners',
    bn: 'প্রোমো ব্যানার বিজ্ঞাপন',
    hi: 'प्रचार विज्ञापन बैनर',
    es: 'Banners Publicitarios',
    ar: 'لافتات الإعلانات الترويجية'
  },
  offers: {
    en: 'Offers & Promo Codes',
    bn: 'অফার ও প্রোমো কোড',
    hi: 'ऑफर और प्रोमो कोड',
    es: 'Ofertas y Cupones',
    ar: 'العروض وأكواد الخصم'
  },
  shop: {
    en: 'Online Spares Shop',
    bn: 'অনলাইন খুচরা যন্ত্রাংশের দোকান',
    hi: 'ऑनलाइन स्पेयर शॉप',
    es: 'Tienda de Repuestos',
    ar: 'متجر قطع الغيار'
  },
  commission: {
    en: 'Commission Settings',
    bn: 'কমিশন রেট সেটআপ',
    hi: 'आयोग दर सेटिंग्स',
    es: 'Ajustes de Comisión',
    ar: 'إعدادات العمولات'
  },
  notifications: {
    en: 'Broadcaster Alerts',
    bn: 'পুশ নোটিফিকেশন',
    hi: 'प्रसारण अलर्ट',
    es: 'Alertas y Difusiones',
    ar: 'تنبيهات البث الجماعي'
  },
  analytics: {
    en: 'Deep Corporate Analytics',
    bn: 'কর্পোরেট অ্যানালিটিক্স',
    hi: 'गहन कॉर्पोरेट विश्लेषिकी',
    es: 'Análisis Corporativo',
    ar: 'التحليلات المؤسسية العميق'
  },
  settings: {
    en: 'Settings & Security',
    bn: 'সিস্টেম ও সিকিউরিটি',
    hi: 'सेटिंग्स और सुरक्षा',
    es: 'Ajustes y Seguridad',
    ar: 'الإعدادات والأمان'
  },

  // General Topbar
  adminPanel: {
    en: 'MISTRI ADMIN',
    bn: 'মিস্ত্রি এডমিন',
    hi: 'मिस्त्री एडमिन',
    es: 'ADMIN MISTRI',
    ar: 'مدير ميستري'
  },
  authorizedConsole: {
    en: 'Authorized Console Panel',
    bn: 'অনুমোদিত অ্যাডমিন প্যানেল',
    hi: 'अधिकृत कंसोल पैनल',
    es: 'Panel de Consola Autorizada',
    ar: 'لوحة التحكم المصرحة'
  },
  exitPanel: {
    en: 'Exit Panel',
    bn: 'লগ আউট করুন',
    hi: 'निकास पैनल',
    es: 'Salir del Panel',
    ar: 'تسجيل الخروج'
  },

  // Language selectors info
  languageLabel: {
    en: 'Language',
    bn: 'ভাষা',
    hi: 'भाषा',
    es: 'Idioma',
    ar: 'اللغة'
  },

  // Overview dashboard items
  overviewTitle: {
    en: 'Operational Control Center',
    bn: 'অপারেশনাল কন্ট্রোল সেন্টার',
    hi: 'परिचालन नियंत्रण केंद्र',
    es: 'Centro de Control Operativo',
    ar: 'مركز التحكم والعمليات'
  },
  overviewSub: {
    en: 'Real-time telemetry and service request dispatches',
    bn: 'রিয়েল-টাইম জিপিএস টেলিমিতি এবং বুকিং ডিসপ্যাচ ওভারভিউ',
    hi: 'वास्तविक समय टेलीमेट्री और सेवा अनुरोध प्रेषण',
    es: 'Telemetría en tiempo real y despachos de solicitudes',
    ar: 'بيانات التشغيل والتحكم في الحجوزات الفورية'
  },
  runningGmv: {
    en: 'Monthly Gross Profit',
    bn: 'চলতি মাসের মোট লভ্যাংশ',
    hi: 'मासिक सकल लाभ',
    es: 'Beneficio Bruto Mensual',
    ar: 'الأرباح الإجمالية الشهرية'
  },
  matchedDispatches: {
    en: 'Successful Dispatches',
    bn: 'সফল বুকিং সম্পূর্ণ',
    hi: 'सफल प्रेषण',
    es: 'Despachos Exitosos',
    ar: 'الحجوزات المكتملة بنجاح'
  },
  activeMistryRate: {
    en: 'Active Mistris Online',
    bn: 'অনলাইন মিস্ত্রি সংখ্যা',
    hi: 'सक्रिय मिस्त्री ऑनलाइन',
    es: 'Técnicos Activos en Línea',
    ar: 'الفنيين المتصلين بالانترنت'
  },
  activeCustomersCount: {
    en: 'Happy Customers (Loyal)',
    bn: 'সক্রিয় গ্রাহক সংখ্যা',
    hi: 'सक्रिय ग्राहक संख्या',
    es: 'Clientes Felices Activos',
    ar: 'العملاء النشطون والسعداء'
  },

  // Dispute banner or states
  disputesFlagged: {
    en: 'Disputes Escalated',
    bn: 'অভিযোগ দায়েরকৃত',
    hi: 'विवाद बढ़े',
    es: 'Disputas Reportadas',
    ar: 'النزاعات والشكاوى المفتوحة'
  },
  unsubmitted: {
    en: 'Unsubmitted',
    bn: 'জমা দেওয়া হয়নি',
    hi: 'अप्रस्तुत',
    es: 'No presentado',
    ar: 'غير مقدم'
  },
  pending: {
    en: 'Pending Audit',
    bn: 'যাচাই পেন্ডিং',
    hi: 'समीक्षा लंबित',
    es: 'Auditoría Pendiente',
    ar: 'قيد التدقيق'
  },
  verified: {
    en: 'Verified Pass',
    bn: 'সফল ভেরিফাইড',
    hi: 'सत्यापित सफल',
    es: 'Verificado',
    ar: 'تم التحقق بنجاح'
  },
  rejected: {
    en: 'Rejected Fail',
    bn: 'বাতিল বা ফেক',
    hi: 'अस्वीकृत विफल',
    es: 'Rechazado',
    ar: 'مرفوض / غير صالح'
  }
};

// Global Translation helper helper
export function getTranslation(key: string, lang: Language): string {
  if (translations[key]) {
    return translations[key][lang];
  }
  return key; // Fallback to raw string / key
}
