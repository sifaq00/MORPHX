# DESIGN.md — Pump.fun Token Concept Generator UI

> Dokumen ini adalah acuan desain lengkap untuk coding agent yang akan me-rebuild UI ini
> secara pixel-accurate. Semua nilai warna adalah hasil estimasi visual dari screenshot
> (color-matched manual, bukan hasil ekstraksi dari source code asli). Sebelum final ship,
> verifikasi ulang dengan color picker terhadap referensi asli jika tersedia.

---

## 1. Ringkasan Produk

- **Nama produk**: Pump.fun — Token Concept Generator
- **Tagline**: "Token Concept Generator"
- **Fungsi halaman**: Form generator satu-input → AI menghasilkan konsep token meme
  (ticker, name, tagline, description, lore, avatar) → user bisa launch ke pump.fun.
- **Mood/vibe**: Dark, gritty, "meme-crypto underground" — background foto vintage
  sephia (kamar mandi tua/abandoned aesthetic) dengan overlay gelap, dikombinasi
  dengan accent hijau-lime terang khas crypto/pump culture.
- **Layout dasar**: 3 kolom — sidebar kiri (input & bantuan), area tengah (hero image +
  floating concept cards + step tracker), sidebar kanan (hasil generate / summary card).

---

## 2. Design Tokens

### 2.1 Warna (Color Tokens)

```css
:root {
  /* === Base / Background === */
  --bg-app: #0a0b08;              /* background utama halaman, hitam kehijauan gelap */
  --bg-header: #0d0e0a;           /* header bar, sedikit lebih gelap/flat */
  --bg-panel: #14150f;            /* card / panel kiri-kanan */
  --bg-panel-alt: #17180f;        /* sub-card di dalam panel (mis. inspirasi item) */
  --bg-input: #101208;            /* textarea/input fields */
  --bg-overlay-image: rgba(8, 9, 6, 0.55); /* overlay gelap di atas hero photo */
  --bg-tooltip-card: #1b1c14e6;   /* floating card di atas foto (ticker/name/tagline/lore) */
  --bg-step-card: #14150fcc;      /* card "Your Token Concept" di bawah tengah, semi-transparent */

  /* === Border === */
  --border-subtle: #2a2c1f;       /* border tipis default semua card */
  --border-input: #2f321f;        /* border textarea */
  --border-active-nav: transparent;

  /* === Text === */
  --text-primary: #f4f3ec;        /* heading & value text, off-white/cream */
  --text-secondary: #a9ab9d;      /* body/paragraph text (deskripsi, tagline value) */
  --text-muted: #74766a;          /* placeholder, caption kecil, char counter */
  --text-label: #9ea36f;          /* label kecil uppercase spt "TICKER", "NAME", "TAGLINE" */
  --text-on-accent: #14170a;      /* teks di atas tombol lime */

  /* === Accent (signature color) === */
  --accent-lime: #cbe83f;         /* tombol utama "Generate Concept" / "Launch on pump.fun" */
  --accent-lime-hover: #dbf569;   /* hover state tombol lime */
  --accent-lime-text: #b8d94a;    /* teks/logo icon berwarna lime di header */

  /* === Nav === */
  --nav-active-bg: #3a3f26;       /* pill background tab "Generate" yang aktif */
  --nav-active-text: #f4f3ec;
  --nav-inactive-text: #9a9c8e;

  /* === Semantic / brand icons === */
  --solana-purple: #9945ff;
  --solana-teal: #14f195;

  /* === Misc === */
  --divider: #23241a;
  --shadow-panel: 0 8px 24px rgba(0,0,0,0.45);
}
```

**Catatan palet:**
- Warna dasar bukan hitam murni (`#000`), melainkan hitam dengan tint olive/hijau gelap
  (hue sekitar 70-90°) — ini yang bikin keseluruhan UI terasa "earthy/military-green"
  alih-alih netral abu-abu.
- Lime accent (`#cbe83f`) adalah satu-satunya warna terang/saturated di seluruh UI —
  dipakai sangat konsisten hanya untuk 2 elemen: tombol CTA utama & label ticker highlight.
  Jangan pakai lime untuk elemen dekoratif lain.
- Label section (huruf kecil uppercase seperti "ONE LINE IDEA", "NEED INSPIRATION?",
  "GENERATED CONCEPT") memakai warna olive-lime yang lebih redup (`--text-label`), bukan
  putih dan bukan lime terang — ini pembeda hierarki penting.

### 2.2 Tipografi

