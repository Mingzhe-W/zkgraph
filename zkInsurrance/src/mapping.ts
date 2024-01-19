//@ts-ignore
import { Address, BigInt, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString('0x7169D38820dfd117C3FA1f22a697dBA58d90BA06');
let esig_sync = Bytes.fromHexString("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");

export function handleBlocks(blocks: Block[]): Bytes {

  let eventsByAcctEsig: Event[] = blocks[0].account(addr).eventsByEsig(esig_sync)

  // require match event count > 0
  require(eventsByAcctEsig.length > 0)


  let event = eventsByAcctEsig[0];
  let eventData = changetype<Bytes>(event.data);

  //let insuree: Address = Address.fromBytes(eventData.slice(0,32));
  // it was commented out because it was not used for this graph
  let amount: BigInt = BigInt.fromBytes(eventData.slice(64,96));
  
  // some logic to check if insuree address match with the user offchain input.
  // to be added 
  // some other policy to be added for insurance eligibility check
  // check if insuree == user.
  // check if insuree.eligible 
  // and so on, you name it

  // some other insurance policy may apply.  


  // Deductable differnt from insurrance policy, 
  let deductable = BigInt.fromI32(100); 
  var indemnity =  BigInt.fromI32(0);


  // Determine the amount of indemnity
  if(amount.minus(deductable).gt(0)){
    indemnity = amount.minus(deductable);
  }
  else{
    indemnity = BigInt.fromI32(0);
  }

  //return payload = indemnity + address of insuree
  let payload = Bytes.fromHexString(indemnity.toString(16)).padStart(32, 0).concat(eventData.slice(0,32));
  return Bytes.fromByteArray(payload);
}
