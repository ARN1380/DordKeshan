# PRODUCT.md — دُردکشان

## What this is
A self-hosted Persian (Farsi) RTL website for browsing notable Shia Islamic scholars and listening to their speech recordings. Collections group serial voices per person.

## Audience
Persian-speaking Muslims interested in Islamic scholarship, mysticism (irfan), and philosophy. They come to learn, listen, and reflect — not to buy or browse casually.

## Mode: Read
The visitor understands something. This is a listening/learning experience, not a marketplace or dashboard.

## Content
- 3 scholars: سید حیدر آملی, علامه طباطبایی, آیت‌الله حسن‌زاده آملی
- 9 speech collections across the scholars
- 12 speeches with audio, descriptions, durations
- Real Wikipedia portrait images

## Technical
- Next.js 16, TypeScript, Tailwind v4, shadcn/ui
- PocketBase backend (public read, admin write)
- RTL with Vazirmatn font
- Docker + Caddy deployment
- Dark/light theme toggle
