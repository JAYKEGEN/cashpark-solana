"use client";

import { SolanaProvider } from "@solana/react-hooks";
import { PropsWithChildren, useMemo } from "react";
import { autoDiscover, createClient } from "@solana/client";

// --- IMPORTS DEL ADAPTADOR CLÁSICO (Para que el botón funcione) ---
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
// ------------------------------------------------------------------

const client = createClient({
  endpoint: "https://api.devnet.solana.com",
  walletConnectors: autoDiscover(),
});

export function Providers({ children }: PropsWithChildren) {
  // Configuramos la red para el proveedor clásico
  const endpoint = "https://api.devnet.solana.com";
  
  // Las wallets modernas (Phantom, Solflare) ya se autodescubren solas,
  // por lo que este arreglo puede ir vacío.
  const wallets = useMemo(() => [], []); 

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