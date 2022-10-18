import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const { chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [infuraProvider({ apiKey: process.env.InfuraApiKey }), publicProvider()]
);
// rainbowkit
const { connectors } = getDefaultWallets({
  appName: "NFTGallery",
  chains,
});
// wagmi
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
// mui theme
const theme = createTheme({
  palette: {
    background: { main: "#1f2225" },
    text: { main: "white" },
  },
  borderRadius: {
    image: "8%",
    modal: "0%",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
