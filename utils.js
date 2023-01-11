const {
    Bip32PrivateKey,
    BaseAddress,
    NetworkInfo,
    StakeCredential,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const { mnemonicToEntropy } = require("bip39");

async function request({ body, endpoint = "", headers = {}, method = "GET" }) {
    try {
        return await (
            await fetch(
                `https://cardano-preprod.blockfrost.io/api/v0${endpoint}`,
                {
                    headers: {
                        project_id: "preprodErVbfRtJxubIxbF5ERCRqeOfAZodPqFK",
                        ...headers,
                    },
                    method: method,
                    body,
                }
            )
        ).json();
    } catch (err) {
        console.log(err);
        return null;
    }
}

function deriveAddress(mnemonic) {
    const h = (n) => 0x80000000 + n;

    const entropy = mnemonicToEntropy(mnemonic);
    const rootKey = Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, "hex"),
        Buffer.from("")
    );

    const accountKey = rootKey
        .derive(h(1852)) // purpose
        .derive(h(1815)) // coin type
        .derive(h(0)); // account #0
    const utxoKey = accountKey
        .derive(0) // external
        .derive(0);
    const stakeKey = accountKey
        .derive(2) // chimeric
        .derive(0)
        .to_public();
    const baseAddress = BaseAddress.new(
        NetworkInfo.testnet().network_id(),
        StakeCredential.from_keyhash(utxoKey.to_public().to_raw_key().hash()),
        StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
    );
    const address = baseAddress.to_address().to_bech32();

    return { address, signKey: utxoKey.to_raw_key() }
}

// function composeTransaction(
//     address,
//     outputAddress,
//     outputAmount,
//     utxo,
//     currentSlot
// ) {
//     const txBuilder = TransactionBuilder.new()
// }

module.exports = {
    request,
    deriveAddress,
};
