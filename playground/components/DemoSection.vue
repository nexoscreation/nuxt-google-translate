<script setup lang="ts">
import { ref, computed } from 'vue'
import { CopyIcon, CheckIcon, RefreshCwIcon } from 'lucide-vue-next'

const isCopied = ref(false)

const sampleTranslatedText = computed(() => ({
  npm: 'npm install nuxt-google-translate',
  yarn: 'yarn add nuxt-google-translate',
  pnpm: 'pnpm add nuxt-google-translate',
  bun: 'bun add nuxt-google-translate',
  nuxi: 'nuxi coming soon!',
  add: '...',
}))

const currentSampleLanguage = ref<keyof typeof sampleTranslatedText.value>('npm')

const changeSampleLanguage = () => {
  const languages = Object.keys(sampleTranslatedText.value)
  const currentIndex = languages.indexOf(currentSampleLanguage.value)
  const nextIndex = (currentIndex + 1) % languages.length
  currentSampleLanguage.value = languages[nextIndex] as keyof typeof sampleTranslatedText.value
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentSampleLanguage.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<template>
  <div class="installation-demo">
    <div
      class="code-block"
      tabindex="0"
      role="button"
      :aria-label="'Sample text in ' + currentSampleLanguage + '. Click to change language.'"
    >
      <code @click="changeSampleLanguage">{{ sampleTranslatedText[currentSampleLanguage] }}</code>
      <button
        class="copy-button"
        :aria-label="isCopied ? 'Copied' : 'Copy to clipboard'"
        @click="copyToClipboard"
      >
        <CopyIcon
          v-if="!isCopied"
          class="icon"
        />
        <CheckIcon
          v-else
          class="icon"
        />
      </button>
    </div>
    <button
      class="change-manager-button"
      @click="changeSampleLanguage"
    >
      <RefreshCwIcon class="icon" />
      Click to see another package manager
    </button>
  </div>
</template>

<style scoped>
.installation-demo {
  margin-bottom: 2rem;
}

.code-block {
  display: flex;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
  background: hsla(0, 0%, 0%, 0.25);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
}

code {
  flex-grow: 1;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  color: #fff;
}

.copy-button,
.change-manager-button {
  background: none;
  border: none;
  color: #00DC82;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.copy-button:hover,
.change-manager-button:hover {
  color: #fff;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.25rem;
}

@media (max-width: 768px) {
  .sample-text {
    font-size: 1.25rem;
  }
}
</style>
