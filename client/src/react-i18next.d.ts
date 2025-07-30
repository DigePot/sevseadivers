// import the original type declarations
import "react-i18next"
// import all namespaces (for the default language, only)
import translation from "../public/locales/en/translation.json"

declare module "react-i18next" {
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "translation"
    // custom resources type
    resources: {
      translation: typeof translation
    }
  }
}
