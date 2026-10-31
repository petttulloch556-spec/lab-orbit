<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import MobileHeader from './components/MobileHeader.vue'
import MobileNavBar from './components/MobileNavBar.vue'
import FeedbackHost from './components/FeedbackHost.vue'
import NoticeScanBanner from './components/NoticeScanBanner.vue'
import ForecastAtmosphere from './components/ForecastAtmosphere.vue'
import MidAutumnMooncakes from './components/MidAutumnMooncakes.vue'
import NationalDayCelebration from './components/NationalDayCelebration.vue'
import SystemTutorialModal from './components/SystemTutorialModal.vue'
import DemoModeBanner from './components/DemoModeBanner.vue'
import { enterPage, leavePage } from './composables/motion'
import { usePresence } from './composables/usePresence'
import { useTutorial } from './composables/useTutorial'
import { authApi } from './api/client'
import { isDemoMode } from './mock/isDemo'

usePresence()

const route = useRoute()
const showNavbar = computed(() => !['/login', '/quick-share', '/setup'].includes(route.path))
const isHome = computed(() => route.path === '/')
const isAssistant = computed(() => route.path === '/assistant')
const isDemo = computed(() => isDemoMode())
const isExcludedRoute = computed(() => ['/setup', '/login', '/quick-share'].includes(route.path))

const isPinned = ref(localStorage.getItem('sidebar_pinned') === 'true')

const { openTutorial, closeTutorial } = useTutorial()
let hasCheckedTutorial = false

async function checkTutorialEligibility() {
  const token = localStorage.getItem('labhub_token')
  if (!token || route.path === '/setup' || route.path === '/login' || route.path === '/quick-share') return

  if (hasCheckedTutorial) return
  try {
    const u = await authApi.getMe()
    if (u && !u.tutorial_completed && !u.is_tutorial_completed) {
      hasCheckedTutorial = true
      openTutorial({ role: u.role, mandatory: true })
    }
  } catch {}
}

watch(() => route.path, (to, from) => {
  isPinned.value = localStorage.getItem('sidebar_pinned') === 'true'
  if (to === '/setup' || to === '/login' || to === '/quick-share') {
    closeTutorial()
  } else {
    checkTutorialEligibility()
  }
}, { immediate: true })

function onUpdatePinned(val) {
  isPinned.value = val
  localStorage.setItem('sidebar_pinned', String(val))
}
</script>

<template>
  <div class="app-shell" :class="{ 'is-home': isHome, 'has-sidebar': showNavbar, 'sidebar-collapsed': !isPinned && showNavbar }">
    <ForecastAtmosphere />
    <MidAutumnMooncakes />
    <NationalDayCelebration />
    <a href="#main-content" class="skip-link">跳到主要内容</a>
    <MobileHeader v-if="showNavbar" />
    <Navbar v-if="showNavbar" :pinned="isPinned" @update:pinned="onUpdatePinned" />
    <main id="main-content" :class="!showNavbar ? 'public-workspace' : (isHome ? 'home-workspace' : (isAssistant ? 'assistant-workspace' : 'workspace'))">
      <router-view v-slot="{ Component }">
        <Transition :css="false" mode="out-in" @enter="enterPage" @leave="leavePage">
          <KeepAlive include="AssistantView">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </Transition>
      </router-view>
    </main>
    <MobileNavBar v-if="showNavbar" />
    <FeedbackHost />
    <NoticeScanBanner />
    <SystemTutorialModal />
    <DemoModeBanner v-if="isDemo && !isExcludedRoute" />
  </div>
</template>

<style>
.skip-link { 
  position: fixed; 
  top: -60px; 
  left: 20px; 
  background: var(--accent); 
  color: #ffffff; 
  padding: 10px 20px; 
  z-index: 200; 
  border-radius: 9999px; 
  font-weight: 500; 
  font-size: 13px; 
}
.skip-link:focus { top: 12px; }
.home-workspace { width: 100%; min-width: 0; }
.assistant-workspace {
  width: 100%;
  height: 100vh;
  max-width: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

</style>
