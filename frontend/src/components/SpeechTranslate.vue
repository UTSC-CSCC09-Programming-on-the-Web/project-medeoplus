<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Live Speech Translator</h1>

    <!-- Language Selector -->
    <label class="block mb-2 text-sm font-semibold">Target Language:</label>
    <select v-model="targetLang" class="mb-4 p-2 border rounded">
      <option v-for="lang in languages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>

    <!-- Start Listening Button -->
    <button
      @click="startListening"
      :disabled="isListening"
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {{ isListening ? 'Listening...' : 'Start Listening' }}
    </button>

    <!-- Display Original and Translated Text -->
    <div class="mt-4">
      <p><strong>Original:</strong> {{ transcript }}</p>
      <p><strong>Translated ({{ targetLang }}):</strong> {{ translated }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transcript = ref('')
const translated = ref('')
const isListening = ref(false)
const targetLang = ref('es') // Default to Spanish
const baseUrl = 'http://localhost:3000/api/translate' // Adjust as needed
const errorMessage = ref('')
let recognition

// Language options
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
]

const startListening = () => {
  if (!recognition) return
  errorMessage.value = ''
  isListening.value = true
  transcript.value = ''
  
  try {
    recognition.start()
  } catch (error) {
    console.error('Recognition start error:', error)
    errorMessage.value = 'Failed to start speech recognition'
    isListening.value = false
  }
}

onMounted(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('Web Speech API not supported in this browser.')
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1
  
  // Add timeout to prevent hanging
  setTimeout(() => {
    if (isListening.value) {
      recognition.stop()
      errorMessage.value = 'Speech recognition timed out. Please try again.'
    }
  }, 10000) // 10 second timeout

  recognition.onresult = async (event) => {
    transcript.value = event.results[0][0].transcript
    isListening.value = false

    // Translate using selected language
    const res = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcript.value, to: targetLang.value })
    })

    const data = await res.json()
    translated.value = data.translated
  }

  recognition.onerror = (e) => {
    console.error('STT Error:', e.error)
    isListening.value = false
    
    switch(e.error) {
      case 'network':
        errorMessage.value = 'Network error: Speech recognition service unavailable. Try again in a moment.'
        break
      case 'not-allowed':
        errorMessage.value = 'Microphone access denied. Please allow microphone access and try again.'
        break
      case 'no-speech':
        errorMessage.value = 'No speech detected. Please speak clearly and try again.'
        break
      case 'audio-capture':
        errorMessage.value = 'Audio capture failed. Check your microphone and try again.'
        break
      case 'service-not-allowed':
        errorMessage.value = 'Speech recognition service not allowed. Check browser settings.'
        break
      case 'aborted':
        errorMessage.value = 'Speech recognition was aborted.'
        break
      default:
        errorMessage.value = `Speech recognition error: ${e.error}`
    }
  }

  recognition.onend = () => {
    isListening.value = false
  }
})
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
