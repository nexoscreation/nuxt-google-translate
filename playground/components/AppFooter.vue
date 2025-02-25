<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpenIcon, GithubIcon, LifeBuoyIcon, HeartIcon } from 'lucide-vue-next'
import { useRouter } from '#imports'

const router = useRouter()
const currentYear = computed(() => new Date().getFullYear())

const footerLinks = [
  { name: 'Documentation', href: 'https://www.nexoscreation.tech/docs/resources/google-translate', icon: BookOpenIcon },
  { name: 'GitHub', href: 'https://github.com/nexoscreation/nuxt-google-translate', icon: GithubIcon },
  { name: 'Support', href: 'https://discord.com/invite/8Hbh5Y9CMd', icon: LifeBuoyIcon },
]

const showHeartbeat = ref(false)

const animateHeart = () => {
  showHeartbeat.value = true
  setTimeout(() => {
    showHeartbeat.value = false
  }, 1000)
}

const isExternalLink = (href: string) => href.startsWith('http')

const handleNavigation = (href: string) => {
  if (isExternalLink(href)) {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  else {
    router.push(href)
  }
}
</script>

<template>
  <footer class="notranslate">
    <div class="footer-content">
      <div class="footer-left">
        <p class="copyright">
          &copy; {{ currentYear }} Nexos Creation
          <HeartIcon
            class="heart-icon"
            :class="{ heartbeat: showHeartbeat }"
            @click="animateHeart"
          />
        </p>
        <p class="tagline">
          Build with Nuxt and Google Translate
        </p>
      </div>
      <nav class="footer-nav">
        <button
          v-for="link in footerLinks"
          :key="link.name"
          class="nav-link"
          :aria-label="link.name"
          @click="handleNavigation(link.href)"
        >
          <component
            :is="link.icon"
            class="nav-icon"
          />
          <span>{{ link.name }}</span>
        </button>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: relative;
  z-index: 50;
  background: hsla(224, 41%, 7%, 0.8);
  backdrop-filter: blur(8px);
  border-top: 2px solid hsla(224, 0%, 100%, 0.1);
  padding: 2rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer-left {
  flex: 1;
  min-width: 200px;
}

.copyright {
  font-size: 0.9rem;
  color: hsla(224, 0%, 100%, 0.9);
  margin: 0;
  display: flex;
  align-items: center;
}

.heart-icon {
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
  color: hsl(355, 100%, 64%);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.heart-icon.heartbeat {
  animation: heartbeat 1s ease-in-out;
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }
}

.tagline {
  font-size: 0.8rem;
  color: hsla(224, 0%, 100%, 0.6);
  margin: 0.5rem 0 0 0;
}

.footer-nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: hsla(224, 0%, 100%, 0.6);
  text-decoration: none;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.nav-link:hover,
.nav-link:focus {
  color: hsl(155, 100%, 43%);
  background: hsla(0, 0%, 100%, 0.1);
  outline: none;
}

.nav-icon {
  width: 16x;
  height: 16px;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-nav {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-nav {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
