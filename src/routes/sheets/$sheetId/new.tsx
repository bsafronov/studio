import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sheets/$sheetId/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/$sheetId/new"!</div>
}
