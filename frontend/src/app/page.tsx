import { Headphones, Sparkles } from "lucide-react"
import pb from "@/lib/pb"
import type { Person, SpeechCollection, Speech } from "@/lib/types"
import { SpeakersSection } from "@/components/speakers-section"

async function getPeopleWithCounts() {
  try {
    const people = (await pb.collection("people").getFullList({
      sort: "order",
      requestKey: undefined,
    })) as unknown as Person[]

    const peopleWithCounts = await Promise.all(
      people.map(async (person) => {
        let collections: SpeechCollection[] = []
        try {
          collections = (await pb.collection("speech_collections").getFullList({
            filter: `person = "${person.id}"`,
            requestKey: undefined,
          })) as unknown as SpeechCollection[]
        } catch {
          // ignore
        }

        let episodeCount = 0
        for (const col of collections) {
          try {
            const speeches = (await pb.collection("speeches").getFullList({
              filter: `collection = "${col.id}"`,
              requestKey: undefined,
            })) as unknown as Speech[]
            episodeCount += speeches.length
          } catch {
            // ignore
          }
        }

        return {
          ...person,
          collectionCount: collections.length,
          episodeCount,
        }
      }),
    )

    return peopleWithCounts
  } catch {
    return []
  }
}

export default async function HomePage() {
  const people = await getPeopleWithCounts()

  const totalCollections = people.reduce((a, p) => a + p.collectionCount, 0)
  const totalEpisodes = people.reduce((a, p) => a + p.episodeCount, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-40"
          style={{
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              گنجینه‌ی سخنرانی‌های ناب پارسی
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              صدای <span className="text-gradient-warm">حکمت</span> را
              <br />
              با جان بشنو
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              دُردکشان مجموعه‌ای است از سخنرانی‌های اندیشمندان، عارفان و ادیبان پارسی —
              گردآمده در یک جا، دسته‌بندی‌شده و آماده‌ی شنیدن.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#speakers"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-warm transition hover:scale-105"
              >
                <Headphones className="h-4 w-4" />
                شروع شنیدن
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
              >
                کاوش دسته‌ها
              </a>
            </div>
            <div className="mt-14 grid grid-cols-3 gap-4 border-t border-border/50 pt-8 text-center sm:mx-auto sm:max-w-lg">
              <Stat n={people.length} label="سخنور" />
              <Stat n={totalCollections} label="مجموعه" />
              <Stat n={totalEpisodes} label="قسمت" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories + Speakers (client-side filtering) */}
      {people.length > 0 ? (
        <SpeakersSection people={people} />
      ) : (
        <section id="speakers" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <p className="text-muted-foreground text-sm">هنوز سخنرانی ثبت نشده است</p>
        </section>
      )}

      {/* About strip */}
      <section id="about" className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            چرا <span className="text-gradient-warm">دُردکشان</span>؟
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            «دُرد» ته‌نشین شراب است؛ خالص‌ترین بخشِ آن. ما اینجا کوشیده‌ایم دُردِ سخنِ
            بزرگان را برای شما نگاه داریم — کلماتی که در گذر زمان ماندگار شده‌اند و هنوز
            دل را روشن می‌کنند.
          </p>
        </div>
      </section>
    </div>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-gradient-warm">{n}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
