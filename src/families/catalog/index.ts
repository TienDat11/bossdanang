/**
 * Catalog family: `/san-pham`, `/thit-tuoi`, `/pate`, `/tim-kiem` and the 15
 * product detail pages.
 *
 * Sources, all captured — nothing is re-fetched at build or run time:
  - `.scratch/capture/catalog.json` — the four listing/search routes, the tab
 *    observation (`productTabsObserved`), the AJAX chain, and the three exact
 *    search-state strings.
  - `./data.ts` — the 15 products: the 9 + 6 cards the source only ever ships
 *    over AJAX, plus each product's own detail hero, thumbnails, price prose,
 *    view snapshot and description, with the capture each value came from.
 *  - `.scratch/raw/products/<slug>.html` — the raw detail pages, which settle
 *    the two places the capture JSON disagrees with itself (see `data.ts`).
 *
 * Source defects this module deliberately does not copy:
  - `/san-pham` ships an EMPTY `.load_ajax_product` grid. Every grid here is
 *    rendered server-side, so all product content is in the HTML with JS off.
 *  - The `Tất cả` tab asks for `perpage=9&idList=0` and so shows 9 of 15 across
 *    two pages of half-English, dead pagination links. `Tất cả` is all 15 here,
 *    statically, with no fake pagination.
 *  - The three tabs are `<a>` elements with no `href`: unclickable and not
 *    keyboard-focusable. They are `<button role="tab">` in a real tablist here.
 *  - The product H1 is `<h1 class="hidden-seoh">`, invisible. The shared layout
 *    emits the real `<h1 class="page-title">`, so this view emits `h2` downward.
 *  - Every product's third thumbnail is a shared usage sheet that the source
 *    titles and alt-texts with the product name. It gets a describing alt.
 *  - The structured price row is commented out and reads `Liên hệ`, contradicting
 *    the visible prices. No `Offer`/`price` structured data is emitted; prices
 *    are visible text only.
 *  - `Lượt xem:` is a live server counter and every product has its own value.
 *    Each is rendered as a labelled snapshot with its capture date, never as a
 *    live-looking counter.
 *  - The `Bình luận` tab is a Facebook embed and the share bar is AddToAny plus
 *    a Zalo SDK. None is reproduced; the tab row keeps its one usable tab.
 *  - The breadcrumb JSON-LD lists three items where the page shows four: the
 *    source hangs each product off its category, adding `Thịt Tươi Rau Củ` or
 *    `Pate Tươi` between `Sản phẩm` and the product name. These routes parent
 *    to `/san-pham` instead, because `breadcrumbTrail` in
 *    `src/data/pages/index.ts` unshift-s each ancestor and so prints
 *    `Sản phẩm / Trang chủ / GÀ XAY HỖN HỢP` — it misorders every page whose
 *    parent is not the home page, across every family, and that file is the
 *    integration owner's. One `.push` in place of the `.unshift` fixes it; once
 *    it is fixed, move the parent to `/thit-tuoi` or `/pate` to restore the
 *    source's four-item trail.
 */
import type { FamilyModule } from '@/families/types';
import type { PageRecord } from '@/data/pages/types';
import { escapeHtml, imageTag, link, prose, requireContent } from '@/lib/blocks';
import type { ContentBlock, ContentFamily } from '@/content/types';
import { mediaByUrl } from '@/data/media';
import { mediaPath } from '@/lib/media';
import { pageByPath } from '@/data/pages';
import catalogCss from '@/styles/catalog.css?raw';
import { search, withBase } from '@/data/site';
import { CATEGORIES, products } from '@/data/products';
import type { CategoryId, PriceLine, Product } from '@/data/products';

const SEARCH_PATH = '/tim-kiem';
const NO_RESULTS = 'Không tìm thấy kết quả';
/** The counter's own label, and the day every per-product value below was read. */
const VIEW_SNAPSHOT = { label: 'Lượt xem:', capturedOn: '30/09/2026' };

