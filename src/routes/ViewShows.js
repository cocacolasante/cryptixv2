import React from 'react'
import { useState, useEffect } from 'react'
import { create as ipfsClient} from "ipfs-http-client"
import {ethers} from "ethers"
import env from "react-dotenv";
import { Buffer } from "buffer";
import CREATE_SHOW_ADDRESS from '../addresses/createShow'
import createContractAbi from "../abiAssets/createContractAbi.json"
import ticketAbi from "../abiAssets/ticketAbi.json"


const auth =
  'Basic ' + Buffer.from(env.PROJECT_ID + ':' + env.PROJECT_CODE).toString('base64');

const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
        },
    });

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

    const buyTickets = async (e, ticketAddress) =>{
        e.preventDefault()
        try{
            const {ethereum} = window;
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            const TicketContract = new ethers.Contract(ticketAddress, ticketAbi.abi, signer)

            let baseURI = await TicketContract.baseUri()
            let ticketNumber = await TicketContract._tokenIds()


            let result = client.add(JSON.stringify({Band: e["bandAddress"], Venue: e["venueAddress"], TicketNumber: ticketNumber, image: baseURI  }))


        }catch(error){
            console.log(error)
        }
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
                    <button value={i} onClick={e=>buyTickets(e.target.value, i["ticketAddress"])} >Buy Ticket</button>

                </div>
            )
        })) }
           
        </div>
        <button onClick={_getTicketNFTImage} >test</button>
    </div>
  )
}

export default ViewShows