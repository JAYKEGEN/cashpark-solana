"use client";

import { SolanaProvider } from "@solana/react-hooks";
import { PropsWithChildren, useMemo } from "react";
import { autoDiscover, createClient } from "@solana/client";

// --- IMPORTS DEL ADAPTADOR CLÁSICO (Para que el botón funcione) ---
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// ------------------------------------------------------------------

const client = createClient({
  endpoint: "https://api.devnet.solana.com",
  walletConnectors: autoDiscover(),
});

export function Providers({ children }: PropsWithChildren) {
  // Configuramos la red para el proveedor clásico
  const endpoint = "https://api.devnet.solana.com";

  // Wallet list para Wallet Adapter (incluye Phantom y fallback móvil)
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SolletWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SlopeWalletAdapter(),
    new TorusWalletAdapter(),
  ], []);

  return (
    <SolanaProvider client={client}>
      {/* Envolvemos la app con los conectores clásicos */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </SolanaProvider>
  );
}