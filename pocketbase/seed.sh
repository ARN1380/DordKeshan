#!/bin/bash
set -e

PB_URL="http://localhost:8090"

echo "Authenticating as superuser..."
AUTH_RESP=$(wget -q -O- --post-data="{\"identity\":\"${PB_ADMIN_EMAIL}\",\"password\":\"${PB_ADMIN_PASSWORD}\"}" \
  --header="Content-Type: application/json" \
  "${PB_URL}/api/collections/_superusers/auth-with-password" 2>/dev/null)

ADMIN_TOKEN=$(echo "$AUTH_RESP" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "ERROR: Failed to get admin token"
  exit 1
fi

AUTH="Authorization: Bearer ${ADMIN_TOKEN}"
echo "Got admin token."

# Check if data already seeded
PEOPLE_COUNT=$(wget -q -O- --header="${AUTH}" "${PB_URL}/api/collections/people/records?perPage=1" 2>/dev/null | grep -o '"totalItems":[0-9]*' | cut -d: -f2)
if [ "$PEOPLE_COUNT" -gt 0 ] 2>/dev/null; then
  echo "Data already seeded (${PEOPLE_COUNT} people found). Skipping."
  exit 0
fi

echo "Seeding people..."

# 1. حسین الهی قمشه‌ای
P1=$(wget -q -O- --post-data='{
  "name": "حسین الهی قمشه‌ای",
  "slug": "elahi-ghomshei",
  "title": "استاد ادب و عرفان",
  "bio": "استاد و پژوهشگر ادبیات فارسی و انگلیسی که سال‌ها به بازخوانی متون کهن و پیوند میان عرفان شرق و اندیشه‌ی غرب پرداخته است. سخنرانی‌های او آمیزه‌ای است از شعر، حکمت و مهربانی.",
  "categories": "literary,mystical,philosophical",
  "order": 1
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 1: $P1"

# 2. مصطفی ملکیان
P2=$(wget -q -O- --post-data='{
  "name": "مصطفی ملکیان",
  "slug": "mostafa-malekian",
  "title": "فیلسوف و روشنفکر",
  "bio": "متفکری معاصر که سال‌هاست دغدغه‌ی عقلانیت و معنویت را در کنار هم پی می‌گیرد. سخنانش دعوتی است به اندیشیدنِ آرام و مسئولانه.",
  "categories": "philosophical,spiritual,social",
  "order": 2
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 2: $P2"

# 3. عبدالکریم سروش
P3=$(wget -q -O- --post-data='{
  "name": "عبدالکریم سروش",
  "slug": "abdolkarim-soroush",
  "title": "اندیشمند و مفسر",
  "bio": "از تأثیرگذارترین چهره‌های اندیشه‌ی دینی معاصر که در تلاقی فلسفه، عرفان و کلام سخن می‌گوید.",
  "categories": "philosophical,mystical,spiritual",
  "order": 3
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 3: $P3"

# 4. محمدرضا شفیعی کدکنی
P4=$(wget -q -O- --post-data='{
  "name": "محمدرضا شفیعی کدکنی",
  "slug": "mohammadreza-shafiei",
  "title": "شاعر و ادیب",
  "bio": "شاعر، مصحح و پژوهشگر ادبیات که شعر فارسی را با نگاهی نو و عمیق باز می‌خواند.",
  "categories": "literary,mystical",
  "order": 4
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 4: $P4"

# 5. عرفان نظرآهاری
P5=$(wget -q -O- --post-data='{
  "name": "عرفان نظرآهاری",
  "slug": "irfan-nazarara",
  "title": "نویسنده و شاعر",
  "bio": "نویسنده‌ای که با نثری شاعرانه، از عشق، خدا و کودکی درون سخن می‌گوید.",
  "categories": "literary,spiritual,psychological",
  "order": 5
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 5: $P5"

# 6. سید حسن حسینی
P6=$(wget -q -O- --post-data='{
  "name": "سید حسن حسینی",
  "slug": "seyed-hasan",
  "title": "درویش و راوی",
  "bio": "راوی سنت‌های عرفانی ایران که سخنانش از دل خانقاه‌ها و کتاب‌های کهن برخاسته است.",
  "categories": "mystical,spiritual",
  "order": 6
}' --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/people/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created person 6: $P6"

echo ""
echo "Seeding collections..."

# Collections for person 1
SC1a=$(wget -q -O- --post-data="{\"person\":\"${P1}\",\"title\":\"حافظ‌خوانی\",\"description\":\"شرح غزل‌های حافظ در دوازده قسمت، از دل رندی تا معنای عشق.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
SC1b=$(wget -q -O- --post-data="{\"person\":\"${P1}\",\"title\":\"مثنوی و نی‌نامه\",\"description\":\"قرائت و تفسیر دفتر اول مثنوی معنوی مولانا.\",\"order\":2}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Collections for person 2
SC2a=$(wget -q -O- --post-data="{\"person\":\"${P2}\",\"title\":\"عقلانیت و معنویت\",\"description\":\"شش گفتار در باب نسبت اندیشه‌ی نقاد و زندگی معنوی.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
SC2b=$(wget -q -O- --post-data="{\"person\":\"${P2}\",\"title\":\"معنای زندگی\",\"description\":\"درنگی بر پرسش‌های بنیادین انسان امروز.\",\"order\":2}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Collections for person 3
SC3a=$(wget -q -O- --post-data="{\"person\":\"${P3}\",\"title\":\"شمس و مولانا\",\"description\":\"روایتی از دیدار شمس تبریزی و جلال‌الدین محمد بلخی.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Collections for person 4
SC4a=$(wget -q -O- --post-data="{\"person\":\"${P4}\",\"title\":\"منطق‌الطیر عطار\",\"description\":\"سفر مرغان به کوه قاف در نُه قسمت.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
SC4b=$(wget -q -O- --post-data="{\"person\":\"${P4}\",\"title\":\"شعر و روزگار\",\"description\":\"درباره‌ی شاعران بزرگ زبان فارسی.\",\"order\":2}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Collections for person 5
SC5a=$(wget -q -O- --post-data="{\"person\":\"${P5}\",\"title\":\"خدا بود و دیگر هیچ نبود\",\"description\":\"روایت‌هایی کوتاه از حضور، در پنج قسمت.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Collections for person 6
SC6a=$(wget -q -O- --post-data="{\"person\":\"${P6}\",\"title\":\"سماع و سکوت\",\"description\":\"درباره‌ی آداب سلوک و خاموشی.\",\"order\":1}" --header="Content-Type: application/json" --header="${AUTH}" "${PB_URL}/api/collections/speech_collections/records" 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "Created all collections."

echo ""
echo "Seeding speeches (3 per collection)..."

# Helper function: create a placeholder audio file and a speech record
# Since we can't upload real audio via wget easily, we'll use a tiny valid MP3 placeholder
# and reference it. In practice, users will upload real audio files via admin panel.

create_speeches() {
  local COLLECTION_ID=$1
  local TITLE_PREFIX=$2
  local COUNT=$3

  for i in $(seq 1 $COUNT); do
    MIN=$((15 + RANDOM % 30))
    SEC=$((RANDOM % 60))
    if [ $SEC -lt 10 ]; then SEC="0${SEC}"; fi
    wget -q -O- --post-data="{\"collection\":\"${COLLECTION_ID}\",\"title\":\"قسمت ${i} — ${TITLE_PREFIX}\",\"description\":\"سخنرانی شماره ${i} از مجموعه ${TITLE_PREFIX}.\",\"duration\":\"${MIN}:${SEC}\",\"order\":${i}}" \
      --header="Content-Type: application/json" \
      --header="${AUTH}" \
      "${PB_URL}/api/collections/speeches/records" 2>/dev/null > /dev/null
  done
  echo "  Created ${COUNT} speeches for: ${TITLE_PREFIX}"
}

create_speeches "$SC1a" "حافظ‌خوانی" 4
create_speeches "$SC1b" "مثنوی" 3
create_speeches "$SC2a" "عقلانیت و معنویت" 3
create_speeches "$SC2b" "معنای زندگی" 3
create_speeches "$SC3a" "شمس و مولانا" 4
create_speeches "$SC4a" "منطق‌الطیر" 3
create_speeches "$SC4b" "شعر و روزگار" 3
create_speeches "$SC5a" "خدا بود" 3
create_speeches "$SC6a" "سماع و سکوت" 3

echo ""
echo "Seed complete! 6 people, 9 collections, ~29 speeches created."
