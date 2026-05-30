'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, TrendingUp, TrendingDown, DollarSign, Save, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, AreaChart, Area, CartesianGrid } from 'recharts'
import { financeStore, generateId, today } from '@/lib/store'
import type { Transaction } from '@/lib/types'

const CATEGORIES = ['Food', 'Transport', 'Health', 'Fitness', 'Entertainment', 'Clothing', 'Rent', 'Utilities', 'Investment', 'Income', 'Other']
const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a78bfa', '#86efac', '#94a3b8']

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="forge-card text-xs p-2">
      <p className="text-muted-foreground">{payload[0].name}</p>
      <p className="font-semibold">€{Math.abs(payload[0].value).toFixed(2)}</p>
    </div>
  )
}

export default function WealthPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [form, setForm] = useState({
    amount: '', category: 'Food', type: 'expense' as 'income' | 'expense', description: '', date: today()
  })
  const [saved, setSaved] = useState(false)
  const [projectionRate, setProjectionRate] = useState(7)
  const [projectionSavings, setProjectionSavings] = useState<number | null>(null)

  useEffect(() => {
    const txs = financeStore.getAll()
    setTransactions(txs)
    const inc = txs.filter(t => t.type === 'income' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)
    const exp = txs.filter(t => t.type === 'expense' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)
    const monthlySavings = inc - exp
    if (monthlySavings > 0) setProjectionSavings(Math.round(monthlySavings))
    else setProjectionSavings(500)
  }, [])

  function save() {
    if (!form.amount || !form.description) return
    const tx: Transaction = {
      id: generateId(),
      date: form.date,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
    }
    financeStore.save(tx)
    setTransactions(financeStore.getAll())
    setForm(f => ({ ...f, amount: '', description: '' }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const balance = transactions.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0)
  const monthlyIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)
  const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)

  // Pie data by category (expenses only)
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {} as Record<string, number>)
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  // Monthly trend (last 6 months)
  const monthlyData = (() => {
    const months: Record<string, { income: number; expenses: number }> = {}
    transactions.forEach(t => {
      const m = t.date.slice(0, 7)
      if (!months[m]) months[m] = { income: 0, expenses: 0 }
      if (t.type === 'income') months[m].income += t.amount
      else months[m].expenses += t.amount
    })
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({ month: format(new Date(month + '-01'), 'MMM'), ...data }))
  })()

  const monthlySavings = projectionSavings ?? 500
  const annualRate = projectionRate / 100
  const projectionData = [0, 1, 2, 3, 5, 7, 10, 15, 20].map(year => {
    const future = year === 0 ? 0 : monthlySavings * 12 * (Math.pow(1 + annualRate, year) - 1) / annualRate
    const contributed = monthlySavings * 12 * year
    return { year: `Y${year}`, value: Math.round(future), contributed: Math.round(contributed), growth: Math.round(future - contributed) }
  })
  const milestone10 = projectionData.find(d => d.year === 'Y10')?.value ?? 0
  const milestone5 = projectionData.find(d => d.year === 'Y5')?.value ?? 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="forge-label mb-1">Financial Intelligence</p>
        <h1 className="text-3xl font-bold">Wealth</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="forge-card">
          <div className="forge-label flex items-center gap-1.5 mb-2"><DollarSign className="w-3 h-3" />Net Balance</div>
          <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance >= 0 ? '+' : ''}€{balance.toFixed(2)}
          </div>
        </div>
        <div className="forge-card">
          <div className="forge-label flex items-center gap-1.5 mb-2"><TrendingUp className="w-3 h-3 text-green-400" />This Month Income</div>
          <div className="text-3xl font-bold text-green-400">€{monthlyIncome.toFixed(2)}</div>
        </div>
        <div className="forge-card">
          <div className="forge-label flex items-center gap-1.5 mb-2"><TrendingDown className="w-3 h-3 text-red-400" />This Month Spent</div>
          <div className="text-3xl font-bold text-red-400">€{monthlyExpenses.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Log transaction */}
        <div className="forge-card space-y-4">
          <span className="forge-label flex items-center gap-2"><Plus className="w-3.5 h-3.5" />Log Transaction</span>

          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            {(['expense', 'income'] as const).map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${form.type === t ? (t === 'expense' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400') : 'text-muted-foreground'}`}>
                {t === 'expense' ? 'Expense' : 'Income'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="forge-label">Amount (€)</label>
              <input type="number" value={form.amount} step={0.01} min={0}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <label className="forge-label">Date</label>
              <input type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="forge-label">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="forge-label">Description</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What was this for?"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
          </div>

          <Button onClick={save} className="w-full bg-primary text-primary-foreground gap-2">
            <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Add Transaction'}
          </Button>
        </div>

        {/* Spending breakdown pie */}
        <div className="space-y-4">
          {pieData.length > 0 && (
            <div className="forge-card">
              <div className="forge-label mb-3">Spending Breakdown</div>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5 max-h-36 overflow-y-auto scrollbar-hide">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="flex-1 text-muted-foreground truncate">{item.name}</span>
                      <span className="font-medium">€{item.value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {monthlyData.length > 1 && (
            <div className="forge-card">
              <div className="forge-label mb-3">Monthly Cash Flow</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="#22c55e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="forge-card mb-6">
          <div className="forge-label mb-4">Recent Transactions</div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
            {transactions.slice(0, 20).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <div className="text-sm font-medium">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">{tx.category} · {format(new Date(tx.date), 'MMM d')}</div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}€{tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Projections */}
      <div className="forge-card">
        <div className="flex items-center gap-2 mb-1 pb-3 border-b border-border">
          <Rocket className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Wealth Projections</span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div>
            <label className="forge-label mb-1.5 block">Monthly savings (€)</label>
            <input
              type="number" min={0} step={50}
              value={monthlySavings}
              onChange={e => setProjectionSavings(Math.max(0, parseInt(e.target.value) || 0))}
              className="forge-input"
            />
          </div>
          <div>
            <label className="forge-label mb-1.5 block">Annual return ({projectionRate}%)</label>
            <input
              type="range" min={1} max={15} step={0.5}
              value={projectionRate}
              onChange={e => setProjectionRate(parseFloat(e.target.value))}
              className="w-full mt-3 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'oklch(0.705 0.213 47.604)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-secondary rounded-xl">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">In 5 years</div>
            <div className="text-xl font-bold text-primary">€{milestone5.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-xl">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">In 10 years</div>
            <div className="text-xl font-bold text-green-400">€{milestone10.toLocaleString()}</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={projectionData} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'oklch(0.13 0.003 285)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', fontSize: 12 }}
              formatter={(val) => [`€${Number(val ?? 0).toLocaleString()}`, '']}
            />
            <Area type="monotone" dataKey="contributed" name="Contributed" stroke="#3b82f6" strokeWidth={1.5} fill="url(#contribGrad)" />
            <Area type="monotone" dataKey="value" name="Total Value" stroke="#f97316" strokeWidth={2} fill="url(#growthGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-primary rounded inline-block" />Total value</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />Amount contributed</div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Compound growth at {projectionRate}% annual return. Past performance ≠ future results.</p>
      </div>
    </div>
  )
}
