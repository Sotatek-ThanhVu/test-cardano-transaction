const { request } = require("./utils");

module.exports = async function (address) {
    const utxo = await request({ endpoint: `/addresses/${address}/utxos` });
    if (!utxo || utxo.length === 0) throw new Error("2.retrieveUTxO.js:6");
    return utxo;
};
