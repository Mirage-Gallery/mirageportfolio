import React from "react";

const URL = process.env.NEXT_PUBLIC_URL;

function UserAdminUi({imgData}) {
    const {address: tokenAddress , id : tokenId, hidden} =  imgData || { address : ''}

    async function sendAction(data) {
        const response = await fetch(`${URL}/api/${data.endPoint}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...data.data
            }) 
        })
        const json = await response.json();
    }
      
    async function hide(){
        sendAction({
            data: {
                tokenAddress,
                tokenId
            },
            endPoint: `hideItem`
        })
    }

    async function unhide(){
        sendAction({
            data: {
                tokenAddress,
                tokenId
            },
            endPoint: `showItem`,
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
export default UserAdminUi;
