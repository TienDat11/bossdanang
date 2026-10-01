/**
 * Home family: the single route `/`.
 *
 * Source: `.scratch/capture/company-home.json` → `routes[path="/"]`, whose 39
 * blocks are reproduced verbatim in `content` below (the group boundaries come
 * from the capture's own `notes[4]` count line), and
 * `.scratch/raw/company/home.html` for the section order the capture records as
 * a flat block list rather than a tree. Every string is the capture's own bytes:
 * Vietnamese diacritics and the source's U+00A0 non-breaking spaces are kept as
 * captured, and nothing here is retyped from memory.
 *
 * Section order, mapped to the capture's 39 blocks:
 *   hero 0-2 → intro 3 → product tabs 4 → accordion 5-10 → testimonials 11-17 →
 *   articles 18-20 → partners 21-31 → album previews 32-35 → dealer 36-37 →
 *   Zalo 38.
 *
 * This page is a preview of the rest of the site: every product, article, album
 * and dealer link points at the real route, so no content that lives on its own
 * page is duplicated here.
 *
 * Third-party blocks deliberately NOT reproduced (`shell.thirdPartyInventory`
 * marks every one of them `dropFromReplica`):
 *  - the floating Zalo widget `https://zalo.me/` — capture block 38 carries
 *    `placeholderTarget: true`, so the inventory refuses the URL as a dead link.
 *    The owner has no confirmed OA URL, so block 38's `zl.png` mark renders as
 *    branding text with no button, rather than a control that looks live and dies.
 *  - `<div id="messages-facebook">` and the Facebook fanpage image: no third-party
 *    account, no SDK, no request. `src/components/Footer.astro` already carries
 *    the Facebook entry as plain text.
 *  - jQuery / Owl Carousel / Bootstrap collapse / AOS / mmenu, replaced below by
 *    native controls. The page's JS config also carries a reCAPTCHA site key, but
 *    reCAPTCHA belongs to the contact form and no homepage block posts anywhere.
 *  - The section-title images (`spnb.png`, `vscb.png`, `feedback.png`,
 *    `cam-nang.png`, `ha.png`, `title-ds.png`): they are `role: "icon"` entries
 *    in the capture's `media` array, not among the 39 blocks. The one that does
 *    carry captured text — the news section's `The Boss - Thức ăn dinh dưỡng dành
 *    cho thú cưng` — is reproduced as that section's heading.
 *
 * Source defects this module does not copy:
 *  - `<h1 class="hidden-seoh">` is empty and invisible, and `<title>` and the meta
 *    description are empty strings. `src/pages/index.astro` renders the real
 *    `<h1 class="page-title">{page.h1}</h1>`, so this view emits `h2` downward.
 *  - The hero is an Owl carousel with `data-autoplay="1"`: it moves on its own,
 *    and each slide is wrapped in `<a href="">` pointing nowhere. It is a CSS-only
 *    scroll-snap track with real radio controls here — no autoplay, no dead
 *    links, keyboard-operable with no script.
 *  - The product tabs are `<a>` elements with no `href`: unclickable and not
 *    focusable. They are `<button role="tab">` in a real tablist with a single
 *    `role="tabpanel"`, the same mechanism `src/families/catalog/index.ts` uses
 *    for `/san-pham`.
 *  - The partner logos are `<a href="" target="_blank">` around decorative marks
 *    with `alt=""`: eleven dead links announcing nothing. They are plain images
 *    with a non-empty alt and no link, because the capture's `href` is empty for
 *    all eleven. The strip is static rather than a `<marquee>`, which animates
 *    regardless of `prefers-reduced-motion`.
 *  - The 08.08.2026 promotion (hero slide 1, alt `Khuyen mai 08.08.2026`) has
 *    passed, yet the source autoplays it as the live front-page offer. The slide
 *    is kept — the artwork is the owner's and the plan requires all three — and
 *    is labelled in visible text as an ended campaign, never as a current offer.
 *  - Live server-side view counters cannot exist in a static build. The capture
 *    found none on the homepage (`notes[1]`), and none is invented here.
 */
