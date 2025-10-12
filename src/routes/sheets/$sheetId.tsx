import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sheets/$sheetId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/$sheetId"!</div>
}
