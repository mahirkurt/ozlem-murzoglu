/**
 * Translation Keys Configuration
 * Maps dynamic resource keys to their translation keys
 */

export interface ResourceTranslationKey {
  categoryKey: string;
  resourceKey: string;
  translationKey: string;
}

// Define all resource translation keys statically
export const RESOURCE_TRANSLATION_KEYS: ResourceTranslationKey[] = [
  // Gelişim Rehberleri
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '0-2-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_0_2',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '2-4-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_2_4',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '4-6-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_4_6',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '6-9-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_6_9',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '9-12-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_9_12',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '12-18-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_12_18',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '18-24-ay',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.AY_18_24',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '2-3-yas',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.YAS_2_3',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '3-4-yas',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.YAS_3_4',
  },
  {
    categoryKey: 'gelisim-rehberleri',
    resourceKey: '4-5-yas',
    translationKey: 'RESOURCES.GELISIM_REHBERLERI.YAS_4_5',
  },

  // Hastalıklar
  { categoryKey: 'hastaliklar', resourceKey: 'ates', translationKey: 'RESOURCES.HASTALIKLAR.ATES' },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'ishal',
    translationKey: 'RESOURCES.HASTALIKLAR.ISHAL',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'kabizlik',
    translationKey: 'RESOURCES.HASTALIKLAR.KABIZLIK',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'kusma',
    translationKey: 'RESOURCES.HASTALIKLAR.KUSMA',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'oksuruk',
    translationKey: 'RESOURCES.HASTALIKLAR.OKSURUK',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'burun-akintisi',
    translationKey: 'RESOURCES.HASTALIKLAR.BURUN_AKINTISI',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'kulak-agrisi',
    translationKey: 'RESOURCES.HASTALIKLAR.KULAK_AGRISI',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'bogaz-agrisi',
    translationKey: 'RESOURCES.HASTALIKLAR.BOGAZ_AGRISI',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'deri-dokuntuleri',
    translationKey: 'RESOURCES.HASTALIKLAR.DERI_DOKUNTULERI',
  },
  {
    categoryKey: 'hastaliklar',
    resourceKey: 'alerjiler',
    translationKey: 'RESOURCES.HASTALIKLAR.ALERJILER',
  },

  // Aşılar
  {
    categoryKey: 'asilar',
    resourceKey: 'asi-takvimi',
    translationKey: 'RESOURCES.ASILAR.ASI_TAKVIMI',
  },
  { categoryKey: 'asilar', resourceKey: 'hepatit-b', translationKey: 'RESOURCES.ASILAR.HEPATIT_B' },
  { categoryKey: 'asilar', resourceKey: 'bcg', translationKey: 'RESOURCES.ASILAR.BCG' },
  {
    categoryKey: 'asilar',
    resourceKey: 'dbt-ipa-hib',
    translationKey: 'RESOURCES.ASILAR.DBT_IPA_HIB',
  },
  {
    categoryKey: 'asilar',
    resourceKey: 'konjuge-pnomokok',
    translationKey: 'RESOURCES.ASILAR.KONJUGE_PNOMOKOK',
  },
  {
    categoryKey: 'asilar',
    resourceKey: 'oral-polio',
    translationKey: 'RESOURCES.ASILAR.ORAL_POLIO',
  },
  {
    categoryKey: 'asilar',
    resourceKey: 'kizamik-kizamikcik-kabakulak',
    translationKey: 'RESOURCES.ASILAR.KKK',
  },
  { categoryKey: 'asilar', resourceKey: 'su-cicegi', translationKey: 'RESOURCES.ASILAR.SU_CICEGI' },
  { categoryKey: 'asilar', resourceKey: 'hepatit-a', translationKey: 'RESOURCES.ASILAR.HEPATIT_A' },
  { categoryKey: 'asilar', resourceKey: 'hpv', translationKey: 'RESOURCES.ASILAR.HPV' },

  // Beslenme
  {
    categoryKey: 'beslenme',
    resourceKey: 'anne-sutu',
    translationKey: 'RESOURCES.BESLENME.ANNE_SUTU',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: 'ek-gidaya-gecis',
    translationKey: 'RESOURCES.BESLENME.EK_GIDAYA_GECIS',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: '6-ay-beslenme',
    translationKey: 'RESOURCES.BESLENME.ALTI_AY',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: '7-9-ay-beslenme',
    translationKey: 'RESOURCES.BESLENME.YEDI_DOKUZ_AY',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: '10-12-ay-beslenme',
    translationKey: 'RESOURCES.BESLENME.ON_ONIKI_AY',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: '1-3-yas-beslenme',
    translationKey: 'RESOURCES.BESLENME.BIR_UC_YAS',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: 'vitamin-mineral',
    translationKey: 'RESOURCES.BESLENME.VITAMIN_MINERAL',
  },
  {
    categoryKey: 'beslenme',
    resourceKey: 'yemek-reddi',
    translationKey: 'RESOURCES.BESLENME.YEMEK_REDDI',
  },
  { categoryKey: 'beslenme', resourceKey: 'obezite', translationKey: 'RESOURCES.BESLENME.OBEZITE' },
  {
    categoryKey: 'beslenme',
    resourceKey: 'besin-alerjileri',
    translationKey: 'RESOURCES.BESLENME.BESIN_ALERJILERI',
  },

  // Uyku
  { categoryKey: 'uyku', resourceKey: 'uyku-duzeni', translationKey: 'RESOURCES.UYKU.UYKU_DUZENI' },
  { categoryKey: 'uyku', resourceKey: '0-3-ay-uyku', translationKey: 'RESOURCES.UYKU.UC_AY' },
  { categoryKey: 'uyku', resourceKey: '3-6-ay-uyku', translationKey: 'RESOURCES.UYKU.UC_ALTI_AY' },
  {
    categoryKey: 'uyku',
    resourceKey: '6-12-ay-uyku',
    translationKey: 'RESOURCES.UYKU.ALTI_ONIKI_AY',
  },
  { categoryKey: 'uyku', resourceKey: '1-3-yas-uyku', translationKey: 'RESOURCES.UYKU.BIR_UC_YAS' },
  {
    categoryKey: 'uyku',
    resourceKey: 'uyku-egitimi',
    translationKey: 'RESOURCES.UYKU.UYKU_EGITIMI',
  },
  {
    categoryKey: 'uyku',
    resourceKey: 'uyku-sorunlari',
    translationKey: 'RESOURCES.UYKU.UYKU_SORUNLARI',
  },
  {
    categoryKey: 'uyku',
    resourceKey: 'gece-uyanmalari',
    translationKey: 'RESOURCES.UYKU.GECE_UYANMALARI',
  },
  { categoryKey: 'uyku', resourceKey: 'uyku-ortami', translationKey: 'RESOURCES.UYKU.UYKU_ORTAMI' },
  {
    categoryKey: 'uyku',
    resourceKey: 'gunduz-uykusu',
    translationKey: 'RESOURCES.UYKU.GUNDUZ_UYKUSU',
  },

  // Genel Bilgiler
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'yenidogan-bakimi',
    translationKey: 'RESOURCES.GENEL_BILGILER.YENIDOGAN_BAKIMI',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'dis-bakim',
    translationKey: 'RESOURCES.GENEL_BILGILER.DIS_BAKIM',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'tuvalet-egitimi',
    translationKey: 'RESOURCES.GENEL_BILGILER.TUVALET_EGITIMI',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'okula-hazirlik',
    translationKey: 'RESOURCES.GENEL_BILGILER.OKULA_HAZIRLIK',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'ergenlik',
    translationKey: 'RESOURCES.GENEL_BILGILER.ERGENLIK',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'guvenlik',
    translationKey: 'RESOURCES.GENEL_BILGILER.GUVENLIK',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'oyun-aktivite',
    translationKey: 'RESOURCES.GENEL_BILGILER.OYUN_AKTIVITE',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'ekran-suresi',
    translationKey: 'RESOURCES.GENEL_BILGILER.EKRAN_SURESI',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'sosyal-gelisim',
    translationKey: 'RESOURCES.GENEL_BILGILER.SOSYAL_GELISIM',
  },
  {
    categoryKey: 'genel-bilgiler',
    resourceKey: 'dil-gelisimi',
    translationKey: 'RESOURCES.GENEL_BILGILER.DIL_GELISIMI',
  },

  // Aile Medya Planı
  {
    categoryKey: 'aile-medya-plani',
    resourceKey: 'medya-plani',
    translationKey: 'RESOURCES.AILE_MEDYA_PLANI.MEDYA_PLANI',
  },
  {
    categoryKey: 'aile-medya-plani',
    resourceKey: 'ekran-suresi-rehberi',
    translationKey: 'RESOURCES.AILE_MEDYA_PLANI.EKRAN_SURESI_REHBERI',
  },
  {
    categoryKey: 'aile-medya-plani',
    resourceKey: 'dijital-guvenlik',
    translationKey: 'RESOURCES.AILE_MEDYA_PLANI.DIJITAL_GUVENLIK',
  },
  {
    categoryKey: 'aile-medya-plani',
    resourceKey: 'sosyal-medya',
    translationKey: 'RESOURCES.AILE_MEDYA_PLANI.SOSYAL_MEDYA',
  },
  {
    categoryKey: 'aile-medya-plani',
    resourceKey: 'oyun-bagimliligi',
    translationKey: 'RESOURCES.AILE_MEDYA_PLANI.OYUN_BAGIMLILIGI',
  },

  // Gebelik Dönemi
  {
    categoryKey: 'gebelik-donemi',
    resourceKey: 'gebelik-takibi',
    translationKey: 'RESOURCES.GEBELIK_DONEMI.GEBELIK_TAKIBI',
  },
  {
    categoryKey: 'gebelik-donemi',
    resourceKey: 'doguma-hazirlik',
    translationKey: 'RESOURCES.GEBELIK_DONEMI.DOGUMA_HAZIRLIK',
  },
  {
    categoryKey: 'gebelik-donemi',
    resourceKey: 'emzirme',
    translationKey: 'RESOURCES.GEBELIK_DONEMI.EMZIRME',
  },
  {
    categoryKey: 'gebelik-donemi',
    resourceKey: 'bebek-bakimi',
    translationKey: 'RESOURCES.GEBELIK_DONEMI.BEBEK_BAKIMI',
  },
  {
    categoryKey: 'gebelik-donemi',
    resourceKey: 'dogum-sonrasi',
    translationKey: 'RESOURCES.GEBELIK_DONEMI.DOGUM_SONRASI',
  },
];

/**
 * Get translation key for a resource
 */
export function getResourceTranslationKey(categoryKey: string, resourceKey: string): string {
  const mapping = RESOURCE_TRANSLATION_KEYS.find(
    (m) => m.categoryKey === categoryKey && m.resourceKey === resourceKey
  );

  if (mapping) {
    return mapping.translationKey;
  }

  // Fallback to dynamic key generation if not found
  console.warn(`No static translation key found for ${categoryKey}/${resourceKey}`);
  return `RESOURCES.${categoryKey.toUpperCase().replace(/-/g, '_')}.${resourceKey.toUpperCase().replace(/-/g, '_')}`;
}

/**
 * Get all translation keys for validation
 */
export function getAllResourceTranslationKeys(): string[] {
  return RESOURCE_TRANSLATION_KEYS.map((m) => m.translationKey);
}
