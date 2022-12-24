import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import {Link } from "react-router-dom"

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
    <div>
        <div className='logo-div'>
            Logo
        </div>

        <div className='navbar-div'>
            <div >
                <ul className='router-links'>
                    <Link to="/" className='router-link'>Home</Link>
                    <Link to="/browse" className='router-link'>Browse Shows</Link>
                    <Link to="/manageshows" className='router-link'>Manage Tickets/Shows</Link>
                    <Link to='/createshow' className='router-link'>Create Show</Link>
                    <Link to='/profile' className='router-link'>Profile</Link>
                </ul>
            </div>
            <div>
            {!activeAccount ? <button onClick={connectWallet}>Connect Wallet</button> : <p>{activeAccount.slice(0, 6)}...{activeAccount.slice(-4)} </p>}

            </div>
        </div>
        <Outlet />
    </div>
  )
}

export default Navbar