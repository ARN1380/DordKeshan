export type CategoryKey =
  | "mystical"
  | "philosophical"
  | "literary"
  | "spiritual"
  | "social"
  | "psychological"

export interface Category {
  key: CategoryKey
  label: string
  description: string
}

export const categories: Category[] = [
  { key: "mystical", label: "عرفانی", description: "سخنانی از جنس دل و راز" },
  { key: "philosophical", label: "فلسفی", description: "اندیشه در هستی و انسان" },
  { key: "literary", label: "ادبی", description: "شعر، ادب و روایت" },
  { key: "spiritual", label: "معنوی", description: "معنا و آرامش درون" },
  { key: "social", label: "اجتماعی", description: "انسان و جامعه" },
  { key: "psychological", label: "روانشناسی", description: "شناخت خویشتن" },
]

export function parseCategories(raw: string | null | undefined): CategoryKey[] {
  if (!raw) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean) as CategoryKey[]
}

export function getCategoryLabel(key: CategoryKey): string {
  return categories.find((c) => c.key === key)?.label ?? key
}
