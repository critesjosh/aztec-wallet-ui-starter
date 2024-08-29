import './style.css'
import { AccountWallet, CompleteAddress, ContractDeployer, createDebugLogger, Fr, PXE, waitForPXE, TxStatus, createPXEClient, getContractInstanceFromDeployParams, DebugLogger } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { deriveSigningKey } from '@aztec/circuits.js';


const setupSandbox = async () => {
  const PXE_URL = 'http://localhost:8080';
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  return pxe;
};

try {
  console.log(process.env)
  let pxe = await setupSandbox();
  let accounts = await pxe.getRegisteredAccounts()
  console.log(accounts)
  //let number = await pxe.getBlockNumber()
  console.log(await pxe.getBlockNumber())

  const button = document.createElement('button');
  button.innerText = 'Click me!';
  button.addEventListener('click', async () => {
    await deploySchnorrAccount(pxe);
  });

  document.body.appendChild(button);
} catch (e) {
  console.log(e)
}


async function deploySchnorrAccount(pxe: PXE) {

  let secretKey = Fr.random();
  let salt = Fr.random();

  let schnorrAccount = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), salt);
  // const { address, publicKeys, partialAddress } = schnorrAccount.getCompleteAddress();
  let wallet = await schnorrAccount.register();
  let txReceipt = await schnorrAccount.deploy().getReceipt();
  console.log(wallet, txReceipt);
}