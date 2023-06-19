const Web3 = require("web3");
const axios = require("axios");
const differenceInMinutes = require("date-fns/differenceInMinutes");
const addMinutes = require("date-fns/addMinutes");
require("dotenv").config();
let appInsights = require('applicationinsights');
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
appInsights.start();
let clientAppInsights = appInsights.defaultClient;


// initialize web3 with a provider
const providerUrl = process.env.PROVIDER_URL; // replace with your Alchemy API key
const provider = new Web3.providers.WebsocketProvider(providerUrl);
const web3 = new Web3(provider);

const contractABI = require("./abi.json");
// replace CONTRACT_ADDRESS and CONTRACT_ABI with your actual contract address and ABI
const contractAddress = process.env.CONTRACT_ADDRESS;
const api_key = process.env.API_KEY;

// create an instance of the contract object
const contract = new web3.eth.Contract(contractABI, contractAddress);

const client = axios.create({
  baseURL: `${process.env.API_BASE}`,
  timeout: 50000,
});

function removeTrailingZeros(number) {
  var str = number.toString(); // Convert the number to a string
  var regex = /0+$/; // Match one or more trailing zeros at the end of the string
  var result = str.replace(regex, ""); // Remove the trailing zeros

  return parseFloat(result); // Convert the resulting string back to a number
}

// listen for the 'vault_cancellation' event
contract.events.vault_cancellation({}, async (error, event) => {
  if (!error) {
    const videoID = event.returnValues.videoID;
    console.log(videoID);
    clientAppInsights.trackTrace({message: `Deleting: ${videoID}`});
    // send videoId to api and delete that stream
    if (videoID) {
      try {
        await client.delete(
          `api/Stream/DeleteStreamByVaultContractId/${videoID}${api_key}`
        );
      } catch (e) {
        clientAppInsights.trackException({exception: new Error(e)});
        console.log(e);
      }
    }
  }
});

contract.events
  .vault_update({}, async (error, event) => {
    if (!error) {
      console.log(event.returnValues);
      const { new_balance, new_lockend, new_lockstart, videoID } =
      event.returnValues;
      clientAppInsights.trackTrace({message: `Editing video: ${videoID}`});
      const balance = removeTrailingZeros(new_balance);
      const lockEnd = addMinutes(new Date(new_lockend * 1000 + 10), 10);
      const lockStart = addMinutes(new Date(new_lockstart * 1000 + 10), 10);
      const duration = differenceInMinutes(lockEnd, lockStart);
      try {
        await client.patch(`api/Stream/UpdateStream/${videoID}${api_key}`, {
          streamStartDate: lockStart.toISOString(),
          streamEndDate: lockEnd.toISOString(),
          cost: balance + "",
          streamDuration: duration + "",
        });
      } catch (e) {
        clientAppInsights.trackException({exception: new Error(e)});
        console.log(e);
      }
      // send videoId to api and delete that stream
    }
  })
  .on("error", console.error);
console.log("Listening to events!");
clientAppInsights.trackTrace({message: "Listening to events!"});
