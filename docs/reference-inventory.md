# Reference inventory — thebossvietnam.com replica

Source: `https://thebossvietnam.com`, captured 2026-09-30.
Target: static Astro site at `https://tiendat11.github.io/bossdanang`.

This file is the record of *what the source actually is* — the route inventory, the
media inventory with provenance, and every place the replica deliberately departs
from it. The raw capture lives in `.scratch/` (git-ignored); this document is the
durable, reviewable summary.

## 1. Route inventory — 37 routes

36 routes come from the source sitemap. `/tim-kiem` is a real page that the sitemap
omits (only the header search input reaches it) and is replicated as a `noindex`
route. `/gio-hang` returns **404** on the source and has no cart anywhere in the
build (`SHIP_CART = false`); it is deliberately **not** replicated.

| # | Route | Kind | Source | Capture file |
|---|-------|------|--------|--------------|
| 1 | `/` | home | 200 | `company-home.json` |
| 2 | `/gioi-thieu` | company | 200 | `company-home.json` |
| 3 | `/lien-he` | contact | 200 | `company-home.json` |
| 4 | `/chinh-sach-bao-mat` | policy | 200 | `company-home.json` |
| 5 | `/chinh-sach-tuyen-dung` | policy | 200 | `company-home.json` |
| 6 | `/san-pham` | catalog | 200 | `catalog.json` |
| 7 | `/thit-tuoi` | category | 200 | `catalog.json` |
| 8 | `/pate` | category | 200 | `catalog.json` |
| 9 | `/tim-kiem` | search (noindex) | 200 | `catalog.json` |
| 10–19 | 9 product details (`ga-xay-hon-hop`, `supper-ga`, `thit-heo`, `thit-bo`, `ca-xay`, `chim-cut`, `thit-vit`, `ga-ac`, `tom-xay-hon-hop`) | product | 200 | `products-fresh-1.json`, `products-fresh-2.json` |
| 20–24 | 5 soup details (`soup-ga-tiem`, `soup-heo-ham`, `soup-vit-tiem`, `soup-ca-tuoi`, `soup-bo-ham`, `soup-hai-san`) | product | 200 | `products-soup.json` |
| 25 | `/cam-nang` | handbook | 200 | `handbook.json` |
| 26–28 | 3 articles (`huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan`, `nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an`, `cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong`) | article | 200 | `handbook.json` |
| 29 | `/thu-vien-anh` | gallery | 200 | `gallery.json` |
| 30–33 | 4 albums (`the-boss-va-cac-sen` 24 img, `menu-the-boss` 12, `the-boss-trong-nhung-phien-hoi` 30, `the-boss-den-khach-hang` 12) | album | 200 | `gallery.json` |
| 34 | `/he-thong-dai-ly` | dealers | 200 | `dealers.json` |
| 35–37 | 3 dealer regions (`…ho-chi-minh` 66 rows/18 groups, `…binh-duong-binh-phuoc` 21 rows/6 groups, `…khu-vuc-khac` 0 rows) | dealer-region | 200 | `dealers.json` |

`/tim-kiem` query states captured as reference: `keyword=ga` → 4 results
(`GÀ XAY HỖN HỢP`, `SUPER GÀ`, `GÀ ÁC`, `SOUP GÀ TIỀM`, in that order);
`keyword=zzzzqqq` → `Tìm kiếm (0): "zzzzqqq"`; empty/missing → `Tìm kiếm (): ""`.
Both non-match states render `Không tìm thấy kết quả`.

## 2. Media inventory

**272 files** fetched, **238 unique on disk** (sha256 dedup collapsed 52 entries onto
18 files, saving 34 files), **199.6 MB**. Full provenance table:
[`docs/media-manifest.csv`](./media-manifest.csv) — one row per manifest entry with
`local_path, source_url, mime, width, height, bytes, sha256_prefix, role, alt, used_on`.

The 3 entries that produced no file are listed in
[`docs/media-problems.json`](./media-problems.json):

| Source URL | Status | Why no file |
|---|---|---|
| `https://fonts.googleapis.com/css2?family=Inter…` | rejected | Cross-origin CSS; the 18 concrete font files it references were fetched instead |
| `https://thebossvietnam.com/api/addons.php?type=messages-facebook` | not-an-image | 1631-byte HTML fragment (a Facebook messenger widget), not an asset |
| `https://thebossvietnam.com/404_files/sky-bg.png` | failed | Source serves its 404 page for this path |

**Byte truth:** all 272 fetched files' magic bytes match their final extension. The
earlier suspicion that the source serves WebP under a `.png` name is **wrong** —
verified 272/272. Content-type disagreed on fonts (`application/font-woff` vs
`font/woff`); bytes win.

