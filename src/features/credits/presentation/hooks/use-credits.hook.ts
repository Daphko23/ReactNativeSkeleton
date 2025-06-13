/**
 * 🚀 CREDITS HOOK - TanStack Query Migration for React Native 2025
 * Replaces Store-based approach with clean server state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@features/auth/presentation/hooks';

// Mock service - Replace with actual service implementation
const mockCreditsService = {
  async getBalance(_userId: string): Promise<number> {
    return new Promise(resolve => setTimeout(() => resolve(150), 500));
  },
  async deductCredits(_userId: string, amount: number): Promise<number> {
    return new Promise(resolve => setTimeout(() => resolve(Math.max(0, 150 - amount)), 1000));
  }
};

// 🔧 QUERY KEYS
const creditsQueryKeys = {
  balance: (userId: string) => ['credits', 'balance', userId] as const,
};

export const useCredits = (_userId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 🎯 BALANCE QUERY - Real-time balance tracking
  const balanceQuery = useQuery({
    queryKey: creditsQueryKeys.balance(user?.id || ''),
    queryFn: () => mockCreditsService.getBalance(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,     // 2 minutes
    gcTime: 1000 * 60 * 10,       // 10 minutes cache retention
    refetchOnWindowFocus: true,   // Refetch credits on app focus
  });

  // 🎯 DEDUCT CREDITS MUTATION - With optimistic updates
  const deductCreditsMutation = useMutation({
    mutationFn: (amount: number) => mockCreditsService.deductCredits(user!.id, amount),
    
    onMutate: async (amount) => {
      if (!user?.id) return;
      
      await queryClient.cancelQueries({ queryKey: creditsQueryKeys.balance(user.id) });
      
      const previousBalance = queryClient.getQueryData(creditsQueryKeys.balance(user.id)) as number;
      
      // Optimistically update balance
      if (previousBalance !== undefined) {
        queryClient.setQueryData(creditsQueryKeys.balance(user.id), Math.max(0, previousBalance - amount));
      }
      
      return { previousBalance };
    },
    
    onSuccess: (newBalance) => {
      if (!user?.id) return;
      queryClient.setQueryData(creditsQueryKeys.balance(user.id), newBalance);
    },
    
    onError: (error, amount, context) => {
      if (!user?.id || !context) return;
      
      // Revert optimistic update
      if (context.previousBalance !== undefined) {
        queryClient.setQueryData(creditsQueryKeys.balance(user.id), context.previousBalance);
      }
    },
  });

  return {
    // State
    balance: balanceQuery.data || 0,
    isLoading: balanceQuery.isLoading,
    error: balanceQuery.error?.message || deductCreditsMutation.error?.message || null,
    transactions: [], // TODO: Implement with TanStack Query
    products: [],     // TODO: Implement with TanStack Query
    
    // Actions
    refreshBalance: () => balanceQuery.refetch(),
    deductCredits: (amount: number) => deductCreditsMutation.mutate(amount),
    clearError: () => {
      queryClient.removeQueries({ queryKey: creditsQueryKeys.balance(user?.id || '') });
      balanceQuery.refetch();
    },
    
    // Computed
    hasCredits: (balanceQuery.data || 0) > 0,
    canAfford: (amount: number) => (balanceQuery.data || 0) >= amount,
    
    // States
    isDeducting: deductCreditsMutation.isPending
  };
}; 