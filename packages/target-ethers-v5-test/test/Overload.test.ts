import { typedAssert } from 'test-utils'

import { createNewBlockchain, deployContract } from './common'
import { Overloads } from '../types/Overloads'
import { BigNumber } from 'ethers'

describe('Overloads', () => {
  let contract: Overloads
  let ganache: any
  beforeEach(async () => {
    const { ganache: _ganache, signer } = await createNewBlockchain()
    ganache = _ganache
    contract = await deployContract<Overloads>(signer, 'Overloads')
  })

  afterEach(() => ganache.close())

  it('works with 1st overload', async () => {
    const result = await contract['overload1(int256)'](1)
    typedAssert(result, BigNumber.from(1))
  })

  it('works with 2n overload', async () => {
    const result = await contract['overload1(uint256,uint256)'](1, 2)
    typedAssert(result, BigNumber.from(3))
  })
})