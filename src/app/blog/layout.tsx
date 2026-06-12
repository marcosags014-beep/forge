import { BlogFooter } from '@/components/BlogFooter'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BlogFooter />
    </>
  )
}
