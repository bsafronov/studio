import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sheets/$sheetId/logs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/$sheetId/logs"!</div>
}
