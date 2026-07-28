"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState, use } from "react"
import pb, { getFileUrl } from "@/lib/pb"
import type { Person, SpeechCollection, Speech } from "@/lib/types"
import { AudioPlayer } from "@/components/audio-player"

interface PageProps {
  params: Promise<{ slug: string; id: string }>
}

export default function CollectionPage({ params }: PageProps) {
  const { slug, id } = use(params)
  const [person, setPerson] = useState<Person | null>(null)
  const [collection, setCollection] = useState<SpeechCollection | null>(null)
  const [speeches, setSpeeches] = useState<Speech[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const records = await pb.collection("people").getFullList({
          filter: `slug = "${slug}"`,
          requestKey: undefined,
        })
        const p = (records[0] as unknown as Person) || null
        setPerson(p)

        const c = await pb.collection("speech_collections").getOne(id, {
          requestKey: undefined,
        })
        const col = c as unknown as SpeechCollection
        setCollection(col)

        if (p && col && col.person === p.id) {
          const s = await pb.collection("speeches").getFullList({
            filter: `collection = "${col.id}"`,
            sort: "order",
            requestKey: undefined,
          })
          const speechList = s as unknown as Speech[]
          setSpeeches(speechList)
          if (speechList.length > 0) setActiveId(speechList[0].id)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, id])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!person || !collection || collection.person !== person.id) {
    return (
      <div className="grid min-h-screen place-items-center text-center">
        <div>
          <h1 className="text-2xl font-bold">مجموعه یافت نشد</h1>
          <Link href="/" className="mt-4 inline-block text-primary">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    )
  }

  const active = speeches.find((s) => s.id === activeId) ?? speeches[0]

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/60 bg-gradient-warm">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Link
            href={`/people/${person.slug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به {person.name}
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-[color:var(--gold)]">مجموعه‌ای از {person.name}</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{collection.title}</h1>
              {collection.description && (
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card px-5 py-3 text-center">
              <div className="text-3xl font-bold text-gradient-warm">{speeches.length}</div>
              <div className="text-xs text-muted-foreground">سخنرانی</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {active && (
          <div className="sticky top-20 z-20 mb-8">
            <AudioPlayer src={getFileUrl(active, active.audio)} title={active.title} />
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold">فهرست سخنرانی‌ها</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {speeches.map((speech, idx) => {
            const isActive = speech.id === activeId
            return (
              <li key={speech.id}>
                <button
                  onClick={() => setActiveId(speech.id)}
                  className={`flex w-full items-center gap-4 px-5 py-4 text-right transition ${
                    isActive ? "bg-muted/60" : "hover:bg-muted/40"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "▶" : String(idx + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{speech.title}</div>
                    {speech.duration && (
                      <div className="text-xs text-muted-foreground">مدت: {speech.duration}</div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isActive ? "در حال پخش" : "پخش"}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {speeches.length === 0 && (
          <div className="border-t border-border pt-16">
            <p className="text-muted-foreground text-sm">هنوز سخنرانی ثبت نشده است</p>
          </div>
        )}
      </section>
    </div>
  )
}
