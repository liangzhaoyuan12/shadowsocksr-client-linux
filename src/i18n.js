import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import zhTW from './locales/zh-TW'
import zhHK from './locales/zh-HK'
import jaJP from './locales/ja-JP'
import koKR from './locales/ko-KR'
import ruRU from './locales/ru-RU'

const STORAGE_KEY = 'ssr-client-language'

// Get system language or default to English
const getSystemLanguage = () => {
  // First check if user has a saved preference
  const savedLang = localStorage.getItem(STORAGE_KEY)
  if (savedLang && ['zh-CN', 'zh-TW', 'zh-HK', 'en-US', 'ja-JP', 'ko-KR', 'ru-RU'].includes(savedLang)) {
    return savedLang
  }

  // Otherwise detect system language
  const lang = navigator.language || 'en-US'
  if (lang.startsWith('zh')) {
    if (lang.includes('TW') || lang.includes('tw')) {
      return 'zh-TW'
    } else if (lang.includes('HK') || lang.includes('hk')) {
      return 'zh-HK'
    } else {
      return 'zh-CN'
    }
  }
  if (lang.startsWith('ja')) {
    return 'ja-JP'
  }
  if (lang.startsWith('ko')) {
    return 'ko-KR'
  }
  if (lang.startsWith('ru')) {
    return 'ru-RU'
  }
  return 'en-US'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getSystemLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'zh-TW': zhTW,
    'zh-HK': zhHK,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'ru-RU': ruRU
  }
})

export default i18n
export { STORAGE_KEY }
