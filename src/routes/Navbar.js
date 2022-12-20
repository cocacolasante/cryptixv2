import React from 'react'
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [activeAccount, setActiveAccount] = useState()

    const connectWallet = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("please install metamask")
                return;
            }
            const accounts = await ethereum.request({method:"eth_requestAccounts"})
            const account = accounts[0]
            setActiveAccount(account)


        }catch(error){
            console.log(error)
        }
    }
    
    const checkIfWalletIsConnected = async () =>{
        try{
            const {ethereum} = window;
            if(!ethereum){
                alert("Please install metamask")
                return;
            }else{
                console.log("Ethereum Detected")

            }
            const accounts = await ethereum.request({method: "eth_accounts"})
            if(accounts.length !== 0 ){
                setActiveAccount(accounts[0]);
                console.log(`connected to ${activeAccount}`)

            }


        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])


  return (
    <div className='navbar-div'>
    {!activeAccount ? <button onClick={connectWallet}>Connect Wallet</button> : <p>{activeAccount.slice(0, 6)}...{activeAccount.slice(-4)} </p>}
        
    </div>
  )
}

export default Navbar