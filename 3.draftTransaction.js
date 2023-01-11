const {
    TransactionBuilder,
    LinearFee,
    BigNum,
    TransactionBuilderConfigBuilder,
} = require("@emurgo/cardano-serialization-lib-nodejs");

module.exports = function (p) {
    const txBuilderCfg = TransactionBuilderConfigBuilder.new()
        .fee_algo(
            LinearFee.new(
                BigNum.from_str(p.linearFee.minFeeA),
                BigNum.from_str(p.linearFee.minFeeB)
            )
        )
        .pool_deposit(BigNum.from_str(p.poolDeposit))
        .key_deposit(BigNum.from_str(p.keyDeposit))
        .max_value_size(Number.parseInt(p.maxValSize))
        .max_tx_size(p.maxTxSize)
        .coins_per_utxo_word(BigNum.from_str(p.coinsPerUtxoWord))
        .build();

    return TransactionBuilder.new(txBuilderCfg);
};