import type { FamilyModule } from '@/families/types';
import type { PageRecord } from '@/data/pages/types';
import { escapeHtml, imageTag, link, requireContent } from '@/lib/blocks';
import type {
  AlbumBlock,
  ArticleBlock,
  ContentBlock,
  ContentFamily,
  ImageBlock,
  ParagraphBlock,
  QuoteBlock,
  TableBlock,
} from '@/content/types';
/**
 * The product cards. The 15 products exist in exactly ONE module on the site;
 * this homepage block holds no product names or images of its own, because the
 * source's `.load_ajax_product` ships empty and the cards arrive over AJAX. So
 * names, prices, weights and artwork come from the catalog family's captured
 * feed dataset, never invented here.
 *
 * The dataset lives at `src/data/products.ts` because the homepage and the
 * product routes need the same 15 products. It is a pure data module: it imports
 * nothing, so it is not the `@/families` glob-aggregator cycle.
 */
import { products } from '@/data/products';
import homeCss from '@/styles/home.css?raw';
import carouselCss from '@/styles/carousel.css?raw';
import { withBase } from '@/data/site';
import { paginationHtml, PAGER_SCRIPT } from '@/components/pagination';
import {
  carouselHtml,
  ARTICLES,
  HERO,
  PARTNERS,
  TESTIMONIALS,
} from '@/components/carouselMarkup';

const routes: PageRecord[] = [
  {
    path: '/',
    kind: 'home',
    section: 'Trang chủ',
    h1: 'THE BOSS VIỆT NAM',
    seo: {
      title: 'The Boss Việt Nam - Thức ăn tươi cho chó mèo',
      description:
        'The Boss là đơn vị chuyên sản xuất thức ăn tươi cho thú cưng với mong muốn đem đến những sản phẩm chất lượng, an toàn và bổ dưỡng, giúp các bé nhà…',
    },
    contentRef: 'home:index',
  },
];

/**
 * The capture's 39 blocks, generated from `routes[path="/"].blocks` and never
 * edited by hand. Group membership is the capture's own: `notes[4]` counts
 * hero=3, intro=1, product-tab=1, accordion=6, testimonials=7, articles=3,
 * partners=11, albums=4, dealer CTA=2, Zalo=1.
 */
