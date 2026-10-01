/**
 * Gallery family: the `/thu-vien-anh` hub plus the four album routes.
 *
 * Source: `.scratch/capture/gallery.json` — `routes[].blocks` (ordered `img`
 * blocks with `role: "album"`) and `.scratch/capture/media-manifest.json`
 * (the `album-preview` cover of each hub card; the 380x300 crop the hub markup
 * uses was not mirrored, the same photo is captured at another crop size).
 *
 * Two source defects are corrected here rather than copied: every `meta
 * description` is empty, and the source `alt` on all 78 album images is the
 * album title (see `seoDefects` on each album route). The captured `alt` is
 * kept byte-exact on the `<img>`; the repeated position is carried by an
 * `aria-label` on the wrapping link so the grid is navigable.
 *
 * Two-sided frame: both views render inside `.wrap-content` and nothing in this
 * family opts into the `.bleed` escape hatch. The source agrees — the album
 * grid sits in `.wrap-album > .wrap-content`, so the full-bleed allowance (the
 * banner carousel and the "Giới thiệu" block) does not reach these routes.

 * ponytail: the view returns an HTML string and the shared layout owns <head>,
 * so this family inlines its own <style> and a classic <script> instead of
 * shipping cacheable assets — ceiling is ~4 KB CSS + ~2 KB JS repeated on 5
 * pages. Move both to `public/` and reference them once the layout can host
 * them. Same ceiling for the grid: only one rendition per album image was
 * mirrored, so a thumbnail is the full-size file behind `loading="lazy"`
 * (~300 KB each); add `srcset` from `thumbs/480x360x1` when those are fetched.
 */
import type { FamilyModule } from '@/families/types';
import type { ContentBlock, ContentFamily, AlbumBlock, ImageBlock } from '@/content/types';
import type { PageRecord } from '@/data/pages/types';
import { escapeHtml, imageTag, requireContent } from '@/lib/blocks';
import { anyMediaPath, mediaPath } from '@/lib/media';
import { mediaByUrl } from '@/data/media';
import { withBase } from '@/data/site';
import galleryCss from '@/styles/gallery.css?raw';

const FAMILY = 'gallery';
const UPLOAD = 'https://thebossvietnam.com/upload/product/';

type Album = {
  path: string;
  title: string;
  /** Captured hub-card cover; resolved through `anyMediaPath` so nothing hotlinks. */
  coverUrl: string;
  /** Album image file names in captured order, relative to `UPLOAD`. */
  files: string[];
};

