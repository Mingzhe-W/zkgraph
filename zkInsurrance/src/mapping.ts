//@ts-ignore
import { Address, BigInt, require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString('0x93099130CF054e1B6B61d60deF66ad9c54fF53e7');
let esig_sync = Bytes.fromHexString("0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1");

export function handleBlocks(blocks: Block[]): Bytes {

  let eventsByAcctEsig: Event[] = blocks[0].account(addr).eventsByEsig(esig_sync)

  // require match event count > 0
  require(eventsByAcctEsig.length > 0)


  let event = eventsByAcctEsig[0];
  let eventData = changetype<Bytes>(event.data);

  let insuree: Address = Address.fromBytes(eventData.slice(0,32));
  let amount: BigInt = BigInt.fromBytes(eventData.slice(32,64));

  // some logic to check if insuree address match with the user offchain input.
  // to be added 

  // some other policy to be added for insurance eligibility check
  // check if insuree == user.
  // check if insuree.eligible 

  // some other insurance policy may apply.  

  // Deductable differnt from insurrance policy, 
  let deductable = BigInt.fromI32(100); 
  var indemnity =  BigInt.fromI32(0);

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