const content: ContentFamily = {
  'home:index': [
    { type: "img", href: "", alt: "Khuyen mai 08.08.2026", url: "https://thebossvietnam.com/thumbs/1920x800x1/upload/photo/banner-boss-vn-final-03-5325.png", role: "hero" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/thumbs/1920x800x1/upload/photo/15-sp-1379.png", role: "hero" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/thumbs/1920x800x1/upload/photo/9-sp-88630.png", role: "hero" },
    { type: "p", text: "The Boss là đơn vị chuyên sản xuất thức ăn tươi cho thú cưng với mong muốn đem đến những sản phẩm chất lượng, an toàn và bổ dưỡng, giúp các bé nhà bạn phát triển khỏe mạnh và hạnh phúc. Với tiêu chí \"an toàn và dinh dưỡng\", The Boss cam kết sử dụng nguồn nguyên liệu được tuyển chọn kỹ lưỡng từ các nhà cung cấp uy tín hàng đầu trên thị trường, kết hợp với quy trình sản xuất hiện đại nhằm bảo toàn giá trị dinh dưỡng của thức ăn." },
    { type: "table", headers: ["Tab","id","data-page","data-tenkhongdau"], rows: [["Tất cả","0","9","san-pham"],["Thịt Tươi Rau Củ","4","9","thit-tuoi"],["Pate Tươi","5","9","pate"]], note: "Tất cả tab sends perpage=0." },
    { type: "quote", text: "Chất lượng sản phẩm.\nThe Boss mang đến công thức dinh dưỡng toàn diện, giúp thú cưng phát triển mạnh mẽ từ bên trong, tăng cường sức đề kháng và duy trì nguồn năng lượng dồi dào. Đồng thời, hương vị thơm ngon khó cưỡng khiến các bé luôn hào hứng và mong chờ mỗi bữa ăn.\nSản phẩm được sản xuất từ nguyên liệu chọn lọc, đảm bảo an toàn thực phẩm và đạt tiêu chuẩn quốc tế. Đặc biệt, sản phẩm còn được Trung tâm Giám định và Chứng nhận Hợp chuẩn Hợp quy VietCert kiểm tra và đánh giá định kỳ hàng năm nhằm đảm bảo chất lượng ổn định và đáng tin cậy, giúp khách hàng hoàn toàn yên tâm về sự an toàn và hiệu quả dinh dưỡng cho thú cưng." },
    { type: "quote", text: "Sản phẩm đa dạng, nhiều lựa chọn:\nSản phẩm The Boss có nhiều hương vị khác nhau để dễ dàng thay đổi bữa ăn cho các bé, giúp các bé luôn thưởng thức bữa ăn ngon miệng, đầy đủ dinh dưỡng mà không bị ngán.\nNgoài ra, The Boss còn có nhiều mức trọng lượng khác nhau từ nhỏ gọn cho bé mới dùng thử đến trọng lượng lớn tiết kiệm hơn nhằm đáp ứng nhu cầu linh hoạt của các Sen." },
    { type: "quote", text: "Giá thành hợp lý và cạnh tranh.\nChúng tôi mang đến sản phẩm chất lượng cao với giá cả phải chăng, tối ưu hóa giá trị cho khách hàng.\nVới mức giá chỉ từ 19.000 đồng, The Boss đáp ứng mọi phân khúc khách hàng, vừa tiết kiệm chi phí vừa đảm bảo mang đến nguồn dinh dưỡng tối ưu cho thú cưng." },
    { type: "quote", text: "Uy tín thương hiệu.\nThe Boss được chứng nhận, công nhận bởi các cơ quan uy tín như:\n+ Cục Chăn Nuôi: công nhận và cấp phép lưu hành sản phẩm một cách hợp pháp.\n+ Sở Nông nghiệp & Phát triển Nông thôn TpHCM: cấp Giấy chứng nhận đủ điều kiện sản xuất thức ăn cho chó mèo.\n+ Trung tâm Giám định & Chứng nhận Hợp chuẩn Hợp quy VietCert: cấp Giấy chứng nhận sản phẩm đạt Quy chuẩn Kỹ thuật Quốc gia QCVN 01-190:2020/BNNPTNT.\n+ Đạt các chứng nhận quốc tế về quản lý chất lượng sản phẩm, an toàn thực phẩm như: ISO 9001:2015 & HACCP." },
    { type: "quote", text: "Tính tiện dụng.\nSản phẩm dễ sử dụng, đóng gói gọn gàng, dễ bảo quản và phù hợp với nhu cầu dinh dưỡng của thú cưng." },
    { type: "quote", text: "Độ tin cậy của khách hàng.\nSản phẩm được các Sen đánh giá cao và được Petshop, Phòng khám Thú Y hàng đầu tin tưởng sử dụng và giới thiệu.\nHiện sản phẩm đã có mặt tại hơn 100+ cửa hàng Petshop và Phòng Khám Thú Y trên khắp các tỉnh thành phía Nam như: TP. Hồ Chí Minh, Bình Dương, Đồng Nai, Cần Thơ, Vũng Tàu, Tây Ninh, Long An, Bến Tre, Vĩnh Long, Đồng Tháp,...." },
    { type: "quote", text: "Từ ngày thay đổi thực phẩm tươi nhanh của The Boss thời gian cho ăn được tiết kiệm rất nhiều, bên cạnh đó thể trạng các bé ổn định hơn, lông dài mượt hơn. Cảm ơn thức ăn tươi The Boss mang lại sản phẩm chất lượng cho người nhân giống.", name: "Quang Thảo", role: "Trại chó Dreamfarm - Long An" },
    { type: "quote", text: "Các Boss nhà tôi cực kì khó tính nên thức ăn phải thật sự tươi và ngon mới đáp ứng được khẩu vị của các bé. Qua thời gian chọn lọc tôi đã tìm được chân ái thực phẩm tươi The Boss để bổ sung dinh dưỡng cho hơn 30 bé nhà tôi.", name: "Nhân Nguyễn", role: "Trại Mèo Tân Bình" },
    { type: "quote", text: "Tôi rất hài lòng về độ tươi ngon cũng như chất lượng được đóng gói quy chuẩn của The Boss. Sẽ tiếp tục ủng hộ trong thời gian tới.", name: "Anh Uông", role: "May Hotel" },
    { type: "quote", text: "Ba đứa nhà mình mê nhất vị gà, ăn hoài không biết ngán. Lần nào mua cũng được phản hồi rất nhanh và nhiệt tình, hỗ trợ hết mức có thể để mình nhận được hàng nhanh chóng. Cảm ơn shop và sẽ luôn ủng hộ nha.", name: "Giunchua", role: "KH của đối tác mua trên Shopee" },
    { type: "quote", text: "Thịt ok lắm nha, trộn với hạt xay nhuyễn con chó nhà tui nó ăn hết sạch láng cái dĩa luôn.", name: "Lucylucas", role: "KH của đối tác mua trên Shopee" },
    { type: "quote", text: "Cây thịt to nặng đúng 800gr, có nhiều vị để lựa chọn. Mình vừa nấu thử thanh thịt heo, chó mình ăn xong còn chóp chép thèm. Đóng hàng cũng đẹp nữa, dùng giấy báo để tiết kiệm các loại bọc khác.", name: "Tiencatbi", role: "KH của đối tác mua trên Shopee" },
    { type: "quote", text: "Trộm vía bé nhà mình ăn hợp, cũng có tăng cân một ít, giao hàng nhanh.", name: "Khanhlinh160299", role: "KH của đối tác mua trên Shopee" },
    { type: "article", title: "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN.", href: "huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan", image: "https://thebossvietnam.com/thumbs/376x300x1/upload/news/chuyen-doi-thuc-an-cho-cho-meo-an-toan-3612.png", alt: "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN." },
    { type: "article", title: "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN.", href: "nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an", image: "https://thebossvietnam.com/thumbs/376x300x1/upload/news/2-3691.png", alt: "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN." },
    { type: "article", title: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG.", href: "cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong", image: "https://thebossvietnam.com/thumbs/376x300x1/upload/news/cham-soc-suc-khoe-toan-dien-2472.png", alt: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG." },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/1-17150.png", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/3-78501.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/41-39172.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/4-13183.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/5-14164.png", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/6-13700.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/7-49701.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/8-75602.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/9-39953.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/10-44294.jpg", role: "partner" },
    { type: "img", href: "", alt: "", url: "https://thebossvietnam.com/upload/photo/2-42230.png", role: "partner" },
    { type: "album", title: "THE BOSS & CÁC SEN", href: "the-boss-va-cac-sen", image: "https://thebossvietnam.com/thumbs/420x420x1/upload/product/46888521713645814346431795730101411714443059n-5759.jpg", alt: "THE BOSS & CÁC SEN" },
    { type: "album", title: "SẴN SÀNG CHO BOSS", href: "menu-the-boss", image: "https://thebossvietnam.com/thumbs/400x300x1/upload/product/z606654379618397dc21fc4b42ff42e5b8dde4047177a2-8324.jpg", alt: "SẴN SÀNG CHO BOSS" },
    { type: "album", title: "THE BOSS & PHIÊN HỘI", href: "the-boss-trong-nhung-phien-hoi", image: "https://thebossvietnam.com/thumbs/600x300x1/upload/product/z60665223331916862929201120000a7f7c73949df2ead-4394.jpg", alt: "THE BOSS & PHIÊN HỘI" },
    { type: "album", title: "THE BOSS & ĐỐI TÁC", href: "the-boss-den-khach-hang", image: "https://thebossvietnam.com/thumbs/340x380x1/upload/product/z5900547486416aa949ad65d7bb44ee429be3463640095-7034.jpg", alt: "THE BOSS & ĐỐI TÁC" },
    { type: "p", text: "Chúng tôi tự hào đã có mặt tại hơn 100+ cửa hàng Petshop và Phòng Khám Thú Y trên khắp các tỉnh thành phía Nam như: TP. Hồ Chí Minh, Bình Dương, Cần Thơ và nhiều khu vực khác. Bạn có thể dễ dàng tìm kiếm đại lý gần nhất để trải nghiệm sản phẩm nhanh chóng và thuận tiện." },
    { type: "p", text: "Nhấn vào để xem chi tiết", href: "https://thebossvietnam.com/he-thong-dai-ly" },
    { type: "img", href: "https://zalo.me/", alt: "Zalo", url: "https://thebossvietnam.com/assets/images/zl.png", role: "zalo" },
  ],
};

/** The capture's `notes[1]` capture date, used for the ended-promotion wording. */
const CAPTURED_ON = '30/09/2026';

/* ------------------------------------------------------------------ hero -- */

/**
 * The captured promotion's own date, read off its alt and filename. The hero
 * slides are the only place a date appears, and 08.08.2026 is in the past at
 * build time, so slide 1 is labelled as ended in visible text — a colour change
 * alone would still read as a current offer.
 */
const PROMOTION_ENDED_NOTE = `Chiến dịch 08.08.2026 đã kết thúc (ảnh chụp ${CAPTURED_ON}).`;

/**
 * CSS-only slider: real `<input type="radio">` controls, one scroll-snap track.
 * The radios are visually hidden with `position:absolute` + `opacity:0`, never
 * `display:none`, so they stay in the tab order; a radio group gives arrow-key
 * selection natively, which is a slider's own control model. No script, no timer,
 * and `global.css` already neutralises transitions under `prefers-reduced-motion`.
 */
const heroHtml = (slides: ImageBlock[]): string => {
  const items = slides
    .map((slide, index) => {
      // The capture gives slides 2 and 3 an empty alt. An empty alt on a
      // contentful hero image hides it from assistive tech entirely, so each
      // slide is described by its position instead.
      const alt = slide.alt || `Ảnh nổi bật ${index + 1} của The Boss Việt Nam`;
      const ended = index === 0 ? `<p class="carousel__note">${escapeHtml(PROMOTION_ENDED_NOTE)}</p>` : '';
      return [
        '<div class="carousel__item">',
        imageTag(slide.url, alt, {
          className: 'carousel__image',
          loading: index === 0 ? 'eager' : 'lazy',
          width: 1920,
          height: 800,
        }),
        ended,
        '</div>',
      ].join('');
    })
    .join('');
  return carouselHtml(HERO, slides.length, items);
};

/* ----------------------------------------------------------------- intro -- */

const introHtml = (block: ParagraphBlock): string =>
  [
    '<section class="intro" aria-labelledby="intro-heading">',
    '<div class="intro__copy" data-reveal="fade">',
    imageTag('https://thebossvietnam.com/upload/photo/theboss-460x75-8475-1-3806.png', '', { className: 'intro__artwork', width: 1600, height: 243, reveal: 'zoom' }),
    `<p class="intro__text">${escapeHtml(block.text)}</p>`,
    `<h2 class="intro__heading" id="intro-heading">WELCOME TO</h2>`,
    '</div>',
    '<div class="intro__images">',
    imageTag('https://thebossvietnam.com/thumbs/300x300x1/upload/news/z5782567673808294211b18a82586d7b22e053cb232e63-5190.jpg', 'the boss', { className: 'intro__image intro__image--first', width: 300, height: 300, reveal: 'zoom' }),
    imageTag('https://thebossvietnam.com/thumbs/470x460x1/upload/news/thiet-ke-chua-co-ten-2-2080.png', 'the boss', { className: 'intro__image intro__image--second', width: 470, height: 460, reveal: 'zoom' }),
    '</div>',
    '</section>',
  ].join('');


/* ---------------------------------------------------------- product tabs -- */

/**
 * Capture block 4 is the source's tab wiring as a table, not as visible copy:
 * `Tab | id | data-page | data-tenkhongdau`. Its three `Tab` cells ARE the
 * visitor-facing labels, so those are what the tablist renders. The `note` field
 * is the capture's observation of the source's request (`Tất cả tab sends
 * perpage=0`) and is never emitted as page text.
 *
 * The product grid is all 15 products in the HTML exactly once and the tabs
 * narrow it locally — the same mechanism, and the same fix for the source's
 * `perpage=0`, that `src/families/catalog/index.ts` applies to `/san-pham`.
 */
const TABS_SCRIPT = `
(function () {
  var root = document.getElementById('home-product-tabs');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panel = root.querySelector('[role="tabpanel"]');
  function select(tab) {
    tabs.forEach(function (other) {
      var on = other === tab;
      other.setAttribute('aria-selected', on ? 'true' : 'false');
      other.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    // The pager script owns which cards are visible: it pages within whatever
    // survives this filter. Two scripts writing \`hidden\` would fight over it.
    root.dispatchEvent(new CustomEvent('filterchange', { bubbles: true }));
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

/** `hot.png` / `new.png` are the source's own ribbon art; both have no text. */
const BADGE_ALT: Record<'hot' | 'new', string> = {
  hot: 'Sản phẩm bán chạy',
  new: 'Sản phẩm mới',
};

/**
 * The capture's `data-tenkhongdau` cell names the ROUTE each tab navigates to
 * (`san-pham`, `thit-tuoi`, `pate`), while the script filters by the product's
 * own `category` (`thit-tuoi`, `pate`). Row 1 is the source's "Tất cả" tab and
 * is the one that shows everything, so it maps to `all`; the other two rows'
 * cells already equal the category ids they filter on.
 */
const productTabsHtml = (block: TableBlock): string => {
  const filters = block.rows.map((row, index) => ({ id: index === 0 ? 'all' : row[3], label: row[0] }));
  const tabs = filters
    .map(
      (filter, index) =>
        `<li role="presentation"><button type="button" role="tab" class="product-tabs__tab" id="home-tab-${filter.id}" data-filter="${escapeHtml(filter.id)}" aria-controls="home-panel-products" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHtml(filter.label)}</button></li>`,
    )
    .join('');
  const cards = products
    .map(
      (product) =>
        [
          `<li class="product-card" data-product-card data-category="${escapeHtml(product.category)}">`,
          '<div class="product-card__pic">',
          product.badge
            ? imageTag(`https://thebossvietnam.com/assets/images/${product.badge}.png`, BADGE_ALT[product.badge], {
                className: `product-card__badge product-card__badge--${product.badge}`,
                width: 226,
                height: 136,
              })
            : '',
          imageTag(product.image, product.name, { className: 'product-card__img', width: 400, height: 200 }),
          imageTag(product.hoverImage, product.name, {
            className: 'product-card__img product-card__img--hover',
            width: 400,
            height: 200,
          }),
          '</div>',
          `<h3 class="product-card__name">${link(`/${product.slug}`, product.name)}</h3>`,
          product.variants
            .map(
              (variant) =>
                `<p class="product-card__price">${escapeHtml(variant.price)} <span class="product-card__price-weight">(${escapeHtml(variant.weight)})</span></p>`,
            )
            .join(''),
          '</li>',
        ].join(''),
    )
    .join('');
  return [
    '<section class="product-tabs" aria-labelledby="product-tabs-heading">',
    // The source's section title here is an image (`spnb.png`) with no text, so
    // the heading is the captured tab list's own subject rather than invented copy.
    '<h2 class="sr-only" id="product-tabs-heading">Sản phẩm</h2>',
    imageTag('https://thebossvietnam.com/assets/images/spnb.png', 'icon-sanpham', { className: 'product-tabs__heading', width: 408, height: 72, reveal: 'fade' }),
    '<div id="home-product-tabs" data-product-grid>',
    `<ul class="product-tabs__list" role="tablist" aria-label="Danh mục sản phẩm">${tabs}</ul>`,
    `<div role="tabpanel" id="home-panel-products" aria-labelledby="home-tab-${escapeHtml(filters[0].id)}">`,
    // Live region: the pager script rewrites this on every page change, so a
    // screen reader hears the window rather than only seeing cards appear.
    '<p class="sr-only" data-product-status aria-live="polite"></p>',
    `<ul class="product-tabs__grid" data-reveal="fade">${cards}</ul>`,
    paginationHtml(products.length),
    '</div>',
    `<script>${TABS_SCRIPT}</script>`,
    `<script>${PAGER_SCRIPT}</script>`,
    '</section>',
  ].join('');
};

