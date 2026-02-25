import type { Transaction } from '@/types'

export function calculateBalanceDelta(
    transactions: Pick<Transaction, 'amount' | 'type' | 'status'>[],
    statusFilter?: Transaction['status'][]
): number {
    return transactions.reduce((acc, tx) => {
        if (statusFilter && !statusFilter.includes(tx.status)) return acc
        return tx.type === 'income' ? acc + Number(tx.amount) : acc - Number(tx.amount)
    }, 0)
}

export function calculateCurrentBalance(
    balanceInitial: number,
    transactions: Pick<Transaction, 'amount' | 'type' | 'status'>[]
): number {
    return balanceInitial + calculateBalanceDelta(transactions, ['confirmed'])
}

export function calculateProjectedBalance(
    balanceInitial: number,
    transactions: Pick<Transaction, 'amount' | 'type' | 'status'>[]
): number {
    return balanceInitial + calculateBalanceDelta(transactions, ['confirmed', 'pending'])
}