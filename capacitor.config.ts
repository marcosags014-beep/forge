import type { CapacitorConfig } from '@capacitor/cli'

const isProd = process.env.NODE_ENV === 'production'

const config: CapacitorConfig = {
  appId: 'app.forge.lifeOS',
  appName: 'FORGE',
  webDir: 'out',
  // In production the native shell loads the live Vercel URL
  // In dev it loads from localhost
  server: isProd
    ? { url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://forge-life.vercel.app', cleartext: false }
    : { url: 'http://localhost:3001', cleartext: true },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#f97316',
    },
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#09090b',
    // HealthKit entitlement required in Xcode → Signing & Capabilities
  },
  android: {
    backgroundColor: '#09090b',
  },
}

export default config
