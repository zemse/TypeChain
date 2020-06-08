import { FunctionDeclaration, isConstant, isConstantFn, FunctionDocumentation, getSignatureForFn } from 'typechain'
import { generateInputTypes, generateOutputTypes } from './types'

export function codegenFunctions(usingResultObject: boolean, fns: FunctionDeclaration[]): string {
  if (fns.length === 1) {
    return generateFunction(usingResultObject, fns[0])
  }

  return codegenForOverloadedFunctions(usingResultObject, fns)
}

export function codegenForOverloadedFunctions(usingResultObject: boolean, fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(usingResultObject, fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}

function isPayable(fn: FunctionDeclaration): boolean {
  return fn.stateMutability === 'payable'
}

function generateFunction(usingResultObject: boolean, fn: FunctionDeclaration, overloadedName?: string): string {
  // console.log(fn)
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${generateInputTypes(fn.inputs)}${
    !isConstant(fn) && !isConstantFn(fn) ? `overrides?: ${isPayable(fn) ? 'PayableOverrides' : 'Overrides'}` : ''
  }): Promise<${
    fn.stateMutability === 'pure' || fn.stateMutability === 'view'
      ? generateOutputTypes(fn.outputs, usingResultObject)
      : 'ContractTransaction'
  }>;
`
}

function generateFunctionDocumentation(doc?: FunctionDocumentation): string {
  if (!doc) return ''

  let docString = '/**'
  if (doc.details) docString += `\n * ${doc.details}`
  if (doc.notice) docString += `\n * ${doc.notice}`

  const params = Object.entries(doc.params || {})
  if (params.length) {
    params.forEach(([key, value]) => {
      docString += `\n * @param ${key} ${value}`
    })
  }

  if (doc.return) docString += `\n * @returns ${doc.return}`

  docString += '\n */'

  return docString
}
