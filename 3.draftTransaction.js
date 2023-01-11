const {
    TransactionBuilder,
    LinearFee,
    BigNum,
} = require("@emurgo/cardano-serialization-lib-nodejs");

module.exports = function (p) {
    console.log(p);

    // const txBuilder = TransactionBuilder.new(
    //     LinearFee.new(
    //         BigNum.from_str(p.linearFee.minFeeA),
    //         BigNum.from_str(p.linearFee.minFeeB)
    //     ),
    //     BigNum.from_str(p.minUtxo),
    //     BigNum.from_str(p.poolDeposit),
    //     BigNum.from_str(p.keyDeposit),
    //     p.maxValSize,
    //     p.maxTxSize
    // );

    return txBuilder;
};
