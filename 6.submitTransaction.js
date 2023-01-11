const { request } = require("./utils");

module.exports = async function (transaction) {
    return await request({
        body:
            typeof transaction === "string"
                ? Buffer.from(transaction, "hex")
                : Buffer.from(transaction),
        endpoint: "/tx/submit",
        method: "POST",
        headers: { "Content-type": "application/cbor" },
    });
};
