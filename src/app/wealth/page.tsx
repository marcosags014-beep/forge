'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, TrendingUp, TrendingDown, DollarSign, Save, Rocket, Trash2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, AreaChart, Area, CartesianGrid } from 'recharts'
import { financeStore, subscriptionsStore, netWorthStore, generateId, today } from '@/lib/store'
import type { Transaction, Subscription, NetWorthEntry } from '@/lib/types'

const SUB_PRESETS = [
  { name: 'Netflix', amount: 13.99, category: 'streaming' as const, color: '#ef4444' },
  { name: 'Spotify', amount: 10.99, category: 'streaming' as const, color: '#22c55e' },
  { name: 'ChatGPT Plus', amount: 20, category: 'software' as const, color: '#10b981' },
  { name: 'iCloud 50GB', amount: 0.99, category: 'software' as const, color: '#3b82f6' },
  { name: 'YouTube Premium', amount: 13.99, category: 'streaming' as const, color: '#ef4444' },
  { name: 'Gym', amount: 40, category: 'fitness' as const, color: '#f59e0b' },
]

const CAT_COLORS: Record<string, string> = {
  streaming: '#ef4444', fitness: '#f59e0b', software: '#3b82f6',
  news: '#8b5cf6', food: '#22c55e', finance: '#14b8a6', other: '#94a3b8',
}

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showAddSub, setShowAddSub] = useState(false)
  const [subForm, setSubForm] = useState({ name: '', amount: '', cycle: 'monthly' as 'monthly' | 'annual', category: 'other' as Subscription['category'] })
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthEntry[]>([])
  const [showNW, setShowNW] = useState(false)
  const [nwForm, setNwForm] = useState({ assets: '', liabilities: '', note: '' })

  useEffect(() => {
    const txs = financeStore.getAll()
    setTransactions(txs)
    setSubscriptions(subscriptionsStore.getAll())
    setNetWorthHistory(netWorthStore.getAll())
    const inc = txs.filter(t => t.type === 'income' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)
    const exp = txs.filter(t => t.type === 'expense' && t.date.startsWith(today().slice(0, 7))).reduce((s, t) => s + t.amount, 0)
    const monthlySavings = inc - exp
    if (monthlySavings > 0) setProjectionSavings(Math.round(monthlySavings))
    else setProjectionSavings(500)
  }, [])

  function addSubscription() {
    if (!subForm.name || !subForm.amount) return
    const sub: Subscription = {
      id: generateId(),
      name: subForm.name,
      amount: parseFloat(subForm.amount),
      cycle: subForm.cycle,
      category: subForm.category,
      color: CAT_COLORS[subForm.category],
    }
    subscriptionsStore.save(sub)
    setSubscriptions(subscriptionsStore.getAll())
    setSubForm({ name: '', amount: '', cycle: 'monthly', category: 'other' })
    setShowAddSub(false)
  }

  function addNetWorth() {
    if (!nwForm.assets && !nwForm.liabilities) return
    const entry: NetWorthEntry = {
      id: generateId(),
      date: today(),
      assets: parseFloat(nwForm.assets) || 0,
      liabilities: parseFloat(nwForm.liabilities) || 0,
      note: nwForm.note || undefined,
    }
    netWorthStore.save(entry)
    setNetWorthHistory(netWorthStore.getAll())
    setNwForm({ assets: '', liabilities: '', note: '' })
    setShowNW(false)
  }

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
        <h1 className="text-3xl font-bold text-gradient">Wealth</h1>
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
      {transactions.length === 0 && (
        <div className="forge-card mb-6 flex flex-col items-center justify-center text-center py-10">
          <div className="w-10 h-10 text-muted-foreground/30 mb-3 text-4xl">€</div>
          <p className="font-semibold text-sm mb-1.5">No transactions yet</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">Add your first income or expense above. Cash flow charts and spending breakdowns appear once you start tracking.</p>
        </div>
      )}
      {transactions.length > 0 && (
        <div className="forge-card mb-6">
          <div className="forge-label mb-4">Recent Transactions</div>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
            {transactions.slice(0, 20).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === 'income' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <div className="text-sm font-medium">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">{tx.category} · {format(new Date(tx.date), 'MMM d')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}€{tx.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => { financeStore.delete(tx.id); setTransactions(financeStore.getAll()) }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions */}
      <div className="forge-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span className="forge-label">Subscriptions</span>
          </div>
          <div className="flex items-center gap-3">
            {subscriptions.length > 0 && (
              <span className="text-xs text-muted-foreground">
                €{subscriptionsStore.getMonthlyTotal().toFixed(0)}/mo · €{subscriptionsStore.getAnnualTotal().toFixed(0)}/yr
              </span>
            )}
            <button onClick={() => setShowAddSub(v => !v)}
              className="text-xs text-primary hover:underline flex items-center gap-0.5">
              <Plus className="w-3 h-3" />Add
            </button>
          </div>
        </div>

        {/* Presets (show when adding) */}
        {showAddSub && (
          <div className="mb-4 space-y-3 p-3 bg-secondary/40 rounded-xl border border-border">
            <div className="flex flex-wrap gap-1.5">
              {SUB_PRESETS.map(p => (
                <button key={p.name}
                  onClick={() => setSubForm(f => ({ ...f, name: p.name, amount: String(p.amount), category: p.category }))}
                  className="text-[10px] px-2 py-1 rounded-full border border-border bg-secondary hover:border-primary/40 text-muted-foreground transition-colors">
                  {p.name} €{p.amount}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={subForm.name} onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Service name"
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              <input value={subForm.amount} onChange={e => setSubForm(f => ({ ...f, amount: e.target.value }))}
                type="number" placeholder="€ amount" min={0} step={0.01}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={subForm.cycle} onChange={e => setSubForm(f => ({ ...f, cycle: e.target.value as 'monthly' | 'annual' }))}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                <option value="monthly">Monthly</option>
                <option value="annual">Annual (÷12)</option>
              </select>
              <select value={subForm.category} onChange={e => setSubForm(f => ({ ...f, category: e.target.value as Subscription['category'] }))}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                {['streaming','fitness','software','news','food','finance','other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addSubscription} disabled={!subForm.name || !subForm.amount} className="flex-1 bg-primary text-primary-foreground">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddSub(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        )}

        {subscriptions.length === 0 && !showAddSub ? (
          <div className="text-center py-6">
            <p className="text-sm font-medium mb-1">No subscriptions tracked</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">Add your recurring costs to see your true monthly burn rate — most people underestimate it by 40%.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {subscriptions.map(sub => {
              const monthly = sub.cycle === 'annual' ? sub.amount / 12 : sub.amount
              return (
                <div key={sub.id} className="flex items-center gap-3 group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_COLORS[sub.category] ?? '#94a3b8' }} />
                  <span className="text-sm flex-1">{sub.name}</span>
                  <span className="text-xs text-muted-foreground">{sub.cycle === 'annual' ? `€${sub.amount}/yr` : ''}</span>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: CAT_COLORS[sub.category] }}>€{monthly.toFixed(2)}/mo</span>
                  <button onClick={() => { subscriptionsStore.delete(sub.id); setSubscriptions(subscriptionsStore.getAll()) }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
            {subscriptions.length > 0 && (
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-border text-xs font-semibold">
                <span className="text-muted-foreground">Monthly total</span>
                <span className="text-red-400">€{subscriptionsStore.getMonthlyTotal().toFixed(2)}/mo</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Net Worth Tracker */}
      <div className="forge-card">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Net Worth</span>
            {netWorthHistory.length > 0 && (() => {
              const last = netWorthHistory[netWorthHistory.length - 1]
              const nw = last.assets - last.liabilities
              return <span className={`text-sm font-bold ${nw >= 0 ? 'text-green-400' : 'text-red-400'}`}>€{nw.toLocaleString()}</span>
            })()}
          </div>
          <button onClick={() => setShowNW(v => !v)}
            className="text-xs text-primary hover:underline">
            {showNW ? 'Cancel' : '+ Log snapshot'}
          </button>
        </div>

        {showNW && (
          <div className="mt-3 space-y-3 p-3 bg-secondary/50 rounded-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="forge-label">Assets (€)</label>
                <input type="number" step={100} value={nwForm.assets}
                  onChange={e => setNwForm(f => ({ ...f, assets: e.target.value }))}
                  placeholder="Savings, investments, property…"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="forge-label">Liabilities (€)</label>
                <input type="number" step={100} value={nwForm.liabilities}
                  onChange={e => setNwForm(f => ({ ...f, liabilities: e.target.value }))}
                  placeholder="Loans, credit cards, debt…"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <input value={nwForm.note} onChange={e => setNwForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Note (optional)"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            {nwForm.assets || nwForm.liabilities ? (
              <div className="text-xs text-muted-foreground">
                Net Worth preview: <span className={`font-bold ${(parseFloat(nwForm.assets)||0) - (parseFloat(nwForm.liabilities)||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  €{((parseFloat(nwForm.assets)||0) - (parseFloat(nwForm.liabilities)||0)).toLocaleString()}
                </span>
              </div>
            ) : null}
            <Button onClick={addNetWorth} size="sm" className="bg-primary text-primary-foreground gap-1">
              <Save className="w-3.5 h-3.5" />Save snapshot
            </Button>
          </div>
        )}

        {netWorthHistory.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={netWorthHistory.map(e => ({
                date: format(new Date(e.date), 'MM/dd'),
                'Net Worth': e.assets - e.liabilities,
                Assets: e.assets,
                Liabilities: e.liabilities,
              }))} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v) => [`€${Number(v).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="Net Worth" stroke="#22c55e" strokeWidth={2} fill="url(#nwGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              {(() => {
                const last = netWorthHistory[netWorthHistory.length - 1]
                const first = netWorthHistory[0]
                const nw = last.assets - last.liabilities
                const growth = netWorthHistory.length > 1 ? nw - (first.assets - first.liabilities) : null
                return (
                  <>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-[10px] text-muted-foreground">Assets</div>
                      <div className="text-sm font-bold text-green-400">€{last.assets.toLocaleString()}</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-[10px] text-muted-foreground">Liabilities</div>
                      <div className="text-sm font-bold text-red-400">€{last.liabilities.toLocaleString()}</div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <div className="text-[10px] text-muted-foreground">{growth !== null ? 'Growth' : 'Net Worth'}</div>
                      <div className={`text-sm font-bold ${growth !== null ? (growth >= 0 ? 'text-green-400' : 'text-red-400') : (nw >= 0 ? 'text-green-400' : 'text-red-400')}`}>
                        {growth !== null ? `${growth >= 0 ? '+' : ''}€${growth.toLocaleString()}` : `€${nw.toLocaleString()}`}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}

        {netWorthHistory.length === 0 && !showNW && (
          <p className="text-xs text-muted-foreground mt-2">Track your total assets vs liabilities over time. Log a snapshot monthly to watch your net worth grow.</p>
        )}
      </div>

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
