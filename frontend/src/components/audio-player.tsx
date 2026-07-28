"use client"

import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Props {
  src: string
  title: string
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return "۰:۰۰"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  const fa = (n: number) =>
    String(n)
      .split("")
      .map((d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d)
      .join("")
  return `${fa(m)}:${fa(s).padStart(2, "۰")}`
}

export function AudioPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setPlaying(false)
    setCurrent(0)
  }, [src])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) el.pause()
    else el.play()
    setPlaying(!playing)
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current
    if (!el) return
    const val = Number(e.target.value)
    el.currentTime = val
    setCurrent(val)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm transition hover:scale-105"
          aria-label={playing ? "توقف" : "پخش"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{title}</div>
          <div className="mt-2 flex items-center gap-3">
            <span className="w-10 text-xs tabular-nums text-muted-foreground">{formatTime(current)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={current}
              onChange={onSeek}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[color:var(--primary)]"
            />
            <span className="w-10 text-xs tabular-nums text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
