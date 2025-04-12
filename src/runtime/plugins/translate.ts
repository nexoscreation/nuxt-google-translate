import { ref, readonly } from 'vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

/**
 * Configuration interface for Google Translate Element
 * @interface GoogleTranslateConfig
 * @property {string} pageLanguage - The default language of the page
 * @property {string} [includedLanguages] - Comma-separated list of supported languages
 * @property {string} layout - The layout style of the translate widget
 * @property {boolean} autoDisplay - Whether to automatically display the widget
 */
interface GoogleTranslateConfig {
  pageLanguage: string
  includedLanguages?: string
  layout: string
  autoDisplay: boolean
}

/**
 * Extend Window interface to include Google Translate types
 */
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new(config: GoogleTranslateConfig, elementId: string): void
          InlineLayout: {
            SIMPLE: string
            HORIZONTAL: string
            VERTICAL: string
          }
        }
      }
    }
    googleTranslateElementInit?: () => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Get configuration from Nuxt runtime config
  const config = useRuntimeConfig()
  const options = config.public.googleTranslate

  // Initialize state variables
  const defaultLanguage = options?.defaultLanguage ?? 'en'
  const supportedLanguages = options?.supportedLanguages ?? ['en']
  const activeLanguage = ref(defaultLanguage)
  // Read from googtrans cookie on init (client-side only)
  if (import.meta.client) {
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='))
      ?.split('=')[1]
      ?.split('/')[2] // gets the target language from '/en/gu'

    if (cookieLang && supportedLanguages.includes(cookieLang)) {
      activeLanguage.value = cookieLang
    }
  }

  const isLoaded = ref(false)

  /**
   * Sets the active language and updates the Google Translate widget
   * @param {string} lang - The language code to set
   */
  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang) && lang !== activeLanguage.value) {
      activeLanguage.value = lang
      updateGoogleTranslate(lang)

      // Set googtrans cookie
      if (import.meta.client) {
        document.cookie = `googtrans=/en/${lang};path=/;`
      }
    }
    else {
      console.warn(`[nuxt-google-translate] Unsupported language: ${lang}.`)
    }
  }

  /**
   * Updates the Google Translate widget to the specified language
   * Only runs on client-side and when the widget is loaded
   * @param {string} lang - The language code to update to
   */
  const updateGoogleTranslate = (lang: string) => {
    if (!import.meta.client || !isLoaded.value) return

    // Find the Google Translate iframe
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = lang
      select.dispatchEvent(new Event('change'))
    }
  }

  /**
   * Initializes the Google Translate widget
   */
  const initializeGoogleTranslate = () => {
    if (!window.google?.translate?.TranslateElement) return

    new window.google.translate.TranslateElement(
      {
        pageLanguage: defaultLanguage,
        includedLanguages: supportedLanguages.join(','),
        layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
        autoDisplay: false,
      },
      'nuxt_translate_element',
    )
    isLoaded.value = true
    updateGoogleTranslate(activeLanguage.value)
  }

  /**
   * Loads the Google Translate script dynamically
   * Only runs once on client-side when the widget hasn't been loaded
   */
  const loadGoogleTranslate = () => {
    if (!import.meta.client || isLoaded.value) return

    // Check if Google Translate is already loaded
    if (window.google?.translate?.TranslateElement) {
      initializeGoogleTranslate()
      return
    }
    if (document.querySelector('#google-translate-script')) return

    // Define `googleTranslateElementInit` BEFORE loading the script
    window.googleTranslateElementInit = initializeGoogleTranslate

    // Create and append the Google Translate script
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.defer = true

    script.onload = initializeGoogleTranslate // Ensure it's initialized when loaded
    script.onerror = () => console.error('[nuxt-google-translate] Failed to load Google Translate script.')

    document.body.appendChild(script)
  }

  // Load Google Translate when the app is mounted (client-side only)
  if (import.meta.client) {
    nuxtApp.hook('app:mounted', () => {
      loadGoogleTranslate()
    })
  }

  // Provide the translation functionality to the app
  return {
    provide: {
      googleTranslate: {
        activeLanguage: readonly(activeLanguage),
        supportedLanguages: readonly(supportedLanguages),
        setLanguage,
        isLoaded: readonly(isLoaded),
      },
    },
  }
})
