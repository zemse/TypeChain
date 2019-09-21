exports['ContractWithOverloads should snapshot generated code 1'] = `
/* tslint:disable */

import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";

export class ContractWithOverloads extends TC.TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [{ name: "offset", type: "uint256" }],
        name: "getCounter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "counter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getCounter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "by", type: "uint256" }],
        name: "increaseCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "increaseCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber,
  ): Promise<ContractWithOverloads> {
    const contract = new ContractWithOverloads(web3, address);
    const code = await TC.promisify(web3.eth.getCode, [address]);

    // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
    // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
    if (code.length < 4) {
      throw new Error(\`Contract at \${address} doesn't exist!\`);
    }
    return contract;
  }

  public get counter(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.counter, []);
  }

  public getCounter(offset: BigNumber | number): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.getCounter, [offset.toString()]);
  }

  public increaseCounterTx(by: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "increaseCounter", [
      by.toString(),
    ]);
  }
}

`

exports['ContractWithOverloads should snapshot generated code 2'] = `
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { ContractWithOverloads } from "./ContractWithOverloads";

export class ContractWithOverloadsFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }
  deploy(): Promise<ContractWithOverloads> {
    return super.deploy() as Promise<ContractWithOverloads>;
  }
  getDeployTransaction(): UnsignedTransaction {
    return super.getDeployTransaction();
  }
  attach(address: string): ContractWithOverloads {
    return super.attach(address) as ContractWithOverloads;
  }
  connect(signer: Signer): ContractWithOverloadsFactory {
    return super.connect(signer) as ContractWithOverloadsFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ContractWithOverloads {
    return new Contract(address, _abi, signerOrProvider) as ContractWithOverloads;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "offset",
        type: "uint256",
      },
    ],
    name: "getCounter",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "counter",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCounter",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "by",
        type: "uint256",
      },
    ],
    name: "increaseCounter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "increaseCounter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506101ba806100206000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063214aed451461007257806361bc221a146100b35780638ada066e146100de5780639e80c07414610109578063b49004e914610136575b600080fd5b34801561007e57600080fd5b5061009d6004803603810190808035906020019092919050505061014d565b6040518082815260200191505060405180910390f35b3480156100bf57600080fd5b506100c861015b565b6040518082815260200191505060405180910390f35b3480156100ea57600080fd5b506100f3610161565b6040518082815260200191505060405180910390f35b34801561011557600080fd5b506101346004803603810190808035906020019092919050505061016a565b005b34801561014257600080fd5b5061014b61017c565b005b600081600054019050919050565b60005481565b60008054905090565b80600080828254019250508190555050565b600160008082825401925050819055505600a165627a7a7230582065f8798addb60572e6143d511ebc2c8ad1c1bae79db3187bd1611bca00b8723a0029";

`
