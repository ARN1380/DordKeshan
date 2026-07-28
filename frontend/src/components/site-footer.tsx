import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <span className="text-lg font-bold">د</span>
            </span>
            <span className="text-xl font-bold">دُردکشان</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            گنجینه‌ای از سخنرانی‌های الهام‌بخش اندیشمندان، عارفان و ادیبان پارسی.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">پیوندها</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">خانه</Link></li>
            <li><a href="#speakers" className="hover:text-foreground transition-colors">سخنوران</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">درباره ما</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">با ما در ارتباط باشید</h4>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            دُردکشان یک پروژه‌ی مستقل فرهنگی است. پیشنهاد و نقد شما راهگشای ماست.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © دُردکشان — تمام حقوق برای عاشقانِ سخن محفوظ است.
      </div>
    </footer>
  )
}
