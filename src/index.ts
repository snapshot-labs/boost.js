import fetch from 'cross-fetch';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import abi from './abi.json';

export const IPFS_GATEWAY = 'pineapple.fyi';
export const BOOST_ADDRESS = '0xaf8b6af86044821eED74E49057De62fB5C48e061';

interface Boost {
  strategyURI: string;
  token: string;
  balance: string;
  guard: string;
  start: number;
  end: number;
  owner: string;
}

interface Strategy {
  strategy: string;
  params: Record<string, any>;
}

export async function getBoost(boostId: number, chainId: number): Promise<Boost> {
  const provider = new JsonRpcProvider(`https://rpc.brovider.xyz/${chainId.toString()}`);
  const contract = new Contract(BOOST_ADDRESS, abi, provider);

  const boost = await contract.boosts(boostId);

  return {
    strategyURI: boost[0],
    token: boost[1],
    balance: boost[2].toString(),
    guard: boost[3],
    start: boost[4].toNumber(),
    end: boost[5].toNumber(),
    owner: boost[6]
  };
}

export async function getStrategy(
  strategyURI: string,
  gateway: string = IPFS_GATEWAY
): Promise<Strategy> {
  const url = strategyURI
    .replace('ipfs://', `https://${gateway}/ipfs/`)
    .replace('ipns://', `https://${gateway}/ipns/`);

  return fetch(url).then((res) => res.json());
}

export async function getNextBoostId(chainId: number): Promise<number> {
  const provider = new JsonRpcProvider(`https://rpc.brovider.xyz/${chainId.toString()}`);
  const contract = new Contract(BOOST_ADDRESS, abi, provider);

  const nextBoostId = await contract.nextBoostId();

  return nextBoostId.toNumber();
}

export async function createBoost(
  web3: Web3Provider,
  strategyURI: string,
  token: string,
  balance: string,
  guard: string,
  start: number,
  end: number,
  owner: string
): Promise<any> {
  const signer = web3.getSigner();
  const contract = new Contract(BOOST_ADDRESS, abi, signer);
  const params = {
    strategyURI,
    token,
    balance,
    guard,
    start,
    end,
    owner
  };

  return await contract.createBoost(params);
}

export async function claimTokens(
  web3: Web3Provider,
  boostId: number,
  recipient: string,
  amount: string,
  signature: string
): Promise<any> {
  const signer = web3.getSigner();
  const contract = new Contract(BOOST_ADDRESS, abi, signer);
  const claim = {
    boostId,
    recipient,
    amount
  };

  return await contract.claimTokens(claim, signature);
}
