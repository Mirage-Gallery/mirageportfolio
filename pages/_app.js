import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { defaultChains, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { createTheme, ThemeProvider } from "@mui/material/styles";

const {provider, chains} = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider()
]);


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
