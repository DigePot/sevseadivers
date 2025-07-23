import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

i18n
  // Use i18next-http-backend to load translations from your public folder
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: "en",
    // Supported languages
    supportedLngs: ["en", "so"],
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      // Path where translations are stored
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })

export default i18n