```css
:root {
  --font-sans: "Inter", "Helvetica Neue", system-ui, -apple-system, sans-serif;

  /* Type scale */
  --text-xs: 11px;    /* char counter, tips kecil */
  --text-sm: 12.5px;  /* label uppercase, caption */
  --text-base: 14px;  /* body text, value text di panel kanan */
  --text-md: 15px;    /* nav items, button text */
  --text-lg: 17px;    /* card titles ("ONE LINE IDEA" besar / nama produk) */
  --text-xl: 20px;    /* logo "PUMP.FUN" */

  --leading-tight: 1.25;
  --leading-normal: 1.5;

  --tracking-label: 0.06em;   /* letter-spacing untuk semua label uppercase */
  --tracking-normal: 0;
}
```

- Font terlihat geometric sans-serif modern (Inter / Helvetica Neue-ish). Angka & huruf
  tegak, tanpa serif, medium x-height.
- Logo "PUMP.FUN" — bold, huruf besar, warna cream/putih; subtitle "TOKEN CONCEPT
  GENERATOR" di bawahnya kecil, tracked-out, warna muted.
- Semua label field (TICKER, NAME, TAGLINE, DESCRIPTION, LORE, dsb.) → **uppercase**,
  ukuran kecil (~11-12px), letter-spacing lebar, warna `--text-label`, font-weight 500-600.
- Value di bawah label → normal case, warna `--text-primary`, weight 500, ukuran 14-15px.

