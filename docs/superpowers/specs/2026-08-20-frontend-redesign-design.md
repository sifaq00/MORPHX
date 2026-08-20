# Pounce Daemon — Frontend Redesign Design

Tanggal: 2026-08-20
Status: Disetujui user

## Tujuan

Redesign frontend web app Pounce Daemon agar modern, bersih, responsif, mengikuti layout mockup yang dikirim user, sambil mempertahankan semua fungsi inti yang ada.

Brand tetap **Pounce Daemon**. Palet aksen diganti ke **hijau pump.fun (#50E0A0)**. Dark background `#0E1116` dipertahankan.

## Prinsip

1. Layout persis mockup (3 kolom generator, navbar baru, kartu workflow bawah).
2. Semua fungsi inti tetap jalan: hash routing, `POST /api/generate` → `generateToken()`, hasil lengkap LLM, launch ke pump.fun, copy to clipboard.
3. Responsif: mobile tetap usable (kolom menumpuk).
4. YAGNI: halaman My Concepts/Leaderboard/Community diisi konten yang ada, bukan fitur baru berat.

## Arsitektur Halaman (hash routing, tetap)

| Route | Halaman | Isi |
|---|---|---|
| `#/` | Home | Landing ringan: hero + CTA ke Generate |
| `#/generate` | Generate | **Generator 3 kolom persis mockup** (halaman inti) |
| `#/concepts` | My Concepts | Placeholder kosong ("Belum ada konsep tersimpan") |
| `#/leaderboard` | Leaderboard | Konten `BUNDLES` lama dipindah |
| `#/community` | Community | Konten `SKILLS` lama dipindah |
| `#/how-it-works` | How it works | Konten FAQ + MCP lama dipindah |

Konten `TOOLS` masuk ke halaman Generate: grid kartu `TOOLS` ditampilkan di bawah layout 3 kolom, dengan badge live/soon sesuai `tools.ts`.

Navbar baru: Home, Generate, My Concepts, Leaderboard, Community, How it works + ikon cart & profile (dekoratif).

## Halaman Generate — Layout

### Kiri (Generator Panel)
- Label "ONE LINE IDEA" + subtext "Give us the idea. One sentence is enough: a mood, a meme, a headline."
- Input textarea/input + char counter `N / 120` (max length 120, format persis mockup)
- Tombol **Generate Concept** (hijau `#50E0A0`, teks gelap) + **Random Idea** (sekunder)
- Section **NEED INSPIRATION?** — daftar item persis mockup, klik → isi input:
  - "When in doubt, ape it out."
  - "Exit liquidity? No, I am."
  - "Built different, Probably not."
  - "One more candle won't hurt."
  - "This is financial advice."
- Kartu **Launch on pump.fun**: "Generate your token concept and launch it directly on pump.fun in one click." + ikon link

### Tengah (Preview / Background)
- Background: gambar/foto yang bisa diganti (Change Background)
- Overlay kartu hasil saat ada: Ticker, Name, Tagline, Lore (one line)

### Kanan (Generated Concept)
- Avatar (lingkaran) — maskot/logo Pounce Daemon (bukan Pepe; brand tetap Pounce Daemon), ring warna dari `brandColors` LLM, placeholder jika kosong
- Field: Ticker, Name, Tagline, Description, Lore
- Metrik: Est. Launch Cost (~0.02 SOL), Network (Solana), Launch Platform (pump.fun)
- Tombol **Launch on pump.fun** (hijau)

### Bawah
- Kartu **YOUR TOKEN CONCEPT**: tagline "One sentence. Infinite possibilities." + workflow Idea → Generate → Launch
- Tombol **Download Concept** (JSON/teks) + **Change Background**

## Footer

Semua halaman: "Built with 💚 for the meme economy. Not financial advice. DYOR." (persis mockup, menggantikan footer disclaimer lama berisi CA). CA tetap tampil di header/hero.

## Data & Alur

- `POST /api/generate` body `{idea}` → `generateToken(idea)` — **tidak berubah**
- Hasil API: `{ticker, name, tagline, description, lore, vibeScore, pumpUrl, generatedFrom, logoPrompt, brandColors, marketingHook}`
- Di frontend, hasil ditambah metrik statis: `estLaunchCost: "~0.02 SOL"`, `network: "Solana"`, `platform: "pump.fun"`
- Download Concept: serialize hasil sebagai file `.json` (Blob + download link)
- Change Background: cycle daftar background (CSS gradient/asset lokal), state di komponen

## Komponen

Baru:
- `Navbar` — rewrite (nav mockup + ikon)
- `GeneratePage` — layout 3 kolom
- `GeneratorPanel` (kiri), `ConceptPreview` (tengah), `ConceptDetail` (kanan), `WorkflowCard` (bawah)
- `InspirationList`, `RandomIdeaButton`, `DownloadButton`, `BackgroundSwitcher`
- Halaman: `ConceptsPage`, `LeaderboardPage`, `CommunityPage`, `HowItWorksPage`

Dihapus/refactor:
- `TickerTape`, `TerminalDemo`, `ClosingCta`, `DirectoryOverview`, `Faq` (home) dihapus
- `Hero` diubah jadi landing ringan
- `PlexusBg` opsional dipertahankan di background global
- `SkillsPage/BundlesPage/McpPage/FaqPage` → konten dipindah ke halaman baru, file dihapus

Data files (`tools.ts`, `skills.ts`, `bundles.ts`, `mcpServers.ts`) tetap dipakai sebagai sumber konten halaman baru.

## Responsive

- Mobile: kolom menumpuk (kiri → tengah → kanan → bawah)
- Desktop: grid 3 kolom dengan lebar tetap panel kiri/kanan, tengah fleksibel

## Error Handling

- Error dari API → banner merah/coral di panel kiri
- Loading → state tombol "Generating…" + skeleton/console di panel tengah
- Clipboard tetap dengan fallback (perbaikan bug lama)

## Testing

- Tidak ada test framework terpasang. Verifikasi manual via dev server + browser snapshot.
- Build `npm run build` (workspace web) harus lolos.

## Diluar Scope

- Backend/API tidak diubah
- Tidak menambah dependency baru
- Tidak deploy