const badgeAlt: Record<'hot' | 'new', string> = {
  hot: 'Sản phẩm HOT',
  new: 'Sản phẩm NEW',
};

/**
 * The description of a product page, composed from that page's own captured copy
 * and nothing else: who it is for, what it costs, how long it keeps. Dropping
 * only the lead-in `Sản phẩm dành ` leaves the `cho` that joins the name to the
 * audience — `Gà xay hỗn hợp cho chó, mèo…`, the sentence the source's own
 * wording already says. The source's U+00A0 word-joiners are plain spaces here,
 * where they would only confuse a crawler reading the meta description. The six
 * pate pages come out around 130 characters rather than the 140–160 the plan
 * asks for, because the sentences they have are all the sentences they have;
 * padding them would mean writing copy the source does not have.
 */
const description = (product: Product): string => {
  const audience = product.prose[0].replace('Sản phẩm dành ', '');
  const prices = product.variants.map((variant) => `${variant.price} (${variant.weight})`).join(' và ');
  return (
    `${product.name.charAt(0)}${product.name.slice(1).toLowerCase()} ${audience} ` +
    `Giá ${prices}. ${product.prose[1].replace(':', '')}`
  ).replace(/ /g, ' ');
};

/** One route per product in `./data.ts`. */
const productRoutes: PageRecord[] = products.map((product) => ({
  path: `/${product.slug}`,
  kind: 'product',
  section: product.name,
  // `/san-pham`, not the product's category as the source does: see the header
  // comment on `breadcrumbTrail`, which misorders a parented trail today.
  parentPath: '/san-pham',
  h1: product.name,
  seo: {
    title: `${product.name} - The Boss Việt Nam`,
    description: description(product),
    image: mediaPath(product.image),
  },
  contentRef: `catalog:${product.slug}`,
}));

const routes: PageRecord[] = [
  {
    path: '/san-pham',
    kind: 'catalog',
    section: 'Sản phẩm',
    h1: 'Sản phẩm',
    seo: {
      title: 'Sản phẩm - The Boss Việt Nam',
      description:
        '15 sản phẩm thức ăn tươi cho chó, mèo từ 3 tháng tuổi trở lên: 9 món thịt tươi rau củ bán theo cây và 6 loại pate tươi 500gr bán theo hộp.',
      image: mediaPath('https://thebossvietnam.com/watermark/product/400x200x1/upload/product/ga-xay-hon-hop-3116.png'),
    },
    contentRef: 'catalog:san-pham',
  },
  {
    path: '/thit-tuoi',
    kind: 'category',
    section: 'Thịt Tươi Rau Củ',
    parentPath: '/san-pham',
    h1: 'Thịt Tươi Rau Củ',
    seo: {
      title: 'Thịt Tươi Rau Củ - The Boss Việt Nam',
      description:
        '9 sản phẩm thịt tươi rau củ cho chó, mèo từ 3 tháng tuổi trở lên: gà xay hỗn hợp, super gà, thịt heo, thịt bò, cá xay, chim cút, thịt vịt, gà ác, tôm xay hỗn hợp.',
      image: mediaPath('https://thebossvietnam.com/watermark/product/400x200x1/upload/product/ga-xay-hon-hop-3116.png'),
    },
    contentRef: 'catalog:thit-tuoi',
  },
  {
    path: '/pate',
    kind: 'category',
    section: 'Pate Tươi',
    parentPath: '/san-pham',
    h1: 'Pate Tươi',
    seo: {
      title: 'Pate Tươi - The Boss Việt Nam',
      description:
        '6 loại pate tươi 500gr cho chó, mèo từ 3 tháng tuổi trở lên: soup gà tiềm, soup heo hầm, soup vịt tiềm, soup cá tươi, soup bò hầm và soup hải sản.',
      image: mediaPath('https://thebossvietnam.com/watermark/product/400x200x1/upload/product/1-hop-soup-ga-tiem-500gr-8807.png'),
    },
    contentRef: 'catalog:pate',
  },
  {
    // Utility route, outside the 36 sitemap URLs: `noindex` keeps it out of the
    // sitemap, and `SiteLayout.astro` omits the canonical for a noindex path.
    path: SEARCH_PATH,
    kind: 'search',
    section: 'Tìm kiếm',
    parentPath: '/',
    h1: 'Tìm kiếm',
    noindex: true,
    seo: {
      title: 'Tìm kiếm - The Boss Việt Nam',
      description:
        'Tìm kiếm thức ăn tươi cho chó, mèo trong 15 sản phẩm của The Boss Việt Nam theo từ khóa: thịt tươi rau củ và pate tươi.',
    },
    contentRef: 'catalog:tim-kiem',
  },
  ...productRoutes,
];

