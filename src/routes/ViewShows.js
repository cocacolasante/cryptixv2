import React from 'react'
import { useState, useEffect } from 'react'
import {ethers} from "ethers"
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"


const ViewShows = () => {
    const [allShows, setAllShows] = useState()

    const returnAllShows = async () =>{
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereum)

        const CreateShowContract = new ethers.Contract(CREATE_SHOW_ADDRESS, createContractAbi.abi, provider)

        const currentShowNum = await CreateShowContract.showNumber()
        
        let output = []
        for(let i = 1; i < currentShowNum; i++){
            const show = await CreateShowContract.allShows(i)

            const returnedShow = {
                showNumber: i,
                bandAddress: show.band,
                venueAddress: show.venue,
                ticketAddress: show.ticketAddress,
                escrowAddress: show.escrowAddress,
                // image: await _getTicketNFTImage(show.ticketAddress)
            }

            output.push(returnedShow)

            setAllShows(output)

        }
        console.log(output)
    }

    const mapShowsToCards = () =>{
        allShows.map((i)=>{
            return(
                <div>
                    <h3>{i["showNumber"]}</h3>
                    <h3>{i["bandAddress"]}</h3>
                    <h3>{i["venueAddress"]}</h3>
                    <h3>{i["ticketAddress"]}</h3>

                </div>
            )
        })
    }

    // get ticket contract then base uri
    // WORK ON THIS TOMORROW
    const _getTicketNFTImage = async (ticketAddress) =>{

        const {ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum)
        const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, provider)

        let ticketUri = await TicketContract.baseUri()
        ticketUri = ticketUri.toString()

        let response = await fetch(ticketUri)
        console.log(response)

        
    }

    useEffect(()=>{
        returnAllShows()
    },[])


  return (
    <div>
        <div>
            <h2>View Shows</h2>
        </div>
        <div>
        {!allShows ? <p>Loading Blockchain Data</p> :( allShows.map((i)=>{
            console.log(i)
            return(
                <div>
                    <h3>{i["showNumber"]}</h3>
                    <h3>{i["bandAddress"]}</h3>
                    <h3>{i["venueAddress"]}</h3>
                    <h3>{i["ticketAddress"]}</h3>

                </div>
            )
        })) }
           
        </div>
        <button onClick={_getTicketNFTImage} >test</button>
    </div>
  )
}

export default ViewShows