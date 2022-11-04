import { useAccount, useSignMessage } from "wagmi";
import React from "react";

function AdditionalUiComponent({imgData}) {
    const {address: tokenAddress, id : tokenId} =  imgData;

    const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
        async onSuccess(data, variables) {
          const response = await fetch(`/api/hideItem`, {
              method: 'POST',
              cache: 'no-cache',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                message: variables.message,
                signedMessage: data
              }) 
          })
          const json = await response.json();
        },
      })
    
    async function send(){
        console.log(tokenAddress, tokenId)
        const content = [tokenAddress, tokenId].join(':');
        signMessage({message: content})
    }

      
    return (
        <div>
            <button
                onClick={() => send?.()}
                className={'button'}
                style={{
                    backgroundColor: '#ff4300',
                    color: '#fafafa',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    padding: '1rem',
                }}
            > Hide From Profile</button>
        </div>
    );
}
export default AdditionalUiComponent;
