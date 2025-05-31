import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

// Define fallback translations for debugging
interface TranslationResource {
  [language: string]: {
    [namespace: string]: {
      app: {
        title: string
        description: string
        noNodes: string
        nodeList: {
          title: string
          id: string
          type: string
          category: string
          inputs: string
          outputs: string
        }
        nodeStats: {
          title: string
          totalNodes: string
          uniqueNodeTypes: string
        }
        footer: {
          clickToHighlight: string
        }
      }
    }
  }
}

const fallbackResources: TranslationResource = {
  en: {
    main: {
      app: {
        title: 'React Example Extension (Fallback)',
        description: 'Shows statistics about nodes in the current workflow',
        noNodes: 'No nodes in the workflow',
        nodeList: {
          title: 'Node List',
          id: 'ID',
          type: 'Type',
          category: 'Category',
          inputs: 'Inputs',
          outputs: 'Outputs'
        },
        nodeStats: {
          title: 'Node Statistics',
          totalNodes: 'Total nodes',
          uniqueNodeTypes: 'Unique node types'
        },
        footer: {
          clickToHighlight:
            'Click on any node in the list to highlight it in the workflow'
        }
      }
    }
  }
}

// Initialize i18next
void i18n
  // Load translations via http backend (must be first!)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Initialize react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Always enable debug mode to see what's happening
    debug: true,

    // Default language
    lng: 'en',

    // Fallback language
    fallbackLng: 'en',

    // Namespace for translations
    ns: ['main'],
    defaultNS: 'main',

    // Do not load from bundled resources first
    initImmediate: true,

    // Custom handling for missing keys
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.log(`Missing translation: [${lng}] ${ns}:${key}`)
    },

    // Backend configuration
    backend: {
      // Path to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Add retry logic
      requestOptions: {
        retry: 3,
        timeout: 3000
      }
    },

    // React specific options
    react: {
      useSuspense: true
    },

    // Allow string formatting for dynamic values
    interpolation: {
      escapeValue: false // Not needed for React as it escapes by default
    }
  })

// Add fallback resources only if HTTP loading fails
i18n.on('failedLoading', (lng, ns) => {
  console.log(
    `Failed loading translation file for ${lng} and ${ns}, using fallback`
  )

  // Add the fallback resources for this language
  if (fallbackResources[lng] && fallbackResources[lng][ns]) {
    i18n.addResourceBundle(lng, ns, fallbackResources[lng][ns], true, true)
  }
})

export default i18n
