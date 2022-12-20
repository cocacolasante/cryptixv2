import { ethers } from 'ethers'
import React from 'react'
import { useState, useEffect } from 'react'
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"

const CreateShow = () => {
    const [showName, setShowName ] = useState()
    const [showSymbol, setShowSymbol] = useState()
    const [bandAddress, setBandAddress] = useState()
    const [venueAddress, setVenueAddress] = useState()
    const [showDate, setShowDate] = useState()
    const [showPrice, setShowPrice] = useState()



    const createNewShow = async (e) =>{
        e.preventDefault()

        try{

            const {ethereum} = window;
            if(ethereum){

                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
    
                const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, signer )
    
                const tx = await CreateShowContract.createShow(showName, showSymbol, bandAddress, venueAddress, showDate, showPrice)
                

                const receipt = await tx.wait()

                if(receipt.status === 1){
                    console.log("success")
                }else{
                    alert("failed")
                }
            }



        }catch(error){
            console.log(error)
        }
    }
    
    // temporary fix until install redux
    const [ activeAccount, setActiveAccount] = useState();
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
        <div>
            <h1>Create Show</h1>
        </div>
        <div>
            <h2>Show info</h2>
            <p>Show Name: {showName} </p>
            <p>Symbol: {showSymbol} </p>
            <p>Band Address: {bandAddress} </p>
            <p>Venue Address: {venueAddress} </p>
            <p>Show Date: {showDate} </p>
            <p>Show Price: {showPrice} </p>
        </div>
        <div>
            <form>
                <label >Show name</label>
                <input onChange={e=>setShowName(e.target.value)} name="show name" />
                <label >Show Symbol (3 letters)</label>
                <input onChange={e=>setShowSymbol(e.target.value)} name="show name" />
                <label >Band Address</label>
                <input onChange={e=>setBandAddress(e.target.value)} name="show name" />
                <label >Venue Address</label>
                <input onChange={e=>setVenueAddress(e.target.value)} name="show name" />
                <label >Show Date </label>
                <input onChange={e=>setShowDate(e.target.value)} name="show name" />

                <label >Ticket Price </label>
                <input onChange={e=>setShowPrice(e.target.value)} name="show name" />

                <button onClick={e=>createNewShow(e)} >Create New Show</button>

                <label >Ticket Picture Upload</label>
                <input type="file" />

            </form>
            
        </div>
    </div>
  )
}

export default CreateShow