/**
 * The three listing routes have a product grid, not prose: the capture holds the
 * tab labels, the product names and the product images, nothing else, and all
 * of it is rendered from `products`. Those keys are empty by fact. The search
 * states are computed at run time from the query string.
 *
 * A product's blocks are its own `desc-pro-detail` sentences, in page order, so
 * the prose and the description above read from one source. The U+00A0 between
 * `chó,` and `mèo` is the source's own non-breaking space, kept byte-exact;
 * products-soup.json normalised it to a plain space, and the raw pages won. The
 * `^` the capture leaves in front of `o` in `-18oC` is a capture artefact of the
 * source's `<sup>o</sup>` and is not a source character, so the superscript
 * flattens to `o` — a text block carries no inline markup.
 * ponytail: flat `-18oC` drops the source's superscript; restore `<sup>` once
 * ContentBlock grows an inline-markup escape hatch.
 */
const productBlocks = (product: Product): ContentBlock[] =>
  product.prose.map((text) => ({ type: 'p', text }));

const content: ContentFamily = {
  'catalog:san-pham': [],
  'catalog:thit-tuoi': [],
  'catalog:pate': [],
  'catalog:tim-kiem': [],
  ...Object.fromEntries(products.map((product) => [`catalog:${product.slug}`, productBlocks(product)])),
};

const TABS_SCRIPT = `
(function () {
  var root = document.getElementById('product-tabs');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panel = root.querySelector('[role="tabpanel"]');
  var items = Array.prototype.slice.call(panel.querySelectorAll('[data-category]'));
  function select(tab) {
    var filter = tab.getAttribute('data-filter');
    tabs.forEach(function (other) {
      var on = other === tab;
      other.setAttribute('aria-selected', on ? 'true' : 'false');
      other.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    items.forEach(function (item) {
      item.hidden = filter !== 'all' && item.getAttribute('data-category') !== filter;
    });
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (event) {
      var next = -1;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus();
    });
  });
})();
`;

const SEARCH_SCRIPT = `
(function () {
  var source = document.getElementById('search-products');
  var out = document.getElementById('search-results');
  if (!source || !out) return;
  var products = JSON.parse(source.textContent || '[]');
  var raw = new URLSearchParams(window.location.search).get('keyword');
  var keyword = raw === null ? '' : raw;
  var fold = function (value) {
    return value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/\\u0111/g, 'd');
  };
  var needle = fold(keyword);
  var matches = needle === '' ? [] : products.filter(function (product) { return fold(product.name).indexOf(needle) !== -1; });
  var count = document.createElement('p');
  count.className = 'search-count';
  count.textContent = 'Tìm kiếm (' + (needle === '' ? '' : String(matches.length)) + '): "' + keyword + '"';
  out.appendChild(count);
  if (matches.length === 0) {
    var warning = document.createElement('p');
    warning.className = 'search-warning';
    warning.setAttribute('role', 'alert');
    warning.textContent = '${NO_RESULTS}';
    out.appendChild(warning);
    return;
  }
  var list = document.createElement('ul');
  list.className = 'product-grid';
  matches.forEach(function (product) {
    var item = document.createElement('li');
    item.className = 'product-card';
    var pic = document.createElement('div');
    pic.className = 'product-card__pic';
    var image = document.createElement('img');
    image.className = 'product-card__img';
    image.src = product.image;
    image.alt = product.name;
    image.width = 400;
    image.height = 200;
    image.loading = 'lazy';
    pic.appendChild(image);
    item.appendChild(pic);
    var name = document.createElement('h2');
    name.className = 'product-card__name';
    if (product.href) {
      var anchor = document.createElement('a');
      anchor.href = product.href;
      anchor.textContent = product.name;
      name.appendChild(anchor);
    } else {
      name.textContent = product.name;
    }
    item.appendChild(name);
    list.appendChild(item);
  });
  out.appendChild(list);
})();
`;

