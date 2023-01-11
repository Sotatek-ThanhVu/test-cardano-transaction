/**
 * Creating a transaction requires various steps
 * 1. Get the protocol parameters
 * 2. Get the transaction hash and index of the UTxO to spent
 * 3. Draft the transaction
 * 4. Calculate the fee
 * 5. Calculate the charge to send back to PAYMENT_ADDR
 * 6. Define the time-to-live (TTL) for the transaction
 * 7. Build the transaction
 * 8. Sign the transaction
 * 9. Submit the transaction
 * 10. Check the balance
 */

const {
    TxBuilderConstants,
    hash_transaction,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const getProtocolParameter = require("./1.getProtocolParameter");
const retrieveUTxO = require("./2.retrieveUTxO");
const draftTransaction = require("./3.draftTransaction");
const prepareOutput = require("./4.prepareOutput");
const signTransaction = require("./5.signTransaction");
const submitTransaction = require("./6.submitTransaction");

const { MNEMONIC } = require("./constants");
const { deriveAddress } = require("./utils");

(async () => {
    const { address, signKey } = deriveAddress(MNEMONIC);

    const parameters = await getProtocolParameter(); // 1
    const utxo = await retrieveUTxO(address); // 2
    const draftTrx = draftTransaction(parameters); // 3
    draftTrx.set_ttl(parameters.slot + 7200); // 6
    const { txBody, txHash } = prepareOutput(draftTrx, utxo);

    const transaction = signTransaction(txBody, signKey); // 8

    try {
        const res = await submitTransaction(transaction.to_bytes());
        console.log(`Transaction successfully submitted: ${txHash}`);
    } catch (err) {
        if (err.status_code === '400') console.log(`Transaction ${txHash} rejected\n`, err.message);
        else console.log(err);
    }
})();