### 2.3 Spacing Scale

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
}
```

Gunakan skala 4px-based. Padding standar card panel: `20-24px`. Gap antar card dalam
sidebar: `16-20px`. Gap antar elemen dalam card (label→value): `4-8px`.

### 2.4 Radius & Border

```css
:root {
  --radius-sm: 8px;    /* input, button kecil */
  --radius-md: 12px;   /* card panel */
  --radius-lg: 16px;   /* card besar / floating tooltip card */
  --radius-full: 999px; /* avatar, nav pill aktif, icon badge bulat */

  --border-width: 1px;
}
```

Semua card memakai border tipis 1px solid `--border-subtle`, radius medium-large
(`10-16px`), tanpa shadow yang berat — hanya elevation halus untuk floating cards di
atas foto.

---

## 3. Struktur Layout Global

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER (fixed top, full width, height ~64px)                             │
│  [Logo+Subtitle]   [Nav: Home | Generate* | My Concepts | Leaderboard |  │
│                      Community | How it works]      [Cart] [Avatar▾]     │
├───────────────┬────────────────────────────────────────┬─────────────────┤
│  LEFT SIDEBAR │            HERO / IMAGE AREA            │  RIGHT SIDEBAR  │
│  (fixed ~270px)│         (flex-grow, relative)          │  (fixed ~280px) │
│               │                                          │                 │
│  [One Line    │   [background photo, dark overlay]      │ [Generated      │
│   Idea card]  │   [floating tooltip cards positioned    │  Concept card]  │
│               │    absolutely: Ticker, Name, Tagline,   │                 │
│  [Need        │    Lore — scattered over the image]     │  - avatar bulat │
│   Inspiration │                                          │  - ticker       │
│   card]       │   [bottom-center overlapping card:      │  - name         │
│               │    "Your Token Concept" step tracker     │  - tagline      │
│  [Launch on   │    Idea → Generate → Launch + 2 buttons] │  - description  │
│   pump.fun    │                                          │  - lore         │
│   promo card] │                                          │  - est cost /   │
│               │                                          │    network /    │
│               │                                          │    platform     │
│               │                                          │  - CTA button   │
├───────────────┴────────────────────────────────────────┴─────────────────┤
│  FOOTER (centered, tiny text): "Built with 🖤 for the meme economy"      │
│                                  "Not financial advice. DYOR."            │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Grid**: 3-kolom dengan sidebar fixed-width kiri & kanan (~260-290px), kolom tengah
  flexible (`flex: 1`), semua dalam 1 baris tinggi penuh viewport minus header/footer.
  Gunakan CSS Grid: `grid-template-columns: 280px 1fr 300px;` dengan gap ~24px, padding
  luar halaman ~24px.
- Kolom tengah adalah **positioning context** (`position: relative`) untuk foto
  background + card-card yang di-absolute-position di atasnya.
- Card "Your Token Concept" di bagian bawah tengah **overlap** ke foto (posisi absolute,
  bottom: 0, sedikit menjorok ke bawah keluar dari foto/rounded container).

---

## 4. Spesifikasi Komponen

### 4.1 Header / Navbar

- Height: `~64px`, background `--bg-header`, border-bottom 1px `--border-subtle`.
- Kiri: logo icon (bentuk seperti bendera/pin kecil warna lime) + teks "PUMP.FUN" (bold,
  putih/cream, ~18px) dengan subtitle "TOKEN CONCEPT GENERATOR" di bawahnya (10px, muted,
  tracked).
- Tengah: nav horizontal, item: `Home`, `Generate`, `My Concepts`, `Leaderboard`,
  `Community`, `How it works`. Font ~14px, warna default `--nav-inactive-text`.
  - Item aktif (`Generate`) mendapat **pill background** `--nav-active-bg` (radius full),
    padding horizontal ~16px vertical ~8px, teks warna `--nav-active-text`.
- Kanan: icon cart (outline), avatar bulat (foto profil) + chevron dropdown kecil.

### 4.2 Left Sidebar

**Card 1 — "ONE LINE IDEA"**
- Icon bohlam/lightbulb kecil warna lime di sebelah label.
- Label uppercase "ONE LINE IDEA" (bold, putih, ~14px — ini beda dari label kecil biasa,
  size lebih besar karena jadi card title).
- Deskripsi kecil abu-abu: "Give us the idea. One sentence is enough: a mood, a meme, a
  headline."
- Textarea besar, background `--bg-input`, border `--border-input`, radius `--radius-sm`,
  placeholder/isi teks contoh: "When in doubt, ape it out."
- Counter karakter kanan-bawah textarea: `18 / 120`, kecil, muted, align right.
- Tombol **"⚡ Generate Concept"** — full width, background `--accent-lime`, teks gelap
  (`--text-on-accent`), bold, radius `--radius-sm`, icon petir di kiri teks.
- Tombol **"🎲 Random Idea"** — full width, secondary style: background `--bg-panel-alt`,
  border `--border-subtle`, teks putih, icon dice di kiri.

**Card 2 — "NEED INSPIRATION?"**
- Label section kecil uppercase warna `--text-label`.
- List 5 item contoh ide (mis. "When in doubt, ape it out.", "Exit liquidity? No, I am.",
  dst), tiap item: teks putih kecil kiri + chevron `›` kanan, hover-able/clickable row.
- Divider antar item sangat tipis atau hanya spacing.

**Card 3 — "Launch on pump.fun" (promo)**
- Icon roket di kiri atas.
- Judul bold "Launch on pump.fun" + icon external-link kecil di sampingnya.
- Deskripsi 2 baris kecil abu-abu: "Generate your token concept and launch it directly
  on pump.fun in one click."

Semua 3 card memakai background `--bg-panel`, border `--border-subtle`, radius
`--radius-md`, padding `20px`, gap vertikal antar card `16px`.

### 4.3 Area Tengah (Hero Image)

- Container full-height, radius besar (`--radius-lg`), overflow hidden, berisi
  `<img>` foto vintage (kamar mandi/bathtub sephia tua) yang di-cover-fit.
- Overlay gradient gelap tipis di atas foto (`--bg-overlay-image`) supaya card di
  atasnya tetap terbaca.
- **Floating tooltip cards** — 4 buah, posisi absolute tersebar di berbagai titik foto
  (tidak grid, terkesan "ditempel" secara acak/artistik):
  1. Ticker card (kiri-atas): avatar kecil bulat (karakter kodok hijau) + label
     "Ticker" + value "WAGMI" + icon checkmark kecil.
  2. Name card (kanan-atas): avatar kecil + label "Name" + value "We All Gonna Make
     It" + icon checkmark.
  3. Tagline card (tengah): avatar kecil + label "Tagline" + value 2 baris "We don't
     chase dreams, we mint them." + icon sparkle.
  4. Lore card (kiri-bawah, lebih lebar): avatar kecil + label "Lore (one line)" +
     value 2 baris kalimat lore + icon checkmark.
  - Tiap tooltip card: background `--bg-tooltip-card` (semi-transparan gelap), border
    tipis, radius `--radius-md`, padding `10-14px`, shadow halus, layout horizontal
    (avatar kiri, teks kanan), max-width ~220-260px.
  - Avatar kecil di tiap card: bulat, ukuran ~36px, foto karakter kodok hijau
    kacamata hitam (pepe-style).

- **Bottom step card — "YOUR TOKEN CONCEPT"** (overlap di bagian bawah foto,
  melebar hampir full-width kolom tengah, sedikit menjorok keluar container foto):
  - Icon sparkle + judul "YOUR TOKEN CONCEPT" (bold putih).
  - Subtitle kecil abu-abu: "One sentence. Infinite possibilities."
  - 3-step horizontal tracker dengan panah penghubung:
    `💡 Idea (Your one line input)` → `✨ Generate (We craft the full concept)` →
    `🚀 Launch (Take it to pump.fun)`
    - Tiap step: icon dalam lingkaran (background sedikit lebih terang untuk step
      aktif/tengah — "Generate" terlihat highlighted lime/terang, dua lainnya redup),
      label bold di bawah icon, deskripsi kecil di bawah label.
  - 2 tombol bawah berdampingan: **"⬇ Download Concept"** (secondary/outline) dan
    **"🖼 Change Background"** (secondary/outline). Sama-sama style outline gelap,
    tidak pakai lime (karena bukan CTA utama).
  - Background card: `--bg-step-card`, border `--border-subtle`, radius `--radius-lg`,
    shadow `--shadow-panel`.

### 4.4 Right Sidebar — "GENERATED CONCEPT"

- Panel background `--bg-panel`, border `--border-subtle`, radius `--radius-md`,
  padding `20-24px`.
- Label section "GENERATED CONCEPT" uppercase kecil, warna `--text-label`, top-left.
- **Avatar besar bulat** di tengah-atas: foto karakter kodok hijau (sama seperti
  tooltip), ukuran ~140px diameter, border/ring tipis, dengan badge kecil nama
  "WAGMI" menempel di bagian bawah avatar (pill kecil dengan icon).
- Di bawah avatar, list field vertikal, tiap field = label uppercase kecil
  (`--text-label`) + value di bawahnya (`--text-primary`, 14-15px):
  1. **TICKER** → `WAGMI`
  2. **NAME** → `We All Gonna Make It`
  3. **TAGLINE** → `We don't chase dreams, we mint them.`
  4. **DESCRIPTION** → paragraf 4-5 baris, warna sedikit lebih muted
     (`--text-secondary`), contoh: "WAGMI is the ultimate meme token for believers.
     No roadmap. No promises. Just vibes, memes, and community. We don't fade, we
     WAGMI."
  5. **LORE (ONE LINE)** → kalimat 2 baris + emoji kodok kecil di akhir.
  - Spacing antar field blocks: `~16px`, dengan divider tipis opsional
    (`--divider`) di antaranya.
