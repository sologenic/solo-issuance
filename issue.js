"use strict";

const yaml = require("js-yaml");
const fs = require("fs");
const ƨ = require("sologenic-xrpl-stream-js");

(async () => {
  try {
    // Load blueprint from blueprint.yaml
    var blueprint = await yaml.safeLoad(
      fs.readFileSync("./blueprint.yaml", "utf8")
    );

    const sologenic = await new ƨ.SologenicTxHandler(
      // RippleAPI Options
      {
        server: blueprint.xrpl
      },
      // Sologenic Options
      {
        redis: blueprint.redis
      }
    ).connect();

    sologenic.on("queued", (id, tx) => {
      console.log("TX QUEUED: ", id);
    });
    sologenic.on("dispatched", (id, tx) => {
      console.log("TX DISPATCHED:", id);
    });
    sologenic.on("requeued", (id, tx) => {
      console.log("TX requeued:", id);
    });
    sologenic.on("warning", (id, type, tx) => {
      console.log("TX WARNING:", id, type, tx);
    });
    sologenic.on("validated", (id, tx) => {
      console.log("TX VALIDATED:", id);
    });
    sologenic.on("failed", (id, type, tx) => {
      console.log("TX FAILED:", id, type, tx);
    });

    // execute before operation
    await sologenic.setAccount(blueprint.issuance.genesis.account);

    // transactions
    for (const transaction of blueprint.issuance.beforeOperation.transactions) {
      sologenic.submit({
        TransactionType: transaction.type,
        Account: blueprint.issuance.genesis.account.address,
        ...options
      });
    }

    // flags
    for (const flag of blueprint.issuance.beforeOperation.flags) {
      await sologenic.submit({
        TransactionType: "AccountSet",
        Account: blueprint.issuance.genesis.account.address,
        SetFlag: flag
      }).promise;
    }

    for (const distribution of blueprint.issuance.distributions) {
      await sologenic.setAccount(distribution.account);

      const limit = distribution.transactions.reduce(
        (a, b) => +a + +b.amount,
        0
      );

      //   Set the trustlines
      await sologenic.submit({
        TransactionType: "TrustSet",
        Account: distribution.account.address,
        LimitAmount: {
          currency: blueprint.issuance.currencyCode,
          issuer: blueprint.issuance.genesis.account.address,
          value: limit.toString()
        }
      }).promise;

      // send IOUs
      await sologenic.setAccount(blueprint.issuance.genesis.account);
      for (const transaction of distribution.transactions) {
        await sologenic.submit({
          TransactionType: transaction.type,
          Account: blueprint.issuance.genesis.account.address,
          Destination: distribution.account.address,
          Amount: {
            currency: blueprint.issuance.currencyCode,
            issuer: blueprint.issuance.genesis.account.address,
            value: transaction.amount.toString()
          },
          ...transaction.options
        }).promise;
      }
    }

    // execute after operations
    await sologenic.setAccount(blueprint.issuance.genesis.account);

    // transactions
    for (const transaction of blueprint.issuance.afterOperation.transactions) {
      await sologenic.submit({
        TransactionType: transaction.type,
        Account: blueprint.issuance.genesis.account.address,
        ...transaction.options
      }).promise;
    }
    // flags
    for (const flag of blueprint.issuance.afterOperation.flags) {
      await sologenic.submit({
        TransactionType: "AccountSet",
        Account: blueprint.issuance.genesis.account.address,
        SetFlag: flag
      }).promise;
    }
  } catch (error) {
    console.log("Error:", error);
  }
})();
(async () => {})();
