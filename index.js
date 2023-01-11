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

const getProtocolParameter = require("./1.getProtocolParameter");
const retrieveUTxO = require("./2.retrieveUTxO");
const draftTransaction = require("./3.draftTransaction");
const { MNEMONIC } = require("./constants");
const { deriveAddress } = require("./utils");

(async () => {
    const { address, signKey } = deriveAddress(MNEMONIC);

    const parameters = await getProtocolParameter(); // 1
    const utxo = await retrieveUTxO(address); // 2
    const draftTrx = draftTransaction(parameters); // 3

    console.log(draftTrx);
})();

// const {
//     mnemonicToPrivateKey,
//     deriveAddressPrvKey,
//     request,
//     composeTransaction,
// } = require("./utils");
// const { MNEMONIC } = require("./constants");

// (async () => {
//     const rootKey = mnemonicToPrivateKey(MNEMONIC);
//     const { address, signKey } = deriveAddressPrvKey(rootKey);

//     console.log(address);

//     let utxo = [];
//     try {
//         utxo = await request({ endpoint: `/addresses/${address}/utxos` });
//         if (utxo.length === 0) throw new Error("Empty UTxO");
//     } catch (err) {
//         console.log(err);
//     }

//     const { slot } = await request({ endpoint: `/blocks/latest` });

//     const {} = composeTransaction(
//         address,
//         "addr_test1qztfvezwwpa7msmjacxggharyl7eawuhy3hzxculynsjzsmu3ke04ltk0yhgypejnwftwcz5yscfwecvanceepklty4sr806u9",
//         "1000000", // 1 ADA
//         utxo,
//         slot
//     );
// })();