/* ------------------------------------------------------------- accordion -- */

/**
 * The six captured `quote` blocks. Each one's first line is the accordion
 * question and the remaining lines are the answer, which is exactly how the
 * source splits them: `.accordion-header` heading plus `.accordion-body` copy.
 *
 * `<details>`/`<summary>` is the native control: keyboard-operable and
 * screen-reader-correct for free, and it keeps its own open state with no script.
 * Nothing is forced open — the source ships all six closed (`aria-expanded="false"`
 * on every one) and collapses the rest on click, which the native element does
 * not; that difference is a defect this does not copy.
 */
const accordionHtml = (quotes: QuoteBlock[]): string => {
  const items = quotes
    .map((quote) => {
      const [question, ...answer] = quote.text.split('\n');
      return [
        '<details class="accordion__item" data-reveal="fade">',
        `<summary class="accordion__question">${escapeHtml(question)}</summary>`,
        `<div class="accordion__answer">${answer.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`,
        '</details>',
      ].join('');
    })
    .join('');
  return [
    '<section class="accordion" aria-labelledby="accordion-heading">',
    '<h2 class="sr-only" id="accordion-heading">Vì sao chọn The Boss</h2>',
    imageTag('https://thebossvietnam.com/assets/images/vscb.png', '', { className: 'carousel__heading', width: 493, height: 69 }),
    imageTag('https://thebossvietnam.com/thumbs/551x398x1/upload/photo/green-bold-international-cat-day-instagram-post-5-2940.png', '', { className: 'accordion__banner', width: 551, height: 398, reveal: 'zoom' }),
    `<div class="accordion__list">${items}</div>`,
    '</section>',
  ].join('');
};

