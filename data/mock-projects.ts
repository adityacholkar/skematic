export interface MockProject {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export const MOCK_MY_PROJECTS: MockProject[] = [
  { id: "p1", name: "E-commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "p2", name: "Auth Service", slug: "auth-service", isOwned: true },
]

export const MOCK_SHARED_PROJECTS: MockProject[] = [
  { id: "p3", name: "Data Pipeline", slug: "data-pipeline", isOwned: false },
]
