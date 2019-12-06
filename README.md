# Sologenic SOLO coin issuance on XRPL

install dependancies

```
$ npm install
```

run the code

```
$ node issue.js
```

Instructions: blueprint.yaml

```yaml
# Issuance configuration of distribution

xrpl: "wss://testnet.xrpl-labs.com"
redis:
  host: "127.0.0.1"
  port: 6379
issuance:
  genesis:
    account:
      address: "rf7QP7mGsG4Zcy5LpCpezqMjUKZCkikSD"
      secret: "xxx"
  currencyCode: "534F4C4F00000000000000000000000000000000"
  totalSupply: 400_000_000
  beforeOperation:
    transactions:
      - type: AccountSet
        options:
          TransferRate: 1000100000
          EmailHash: "7AC3878BF42A5329698F468A6AAA03B9"
          Domain: "736F6C6F67656E69632E636F6D"
      - type: AccountSet
        options:
          SetFlag: 3 #asfDisallowXRP
      - type: AccountSet
        options:
          SetFlag: 6 #asfNoFreeze
      - type: AccountSet
        options:
          SetFlag: 8 #asfDefaultRipple
  distributions:
    - name: "A"
      account:
        address: "rEN7vx5uQLQkt4ZNqzQ4ZrLRkAbjFoV5my"
        secret: "xxx"
      TrustSetFlags: 0x00020000 #tfSetNoRipple
      send:
        - type: Payment
          amount: 50_000_000
        - type: Payment
          amount: 50_000_000
    - name: "B"
      account:
        address: "rBJuHN9wJMBT2D6fEidFPH6Ax9o6vcAxj8"
        secret: "xxx"
      TrustSetFlags: 0x00020000 #tfSetNoRipple
      send:
        - type: Payment
          amount: 100_000_000
  afterOperation:
    transactions:
      - type: SetRegularKey
        options:
          RegularKey: "rrrrrrrrrrrrrrrrrrrrBZbvji"
      - type: AccountSet
        options:
          SetFlag: 4 #asfDisableMaster
```

Sample transaction between two accounts:

```json
{
  "TransactionType": "Payment",
  "Account": "rEN7vx5uQLQkt4ZNqzQ4ZrLRkAbjFoV5my",
  "Destination": "rBJuHN9wJMBT2D6fEidFPH6Ax9o6vcAxj8",
  "SendMax": {
    "currency": "534F4C4F00000000000000000000000000000000",
    "issuer": "rf7QP7mGsG4Zcy5LpCpezqMjUKZCkikSD",
    "value": "10001"
  },
  "Amount": {
    "currency": "534F4C4F00000000000000000000000000000000",
    "issuer": "rf7QP7mGsG4Zcy5LpCpezqMjUKZCkikSD",
    "value": "10000"
  }
}
```