/* ---------------------------------------------------------- testimonials -- */

/**
 * The seven captured `quote` blocks that carry a `name` and `role`. The capture
 * holds no avatar for any of them (`avatar: null` throughout, and `notes[3]`
 * confirms the source markup has no avatar element), so none is rendered.
 */
const testimonialsHtml = (quotes: QuoteBlock[]): string => {
  const items = quotes
    .map(
      (quote) =>
        [
          '<div class="carousel__item">',
          '<figure class="carousel__card">',
          `<blockquote class="carousel__quote"><p>${escapeHtml(quote.text)}</p></blockquote>`,
          '<figcaption class="carousel__by">',
          `<span class="carousel__name">${escapeHtml(quote.name ?? '')}</span>`,
          `<span class="carousel__role">${escapeHtml(quote.role ?? '')}</span>`,
          '</figcaption>',
          '</figure>',
          '</div>',
        ].join(''),
    )
    .join('');
  return carouselHtml(TESTIMONIALS, quotes.length, items);
};
/* --------------------------------------------------------------- articles -- */

/**
 * The source wraps each article's image, its title AND a `Xem thêm` line in
 * three separate anchors to the same URL: three tab stops announcing one article
 * three times. The card below is a single link with the image inside it.
 */
const articlesHtml = (articles: ArticleBlock[]): string => {
  const items = articles
    .map(
      (article) =>
        [
          '<div class="carousel__item">',
          '<article class="carousel__card">',
          `<a class="carousel__link" href="${escapeHtml(withBase(`/${article.href}`))}">`,
          imageTag(article.image, article.alt, { className: 'carousel__thumb', width: 376, height: 300 }),
          `<h3 class="carousel__headline">${escapeHtml(article.title)}</h3>`,
          '<span class="carousel__more">Xem thêm <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M8 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>',
          '</a>',
          '</article>',
          '</div>',
        ].join(''),
    )
    .join('');
  return carouselHtml(ARTICLES, articles.length, items);
};

