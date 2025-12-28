import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'

export default async function EditorPage() {
  const { userId } = await auth() // ⬅️ WAJIB await

  if (!userId) {
    redirect('/sign-in')
  }

  return <AppShell />
}
