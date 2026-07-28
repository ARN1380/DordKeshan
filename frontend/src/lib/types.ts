import type { CategoryKey } from "./categories"

export interface Person {
  id: string
  collectionId: string
  collectionName: string
  name: string
  slug: string
  title: string
  bio: string
  categories: string
  photo: string
  order: number
  created: string
  updated: string
}

export interface SpeechCollection {
  id: string
  collectionId: string
  collectionName: string
  person: string
  title: string
  description: string
  cover_image: string
  order: number
  created: string
  updated: string
  speeches?: Speech[]
}

export interface Speech {
  id: string
  collectionId: string
  collectionName: string
  collection: string
  title: string
  audio: string
  description: string
  duration: string
  date: string
  order: number
  created: string
  updated: string
}