/* --------------------------------------------------------------- partners -- */

/**
 * The eleven captured partner marks, in source order. Every one is a decorative
 * mark with `alt: ""` and `href: ""` in the capture, so no brand name is read off
 * the artwork and none is invented: each is labelled by its position in the
 * strip, which is a true statement about the image.
 */
const partnersHtml = (partners: ImageBlock[]): string => {
  const items = partners
    .map((partner, index) =>
      [
        '<div class="carousel__item">',
        imageTag(partner.url, `Logo đối tác ${index + 1}`, { className: 'carousel__logo' }),
        '</div>',
      ].join(''),
    )
    .join('');
  return carouselHtml(PARTNERS, partners.length, items);
};

/**
 * The eleven captured partner marks, in source order.
 *
 * The capture gives every one `alt: ""` and `href: ""` — decorative marks with no
 * recorded company name and no destination. The capture is the authority on copy,
 * so no brand name is read off the artwork and none is invented: each is labelled
 * by its position in the strip, which is a true statement about the image. Sizes
 * are the manifest's intrinsic dimensions, which also reserve layout space.
 */

/* ----------------------------------------------------------------- albums -- */

const albumsHtml = (albums: AlbumBlock[]): string => {
  const items = albums
    .map(
      (album) =>
        [
          '<li class="albums__item" data-reveal="zoom">',
          `<a class="albums__link" href="${escapeHtml(withBase(`/${album.href}`))}">`,
          imageTag(album.image, album.alt, { className: 'albums__image', width: 420, height: 420 }),
          `<span class="albums__title">${escapeHtml(album.title)}</span>`,
          '</a>',
          '</li>',
        ].join(''),
    )
    .join('');
  return [
    '<section class="albums" aria-labelledby="albums-heading">',
    '<h2 class="sr-only" id="albums-heading">Thư viện ảnh</h2>',
    imageTag('https://thebossvietnam.com/assets/images/ha.png', 'icon-album', { className: 'carousel__heading', width: 424, height: 68 }),
    `<ul class="albums__grid">${items}</ul>`,
    // "Xem thêm" is the source's own album-section link text.
    `<p class="albums__more">${link('/thu-vien-anh', 'Xem thêm')}</p>`,
    '</section>',
  ].join('');
};

