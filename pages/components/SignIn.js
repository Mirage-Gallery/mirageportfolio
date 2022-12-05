import * as React from 'react'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import styles from '../../styles/Home.module.css';

export default function SignInButton() {
  const [state, setState] = React.useState({})
 
  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
      setState((x) => ({ ...x, nonce }))
    } catch (error) {
      setState((x) => ({ ...x, error: error }))
    }
  }
 
  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce()
  }, [])
 
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
 
  const signIn = async () => {
    try {
      const chainId = chain?.id
      if (!address || !chainId) return
 
      setState((x) => ({ ...x, loading: true }))
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to Mirage Gallery.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
 
      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')
 
      setState((x) => ({ ...x, loading: false }))
      onSuccess({ address })
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }))
      fetchNonce()
    }
  }
 
  return (<button style={{marginLeft: '1rem'}} className={styles.button} disabled={!state.nonce || state.loading} onClick={signIn}>Create Portfolio</button>)
}