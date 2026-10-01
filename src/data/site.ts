/**
 * Site-wide constants derived from `.scratch/capture/company-home.json` → `shell`.
 * Components read this module instead of hardcoding chrome copy.
 */
import { anyMediaPath, mediaPath } from '@/lib/media';

// Injected by `vite.define` in astro.config.mjs (release gate lives there).
declare global {
  var __SITE_URL__: string;
  var __SITE_BASE__: string;
  var __PUBLISH__: boolean;
}

export const siteUrl = __SITE_URL__.replace(/\/+$/, '');
const basePath = __SITE_BASE__.replace(/^\/+|\/+$/g, '');
export const siteBase = basePath ? `/${basePath}` : '';
export const publish = __PUBLISH__;

/** Absolute canonical/sitemap URL for a registry path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${siteBase}${path === '/' ? '' : path}`;
}

/**
 * Internal href. Astro does not rewrite `href` for a project-site `base`, so every
 * internal link must carry the prefix.
 */
export function withBase(path: string): string {
  return `${siteBase}${path === '/' ? '/' : path}`;
}

export const brand = {
  name: 'THE BOSS VIỆT NAM',
  // Source ships the same artwork at two sizes; the media pipeline dedupes it to one file.
  logoSourceUrls: [
    'https://thebossvietnam.com/upload/photo/02-logo-boss-chu-do-nen-trang-5204.png',
    'https://thebossvietnam.com/upload/news/02-logo-boss-chu-do-nen-trang-5204-8553.png',
  ],
};

export const logoPath = anyMediaPath(...brand.logoSourceUrls);

export const searchIconPath = mediaPath('https://thebossvietnam.com/assets/images/search.png');

// Source `.menu ul li a.active:after` — the dog-bone marker under the active
// nav item: 21x8 px at `left: calc(50% - 10.5px)`, pinned to the link's baseline.
export const menuMarkerPath = mediaPath('https://thebossvietnam.com/assets/images/icon1.png');

export type SiteLink = { label: string; path: string; children?: SiteLink[] };

/** `shell.navigation` — source hrefs are root-relative without a leading slash; "" is the home page. */
export const navigation: SiteLink[] = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Giới thiệu', path: '/gioi-thieu' },
  {
    label: 'Sản phẩm',
    path: '/san-pham',
    children: [
      { label: 'Thịt Tươi Rau Củ', path: '/thit-tuoi' },
      { label: 'Pate Tươi', path: '/pate' },
    ],
  },
  { label: 'Hệ thống đại lý', path: '/he-thong-dai-ly' },
  { label: 'Cẩm nang', path: '/cam-nang' },
  { label: 'Liên hệ', path: '/lien-he' },
];

export const contact = {
  address: '225A Kênh Đông, ấp Bàu Tre 1, xã Tân An Hội, Thành phố Hồ Chí Minh.',
  phone: '0978202063',
};

export type FooterColumn =
  | { kind: 'brand'; heading: string }
  | { kind: 'contact'; heading: string }
  | { kind: 'links'; heading: string; links: SiteLink[] };

/**
 * `shell.footerColumns`. The Facebook entry is kept as text only: the capture's
 * `shell.thirdPartyInventory` marks it `dropFromReplica`, and `isLive()` renders
 * anything outside the route registry as plain text.
 */
export const footerColumns: FooterColumn[] = [
  { kind: 'brand', heading: 'Logo' },
  { kind: 'contact', heading: 'THE BOSS VIỆT NAM' },
  {
    kind: 'links',
    heading: 'Chính sách',
    links: [
      { label: 'Chính sách bảo mật.', path: '/chinh-sach-bao-mat' },
      { label: 'Chính sách tuyển dụng.', path: '/chinh-sach-tuyen-dung' },
    ],
  },
  {
    kind: 'links',
    heading: 'Social',
    links: [{ label: 'Facebook', path: 'https://www.facebook.com/TheBossVietnam' }],
  },
];

export const footerCopyright = {
  year: '2024',
  holder: 'The Boss Vietnam',
  licence: 'Được cấp phép bởi Cục Chăn Nuôi',
};

export const search = {
  action: '/tim-kiem',
  fieldName: 'keyword',
  placeholder: 'Nhập từ khóa cần tìm...',
};