- **Meta info row** (setelah divider): 3 baris key-value kecil, align label kiri /
  value kanan:
  - `EST. LAUNCH COST` → `~0.02 SOL`
  - `NETWORK` → icon Solana (gradient ungu-teal) + teks `Solana`
  - `LAUNCH PLATFORM` → `pump.fun`
- **Tombol CTA besar full-width di paling bawah**: **"🚀 Launch on pump.fun"** —
  background `--accent-lime`, teks gelap bold, radius `--radius-sm`, padding vertikal
  ~14px, icon roket kiri teks.

### 4.5 Footer

- Full width, centered text, sangat kecil (~11px), warna `--text-muted`.
- Baris 1: `Built with 🖤 for the meme economy`
- Baris 2: `Not financial advice. DYOR.`
- Padding vertikal ~20px, tanpa background berbeda (menyatu dengan `--bg-app`).

---

## 5. Ikonografi

- Style icon: **line/outline icons**, stroke tipis (~1.5-2px), rounded caps, ukuran
  konsisten 16-20px di dalam UI, 20-24px untuk icon judul card.
- Set icon yang dipakai: lightbulb (idea), dice (random), sparkles (generate/AI),
  rocket (launch), download-arrow, image/picture (change background), checkmark-circle
  (confirmed field), chevron-right (list item), cart, chevron-down (dropdown), external-
  link.
- Rekomendasi library: **Lucide Icons** (bentuk & stroke-nya sangat cocok dengan yang
  terlihat di screenshot).

## 6. Aset Gambar

- **Background hero**: foto interior vintage bertone sephia/desaturated (kamar mandi
  tua dengan bathtub, gorden usang, cermin retak) — mood "abandoned/nostalgic". Perlu
  di-source atau di-generate, lalu diberi overlay gelap `rgba(8,9,6,0.55)` supaya
  card teks di atasnya tetap kontras.
