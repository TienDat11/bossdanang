/**
 * The 15 products, in the order the source serves them: the nine
 * `api/product.php?perpage=9&idList=4` Thịt Tươi Rau Củ cards followed by the six
 * `idList=5` Pate Tươi cards.
 *
 * Provenance, per field:
 *  - name, `image`, `hoverImage`, `badge`, `variants` — the two feed snapshots,
 *    `.scratch/raw/catalog/api_product_idList{4,5}.html`, byte-exact. The slug
 *    spelling `supper-ga` is the source's; the product name is `SUPER GÀ`.
 *  - `mainImage`, `thumbs` — the detail pages' `product-main` / `product-thumb*`
 *    blocks in `.scratch/capture/products-fresh-{1,2}.json` (the nine meat
 *    routes and `/soup-ga-tiem`) and `products-soup.json` (the other five
 *    soups), confirmed against the raw pages in `.scratch/raw/products/`.
 *  - `viewCount` — what each page printed under `Lượt xem:` on 2026-09-30: the
 *    `value` field of the block in products-fresh-1, the second item of the `ul`
 *    block in products-fresh-2, and the note in products-soup.json. All fifteen
 *    values match the raw HTML. A point-in-time snapshot, never a live count.
 *  - `prose`, `variants[].price` — the `desc-pro-detail` block of each raw page.
 *    `<sup>o</sup>` in `-18<sup>o</sup>C` flattens to `o` because a text block
 *    carries no inline markup. The U+00A0 the source puts between `chó,` and
 *    `mèo` is kept; products-soup.json normalised it to a plain space, so the
 *    raw pages are followed instead.
 *
 * Source defects deliberately not copied:
 *  - The price each detail page prints agrees with the feed for all 15 products
 *    (`priceAgreementFeedVsDetail: "exact match"` in products-fresh-1), so the
 *    feed numbers back the detail page. What the source renders instead is a
 *    COMMENTED-OUT `Giá: Liên hệ` row, which contradicts the visible prices;
 *    no such row is emitted here.
 *  - Only THỊT HEO and THỊT BÒ carry `hot`; only the six soups carry `new`.
 *    The badges are card-level overlays — no detail page contains `check-hot`
 *    or `check-new` — so they belong to the card, not the detail view.
 *  - Every third thumbnail is a shared usage sheet that the source titles and
 *    alt-texts with the product name. It gets an alt saying what the image is.
 *  - The `Bình luận` tab is a Facebook embed. Not reproduced; see index.ts.
 */
export type CategoryId = 'thit-tuoi' | 'pate';

/** One price variant, split the way the source splits it: amount, then weight. */
export type PriceLine = { price: string; unit: string; weight: string };

/** One gallery thumbnail of a detail page, in the source's order. */
export type Thumb = { url: string; alt: string };

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  /** The feed card image, and the second layer the card swaps to on hover. */
  image: string;
  hoverImage: string;
  badge: 'hot' | 'new' | null;
  /** The feed's price variants. The detail page prints the same amounts. */
  variants: PriceLine[];
  /** What the detail page puts between the amount and the weight. The nine meat
   * pages use a plain space, the six pate pages U+00A0, so an amount never
   * breaks from its weight. The feed card always uses a plain space. */
  priceJoin: ' ' | ' ';
  /** The detail page's own hero photo and its three thumbnails. */
  mainImage: string;
  thumbs: Thumb[];
  /** What this page printed under `Lượt xem:` when it was captured. */
  viewCount: string;
  /** The description sentences under `desc-pro-detail`, in page order. */
  prose: string[];
};

const SOURCE = 'https://thebossvietnam.com/';
/** Feed card art: the watermarked 400x200 rendering. */
const card = (file: string): string => `${SOURCE}watermark/product/400x200x1/upload/product/${file}`;
/** The first detail thumbnail is the watermarked 400x200 version of the hero. */
const watermark = (file: string): string => `${SOURCE}watermark/product/400x200x2/upload/product/${file}`;
/** Hero photo, the A4 label shot, and the usage sheets: the raw upload. */
const upload = (file: string): string => `${SOURCE}upload/product/${file}`;

