const {
    hash_transaction,
    TransactionWitnessSet,
    Vkeywitnesses,
    make_vkey_witness,
    Transaction,
} = require("@emurgo/cardano-serialization-lib-nodejs");

module.exports = function (txBody, signKey) {
    const txHash = hash_transaction(txBody);
    const witnesses = TransactionWitnessSet.new();
    const vkeyWitnesses = Vkeywitnesses.new();
    vkeyWitnesses.add(make_vkey_witness(txHash, signKey));

    witnesses.set_vkeys(vkeyWitnesses);

    return Transaction.new(txBody, witnesses);
};