- **Avatar karakter**: ilustrasi kodok hijau bergaya "Pepe" memakai kacamata hitam,
  background lingkaran gradasi hijau gelap-ke-hitam dengan glow tipis di tepi.
  Dipakai di 2 tempat: avatar besar panel kanan (~140px) & avatar kecil di tiap
  tooltip card (~36px).
- Semua gambar avatar/tooltip pakai `border-radius: 50%` dan `object-fit: cover`.

---

## 7. Interaction States

| Elemen | Default | Hover | Active/Focus |
|---|---|---|---|
| Nav item (inactive) | `--nav-inactive-text` | teks jadi `--text-primary`, tanpa bg | — |
| Nav item (active/Generate) | pill bg `--nav-active-bg` | sedikit lebih terang | — |
| Tombol lime (CTA) | `--accent-lime` bg | `--accent-lime-hover` bg, sedikit scale/brightness up | ring outline lime transparan utk keyboard focus |
| Tombol outline (secondary) | bg `--bg-panel-alt`, border `--border-subtle` | border jadi lebih terang, bg sedikit naik | — |
| Textarea | border `--border-input` | — | border jadi `--accent-lime` saat focus, ring halus |
| List item "Need Inspiration" | teks putih | bg row sedikit terang, chevron bergeser kanan halus | — |
| Card panel | shadow halus | — | — |

Semua transisi: `150-200ms ease-out`. Hormati `prefers-reduced-motion`.

---

## 8. Responsive Behavior

- **Desktop (≥1280px)**: layout 3 kolom seperti dijelaskan di atas.
- **Tablet (768-1279px)**: sidebar kanan pindah ke bawah kolom tengah (stack), sidebar
  kiri tetap di kiri atau collapse jadi accordion/drawer.
- **Mobile (<768px)**: semua stack vertikal 1 kolom: Header → Left sidebar cards →
  Hero image (tinggi dikurangi, tooltip cards disederhanakan/disembunyikan atau jadi
  carousel) → Step card → Right sidebar (Generated Concept) → Footer. Nav header jadi
  hamburger menu.

---

## 9. Copy Reference (contoh konten dari screenshot)

```
Idea input        : "When in doubt, ape it out."
Ticker             : WAGMI
Name               : We All Gonna Make It
Tagline            : We don't chase dreams, we mint them.
Description        : WAGMI is the ultimate meme token for believers.
                      No roadmap. No promises. Just vibes, memes, and community.
                      We don't fade, we WAGMI.
Lore (one line)     : In a world of doubt, one frog believed: "We All Gonna Make It." 🐸
Est. Launch Cost   : ~0.02 SOL
Network             : Solana
Launch Platform    : pump.fun
Footer              : Built with 🖤 for the meme economy — Not financial advice. DYOR.
```

---

## 10. Rekomendasi Tech Stack (implementasi)

- **Framework**: React (Next.js) atau plain HTML/CSS jika hanya butuh static UI.
- **Styling**: Tailwind CSS — semua token di bagian 2 bisa langsung dipetakan ke
  `tailwind.config.js` (`theme.extend.colors`, `theme.extend.borderRadius`, dst).
- **Icon**: `lucide-react`.
- **Font**: load "Inter" via Google Fonts / self-host, weight 400/500/600/700.
- **Positioning tooltip cards**: gunakan `position: absolute` dengan koordinat
  persen (`top/left in %`) relatif ke container hero agar tetap proporsional saat
  resize, atau gunakan CSS Grid area custom per breakpoint.

---

## 11. Checklist Akurasi untuk Coding Agent

- [ ] Background dasar **bukan** hitam pekat — pastikan ada tint olive/hijau gelap.
- [ ] Hanya SATU warna accent terang (lime `#cbe83f`) dipakai di seluruh halaman.
- [ ] Semua label field pakai UPPERCASE + letter-spacing, warna olive-muted, ukuran
      kecil — jangan pakai warna putih untuk label.
- [ ] Tab nav aktif pakai pill background, bukan underline atau bold saja.
- [ ] Card "Your Token Concept" **overlap**/menjorok ke luar foto hero (bukan sejajar
      rapi di bawahnya).
- [ ] Tooltip cards di atas foto posisinya **scattered/artistik**, bukan grid rapi.
- [ ] Avatar kodok pakai lingkaran dengan glow/gradient hijau-gelap di background.
- [ ] Border radius konsisten medium-large (10-16px) di semua card, bukan tajam
      (0px) atau terlalu bulat (24px+).
- [ ] Tombol CTA utama selalu icon + teks, background lime, teks gelap (bukan putih).