const GALLERY_SCRIPT = `
(function () {
  var main = document.querySelector('.product-gallery__main img');
  if (!main) return;
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-thumb]'));
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function (event) {
      event.preventDefault();
      main.src = thumb.getAttribute('data-gallery-thumb');
      main.alt = thumb.getAttribute('data-gallery-alt');
      thumbs.forEach(function (other) { other.setAttribute('aria-current', other === thumb ? 'true' : 'false'); });
    });
  });
})();
`;

/**
 * ponytail: a `PageView` returns an HTML string and the shared layout owns
 * `<head>`, so the stylesheet is inlined per page rather than linked. Ceiling:
 * the CSS is repeated in every catalog page and `<style>` sits in `<body>`.
 * Import it from `SiteLayout.astro` instead once a family view may own assets.
 *
 * Every route this family serves gets the shared two-sided frame here, in the
 * one place all four views already pass through: nothing in the catalogue is
 * a banner, so `class="wrap-content"` is the whole rule. The width and the
 * gutter come from `global.css`, so this file never restates 1200px.
 */
const withStyles = (body: string) => `<style>${catalogCss}</style><div class="wrap-content">${body}</div>`;

/** A captured SOURCE url resolved to the local, base-prefixed public path. */
const localImage = (sourceUrl: string) => withBase(mediaPath(sourceUrl));

/** One price line, split the way the source splits it: large amount, small weight. */
const priceLine = (variant: PriceLine, className: string) =>
  `<p class="${className}"><span class="${className}-amount">${escapeHtml(variant.price)}</span> <span class="${className}-weight">(${escapeHtml(variant.weight)})</span></p>`;

/**
 * A product card. The image is not a second link to the same target: the source
 * wraps both image and name in anchors, which costs a keyboard user two tab
 * stops per card and announces the product twice.
 */
const cardHtml = (product: Product, headingLevel: 2 | 3) => {
  const badge = product.badge
    ? imageTag(`https://thebossvietnam.com/assets/images/${product.badge}.png`, badgeAlt[product.badge], {
        className: `product-card__badge product-card__badge--${product.badge}`,
        width: 226,
        height: 136,
      })
    : '';
  const heading = `h${headingLevel}`;
  return [
    `<li class="product-card" data-category="${product.category}">`,
    `<div class="product-card__pic">${badge}${imageTag(product.image, product.name, { className: 'product-card__img', width: 400, height: 200 })}${imageTag(product.hoverImage, product.name, { className: 'product-card__img product-card__img--hover', width: 400, height: 200 })}</div>`,
    `<${heading} class="product-card__name">${link(`/${product.slug}`, product.name)}</${heading}>`,
    product.variants.map((variant) => priceLine(variant, 'product-card__price')).join(''),
    '</li>',
  ].join('');
};

const gridHtml = (list: Product[], headingLevel: 2 | 3) =>
  `<ul class="product-grid">${list.map((product) => cardHtml(product, headingLevel)).join('')}</ul>`;

