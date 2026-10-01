/**
 * Carousel markup for the family views.
 *
 * A `PageView` returns an HTML string (see `withStyles` in the families), so
 * these cannot be `.astro` components — nothing in a plain `.ts` module can
 * mount one. The runtime lives in `carousel.ts`; this file only emits the
 * markup and the data attributes that runtime reads.
 *
 * Every number below was measured in Chrome DevTools against the source and is
 * repeated in the data attributes and in `carousel.css` (which carries the same
 * figures as the no-JS fallback).
 */

import { withBase } from '@/data/site';

export interface CarouselSpec {
  id: string;
  /** Class on the section; `carousel.css` keys its per-view numbers off it. */
  variant: 'hero' | 'partners' | 'testimonials' | 'articles';
  perView: number;
  gap: number;
  /** `0` disables autoplay — the source's testimonial and article strips. */
  autoplay: number;
  autoplaySpeed: number;
  /** Duration of the slide transition itself, not the pause between slides. */
  smartSpeed: number;
  dots: 0 | 1;
  /** Section title. Visible by default; `srOnlyHeading` hides it behind artwork. */
  heading: string;
  /** Optional captured title artwork drawn above the heading. */
  headingImage?: { src: string; width: number; height: number; alt: string };
  /** Announce the heading to assistive tech only — artwork carries the visible title. */
  srOnlyHeading?: boolean;
  reveal?: 'fade' | 'zoom';
  nav: 0 | 1;
  /** Owl's `data-navcontainer`, kept because the CSS positions off it. */
  navContainer?: string;
  drag: 0 | 1;
  /** Section id the nav container selector points at. */
  navSectionId?: string;
  /** Per-view and gap below 768px; the source has no mobile layout to copy. */
  perViewMobile?: number;
  gapMobile?: number;
}

/** Hero: three full-bleed artwork slides, 6.6s apart, 800ms cross-fade. */
export const HERO: CarouselSpec = {
  id: 'hero-carousel',
  variant: 'hero',
  perView: 1,
  gap: 0,
  autoplay: 1,
  autoplaySpeed: 6600,
  smartSpeed: 800,
  dots: 1,
  nav: 1,
  navContainer: '.control-slideshow',
  navSectionId: 'control-slideshow',
  drag: 0,
  heading: 'Ảnh nổi bật',
  srOnlyHeading: true,
};

/** Partner strip: 11 logos, 6 per window, 55px apart, 8.8s apart in time. */
export const PARTNERS: CarouselSpec = {
  id: 'partners-carousel',
  variant: 'partners',
  perView: 6,
  gap: 55,
  autoplay: 1,
  autoplaySpeed: 8800,
  smartSpeed: 3500,
  dots: 0,
  nav: 1,
  navContainer: '.control-partner',
  navSectionId: 'control-partner',
  drag: 1,
  heading: 'ĐỐI TÁC KHÁCH HÀNG CỦA THE BOSS',
  // Six 55px-gapped logos need 1347px. Below 768px that leaves 11px logos, so
  // mobile takes three per window with the gap the frame can spare.
  perViewMobile: 3,
  gapMobile: 24,
  reveal: 'fade',
};

/** Testimonials: 7 cards, 2 per window, 4 dots, no autoplay, drag only. */
export const TESTIMONIALS: CarouselSpec = {
  id: 'testimonial-carousel',
  variant: 'testimonials',
  perView: 2,
  gap: 40,
  autoplay: 0,
  autoplaySpeed: 3500,
  smartSpeed: 300,
  dots: 1,
  nav: 0,
  drag: 1,
  heading: 'Cảm nhận khách hàng',
  headingImage: { src: '/media/misc/feedback.png', width: 429, height: 55, alt: 'icon-news' },
  srOnlyHeading: true,
  perViewMobile: 1,
  gapMobile: 16,
  reveal: 'fade',
};

/** Articles: 3 posts, 3 per window, no autoplay, no dots, drag only. */
export const ARTICLES: CarouselSpec = {
  id: 'article-carousel',
  variant: 'articles',
  perView: 3,
  gap: 36,
  autoplay: 0,
  autoplaySpeed: 3500,
  smartSpeed: 300,
  dots: 0,
  nav: 0,
  drag: 1,
  heading: 'The Boss - Thức ăn dinh dưỡng dành cho thú cưng',
  headingImage: { src: '/media/misc/cam-nang.png', width: 250, height: 62, alt: 'icon-news' },
  perViewMobile: 1,
  gapMobile: 16,
  reveal: 'fade',
};