**Fonts** are self-hosted in `public/fonts/`: SVN-Poppins (5 weights, woff),
SRN-CookieRun-Black (woff), and 18 Inter `.ttf` slices from `fonts.gstatic.com`.
The Inter files are unicode-range slices of one variable font, not weight instances
(all are ~328 KB, `usWeightClass` 400 on every one), so `@font-face` for Inter needs
the `unicode-range` map from the Google CSS that the allowlist rejected. The replica
titles with the Poppins stack and leaves Inter unmapped — see the `ponytail:` note in
`src/styles/global.css`.

**No hotlinking.** Every `src` in the built output resolves to a file under
`public/media/` or `public/fonts/`. Captured source URLs are provenance only and go
through `mediaPath()` / `imageTag()` (`src/lib/blocks.ts`), which throws at build
time on a miss.

**`mediaByLocalName` is last-wins.** Several distinct source URLs share a
`localName` (e.g. the album covers at two different thumbnail sizes). Look media up
by `mediaByUrl[sourceUrl]`, never by local name.

**Largest file is 9.8 MB** (`/media/home/2-42230.png`), under GitHub's 100 MB
per-blob limit. All 238 files are committed deliberately — the site is
self-contained, and the alternative is a broken deploy.

## 3. Visual baseline

`scripts/shoot-source.mjs` drives headless Chrome to capture the source at three
widths into `.scratch/screens/` (git-ignored, 78 PNGs):

- `desktop/` — **37/37** routes at 1366×900
- `tablet/` — 10 routes at 768×1024
- `mobile/` — 10 routes at 390×844

The 10 routes in the responsive set: `/`, `/san-pham`, `/thit-tuoi`, `/pate`,
`/ga-xay-hon-hop`, `/thu-vien-anh`, `/cam-nang`, `/he-thong-dai-ly`, `/lien-he`,
`/danh-sach-dai-ly-o-ho-chi-minh`.

Interaction-state captures (`.scratch/screens/interaction/`, 8 files) came from a
real browser session: hero slides 2 and 3, open nav dropdown, both product tabs, an
expanded accordion item, and the album lightbox.

Homepage section order, confirmed against the DOM: 3 hero slides → intro → product
tabs → 6-item accordion → 7 testimonials → 3 articles → 11 partner logos → 4 album
previews → dealer CTA. The hero carousel has no dots (`data-dots="0"`); the
testimonial carousel does (`data-dots="1"`).

## 4. Design tokens (from `assets/css/style.css`)

`#a72223` dark red · `#ffd400` static yellow · `#eceb1b` hover yellow · `#ec2d3f` red
· `#212529` near-black · `#6c757d` gray. Container `1200px`, body `14px`,
fonts SVN-Poppins + Inter.

The Picasso-computed palette (`#A81C1E` / `#FBFBC9`) is **not** the site's variables
and is not used. `#fbfbc9` and `#a81c1e` survive only as literal usage values where
the source uses them as literals (e.g. `.wrap-newsnb { background: #fbfbc9 }`).

## 5. Shell chrome

Navigation (6 items, source hrefs are root-relative with no leading slash; `""` is
home): Trang chủ · Giới thiệu · Sản phẩm (children: Thịt Tươi Rau Củ, Pate Tươi) ·
Hệ thống đại lý · Cẩm nang · Liên hệ.

Footer, 4 columns: Logo · THE BOSS VIỆT NAM (address + phone) · Chính sách (2 links)
· Social (Facebook). Contact: `225A Kênh Đông, ấp Bàu Tre 1, xã Tân An Hội, Thành
phố Hồ Chí Minh.` / `0978202063` / `https://www.facebook.com/TheBossVietnam`.

The address differs between the footer and `/lien-he` (the latter adds *Huyện Củ
Chi*). Both are recorded verbatim in their own data layer rather than unified — the
difference is in the source, not a transcription error.

## 6. Deliberate deviations from the source

Every item here is a **fixed source defect**, not a design change. The rule is:
fix it, document it, never copy it.

