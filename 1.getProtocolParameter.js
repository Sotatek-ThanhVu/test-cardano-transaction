const { request } = require("./utils");

module.exports = async function () {
    const latestBlock = await request({ endpoint: "/blocks/latest" });
    if (!latestBlock) throw new Error("1.getProtocolParameter.js:5");

    const p = await request({ endpoint: `/epochs/${latestBlock.epoch}/parameters` });
    if (!p) throw new Error("1.getProtocolParameter.js:8");

    return {
        linearFee: {
            minFeeA: p.min_fee_a.toString(),
            minFeeB: p.min_fee_b.toString(),
        },
        minUtxo: p.min_utxo,
        poolDeposit: p.pool_deposit,
        keyDeposit: p.key_deposit,
        maxValSize: p.max_val_size,
        maxTxSize: p.max_tx_size,
        coinsPerUtxoWord: p.coins_per_utxo_word,
        slot: latestBlock.slot,
    };
};