/* ----------------------------------------------------------------- dealer -- */

/**
 * The dealer banner's two captured paragraphs. The second is a link to the dealer
 * system; the source points it at an absolute source-origin URL, which becomes a
 * root-relative internal path here so it cannot hotlink the source.
 */
const DEALER_PATH = '/he-thong-dai-ly';

const dealerHtml = (paragraphs: ParagraphBlock[]): string => {
  const [body, cta] = paragraphs;
  return [
    '<section class="dealer" aria-labelledby="dealer-heading" data-reveal="fade">',
    imageTag('https://thebossvietnam.com/assets/images/title-ds.png', '', { className: 'carousel__heading', width: 380, height: 71 }),
    imageTag('https://thebossvietnam.com/thumbs/785x350x1/upload/photo/thiet-ke-chua-co-ten-14-8887.png', '', { className: 'dealer__banner', width: 785, height: 350 }),
    '<h2 class="sr-only" id="dealer-heading">Hệ thống đại lý</h2>',
    `<p class="dealer__text">${escapeHtml(body.text)}</p>`,
    `<p class="dealer__cta">${link(DEALER_PATH, cta.text)}</p>`,
    '</section>',
  ].join('');
};

/* ------------------------------------------------------------------ zalo -- */

/**
 * Capture block 38. The source wraps this mark in a floating link to
 * `https://zalo.me/`, which the capture flags `placeholderTarget: true` and
 * `shell.thirdPartyInventory` drops as a dead placeholder. No confirmed OA URL
 * exists, so there is no button to enable: the mark renders as branding text, and
 * `src/components/Footer.astro` carries the phone number for real contact.
 */