const ALBUMS: Album[] = [
  {
    path: '/the-boss-va-cac-sen',
    title: 'THE BOSS & CÁC SEN',
    coverUrl:
      'https://thebossvietnam.com/thumbs/420x420x1/upload/product/46888521713645814346431795730101411714443059n-5759.jpg',
    files: [
      '46922224713645813746431858803985998071900908n-9199.jpg',
      'z634031367547797b0e5db832644db1c69df7d8838983d-5243.jpg',
      '3383725727541802894182503150056145525131371n-9531.jpg',
      '44953109912471490897197483686427025592409184n-9579.jpg',
      '44960198212471492230530686386934593721376819n-3909.jpg',
      'z634028151348764e47fe3812984904ce442d2d5b75935-5970.jpg',
      'z6340285571669793361170bbc6819c0f15246111780f3-9650.jpg',
      'z63402815030006ed937c22d41977ab681f00b4140041e-1897.jpg',
      'z6340281521748ef21f5d4f3cb84fa1253ef25ef3ad47a-1365.jpg',
      'z6340281543939245df2168ffd910353820db3a82a9211-6873.jpg',
      'z6340281568439313cd22fb61ff12216b84139d5a55aed-7667.jpg',
      'z6340281557449b651e6c3a96b6fe405352193851d9f12-5003.jpg',
      'z634028158237051714caa8576f930d2e49f295c664a17-3502.jpg',
      'z63402815947929ffa98addd5a4883e1c7d9c5955d26b0-3808.jpg',
      'z6340281605546280de55d10ad6064e933ed1185bcfe6d-6486.jpg',
      'z6340281616745f2ff7f79097ab95333852ab13b92f8ac-1079.jpg',
      'z6340281630114e0d733a65ce5b02b47fa8431da8389f9-5466.jpg',
      'z634028164058026d5b2e4ae48bf45fa13a40cadef479d-4904.jpg',
      'z63402857715382eb121e94db514e32672407d3bfe607d-2754.jpg',
      'z6340285785862e684a387bc8b1aff7999e34fd081313c-9207.jpg',
      'z634028579595810df18651f1ef062480a3b1c7b13c7a5-7261.jpg',
      'z6340285806379e873c7261b3a37ef8ba8dd5b90e56ddf-9616.jpg',
      'z634028583528665f296d45ac48cc92dec3cc3609f837d-5891.jpg',
      '36227816410239356820410913097267346356951918n-7298.jpg',
    ],
  },
  {
    path: '/menu-the-boss',
    title: 'SẴN SÀNG CHO BOSS',
    coverUrl:
      'https://thebossvietnam.com/thumbs/400x300x1/upload/product/z606654379618397dc21fc4b42ff42e5b8dde4047177a2-8324.jpg',
    files: [
      'z606654379618397dc21fc4b42ff42e5b8dde4047177a2-4168.jpg',
      '43484781811866710591008852955163669336045241n-3434.jpg',
      '43162597811696060474740536263641340348834145n-6867.jpg',
      '42948977511620007882345791948083131684538267n-3424.jpg',
      '42870839811580715752941675176293336113061507n-7088.jpg',
      'z6343017073057b6f45d47b68b171eac796159073810e0-7030.jpg',
      'z6340311945702db8da0cc530d1267280deedfc7135625-3419.jpg',
      'z63403119346153c5c84f79d41e50f1e91003a41b46ce2-2517.jpg',
      'thiet-ke-chua-co-ten-4849.png',
      'z634299652321627d38728ce81f0b52af70040051528ea-5285.jpg',
      'z63430170670089574d54306b81537bc37c3594fa1bf00-9388.jpg',
      'z6340311957681104ce283ce91025a5213141cc0bd0c5b-3438.jpg',
    ],
  },
  {
    path: '/the-boss-trong-nhung-phien-hoi',
    title: 'THE BOSS & PHIÊN HỘI',
    coverUrl:
      'https://thebossvietnam.com/thumbs/600x300x1/upload/product/z60665223331916862929201120000a7f7c73949df2ead-4394.jpg',
    files: [
      'z60665223331916862929201120000a7f7c73949df2ead-9543.jpg',
      'z6340285614124a0c09c06542be162f3b3ac67bad2193a-6704.jpg',
      'z63402855590825bb044a5146ea97c692e8dc149845027-4186.jpg',
      'z6340285673584a108066c2a3c199f17af08317d7d41f3-4901.jpg',
      'z6340285728571c8e555f94c381198889802c2a57c0c8b-2494.jpg',
      'z634028575444323bdaa78e1ba64ed1cacf8ec682a4721-5865.jpg',
      'z63402858204488f1a8a827e7ea591551326b21c6c01e4-6108.jpg',
      'z63402856440363a4150c7305896585565943479d6a17a-3468.jpg',
      'z63402857027491d112fab2920261841f9797765f97118-6387.jpg',
      'z63402857153966f7ebdf62bb3522e17b21fbc72fce81c-9627.jpg',
      '42245530711410961803250403324240424581439957n-6817.jpg',
      '4235819151141679516933373790793117990338250n-5301.jpg',
      '42353882411416795369333715530404713936823637n-5874.jpg',
      '42358262511416795869333661474060253812655161n-3857.jpg',
      '4487187321240072567094067137809670785498991n-4881.jpg',
      '44862326312400725904273985771917760967962958n-1711.jpg',
      '44867402112400726170940624856702528227737926n-4087.jpg',
      '44855970612400726004273974042126893597682080n-5610.jpg',
      '40891036611064980871181833287115113790478801n-5055.jpg',
      '4162239691125281241906534868613801040171089n-3897.jpg',
      '41525845611228356688177583169379384951845062n-8185.jpg',
      '41591927911228356988177558568196071108638897n-8934.jpg',
      '41558384411228356721510916103829948888126071n-3359.jpg',
      '4155305791122835745484417327405543531802512n-6080.jpg',
      '38043040310565908854422378318248088048630668n-7450.jpg',
      '23-9567.jpg',
      '4740277131400620137705975501299499851185789n-4990.jpg',
      '41554179911228356754844243114874800821125475n-7614.jpg',
      '44968384512471492497197323220675204690482420n-8757.jpg',
      '44913359712471491297197448135681137809689868n-1705.jpg',
    ],
  },
  {
    path: '/the-boss-den-khach-hang',
    title: 'THE BOSS & ĐỐI TÁC',
    coverUrl:
      'https://thebossvietnam.com/thumbs/340x380x1/upload/product/z5900547486416aa949ad65d7bb44ee429be3463640095-7034.jpg',
    files: [
      'z5900547486416aa949ad65d7bb44ee429be3463640095-6230.jpg',
      'z6064887754509697a8396777bf40561124fdcb533ed70-7766.jpg',
      'z606651837906859820bd616ee79958e421a2a77837d21-8832.jpg',
      '46916718413662415444771688896966380733590431n-4085.jpg',
      '46589848813462800431399858788732353754662110n-5663.jpg',
      '3-2756.jpg',
      '3460477396295459353485644402966311231652959n-6654.jpg',
      '44447931212264777017868873653840667229627032n-5011.jpg',
      '4561064071283511739416816978731316554858924n-1352.jpg',
      '46212250213179291759750729027101790374890352n-6495.jpg',
      '46341332613270048984008332317157777864792622n-4877.jpg',
      '4295240971162000778234580629922784951885772n-3879.jpg',
    ],
  },
];

