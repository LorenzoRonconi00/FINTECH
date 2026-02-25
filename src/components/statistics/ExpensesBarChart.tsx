'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'

interface CategoryData {
    id: string
    name: string
    color: string
    icon: string
    total: number
}

interface ExpensesBarChartProps {
    data: CategoryData[]
    currency: string
}

export function ExpensesBarChart({ data, currency }: ExpensesBarChartProps) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(n)

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-white/30 font-mono text-sm">
                Nessun dato disponibile
            </div>
        )
    }

    const chartData = data.map((d) => ({
        ...d,
        label: `${d.icon} ${d.name}`,
    }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
                <XAxis
                    type="number"
                    tickFormatter={(v) => fmt(v)}
                    tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DM Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
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
                    formatter={(value: number | undefined) => [fmt(value ?? 0), 'Totale']}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} opacity={0.8} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}