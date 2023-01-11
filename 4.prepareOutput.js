const {
    TransactionInput,
    TransactionHash,
    Value,
    BigNum,
    TransactionOutput,
    Address,
    hash_transaction,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const { OUT_ADDRESS, CHANGE_ADDRESS } = require("./constants");

module.exports = function (draftTrx, utxos, outputAmount = "1000000") {
    draftTrx.add_output(
        TransactionOutput.new(
            Address.from_bech32(OUT_ADDRESS),
            Value.new(BigNum.from_str(outputAmount))
        )
    );

    const sortedUtxos = utxos
        .filter((_) => !_.amount.find((__) => __.unit !== "lovelace"))
        .sort((a, b) => {
            const amountA = BigNum.from_str(
                a.amount.find((_) => _.unit === "lovelave")?.quantity || "0"
            );
            const amountB = BigNum.from_str(
                b.amount.find((_) => _.unit === "lovelave")?.quantity || "0"
            );
            return amountB.compare(amountA);
        });
    let totalUtxoAda = BigNum.from_str("0");

    for (const utxo of sortedUtxos) {
        const amount = utxo.amount.find((_) => _.unit === "lovelace")?.quantity;
        if (!amount) continue;

        const input = TransactionInput.new(
            TransactionHash.from_bytes(Buffer.from(utxo.tx_hash, "hex")),
            utxo.output_index
        );
        const inputValue = Value.new(BigNum.from_str(amount.toString()));
        draftTrx.add_input(
            Address.from_bech32(CHANGE_ADDRESS),
            input,
            inputValue
        );

        const fee = draftTrx.min_fee();
        totalUtxoAda = totalUtxoAda.checked_add(
            BigNum.from_str(amount.toString())
        );
        if (
            totalUtxoAda.compare(
                BigNum.from_str(outputAmount).checked_add(fee)
            ) >= 0
        ) {
            // break the loop since we have enough ADA to cover the output + fee
            break;
        }
    }

    draftTrx.add_change_if_needed(Address.from_bech32(CHANGE_ADDRESS));
    
    const txBody = draftTrx.build();
    const txHash = Buffer.from(hash_transaction(txBody).to_bytes()).toString("hex");

    return { txBody, txHash };
};
