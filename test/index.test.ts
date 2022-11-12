import { getBoost, getNextBoostId, getStrategy } from '../src';

const chainId = 5;

describe('Boost', () => {
  it('getBoost', async () => {
    const boost = await getBoost(4, chainId);
    expect(boost).toMatchSnapshot();
  });

  it('getStrategy', async () => {
    const strategyURI = 'ipfs://bafkreihfwpcbmgq7llxnwbwekql2kjwc33g2a6pqj5ylfxasbcnappage4';
    const strategy = await getStrategy(strategyURI);
    expect(strategy).toMatchSnapshot();
  });

  it('getNextBoostId', async () => {
    const nextBoostId = await getNextBoostId(chainId);
    expect(nextBoostId).toEqual(expect.any(Number));
  });
});