const HUB_PATH = '/thu-vien-anh';
const HUB_TITLE = 'Thư viện ảnh';

const contentRefFor = (path: string): string => `${FAMILY}:${path.slice(1)}`;

const content: ContentFamily = {
  [contentRefFor(HUB_PATH)]: [
    { type: 'h2', text: HUB_TITLE },
    ...ALBUMS.map((album) => ({
      type: 'album' as const,
      title: album.title,
      href: album.path,
      image: album.coverUrl,
      alt: album.title,
    })),
  ],
  ...Object.fromEntries(
    ALBUMS.map((album) => [
      contentRefFor(album.path),
      [
        { type: 'h2', text: album.title },
        ...album.files.map((file): ContentBlock => ({
          type: 'img',
          url: UPLOAD + file,
          alt: album.title,
          role: 'album',
        })),
      ] satisfies ContentBlock[],
    ]),
  ),
};

const albumByPath: Record<string, Album> = Object.fromEntries(ALBUMS.map((album) => [album.path, album]));

const albumImages = (path: string): ImageBlock[] =>
  (content[contentRefFor(path)] ?? []).filter((block): block is ImageBlock => block.type === 'img');

const totalCaptured = ALBUMS.reduce((sum, album) => sum + albumImages(album.path).length, 0);

const positionLabel = (title: string, index: number, total: number): string =>
  `${title} — ảnh ${index + 1} / ${total}`;

const dimensions = (sourceUrl: string) => {
  const entry = mediaByUrl[sourceUrl];
  return { width: entry?.width ?? undefined, height: entry?.height ?? undefined };
};

const routes: PageRecord[] = [
  {
    path: HUB_PATH,
    kind: 'gallery',
    section: HUB_TITLE,
    h1: HUB_TITLE,
    seo: {
      title: 'Thư viện ảnh - The Boss Việt Nam',
      description: `Thư viện ảnh của The Boss Việt Nam gồm ${ALBUMS.length} album, tổng cộng ${totalCaptured} ảnh. Mở từng album để xem và phóng to ảnh ngay trên trang.`,
      image: anyMediaPath(ALBUMS[0].coverUrl),
    },
    contentRef: contentRefFor(HUB_PATH),
  },
  ...ALBUMS.map((album): PageRecord => {
    const total = albumImages(album.path).length;
    return {
      path: album.path,
      kind: 'album',
      section: album.title,
      parentPath: HUB_PATH,
      h1: album.title,
      seo: {
        title: `${album.title} - Thư viện ảnh The Boss Việt Nam`,
        description: `Album ${album.title} trong thư viện ảnh The Boss Việt Nam, gồm ${total} ảnh.`,
        image: anyMediaPath(album.coverUrl),
      },
      contentRef: contentRefFor(album.path),
    };
  }),
];

/**
 * Lightbox behaviour. Plain ES5 in a classic script so the album grid stays the
 * source of truth with scripting off: every thumbnail is a real link to its own
 * local image file and this only intercepts it.
 *
 * `showModal()` supplies the focus trap and the inert page behind the dialog —
 * no hand-rolled trap, no dependency. Escape and the close button use the
 * native `close` event, which is also where focus goes back to the thumbnail.
 */
