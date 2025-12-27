export type PageId = string

export type Page = {
  id: PageId
  title: string
  content: string
  parentId?: PageId | null
}
