'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Something went wrong</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{this.state.message || 'An unexpected error occurred. Your data is safe.'}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false, message: '' })}>
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