const LIGHTBOX_SCRIPT = `(function () {
  var dialog = document.querySelector('[data-lightbox]');
  var grid = document.querySelector('[data-album-grid]');
  if (!dialog || !grid || typeof dialog.showModal !== 'function') return;
  var thumbs = Array.prototype.slice.call(grid.querySelectorAll('[data-gallery-thumb]'));
  var image = dialog.querySelector('.lightbox__image');
  var counter = dialog.querySelector('[data-lightbox-counter]');
  if (!thumbs.length || !image || !counter) return;
  var total = thumbs.length;
  var title = dialog.getAttribute('data-album-title') || '';
  var index = 0;
  var opener = null;

  function show(next) {
    index = next;
    var thumb = thumbs[index];
    var full = thumb.getAttribute('href') || '';
    var thumbImage = thumb.querySelector('img');
    image.setAttribute('src', full);
    image.setAttribute('alt', thumbImage ? thumbImage.getAttribute('alt') || '' : '');
    var text = title + ' — ảnh ' + (index + 1) + ' / ' + total;
    dialog.setAttribute('aria-label', text);
    counter.textContent = text;
  }

  function step(delta) {
    show((index + delta + total) % total);
  }

  function open(i, trigger) {
    opener = trigger;
    show(i);
    dialog.showModal();
  }

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) { dialog.close(); return; }
    var control = event.target.closest('[data-lightbox-control]');
    if (!control) return;
    var action = control.getAttribute('data-lightbox-control');
    if (action === 'prev') step(-1);
    else if (action === 'next') step(1);
    else dialog.close();
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });

  dialog.addEventListener('close', function () {
    var target = opener;
    opener = null;
    if (target && typeof target.focus === 'function') target.focus();
  });

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function (event) {
      // Ctrl/Cmd/shift/middle-click must reach the browser so the no-JS <a href>
      // still opens the image in a new tab or window.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(i, thumb);
    });
    thumb.addEventListener('keydown', function (event) {
      if (event.key !== ' ' && event.key !== 'Spacebar') return;
      event.preventDefault();
      open(i, thumb);
    });
  });
})();`;

function hubView(record: PageRecord): string {
  const albums = requireContent(record, content).filter((block): block is AlbumBlock => block.type === 'album');
  const cards = albums
    .map((album) => {
      const cover = [
        `<a class="album-card__link" href="${escapeHtml(withBase(album.href))}">`,
        imageTag(album.image, album.alt, { className: 'album-card__cover', ...dimensions(album.image) }),
        '<span class="album-card__body">',
        `<h2 class="album-card__title">${escapeHtml(album.title)}</h2>`,
        `<p class="album-card__count">${albumImages(album.href).length} ảnh</p>`,
        '</span></a>',
      ];
      return `<li class="album-card">${cover.join('')}</li>`;
    })
    .join('');

  return [
    `<style>${galleryCss}</style>`,
    '<div class="wrap-content gallery-hub">',
    `<ul class="album-cards">${cards}</ul>`,
    '</div>',
  ].join('');
}

function albumView(record: PageRecord): string {
  const album = albumByPath[record.path];
  if (!album) {
    throw new Error(`[${FAMILY}] "${record.contentRef}" (${record.path}) is not a known album route.`);
  }
  const images = requireContent(record, content).filter((block): block is ImageBlock => block.type === 'img');
  const first = images[0];
  if (!first) {
    throw new Error(`[${FAMILY}] album "${record.path}" captured no images.`);
  }
  const total = images.length;

  const items = images
    .map((block, index) => {
      // mediaPath throws at build time rather than shipping a hotlinked <img>.
      const href = withBase(mediaPath(block.url));
      return [
        '<li class="album-grid__item">',
        `<a class="album-thumb" href="${escapeHtml(href)}" data-gallery-thumb aria-label="${escapeHtml(
          positionLabel(album.title, index, total),
        )}">`,
        // imageTag already writes loading="lazy", decoding="async" and the
        // captured width/height; the CSS ratio reserves the box, so no eager
        // override is wanted.
        imageTag(block.url, block.alt, {
          className: 'album-thumb__img',
          ...dimensions(block.url),
        }),
        '</a></li>',
      ].join('');
    })
    .join('');

  const label = escapeHtml(positionLabel(album.title, 0, total));
  const dialog = [
    `<dialog class="lightbox" data-lightbox data-album-title="${escapeHtml(album.title)}" aria-label="${label}">`,
    '<div class="lightbox__panel">',
    imageTag(first.url, first.alt, { className: 'lightbox__image', loading: 'eager', ...dimensions(first.url) }),
    '<div class="lightbox__bar">',
    `<p class="lightbox__counter" data-lightbox-counter>${label}</p>`,
    '<div class="lightbox__actions">',
    '<button type="button" class="lightbox__btn" data-lightbox-control="prev" aria-label="Ảnh trước">‹</button>',
    '<button type="button" class="lightbox__btn" data-lightbox-control="next" aria-label="Ảnh sau">›</button>',
    '<button type="button" class="lightbox__btn" data-lightbox-control="close" aria-label="Đóng">×</button>',
    '</div></div></div></dialog>',
  ].join('');

  return [
    `<style>${galleryCss}</style>`,
    '<div class="wrap-content">',
    `<ul class="album-grid" data-album-grid>${items}</ul>`,
    '</div>',
    dialog,
    `<script>${LIGHTBOX_SCRIPT}</script>`,
  ].join('');
}

const gallery: FamilyModule = {
  name: FAMILY,
  routes,
  content,
  views: {
    gallery: hubView,
    album: albumView,
  },
};

export default gallery;
