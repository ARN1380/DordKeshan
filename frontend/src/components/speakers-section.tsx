"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useMemo, useState } from "react"
import type { Person } from "@/lib/types"
import { categories, parseCategories, getCategoryLabel, type CategoryKey } from "@/lib/categories"
import { getFileUrl } from "@/lib/pb"

interface PersonWithCounts extends Person {
  collectionCount: number
  episodeCount: number
}

interface Props {
  people: PersonWithCounts[]
}

export function SpeakersSection({ people }: Props) {
  const [active, setActive] = useState<CategoryKey | "all">("all")

  const filtered = useMemo(
    () =>
      active === "all"
        ? people
        : people.filter((p) => parseCategories(p.categories).includes(active)),
    [active, people],
  )

  return (
    <>
      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">دسته‌بندی سخنان</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              هر دسته دریچه‌ای است به گونه‌ای از اندیشه.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryChip label="همه" active={active === "all"} onClick={() => setActive("all")} />
          {categories.map((c) => (
            <CategoryChip
              key={c.key}
              label={c.label}
              active={active === c.key}
              onClick={() => setActive(c.key)}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = people.filter((p) => parseCategories(p.categories).includes(c.key)).length
            return (
              <button
                key={c.key}
                onClick={() => {
                  setActive(c.key)
                  document.getElementById("speakers")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`group rounded-2xl border border-border bg-card/60 p-5 text-right transition hover:border-primary/40 hover:bg-card ${
                  active === c.key ? "border-primary/60 shadow-soft" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{c.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {count} سخنور
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Speakers grid */}
      <section id="speakers" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">سخنوران</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {filtered.length} سخنور در دسته‌ی انتخابی
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person) => {
            const personCategories = parseCategories(person.categories)
            return (
              <Link
                key={person.id}
                href={`/people/${person.slug}`}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-warm"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {person.photo ? (
                    <img
                      src={getFileUrl(person, person.photo)}
                      alt={person.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-6xl font-bold text-muted-foreground/30">
                      {person.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {personCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {personCategories.slice(0, 2).map((k) => (
                          <span
                            key={k}
                            className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] text-white backdrop-blur"
                          >
                            {getCategoryLabel(k)}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="mt-3 text-2xl font-bold text-white">{person.name}</h3>
                    {person.title && (
                      <p className="mt-1 text-sm text-white/80">{person.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <span className="text-sm text-muted-foreground">
                    {person.collectionCount} مجموعه · {person.episodeCount} قسمت
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    ورود
                    <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}
