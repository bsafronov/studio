import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sheets/$sheetId/columns/$rowId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/$sheetId/columns/$rowId"!</div>
}
