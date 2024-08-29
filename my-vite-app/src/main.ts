import './style.css'
import { AccountWallet, CompleteAddress, ContractDeployer, createDebugLogger, Fr, PXE, waitForPXE, TxStatus, createPXEClient, getContractInstanceFromDeployParams, DebugLogger, AccountWalletWithSecretKey } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { deriveSigningKey } from '@aztec/circuits.js';
import {
  TokenContract
} from "@aztec/noir-contracts.js"


const setupSandbox = async () => {
  const PXE_URL = 'http://localhost:8080';
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  return pxe;
};

try {
  let pxe = await setupSandbox();
  let accounts = await pxe.getRegisteredAccounts()
  console.log(accounts)
  //let number = await pxe.getBlockNumber()
  console.log(await pxe.getBlockNumber())

  const button = document.createElement('button');
  button.innerText = 'Click me!';
  button.addEventListener('click', async () => {

    let { wallet } = await deploySchnorrAccount(pxe);
    await deployTokenContract(pxe, wallet);
  });

  document.body.appendChild(button);
} catch (e) {
  console.log(e)
}


async function deploySchnorrAccount(pxe: PXE): Promise<{ wallet: AccountWalletWithSecretKey }> {
  let secretKey = Fr.random();
  let salt = Fr.random();
  let schnorrAccount = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), salt);
  // let completeAddress = schnorrAccount.getCompleteAddress();
  let wallet = await schnorrAccount.register();
  let txReceipt = await schnorrAccount.deploy().wait();
  console.log(wallet, txReceipt);
  return {
    wallet
  }
}
async function deployTokenContract(pxe: PXE, wallet: AccountWalletWithSecretKey) {
  let token = await TokenContract.deploy(wallet, wallet.getAddress(), "test", "TST", 18).send().wait();
  let bal = await token.contract.methods.balance_of_public(wallet.getAddress()).simulate()
  console.log(bal)
}
