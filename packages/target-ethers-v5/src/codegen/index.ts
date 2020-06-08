import { values } from 'lodash'
import {
  AbiParameter,
  BytecodeWithLinkReferences,
  Contract,
  EventArgDeclaration,
  EventDeclaration,
  FunctionDeclaration,
} from 'typechain'
import { generateInputType, generateInputTypes } from './types'
import { codegenFunctions } from './functions'

export function codegenContractTypings(contract: Contract) {
  const template = `
  import { ethers, Contract, ContractTransaction, PopulatedTransaction, EventFilter, Signer, BigNumber, BigNumberish, BytesLike, ContractInterface, Overrides } from "ethers";

  export class ${contract.name} extends Contract {
    functions: {
      ${values(contract.functions).map(codegenFunctions.bind(null, true)).join('\n')}
    };

    ${values(contract.functions).map(codegenFunctions.bind(null, false)).join('\n')}

    filters: {
      ${values(contract.events)
        .map((v: any) => v[0])
        .map(generateEvents)
        .join('\n')}
    };

    estimateGas: {
      ${values(contract.functions)
        .map((v: any) => v[0])
        .map(generateEstimateFunction)
        .join('\n')}
    };
    
    populateTransaction: {
      ${values(contract.functions)
        .map((v: any) => v[0])
        .map(generatePopulateTransactionFunction)
        .join('\n')}
    };
  }`

  return template
}

export function codegenContractFactory(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences): string {
  const constructorArgs =
    (contract.constructor && contract.constructor[0] ? generateInputTypes(contract.constructor[0].inputs) : '') +
    `overrides?: ${contract.constructor[0]?.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides'}`
  const constructorArgNamesWithoutOverrides =
    contract.constructor && contract.constructor[0] ? generateParamNames(contract.constructor[0].inputs) : ''
  const constructorArgNames = constructorArgNamesWithoutOverrides
    ? `${constructorArgNamesWithoutOverrides}, overrides`
    : 'overrides'
  if (!bytecode) return codegenAbstractContractFactory(contract, abi)

  // tsc with noUnusedLocals would complain about unused imports
  const ethersUtilsImports: string[] = []
  if (constructorArgs.match(/\WArrayish(\W|$)/)) ethersUtilsImports.push('Arrayish')
  if (constructorArgs.match(/\WBigNumberish(\W|$)/)) ethersUtilsImports.push('BigNumberish')
  const ethersUtilsImportLine =
    ethersUtilsImports.length > 0 ? `import { ${ethersUtilsImports.join(', ')} } from "ethers/utils";` : ''

  return `
  import { ethers, Contract, ContractFactory, Signer, UnsignedTransaction, 
    Overrides, PayableOverrides, ${ethersUtilsImports.join(', ')} } from "ethers";
  import { TransactionRequest, Provider } from '@ethersproject/providers';

  import { ${contract.name} } from "./${contract.name}";


  export class ${contract.name}Factory extends ContractFactory {
    ${generateFactoryConstructor(contract, bytecode)}
    deploy(${constructorArgs}): Promise<${contract.name}> {
      return super.deploy(${constructorArgNames}) as Promise<${contract.name}>;
    }
    getDeployTransaction(${constructorArgs}): TransactionRequest {
      return super.getDeployTransaction(${constructorArgNames});
    };
    attach(address: string): ${contract.name} {
      return super.attach(address) as ${contract.name};
    }
    connect(signer: Signer): ${contract.name}Factory {
      return super.connect(signer) as ${contract.name}Factory;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): ${contract.name} {
      return new Contract(address, _abi, signerOrProvider) as ${contract.name};
    }
  }

  const _abi = ${JSON.stringify(abi, null, 2)};

  const _bytecode = "${bytecode.bytecode}";

  ${generateLibraryAddressesInterface(contract, bytecode)}
  `
}

export function codegenAbstractContractFactory(contract: Contract, abi: any): string {
  return `
  import { Contract, Signer } from "ethers";
  import { Provider } from "ethers/providers";

  import { ${contract.name} } from "./${contract.name}";

  export class ${contract.name}Factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ${contract.name} {
      return new Contract(address, _abi, signerOrProvider) as ${contract.name};
    }
  }

  const _abi = ${JSON.stringify(abi, null, 2)};
  `
}

function generateFactoryConstructor(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  if (!bytecode.linkReferences) {
    return `
    constructor(signer?: Signer) {
      super(_abi, _bytecode, signer);
    }
    `
  }

  const linkRefReplacements = bytecode.linkReferences.map((linkRef) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    // We're using a double escape backslash, since the string will be pasted into generated code.
    const escapedLinkRefRegex = linkRef.reference.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&')
    const libraryKey = linkRef.name || linkRef.reference
    return `
      linkedBytecode = linkedBytecode.replace(
        new RegExp("${escapedLinkRefRegex}", "g"),
        linkLibraryAddresses["${libraryKey}"].replace(/^0x/, '').toLowerCase(),
      );`
  })

  return `
    constructor(linkLibraryAddresses: ${contract.name}LibraryAddresses, signer?: Signer) {
      super(_abi, ${contract.name}Factory.linkBytecode(linkLibraryAddresses), signer);
    }

    static linkBytecode(linkLibraryAddresses: ${contract.name}LibraryAddresses): string {
      let linkedBytecode = _bytecode;
      ${linkRefReplacements.join('\n')}

      return linkedBytecode;
    }
  `
}

function generateLibraryAddressesInterface(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  if (!bytecode.linkReferences) return ''

  const linkLibrariesKeys = bytecode.linkReferences.map(
    (linkRef) => `    ["${linkRef.name || linkRef.reference}"]: string;`,
  )
  return `
  export interface ${contract.name}LibraryAddresses {
    ${linkLibrariesKeys.join('\n')}
  };`
}

function generateEstimateFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): Promise<BigNumber>;
`
}

function generatePopulateTransactionFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): Promise<PopulatedTransaction>;
`
}

function generateInterfaceFunctionDescription(fn: FunctionDeclaration): string {
  return `
  ${fn.name}: TypedFunctionDescription<{ encode(${generateParamArrayNames(fn.inputs)}: ${generateParamArrayTypes(
    fn.inputs,
  )}): string; }>;
`
}

function generateParamArrayTypes(params: Array<AbiParameter>): string {
  return `[${params.map((param) => generateInputType(param.type)).join(', ')}]`
}

function generateParamNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return params.map((param) => param.name).join(', ')
}

function generateParamArrayNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return `[${generateParamNames(params)}]`
}

function generateEvents(event: EventDeclaration) {
  return `
  ${event.name}(${generateEventTypes(event.inputs)}): EventFilter;
`
}

function generateInterfaceEventDescription(event: EventDeclaration): string {
  return `
  ${event.name}: TypedEventDescription<{ encodeTopics(${generateParamArrayNames(
    event.inputs,
  )}: ${generateEventTopicTypes(event.inputs)}): string[]; }>;
`
}

function generateEventTopicTypes(eventArgs: Array<EventArgDeclaration>): string {
  return `[${eventArgs.map(generateEventArgType).join(', ')}]`
}

function generateEventTypes(eventArgs: EventArgDeclaration[]) {
  if (eventArgs.length === 0) {
    return ''
  }
  return (
    eventArgs
      .map((arg) => {
        return `${arg.name}: ${generateEventArgType(arg)}`
      })
      .join(', ') + ', '
  )
}

function generateEventArgType(eventArg: EventArgDeclaration): string {
  return eventArg.isIndexed ? `${generateInputType(eventArg.type)} | null` : 'null'
}