| # | Source behaviour | Replica | Why |
|---|---|---|---|
| 1 | `<html lang="vi|en">` | `lang="vi"` | Pipe-delimited tag is invalid; the site has one language and no `/en/` routes or `hreflang` anywhere |
| 2 | `<meta name="viewport" content="width=1366px">` | `width=device-width, initial-scale=1` | Fixed viewport breaks every viewport under 1366px |
| 3 | `body { min-width: 1366px }` | removed | Same cause; forces horizontal scroll on mobile |
| 4 | `<h1 class="hidden-seoh">` (`visibility:hidden; height:0`) | real visible `<h1>` | The only H1 on most pages is hidden from users and screen readers alike |
| 5 | Empty `metaDescription` on most pages | real descriptions written per page | A missing fact is a finding, not licence to ship an empty tag |
| 6 | `<base href="https://thebossvietnam.com/">` | not emitted | Relative URLs would silently resolve to the source origin |
| 7 | `/san-pham` ships an **empty** product grid (AJAX-only) | 15 cards rendered server-side | With JS off the source page is a soft-200 blank |
| 8 | Product tabs are `<a>` with no `href`, not keyboard-focusable | real `<button>` tablist with `aria-selected` | Keyboard users could not reach the tabs at all |
| 9 | `Tất cả` tab requests `perpage=9&idList=0` → only 9 products | all 15 | Source bug: the "All" tab is not all |
| 10 | Commented-out structured price whose value is `Liên hệ`, contradicting the visible prices | no `Offer`/price structured data | A machine-readable price that contradicts the page is worse than none |
| 11 | 3rd product thumbnail is a shared usage-guide image alt-texted as the product name | alt describes the guide image | Source accessibility defect |
| 12 | View counters presented as live numbers | labelled as a captured snapshot with a capture date | The replica cannot know a live count |
| 13 | `.load_ajax_product` empty / inert pagination container | static render, no inert container | Dead markup in a static build |
| 14 | `hot` badge on GÀ ÁC and CHIM CÚT (per the original brief) | hot only on THỊT HEO and THỊT BÒ | **The source is the authority**: the feed snapshot has exactly 2 `check-hot` spans and 0 `new.png` across all 9 cards. The brief was wrong. |
| 15 | Promotion dated 08.08.2026 shown as live | marked expired | That date has passed |
| 16 | 11 partner logos wrapped in `<a href="">` | rendered as non-links | Empty `href` is a broken link, not a link |
| 17 | Facebook messenger + comment widgets, `addons.php` side-loads, reCAPTCHA v3 with the source owner's site key | dropped | Third-party runtime on someone else's key; the replica has no recipient to receive submissions |
| 18 | Search submit uses `javascript:void();` | real form `GET /tim-kiem` | A form that goes nowhere |
| 19 | Embedded map on dealer pages | none | **No map exists on any of the 4 source routes** — no map image, no iframe, no map URL. Nothing to replicate; nothing was invented. |
| 20 | `/gio-hang` 404 page with a broken starfield (`/404_files/sky-bg.png` itself 404s) | plain local 404 with a link home | The source's 404 art is missing in the source |
| 21 | `/lien-he` contact form uses Bootstrap `form-floating` — labels inside the control, 45px box, 1px bottom border, `row-20` 2-column grid for the first four fields, Bootstrap primary/secondary buttons | reproduces the source geometry (floating labels, 45px box, 1px bottom border, `row-20` grid, primary/secondary buttons); only deviation is the deliberately `disabled` send button (no recipient configured) | No endpoint exists to receive submissions. |
| 22 | 6 soup detail pages carry **no price block at all** — the price exists only in the `api/product.php` feed, never in the page HTML | no price block on those 6 pages | The source is the authority. Rendering a feed price on a page that has none would be inventing content. |
| 23 | Each article card wraps its image, title and CTA in three separate `<a>` elements, all pointing at the same article | one card-level `<a>` wrapping the whole card | Three links to one destination is redundant navigation noise for screen-reader and keyboard users; the destination and the visual card are the same object |

## 7. Known gaps awaiting owner confirmation

- **Contact form has no recipient.** Six fields are rendered and validated
  client-side; the send button is visibly disabled and the page says in Vietnamese
  that the form is not yet configured. No fake success screen, no POST to the source.
  Upgrade: a real endpoint plus the owner's own key.
- **No Zalo OA URL** and no verified Facebook embed, so the phone number and address
  render as text. There is no dead button and no unverified embed.
- **Prices are captured snapshots.** They are prose text with no `dateModified`; the
  owner should re-confirm them before any real-world publication.
- **Business copy and photography are the owner's.** The replica is a private
  demonstration; publishing it publicly requires the owner's sign-off on brand,
  copy, images and fonts. Nothing here is a rights determination.
- **The source's own privacy page names a contact email.** `/chinh-sach-bao-mat`
  publishes `info.thebossvietnam@gmail.com` twice as the address for data requests.
  The owner was asked whether `/lien-he` should mail there and decided against it for
  this deliverable: the form stays disabled until a real endpoint exists. Recorded
  here so the two pages are not read as contradicting each other.

## 8. Regenerating this evidence

```bash
node scripts/fetch-media.mjs          # media: allowlisted hosts, byte-sniffed, sha256-deduped
node scripts/fetch-media.mjs --dry-run  # plan only, writes nothing
node scripts/shoot-source.mjs         # source screenshots (needs network)
node scripts/shoot-source.mjs --force --only san-pham,pate
```
