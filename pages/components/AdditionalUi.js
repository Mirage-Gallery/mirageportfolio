import { useSignMessage } from "wagmi";
import React from "react";

const URL = process.env.NEXT_PUBLIC_URL;

function AdditionalUiComponent({imgData}) {
    const {address: tokenAddress, id : tokenId, hidden} =  imgData;

    const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
        async onSuccess(data, variables) {
          const response = await fetch(variables.endPoint, {
              method: 'POST',
              cache: 'no-cache',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                message: variables.message,
                signedMessage: data
              }) 
          })
          const json = await response.json();
          console.log(json)
        },
      })
      
    async function hide(){
        const content = [tokenAddress, tokenId].join(':');
        signMessage({
            message: content,
            endPoint: `${URL}/api/hideItem`
        })
    }

    async function unhide(){
        const content = [tokenAddress, tokenId].join(':');
        signMessage({
            message: content,
            endPoint: `${URL}/api/showItem`
        })
    }
      
    return (
        <div>
            { !hidden && (
                <button
                    onClick={() => hide?.()}
                    className={'button'}
                    style={{
                        backgroundColor: '#ff4300',
                        color: '#fafafa',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        padding: '1rem',
                    }}
                > Hide From Profile</button>
            )}
            
            {hidden && (
                <button
                    onClick={() => unhide?.()}
                    className={'button'}
                    style={{
                        backgroundColor: 'rgb(40 186 125)',
                        color: '#fafafa',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        padding: '1rem',
                    }}
                > Show on Profile</button>
            )}

        </div>
    );
}
export default AdditionalUiComponent;
