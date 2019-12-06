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
xrpl: "wss://testnet.xrpl-labs.com"
redis:
  host: "127.0.0.1"
  port: 6379
issuance:
  genesis:
    account:
      address: "rK9TM6ewzMtifMDib57AZ6TBcpp81JYwZF"
      secret: "shJGvnajR3xo8u8KRnjzgipiiToDw"
  currencyCode: "534F4C4F00000000000000000000000000000000"
  totalSupply: 400_000_000
  beforeOperation:
    transactions:
      - type: AccountSet
        options:
          TransferRate: 1000100000
          EmailHash: "7AC3878BF42A5329698F468A6AAA03B9"
          Domain: "736F6C6F67656E69632E636F6D"
    flags:
      - 3 #asfDisallowXRP
      - 6 #asfNoFreeze
      - 8 #asfDefaultRipple
  distributions:
    - name: "A"
      account:
        address: "rLocsgGQQWyRyiLwgir46Q8xYpMK5erLVf"
        secret: "ss24nRwYweEtxk5USbJastrb6Sgji"
      transactions:
        - type: Payment
          amount: 50_000_000
        - type: Payment
          amount: 50_000_000
    - name: "B"
      account:
        address: "rhWkvNKWt67WLJRDreHTTpUy1ddFM7q7f5"
        secret: "sszpY5jTQUaUA8sk7aPJyGHyFaHKG"
      transactions:
        - type: Payment
          amount: 100_000_000
  afterOperation:
    transactions:
      - type: SetRegularKey
        options:
          RegularKey: "rrrrrrrrrrrrrrrrrrrrBZbvji"
    flags:
      - 4 #asfDisableMaster
```

Sample transaction between two accounts:

```json
{
  "TransactionType": "Payment",
  "Account": "rLocsgGQQWyRyiLwgir46Q8xYpMK5erLVf",
  "Destination": "rhWkvNKWt67WLJRDreHTTpUy1ddFM7q7f5",
  "SendMax": {
    "currency": "534F4C4F00000000000000000000000000000000",
    "issuer": "rK9TM6ewzMtifMDib57AZ6TBcpp81JYwZF",
    "value": "400000000"
  },
  "Amount": {
    "currency": "534F4C4F00000000000000000000000000000000",
    "issuer": "rK9TM6ewzMtifMDib57AZ6TBcpp81JYwZF",
    "value": "10000"
  }
}
```