/** `/san-pham`: all 15 in the HTML once, filtered by the tabs. */
const catalogView = () => {
  const filters = [{ id: 'all', label: 'Tất cả' }, ...CATEGORIES];
  const tabs = filters
    .map(
      (filter, index) =>
        `<li role="presentation"><button type="button" role="tab" class="product-tabs__tab" id="tab-${filter.id}" data-filter="${filter.id}" aria-controls="panel-products" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHtml(filter.label)}</button></li>`,
    )
    .join('');
  return withStyles(
    [
      // One grid of all 15, filtered by the tabs — not one panel per tab. The
      // full catalogue is therefore in the HTML exactly once, so the `Tất cả`
      // tab cannot repeat the source's `perpage=9` shortfall.
      // ponytail: the three tab buttons are inert until the script below runs.
      // Ceiling: with JS off the tabs do nothing, but all 15 products they
      // would narrow to are already on screen, and `/thit-tuoi` and `/pate` are
      // one click away in the breadcrumb. Upgrade by pointing the tabs at
      // `/san-pham`, `/thit-tuoi` and `/pate` and enhancing a nav instead.
      '<div id="product-tabs">',
      `<ul class="product-tabs__list" role="tablist" aria-label="Danh mục sản phẩm">${tabs}</ul>`,
      `<div role="tabpanel" id="panel-products" aria-labelledby="tab-all">${gridHtml(products, 2)}</div>`,
      '</div>',
      `<script>${TABS_SCRIPT}</script>`,
    ].join(''),
  );
};

/** `/thit-tuoi` (9) and `/pate` (6): the captured category page, statically. */
const categoryView = (record: PageRecord) => {
  const id = record.path.slice(1) as CategoryId;
  if (id !== 'thit-tuoi' && id !== 'pate') {
    throw new Error(`[catalog] "${record.path}" is not a catalog category.`);
  }
  return withStyles(gridHtml(products.filter((product) => product.category === id), 2));
};

/**
 * `/tim-kiem`. The static HTML is a truthful no-claims state: the shared header
 * carries the search form, the page states what the search covers, and the
 * category links below are real routes. The result region stays empty until the
 * inline script filters the embedded dataset, so JS off never shows a false
 * `Không tìm thấy kết quả` for a keyword that does have matches.
 */
const searchView = () => {
  // Local paths only: nothing in the emitted page can point at the source.
  const dataset = products.map((product) => {
    const path = `/${product.slug}`;
    return { name: product.name, image: localImage(product.image), href: pageByPath.has(path) ? withBase(path) : '' };
  });
  const categoryLinks = [`<li>${link('/san-pham', 'Sản phẩm')}</li>`, ...CATEGORIES.map((category) => `<li>${link(`/${category.id}`, category.label)}</li>`)].join('');
  return withStyles(
    [
      `<p class="search-hint">${escapeHtml(search.placeholder)} Danh sách ${products.length} sản phẩm của The Boss Việt Nam được lọc ngay trên trang này.</p>`,
      '<div id="search-results"></div>',
      '<nav class="search-categories" aria-labelledby="search-categories-heading">',
      '<h2 id="search-categories-heading">Danh mục sản phẩm</h2>',
      `<ul>${categoryLinks}</ul>`,
      '</nav>',
      // `<` is the only character JSON here that could close this element
      // early, so it is the only one escaped.
      `<script type="application/json" id="search-products">${JSON.stringify(dataset).replace(/</g, '\\u003c')}</script>`,
      `<script>${SEARCH_SCRIPT}</script>`,
    ].join(''),
  );
};

/**
 * A product detail page. Gallery, this product's own price variants, its own
 * captured prose, the source's `Thông tin sản phẩm` tab area, and the related
 * rail. Everything on the page comes from `./data.ts`, so the fifteen routes
 * this view serves are the same page with a different product in it.
 */
/** Intrinsic size, read from the generated manifest rather than repeated here:
 * the detail captures in products-fresh-2.json record no width/height, but the
 * fetcher measured every file it downloaded, and `imageTag` omits a dimension
 * the manifest does not have. */
