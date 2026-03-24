import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cashpark.waylern',
  appName: 'CashPark WayLern',
  webDir: 'out',
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
  },
  plugins: {
    Browser: {
      toolbarColor: '#0d1b2a',
    },
    App: {
      scheme: 'waypark',
      hostname: 'localhost',
    },
  },
};

export default config;
