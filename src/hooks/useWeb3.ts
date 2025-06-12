import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-hot-toast';

// Contract addresses (these would be deployed contract addresses)
// For demo purposes, using placeholder addresses - replace with actual deployed contracts
const CONTRACTS = {
  VOTE_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const, // TalentLinkToken address
  PROFILE_NFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as const, // TalentLinkNFT address  
  DAO: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as const, // TalentLinkDAO address
};

// Contract ABIs (simplified for demo)
const VOTE_TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'claimFromFaucet',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' }, 
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'canClaimFromFaucet',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'getTimeUntilNextClaim',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

const DAO_ABI = [
  {
    name: 'voteForCreator',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'creator', type: 'address' }, 
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
  },
  {
    name: 'getCreatorVotes',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'creator', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'canVoteForCreator',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'curator', type: 'address' },
      { name: 'creator', type: 'address' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const NFT_ABI = [
  {
    name: 'mintProfile',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' }, 
      { name: 'tokenURI', type: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'hasMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<number>(0);

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  });

  // Check if user can claim from faucet
  const { data: canClaimData, refetch: refetchCanClaim } = useReadContract({
    address: CONTRACTS.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: 'canClaimFromFaucet',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  });

  // Get time until next claim
  const { data: timeUntilClaim, refetch: refetchTimeUntilClaim } = useReadContract({
    address: CONTRACTS.VOTE_TOKEN,
    abi: VOTE_TOKEN_ABI,
    functionName: 'getTimeUntilNextClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 1000, // Refetch every second for countdown
    }
  });

  useEffect(() => {
    if (balance) {
      setTokenBalance(formatEther(balance));
    }
  }, [balance]);

  useEffect(() => {
    if (canClaimData !== undefined) {
      setCanClaim(canClaimData);
    }
  }, [canClaimData]);

  useEffect(() => {
    if (timeUntilClaim !== undefined) {
      setTimeUntilNextClaim(Number(timeUntilClaim));
    }
  }, [timeUntilClaim]);

  // Handle successful transactions
  useEffect(() => {
    if (isConfirmed) {
      // Refetch all data after successful transaction
      refetchBalance();
      refetchCanClaim();
      refetchTimeUntilClaim();
    }
  }, [isConfirmed, refetchBalance, refetchCanClaim, refetchTimeUntilClaim]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      toast.error(`Transaction failed: ${error.message}`);
    }
  }, [error]);

  const claimTokensFromFaucet = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!canClaim) {
      const hours = Math.floor(timeUntilNextClaim / 3600);
      const minutes = Math.floor((timeUntilNextClaim % 3600) / 60);
      toast.error(`Please wait ${hours}h ${minutes}m before claiming again`);
      return;
    }

    try {
      toast.loading('Claiming tokens...', { id: 'claim-tokens' });
      
      await writeContract({
        address: CONTRACTS.VOTE_TOKEN,
        abi: VOTE_TOKEN_ABI,
        functionName: 'claimFromFaucet',
      });

      // The success toast will be shown when transaction is confirmed
    } catch (error: any) {
      console.error('Error claiming tokens:', error);
      toast.dismiss('claim-tokens');
      
      // Handle specific error cases
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else {
        toast.error('Failed to claim tokens. Please try again.');
      }
    }
  };

  const mintProfileNFT = async (metadataURI: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      toast.loading('Minting profile NFT...', { id: 'mint-nft' });
      
      await writeContract({
        address: CONTRACTS.PROFILE_NFT,
        abi: NFT_ABI,
        functionName: 'mintProfile',
        args: [address, metadataURI],
      });

    } catch (error: any) {
      console.error('Error minting NFT:', error);
      toast.dismiss('mint-nft');
      
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else {
        toast.error('Failed to mint profile NFT. Please try again.');
      }
    }
  };

  const voteForCreator = async (creatorAddress: string, amount: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (creatorAddress === address) {
      toast.error('You cannot vote for yourself');
      return;
    }

    try {
      const voteAmount = parseEther(amount);
      
      toast.loading('Preparing vote...', { id: 'vote-creator' });
      
      // First approve tokens
      await writeContract({
        address: CONTRACTS.VOTE_TOKEN,
        abi: VOTE_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.DAO, voteAmount],
      });

      // Wait for approval, then vote
      // Note: In a real implementation, you'd want to wait for the approval transaction
      // to be confirmed before proceeding with the vote
      
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.dismiss('vote-creator');
      
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else {
        toast.error('Failed to cast vote. Please try again.');
      }
    }
  };

  const formatTimeUntilClaim = (seconds: number): string => {
    if (seconds <= 0) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return {
    address,
    isConnected,
    tokenBalance,
    canClaim,
    timeUntilNextClaim,
    formatTimeUntilClaim,
    claimTokensFromFaucet,
    mintProfileNFT,
    voteForCreator,
    contracts: CONTRACTS,
    isTransactionPending: isPending || isConfirming,
    isTransactionConfirmed: isConfirmed,
  };
}

export default useWeb3;