const size = (sourceUrl: string) => {
  const entry = mediaByUrl[sourceUrl];
  return { width: entry?.width ?? undefined, height: entry?.height ?? undefined };
};

const productView = (record: PageRecord) => {
  const product = products.find((item) => `/${item.slug}` === record.path);
  if (!product) {
    throw new Error(`[catalog] no product data for "${record.path}".`);
  }
  const thumbs = product.thumbs
    .map((thumb, index) => {
      const local = localImage(thumb.url);
      return `<li><a href="${escapeHtml(local)}" data-gallery-thumb="${escapeHtml(local)}" data-gallery-alt="${escapeHtml(thumb.alt)}" aria-current="${index === 0}">${imageTag(thumb.url, thumb.alt, size(thumb.url))}</a></li>`;
    })
    .join('');
  // The `Giá:` label sits on the first line only, as in the source, and the
  // second line is indented by the stylesheet in place of the four U+00A0 the
  // source's markup carries. The amount and its weight are joined by this
  // product's own joiner so a price never breaks across a line.
  const prices = product.variants
    .map(
      (variant, index) =>
        `<p class="product-price__line">${index === 0 ? '<span class="product-price__label">Giá:</span> ' : ''}<span class="product-price__amount">${escapeHtml(variant.price)}</span>${product.priceJoin}<span class="product-price__weight">(${escapeHtml(variant.weight)})</span></p>`,
    )
    .join('');
  // The source's related rail is the other eight Thịt Tươi Rau Củ products, in
  // feed order, and prices every one of them as the placeholder `Liên hệ`. The
  // real prices are in the idList feed, so those are used here. A pate page's
  // rail is the other five pate products, which is what its own category has.
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug);
  return withStyles(
    [
      '<div class="product-detail">',
      '<div class="product-gallery">',
      `<figure class="product-gallery__main">${imageTag(product.mainImage, product.name, { loading: 'eager', ...size(product.mainImage) })}</figure>`,
      `<ul class="product-thumbs">${thumbs}</ul>`,
      '</div>',
      '<div class="product-summary">',
      `<div class="product-price">${prices}</div>`,
      // A captured snapshot, labelled as one. The source renders a live server
      // counter; a static build cannot, and must not look as though it can.
      `<p class="product-view-count">${escapeHtml(VIEW_SNAPSHOT.label)} ${escapeHtml(product.viewCount)} <span class="product-view-count__note">(số lượt xem ghi nhận tại thời điểm chụp ngày ${escapeHtml(VIEW_SNAPSHOT.capturedOn)}, không phải bộ đếm trực tiếp)</span></p>`,
      `<div class="desc-pro-detail">${prose(requireContent(record, content))}</div>`,
      // The source's tab pane is empty and its second tab is a Facebook embed,
      // so the tab row is kept with its single usable tab. With nothing to
      // switch between, it needs no script.
      '<div class="product-info">',
      '<ul class="product-info__list" role="tablist" aria-label="Thông tin sản phẩm">',
      '<li role="presentation"><button type="button" role="tab" class="product-info__tab" id="info-pro-detail-tab" aria-controls="info-pro-detail" aria-selected="true" tabindex="0">Thông tin sản phẩm</button></li>',
      '</ul>',
      '<div role="tabpanel" id="info-pro-detail" aria-labelledby="info-pro-detail-tab"></div>',
      '</div>',
      '</div>',
      '</div>',
      `<section class="product-related"><h2>Sản phẩm cùng loại</h2>${gridHtml(related, 3)}</section>`,
      `<script>${GALLERY_SCRIPT}</script>`,
    ].join(''),
  );
};

const catalog: FamilyModule = {
  name: 'catalog',
  routes,
  content,
  views: {
    catalog: catalogView,
    category: categoryView,
    product: productView,
    search: searchView,
  },
};

export default catalog;