/** `Sản phẩm dành cho chó,` and `mèo` are joined by the source's U+00A0. */
const AUDIENCE = 'Sản phẩm dành cho chó, mèo từ 3 tháng tuổi trở lên.';
const KEEP = 'Bảo quản: ở nhiệt độ -18oC hoặc trong ngăn đông tủ lạnh.';

const MEAT_PROSE: string[] = [AUDIENCE, 'Hạn sử dụng: 06 tháng kể từ ngày sản xuất.', KEEP];
/** The pate pages also hold `06` and `tháng` together with U+00A0. */
const PATE_PROSE: string[] = [AUDIENCE, 'Hạn sử dụng: 06 tháng kể từ ngày sản xuất.', KEEP];

const MEAT_GUIDE_ALT = 'Hướng dẫn sử dụng thịt tươi';
const PATE_GUIDE_ALT = 'Hướng dẫn sử dụng pate tươi';

/** Tab row labels, in source order (`productTabsObserved.tabs[].label`). */
export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'thit-tuoi', label: 'Thịt Tươi Rau Củ' },
  { id: 'pate', label: 'Pate Tươi' },
];

export const products: Product[] = [
  {
    slug: 'ga-xay-hon-hop',
    name: 'GÀ XAY HỖN HỢP',
    category: 'thit-tuoi',
    image: card('ga-xay-hon-hop-3116.png'),
    hoverImage: card('ga-xay-hon-hop-2-2399.png'),
    badge: null,
    variants: [
      { price: '33.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '19.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('ga-xay-hon-hop-3116.png'),
    thumbs: [
      { url: watermark('ga-xay-hon-hop-3116.png'), alt: 'GÀ XAY HỖN HỢP' },
      { url: upload('ga-xay-hon-hop-4634.png'), alt: 'GÀ XAY HỖN HỢP' },
      { url: upload('huong-dan-su-dung-thit-tuoi-7753.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '2040',
    prose: MEAT_PROSE,
  },
  {
    slug: 'supper-ga',
    name: 'SUPER GÀ',
    category: 'thit-tuoi',
    image: card('super-ga-9866.png'),
    hoverImage: card('super-ga-2-1997.png'),
    badge: null,
    variants: [
      { price: '43.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '26.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('super-ga-9866.png'),
    thumbs: [
      { url: watermark('super-ga-9866.png'), alt: 'SUPER GÀ' },
      { url: upload('super-ga-5843.png'), alt: 'SUPER GÀ' },
      { url: upload('huong-dan-su-dung-thit-tuoi-6167.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1588',
    prose: MEAT_PROSE,
  },
  {
    slug: 'thit-heo',
    name: 'THỊT HEO',
    category: 'thit-tuoi',
    image: card('thit-heo-4805.png'),
    hoverImage: card('thit-heo-2-3989.png'),
    badge: 'hot',
    variants: [
      { price: '67.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '39.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('thit-heo-4805.png'),
    thumbs: [
      { url: watermark('thit-heo-4805.png'), alt: 'THỊT HEO' },
      { url: upload('thit-heo-1189.png'), alt: 'THỊT HEO' },
      { url: upload('huong-dan-su-dung-thit-tuoi-6839.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1394',
    prose: MEAT_PROSE,
  },
  {
    slug: 'thit-bo',
    name: 'THỊT BÒ',
    category: 'thit-tuoi',
    image: card('thit-bo-3112.png'),
    hoverImage: card('thit-bo-2-1108.png'),
    badge: 'hot',
    variants: [
      { price: '77.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '46.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('thit-bo-3112.png'),
    thumbs: [
      { url: watermark('thit-bo-3112.png'), alt: 'THỊT BÒ' },
      { url: upload('thit-bo-5290.png'), alt: 'THỊT BÒ' },
      { url: upload('huong-dan-su-dung-thit-tuoi-5798.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1424',
    prose: MEAT_PROSE,
  },
  {
    slug: 'ca-xay',
    name: 'CÁ XAY',
    category: 'thit-tuoi',
    image: card('ca-xay-1854.png'),
    hoverImage: card('ca-xay-2-5529.png'),
    badge: null,
    variants: [
      { price: '67.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '39.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('ca-xay-1854.png'),
    thumbs: [
      { url: watermark('ca-xay-1854.png'), alt: 'CÁ XAY' },
      { url: upload('ca-xay-2799.png'), alt: 'CÁ XAY' },
      { url: upload('huong-dan-su-dung-thit-tuoi-6252.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1331',
    prose: MEAT_PROSE,
  },
  {
    slug: 'chim-cut',
    name: 'CHIM CÚT',
    category: 'thit-tuoi',
    image: card('chim-cut-3392.png'),
    hoverImage: card('chim-cut-2-1711.png'),
    badge: null,
    variants: [
      { price: '77.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '46.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('chim-cut-3392.png'),
    thumbs: [
      { url: watermark('chim-cut-3392.png'), alt: 'CHIM CÚT' },
      { url: upload('chim-cut-5290.png'), alt: 'CHIM CÚT' },
      { url: upload('huong-dan-su-dung-thit-tuoi-9203.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1246',
    prose: MEAT_PROSE,
  },
  {
    slug: 'thit-vit',
    name: 'THỊT VỊT',
    category: 'thit-tuoi',
    image: card('thit-vit-5339.png'),
    hoverImage: card('thit-vit-2-5357.png'),
    badge: null,
    variants: [
      { price: '77.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '46.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('thit-vit-5339.png'),
    thumbs: [
      { url: watermark('thit-vit-5339.png'), alt: 'THỊT VỊT' },
      { url: upload('thit-vit-7064.png'), alt: 'THỊT VỊT' },
      { url: upload('huong-dan-su-dung-thit-tuoi-3916.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1013',
    prose: MEAT_PROSE,
  },
  {
    slug: 'ga-ac',
    name: 'GÀ ÁC',
    category: 'thit-tuoi',
    image: card('ga-ac-3281.png'),
    hoverImage: card('ga-ac-2-8923.png'),
    badge: null,
    variants: [
      { price: '77.000đ/cây', unit: 'cây', weight: '800gr' },
      { price: '46.000đ/cây', unit: 'cây', weight: '400gr' },
    ],
    priceJoin: ' ',
    mainImage: upload('ga-ac-3281.png'),
    thumbs: [
      { url: watermark('ga-ac-3281.png'), alt: 'GÀ ÁC' },
      { url: upload('ga-ac-8019.png'), alt: 'GÀ ÁC' },
      { url: upload('huong-dan-su-dung-thit-tuoi-3559.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1034',
    prose: MEAT_PROSE,
  },
  {
    slug: 'tom-xay-hon-hop',
    name: 'TÔM XAY HỖN HỢP',
    category: 'thit-tuoi',
    image: card('tom-xay-1642.png'),
    hoverImage: card('tom-xay-2-2564.png'),
    badge: null,
    variants: [{ price: '56.000đ/cây', unit: 'cây', weight: '400gr' }],
    priceJoin: ' ',
    mainImage: upload('tom-xay-1642.png'),
    thumbs: [
      { url: watermark('tom-xay-1642.png'), alt: 'TÔM XAY HỖN HỢP' },
      { url: upload('tom-xay-hon-hop-8898.png'), alt: 'TÔM XAY HỖN HỢP' },
      { url: upload('huong-dan-su-dung-thit-tuoi-1986.png'), alt: MEAT_GUIDE_ALT },
    ],
    viewCount: '1082',
    prose: MEAT_PROSE,
  },
  {
    slug: 'soup-ga-tiem',
    name: 'SOUP GÀ TIỀM',
    category: 'pate',
    image: card('1-hop-soup-ga-tiem-500gr-8807.png'),
    hoverImage: card('1-icon-soup-ga-tiem-500gr-7966.png'),
    badge: 'new',
    variants: [{ price: '45.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('1-hop-soup-ga-tiem-500gr-8807.png'),
    thumbs: [
      { url: watermark('1-hop-soup-ga-tiem-500gr-8807.png'), alt: 'SOUP GÀ TIỀM' },
      { url: upload('1-soup-ga-tiem-a4-1231.png'), alt: 'SOUP GÀ TIỀM' },
      { url: upload('a4huong-dan-su-dungpage2-9410.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '896',
    prose: PATE_PROSE,
  },
  {
    slug: 'soup-heo-ham',
    name: 'SOUP HEO HẦM',
    category: 'pate',
    image: card('2-hop-soup-heo-ham-500gr-2426.png'),
    hoverImage: card('2-icon-soup-heo-ham-500gr-9409.png'),
    badge: 'new',
    variants: [{ price: '60.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('2-hop-soup-heo-ham-500gr-2426.png'),
    thumbs: [
      { url: watermark('2-hop-soup-heo-ham-500gr-2426.png'), alt: 'SOUP HEO HẦM' },
      { url: upload('2-soup-heo-ham-a4-5042.png'), alt: 'SOUP HEO HẦM' },
      { url: upload('a4huong-dan-su-dungpage2-3888.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '780',
    prose: PATE_PROSE,
  },
  {
    slug: 'soup-vit-tiem',
    name: 'SOUP VỊT TIỀM',
    category: 'pate',
    image: card('5-hop-soup-vit-tiem-500gr-6648.png'),
    hoverImage: card('5-icon-soup-vit-tiem-500gr-2776.png'),
    badge: 'new',
    variants: [{ price: '60.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('5-hop-soup-vit-tiem-500gr-6648.png'),
    thumbs: [
      { url: watermark('5-hop-soup-vit-tiem-500gr-6648.png'), alt: 'SOUP VỊT TIỀM' },
      { url: upload('5-soup-vit-tiem-a4-5984.png'), alt: 'SOUP VỊT TIỀM' },
      { url: upload('a4huong-dan-su-dungpage2-1119.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '643',
    prose: PATE_PROSE,
  },
  {
    slug: 'soup-ca-tuoi',
    name: 'SOUP CÁ TƯƠI',
    category: 'pate',
    image: card('4-hop-soup-ca-tuoi-500gr-9469.png'),
    hoverImage: card('4-icon-soup-ca-tuoi-500gr-9084.png'),
    badge: 'new',
    variants: [{ price: '60.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('4-hop-soup-ca-tuoi-500gr-9469.png'),
    thumbs: [
      { url: watermark('4-hop-soup-ca-tuoi-500gr-9469.png'), alt: 'SOUP CÁ TƯƠI' },
      { url: upload('4-soup-ca-tuoi-a4-8303.png'), alt: 'SOUP CÁ TƯƠI' },
      { url: upload('a4huong-dan-su-dungpage2-6979.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '670',
    prose: PATE_PROSE,
  },
  {
    slug: 'soup-bo-ham',
    name: 'SOUP BÒ HẦM',
    category: 'pate',
    image: card('3-hop-soup-bo-ham-500gr-5025.png'),
    hoverImage: card('3-icon-soup-bo-ham-500gr-7759.png'),
    badge: 'new',
    variants: [{ price: '70.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('3-hop-soup-bo-ham-500gr-5025.png'),
    thumbs: [
      { url: watermark('3-hop-soup-bo-ham-500gr-5025.png'), alt: 'SOUP BÒ HẦM' },
      { url: upload('3-soup-bo-ham-a4-1353.png'), alt: 'SOUP BÒ HẦM' },
      { url: upload('a4huong-dan-su-dungpage2-5511.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '686',
    prose: PATE_PROSE,
  },
  {
    slug: 'soup-hai-san',
    name: 'SOUP HẢI SẢN',
    category: 'pate',
    image: card('6-hop-soup-hai-san-500gr-6344.png'),
    hoverImage: card('6-icon-soup-hai-san-500gr-6054.png'),
    badge: 'new',
    variants: [{ price: '70.000đ/hộp', unit: 'hộp', weight: '500gr' }],
    priceJoin: ' ',
    mainImage: upload('6-hop-soup-hai-san-500gr-6344.png'),
    thumbs: [
      { url: watermark('6-hop-soup-hai-san-500gr-6344.png'), alt: 'SOUP HẢI SẢN' },
      { url: upload('6-soup-hai-san-a4-4569.png'), alt: 'SOUP HẢI SẢN' },
      { url: upload('a4huong-dan-su-dungpage2-5859.jpg'), alt: PATE_GUIDE_ALT },
    ],
    viewCount: '641',
    prose: PATE_PROSE,
  },
];
