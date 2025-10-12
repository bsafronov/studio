import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sheets/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sheets/new"!</div>
}
