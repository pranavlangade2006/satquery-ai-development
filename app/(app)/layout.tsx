import { WorkflowProvider } from "@/components/workflow-provider"
import { AppShell } from "@/components/app-shell"

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkflowProvider>
      <AppShell>{children}</AppShell>
    </WorkflowProvider>
  )
}
