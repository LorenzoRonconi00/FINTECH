'use client'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

interface CategoryData {
    id: string
    name: string
    color: string
    icon: string
    total: number
}

interface ExpensesPieChartProps {
    data: CategoryData[]
    currency: string
}

export function ExpensesPieChart({ data, currency }: ExpensesPieChartProps) {
    const fmt = (n: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(n)

    const total = data.reduce((sum, d) => sum + d.total, 0)

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-white/30 font-mono text-sm">
                Nessun dato disponibile
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                >
                    {data.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} opacity={0.85} />
                    ))}
                </Pie>
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
                    formatter={(value: number | undefined, name: string | undefined) => [value !== undefined ? fmt(value) : 'N/A', name || '']}
                />
                <Legend
                    formatter={(value) => (
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
                            {value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}