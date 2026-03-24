import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cashpark.waylern',
  appName: 'CashPark WayLern',
  webDir: 'out',
  // 👇 ELIMINAMOS EL BLOQUE SERVER PARA LA VERSIÓN FINAL 👇
  plugins: {
    Browser: {
      toolbarColor: '#0d1b2a',
    },
    App: {
      scheme: 'waypark',
    },
  },
};

export default config;