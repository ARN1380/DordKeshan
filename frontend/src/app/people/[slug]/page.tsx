import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ListMusic } from "lucide-react"
import pb, { getFileUrl } from "@/lib/pb"
import type { Person, SpeechCollection, Speech } from "@/lib/types"
import { parseCategories, getCategoryLabel } from "@/lib/categories"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPerson(slug: string): Promise<Person | null> {
  try {
    const records = await pb.collection("people").getFullList({
      filter: `slug = "${slug}"`,
      requestKey: undefined,
    })
    return (records[0] as unknown as Person) || null
  } catch {
    return null
  }
}

async function getCollectionsWithSpeeches(personId: string) {
  try {
    const collections = (await pb.collection("speech_collections").getFullList({
      filter: `person = "${personId}"`,
      sort: "order",
      requestKey: undefined,
    })) as unknown as SpeechCollection[]

    return Promise.all(
      collections.map(async (col) => {
        let speeches: Speech[] = []
        try {
          speeches = (await pb.collection("speeches").getFullList({
            filter: `collection = "${col.id}"`,
            sort: "order",
            requestKey: undefined,
          })) as unknown as Speech[]
        } catch {
          // ignore
        }
        return { ...col, speeches }
      }),
    )
  } catch {
    return []
  }
}

export default async function PersonPage({ params }: PageProps) {
  const { slug } = await params
  const person = await getPerson(slug)
  if (!person) notFound()

  const collections = await getCollectionsWithSpeeches(person.id)
  const totalEpisodes = collections.reduce((sum, c) => sum + c.speeches.length, 0)
  const personCategories = parseCategories(person.categories)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        {person.photo && (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${getFileUrl(person, person.photo)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(60px)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به خانه
          </Link>
          <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:items-end">
            {person.photo && (
              <div className="overflow-hidden rounded-3xl border border-border shadow-warm">
                <img
                  src={getFileUrl(person, person.photo)}
                  alt={person.name}
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                />
              </div>
            )}
            <div>
              {personCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {personCategories.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                    >
                      {getCategoryLabel(k)}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{person.name}</h1>
              {person.title && (
                <p className="mt-2 text-lg text-[color:var(--gold)]">{person.title}</p>
              )}
              {person.bio && (
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">{person.bio}</p>
              )}
              <div className="mt-6 flex gap-6 text-sm text-muted-foreground">
                <span>
                  <b className="text-foreground">{collections.length}</b> مجموعه
                </span>
                <span>
                  <b className="text-foreground">{totalEpisodes}</b> قسمت
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">مجموعه‌های سخنرانی</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          هر مجموعه پیرامون یک موضوع، در چند قسمت گرد آمده است.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/people/${slug}/collections/${collection.id}`}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-warm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <ListMusic className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {collection.speeches.length} قسمت
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{collection.title}</h3>
              {collection.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">{collection.description}</p>
              )}
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                باز کردن مجموعه
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
        {collections.length === 0 && (
          <div className="border-t border-border pt-16">
            <p className="text-muted-foreground text-sm">هنوز مجموعه‌ای ثبت نشده است</p>
          </div>
        )}
      </section>
    </div>
  )
}
