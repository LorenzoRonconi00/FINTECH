'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceLine,
} from 'recharts'

interface TrendPoint {
    period: string
    balance: number
}

interface BalanceTrendChartProps {
    data: TrendPoint[]
    currency: string
}

export function BalanceTrendChart({ data, currency }: BalanceTrendChartProps) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(n)

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-white/30 font-mono text-sm">
                Nessun dato disponibile
            </div>
        )
    }

    const minBalance = Math.min(...data.map((d) => d.balance))
    const maxBalance = Math.max(...data.map((d) => d.balance))
    const padding = (maxBalance - minBalance) * 0.1

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                />
                <XAxis
                    dataKey="period"
                    tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tickFormatter={(v) => fmt(v)}
                    tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[minBalance - padding, maxBalance + padding]}
                    width={90}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#0d1420',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '12px',
                    }}
                    itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                    formatter={(value: number | undefined) => [fmt(value ?? 0), 'Saldo']}
                />
                {minBalance < 0 && (
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                )}
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                    activeDot={{ fill: '#10b981', strokeWidth: 0, r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}