const zaloHtml = (mark: ImageBlock): string =>
  [
    '<aside class="zalo" aria-label="Zalo">',
    imageTag(mark.url, mark.alt, { className: 'zalo__mark', width: 35, height: 35 }),
    '<p class="zalo__note">Zalo: liên hệ qua số điện thoại ở chân trang.</p>',
    '</aside>',
  ].join('');

/* ------------------------------------------------------------------- view -- */

/**
 * ponytail: a `PageView` returns an HTML string and the shared layout owns
 * `<head>`, so the stylesheet is inlined per page rather than linked. Ceiling:
 * the CSS is repeated on every page and `<style>` sits in `<body>`. Import it
 * from `SiteLayout.astro` once a family view may own assets.
 */
const withStyles = (body: string) => `<style>${homeCss}${carouselCss}</style>${body}`;

const homeView = (record: PageRecord): string => {
  const blocks = requireContent(record, content);
  const ofType = <T extends ContentBlock['type']>(type: T) =>
    blocks.filter((block): block is Extract<ContentBlock, { type: T }> => block.type === type);

  const images = ofType('img');
  const hero = images.filter((image) => image.role === 'hero');
  const partners = images.filter((image) => image.role === 'partner');
  const zalo = images.find((image) => image.role === 'zalo');

  const quotes = ofType('quote');
  // Blocks 5-10 are the accordion, 11-17 the testimonials; a testimonial is the
  // only quote the capture gives a name and role.
  const testimonials = quotes.filter((quote) => Boolean(quote.name));
  const accordion = quotes.filter((quote) => !quote.name);

  const paragraphs = ofType('p');
  const table = blocks.find((block): block is TableBlock => block.type === 'table');

  // The content map is generated from the capture, so these three are present by
  // construction. The guards keep that a typed fact rather than a hope, and a
  // missing block names itself in the build error instead of rendering `undefined`.
  if (!zalo) throw new Error('[home] capture block 38 (the Zalo mark) is missing.');
  if (!paragraphs[0]) throw new Error('[home] capture block 3 (the intro paragraph) is missing.');
  if (!table) throw new Error('[home] capture block 4 (the product tab table) is missing.');

  return withStyles(
    [
      heroHtml(hero),
      introHtml(paragraphs[0]),
      productTabsHtml(table),
      accordionHtml(accordion),
      testimonialsHtml(testimonials),
      articlesHtml(ofType('article')),
      partnersHtml(partners),
      albumsHtml(ofType('album')),
      dealerHtml(paragraphs.slice(1, 3)),
      zaloHtml(zalo),
    ].join('\n'),
  );
};

const home: FamilyModule = {
  name: 'home',
  routes,
  content,
  views: { home: homeView },
};

export default home;