const CHEVRON = (d: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"></path></svg>`;

const dots = (spec: CarouselSpec, count: number, label: string) =>
  count < 2
    ? ''
    : [
        '<div class="carousel__dots">',
        Array.from({ length: count }, (_, index) => {
          const current = index === 0 ? ' aria-current="true"' : '';
          return `<button type="button" class="carousel__dot" aria-label="${label} ${index + 1}"${current}></button>`;
        }).join(''),
        '</div>',
      ].join('');

const arrows = (spec: CarouselSpec, itemCount: number) => {
  if (!spec.nav || itemCount <= spec.perView) return '';
  const [prev, next] = ARROW_LABELS[spec.variant];
  return [
    `<div class="carousel__nav ${spec.navSectionId}">`,
    `<button type="button" class="carousel__arrow carousel__arrow--prev" aria-label="${prev}">${CHEVRON('M15 5l-7 7 7 7')}</button>`,
    `<button type="button" class="carousel__arrow carousel__arrow--next" aria-label="${next}">${CHEVRON('M9 5l7 7-7 7')}</button>`,
    '</div>',
  ].join('');
};

const ARROW_LABELS: Record<CarouselSpec['variant'], [string, string]> = {
  hero: ['Ảnh nổi bật trước', 'Ảnh nổi bật sau'],
  partners: ['Nhóm đối tác trước', 'Nhóm đối tác sau'],
  testimonials: ['Cảm nhận trước', 'Cảm nhận sau'],
  articles: ['Bài viết trước', 'Bài viết sau'],
};

const DOT_LABELS: Record<CarouselSpec['variant'], string> = {
  hero: 'Xem ảnh nổi bật',
  partners: 'Xem đối tác',
  testimonials: 'Xem cảm nhận',
  articles: 'Xem bài viết',
};

/**
 * One carousel. `items` is the caller's pre-rendered `carousel__item` markup.
 */
export function carouselHtml(spec: CarouselSpec, itemCount: number, items: string): string {
  const heading = spec.heading;
  const headingId = `${spec.id}-heading`;
  // The hero banner is one of the source's full-width bands; everything else
  // sits inside the 1200px frame.
  const bleed = spec.variant === 'hero' ? ' frame--bleed' : '';
  return [
    `<section class="carousel-section carousel--${spec.variant}" id="${spec.id}" data-carousel`,
    spec.reveal ? ` data-reveal="${spec.reveal}"` : '',
    ` data-per-view="${spec.perView}" data-gap="${spec.gap}"`,
    spec.perViewMobile ? ` data-per-view-mobile="${spec.perViewMobile}"` : '',
    spec.gapMobile !== undefined ? ` data-gap-mobile="${spec.gapMobile}"` : '',
    ` data-autoplay="${spec.autoplay}" data-autoplayspeed="${spec.autoplaySpeed}"`,
    ` data-smartspeed="${spec.smartSpeed}" data-dots="${spec.dots}" data-nav="${spec.nav}"`,
    spec.dots ? ` data-dot-label="${DOT_LABELS[spec.variant]}"` : '',
    spec.navContainer ? ` data-navcontainer="${spec.navContainer}"` : '',
    ' data-rewind="1" data-loop="0"',
    ` data-mousedrag="${spec.drag}" aria-roledescription="carousel" aria-labelledby="${headingId}">`,
    [
      spec.headingImage
        ? `<div class="carousel__heading-art"><img src="${withBase(spec.headingImage.src)}" alt="${spec.headingImage.alt}" width="${spec.headingImage.width}" height="${spec.headingImage.height}" loading="lazy" decoding="async" /></div>`
        : '',
      spec.srOnlyHeading
        ? `<h2 class="sr-only" id="${headingId}">${heading}</h2>`
        : `<h2 class="carousel__heading" id="${headingId}">${heading}</h2>`,
    ].join(''),
    `<div class="frame${bleed} carousel-frame">`,
    '<div class="carousel"><div class="carousel__track">',
    items,
    '</div></div>',
    spec.dots ? dots(spec, Math.ceil(itemCount / spec.perView), DOT_LABELS[spec.variant]) : '',
    arrows(spec, itemCount),
    '</div></section>',
  ].join('');
}
