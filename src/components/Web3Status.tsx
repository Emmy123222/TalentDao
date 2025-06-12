import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, Clock, CheckCircle } from 'lucide-react';
import useWeb3 from '../hooks/useWeb3';
import LoadingSpinner from './LoadingSpinner';

export default function Web3Status() {
  const { 
    tokenBalance, 
    claimTokensFromFaucet, 
    isConnected, 
    canClaim, 
    timeUntilNextClaim,
    formatTimeUntilClaim,
    isTransactionPending,
    isTransactionConfirmed
  } = useWeb3();

  if (!isConnected) {
    return null;
  }

  const handleClaimClick = () => {
    if (canClaim) {
      claimTokensFromFaucet();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50"
    >
      <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white min-w-[200px]">
        <div className="flex items-center space-x-3 mb-3">
          <Coins className="h-5 w-5 text-yellow-400" />
          <div>
            <div className="text-sm text-gray-400">TLVT Balance</div>
            <div className="font-bold text-lg">
              {parseFloat(tokenBalance).toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Claim Button */}
        <button
          onClick={handleClaimClick}
          disabled={!canClaim || isTransactionPending}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            canClaim && !isTransactionPending
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isTransactionPending ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              <span>Processing...</span>
            </>
          ) : isTransactionConfirmed ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Claimed!</span>
            </>
          ) : canClaim ? (
            <>
              <Zap className="h-4 w-4" />
              <span>Claim 100 TLVT</span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              <span>
                {timeUntilNextClaim > 0 
                  ? formatTimeUntilClaim(timeUntilNextClaim)
                  : 'Checking...'
                }
              </span>
            </>
          )}
        </button>

        {/* Cooldown Info */}
        {!canClaim && timeUntilNextClaim > 0 && (
          <div className="mt-2 text-xs text-gray-400 text-center">
            Next claim available in {formatTimeUntilClaim(timeUntilNextClaim)}
          </div>
        )}

        {/* Transaction Status */}
        {isTransactionPending && (
          <div className="mt-2 text-xs text-blue-400 text-center">
            Waiting for confirmation...
          </div>
        )}
      </div>
    </motion.div>
  );
}