//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event, BigInt} from "@hyperoracle/zkgraph-lib";


// this graph listen to event on a sepolia testnet (toy) contract that i created to get the conversion ratio of ETH and BTC
// This ratio can be a indicator to buy/sell ETH or BTC at some certain point. 
// Can be used for trading strategy, potentially 

function conversionRatio(priceEvent: Event): BigInt {
  // calculate the ETH/BTC conversion rate for trading strategy 
  // got ETH price and BTC price from the equiped demo-only smart contract 
  // In real use case it can be any pair of currency being traded.
  // contract address 0x4137376d8214EB47Df1190659640382eEe153BE7
  // run with zkgraph exec 5110071   
  
  const priceData = changetype<Bytes>(priceEvent.data)
  const ethPrice =  BigInt.fromBytes(priceData.slice(0,32));
  const btcPrice = BigInt.fromBytes(priceData.slice(32,64));

  //calculate and return the conversion ratio for later usage
  return btcPrice.div(ethPrice); 
}
export function handleBlocks(blocks: Block[]): Bytes {

  let events = blocks[0].events;

  if(events.length != 0){
    let lastPriceEvent =  (blocks[0].events)[0];
    let B2Eratio =  conversionRatio(lastPriceEvent);

    return Bytes.fromHexString(B2Eratio.toString(16)).padStart(32, 0);
    // When run with blocknumber 5110071, should return 0x10, or 16 in Decimal. The exact number should be 41165.89/2446.7874 = 16.824465... 
    // I haven't figured out a way to work with float. Looks like I can use the WebAssebmly's math library, but the documentation advice aginst it
    // as they are not ZK friendly.
  }
  else{
    require(false);
    return Bytes.empty(); // learned this technique to omit compile error from template lol 
  }


}


