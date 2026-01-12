import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion' // Import the plugin
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(MotionPlugin) // Activate it here

app.mount('#app')