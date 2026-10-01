/**
 * Shared carousel + scroll-reveal behaviour, vanilla, no dependency.
 *
 * Every option is read from the root element's data attributes, which mirror the
 * source's own Owl Carousel attributes, so the DOM markup stays the single place
 * a measurement is declared. Numbers below are the Chrome DevTools measurements
 * of https://thebossvietnam.com/ and must not be "rounded" to nicer values:
 *
 *   hero         3 slides  · 1 per view · gap 0 · autoplay 6600ms · transition 800ms
 *   partners    11 marks   · 6 per view · gap 55px · autoplay 8800ms · transition 3500ms
 *   testimonials 7 cards   · 2 per view · gap 40px · autoplay off · 4 dots · transition 300ms
 *   articles     3 cards   · 3 per view · gap 36px · autoplay off · transition 300ms
 *
 * ponytail: one class, no plugin. Upgrade path if these ever need looping or
 * multi-breakpoint `perView` — keep it here rather than adding a dependency.
 */

export interface CarouselOptions {
  /** Slides visible at once; fixed at every breakpoint, as measured. */
  perView: number;
  /** Gap between items, px. */
  gap: number;
  /** Autoplay interval, ms. Only read when `autoplay` is on. */
  interval: number;
  /** Slide transition duration, ms. */
  speed: number;
  autoplay: boolean;
  /** `data-rewind="1"`: next on the last slide wraps to the first, prev on the first to the last. */
  rewind: boolean;
  drag: boolean;
  dots: boolean;
  nav: boolean;
}

const DEFAULTS: CarouselOptions = {
  perView: 1,
  gap: 0,
  interval: 6600,
  speed: 800,
  autoplay: false,
  rewind: true,
  drag: false,
  dots: false,
  nav: false,
};

const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';
const NARROW = '(max-width: 767px)';

/**
 * Dot/page count, `ceil(items / perView)` — Owl's own rule, and it is what
 * produces the measured 4 dots for the 7 testimonials at 2 per view.
 * Shared with the Astro components so server-rendered dots and JS clicks agree.
 */
export const pageCount = (items: number, perView: number): number =>
  Math.max(1, Math.ceil(items / Math.max(1, perView)));

const readNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(parsed) ? parsed : fallback;
};

/** Owl writes booleans as "1" / "0"; anything else present is read as false. */
const readFlag = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined ? fallback : value === '1' || value === 'true';

class Carousel {
  private readonly track: HTMLElement | null;
  private readonly options: CarouselOptions;
  private index = 0;
  private lastIndex = 0;
  private step = 0;
  private count = 0;
  private timer: number | undefined;
  private dragX = 0;
  private dragging = false;
  private pointerId = -1;
  private startX = 0;
  private perViewMobile = 0;
  private gapMobile = 0;

  constructor(
    private readonly root: HTMLElement,
    overrides?: Partial<CarouselOptions>,
  ) {
    const data = root.dataset;
    this.options = {
      perView: Math.max(1, readNumber(data.perView, DEFAULTS.perView)),
      gap: readNumber(data.gap, DEFAULTS.gap),
      interval: readNumber(data.autoplayspeed, DEFAULTS.interval),
      speed: readNumber(data.smartspeed, DEFAULTS.speed),
      autoplay: readFlag(data.autoplay, DEFAULTS.autoplay),
      rewind: readFlag(data.rewind, DEFAULTS.rewind),
      drag: readFlag(data.mousedrag, DEFAULTS.drag),
      dots: readFlag(data.dots, DEFAULTS.dots),
      nav: readFlag(data.nav, DEFAULTS.nav),
      ...overrides,
    };
    this.track = root.querySelector<HTMLElement>('.carousel__track');
    this.count = this.track?.children.length ?? 0;
    this.lastIndex = 0;
    // The source ships one `perView` for every breakpoint, which only works
    // because it pins `body { min-width: 1366px }`. This replica is responsive,
    // so a small screen can carry its own figure — see `data-per-view-mobile`.
    this.perViewMobile = Math.max(1, readNumber(data.perViewMobile, this.options.perView));
    this.gapMobile = readNumber(data.gapMobile, this.options.gap);

    // The variant classes in `carousel.css` hold these same numbers as the no-JS
    // fallback; JS overwrites them from the data attributes above.
    this.syncVars();
    this.syncDots();
    this.lastIndex = Math.max(0, this.count - this.perView);
    if (this.options.drag) this.root.classList.add('is-draggable');
    this.applySpeed();

    this.measure();
    this.bind();
    this.place();
  }

  private get reduceMotion(): boolean {
    return matchMedia(REDUCE_MOTION).matches;
  }
  /** Narrow screens fall back to their own figures; wide ones use the source's. */
  private get narrow(): boolean {
    return matchMedia(NARROW).matches;
  }

  private get perView(): number {
    return this.narrow ? this.perViewMobile : this.options.perView;
  }

  private get gap(): number {
    return this.narrow ? this.gapMobile : this.options.gap;
  }
  /** The CSS custom properties carry the live per-view figure and gap. */
  private syncVars(): void {
    this.root.style.setProperty('--carousel-per-view', String(this.perView));
    this.root.style.setProperty('--carousel-gap', `${this.gap}px`);
  }

  /**
   * Rebuild the dot row to the live page count. The server markup carries the
   * desktop count as the no-JS fallback; a narrow window needs its own.
   */
  private syncDots(): void {
    if (!this.options.dots) return;
    const row = this.root.querySelector('.carousel__dots');
    if (!row) return;
    const label = this.root.dataset.dotLabel ?? 'Xem';
    const total = pageCount(this.count, this.perView);
    if (row.children.length === total) return;
    row.innerHTML = Array.from(
      { length: total },
      (_, index) => `<button type="button" class="carousel__dot" aria-label="${label} ${index + 1}"></button>`,
    ).join('');
  }
  private measure(): void {
    // offsetWidth is layout-only, so a drag translate never skews the step.
    const first = this.track?.firstElementChild as HTMLElement | null;
    this.step = first ? first.offsetWidth + this.gap : 0;
  }

  private applySpeed(): void {
    // Reduced motion pins the track to the first slide and never slides on its own.
    this.root.style.setProperty('--carousel-speed', `${this.reduceMotion ? 0 : this.options.speed}ms`);
  }

  private place(): void {
    this.track?.style.setProperty('--carousel-offset', `${-(this.index * this.step) + this.dragX}px`);
    const perView = this.perView;
    // The final page holds fewer than `perView` cards (7 testimonials at 2 per
    // view is 4 pages), so the last dot lights on the last index, not on its
    // own page number.
    const activePage =
      this.index === this.lastIndex
        ? pageCount(this.count, perView) - 1
        : Math.floor(this.index / perView);
    Array.from(this.track?.children ?? []).forEach((child, position) => {
      // Off-window cards are decoration for AT, not lost content: without JS the
      // attribute is never set and everything stays in the accessibility tree.
      const offscreen = position < this.index || position >= this.index + perView;
      if (offscreen) child.setAttribute('aria-hidden', 'true');
      else child.removeAttribute('aria-hidden');
    });
    this.dotButtons().forEach((dot, position) => {
      if (position === activePage) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  /** Clamps instead of rewinding: a dot is a destination, not a step. */
  private jump(target: number): void {
    this.index = Math.min(Math.max(0, target), this.lastIndex);
    this.dragX = 0;
    this.place();
  }

  private go(target: number): void {
    const { rewind } = this.options;
    this.index =
      target < 0 ? (rewind ? this.lastIndex : 0) : target > this.lastIndex ? (rewind ? 0 : this.lastIndex) : target;
    this.dragX = 0;
    this.place();
  }

  private next(): void {
    this.go(this.index + 1);
  }

  private prev(): void {
    this.go(this.index - 1);
  }

  private dotButtons(): HTMLButtonElement[] {
    return Array.from(this.root.querySelectorAll<HTMLButtonElement>('.carousel__dot'));
  }

  private clearTimer(): void {
    if (this.timer !== undefined) window.clearTimeout(this.timer);
    this.timer = undefined;
  }

  /** Recursive `setTimeout`, not `setInterval`: a slow frame must not stack slides. */
  private schedule(): void {
    this.clearTimer();
    if (!this.options.autoplay || this.reduceMotion || this.count < 2) return;
    this.timer = window.setTimeout(() => {
      this.next();
      this.schedule();
    }, this.options.interval);
  }

  private onDown = (event: PointerEvent): void => {
    if (!this.options.drag || this.count < 2) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.dragging = true;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.dragX = 0;
    this.root.classList.add('is-dragging');
    this.clearTimer();
    this.track?.setPointerCapture(event.pointerId);
  };

  private onMove = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.pointerId) return;
    const min = -(this.lastIndex * this.step);
    this.dragX = Math.min(0, Math.max(min, event.clientX - this.startX));
    this.place();
  };

  private onUp = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.pointerId) return;
    this.dragging = false;
    this.root.classList.remove('is-dragging');
    this.track?.releasePointerCapture(event.pointerId);
    // One step per `step` pixels of travel; a partial drag snaps back to the
    // nearest window instead of leaving the track between two slides.
    const travelled = this.step > 0 ? Math.round(-this.dragX / this.step) : 0;
    this.go(this.index + travelled);
    this.schedule();
  };

  private bind(): void {
    if (this.count < 2) return;

    this.root.querySelector('.carousel__arrow--prev')?.addEventListener('click', () => {
      this.prev();
      this.schedule();
    });
    this.root.querySelector('.carousel__arrow--next')?.addEventListener('click', () => {
      this.next();
      this.schedule();
    });
    // Delegated, not per-button: the dot count is rebuilt whenever the window
    // crosses the narrow breakpoint, and per-button listeners would not survive.
    this.root.querySelector('.carousel__dots')?.addEventListener('click', (event) => {
      const dot = (event.target as HTMLElement).closest<HTMLButtonElement>('.carousel__dot');
      if (!dot) return;
      const position = this.dotButtons().indexOf(dot);
      if (position < 0) return;
      this.jump(position * this.perView);
      this.schedule();
    });

    if (this.options.drag && this.track) {
      this.track.addEventListener('pointerdown', this.onDown);
      this.track.addEventListener('pointermove', this.onMove);
      this.track.addEventListener('pointerup', this.onUp);
      this.track.addEventListener('pointercancel', this.onUp);
    }

    // Both apply to every carousel, autoplay or not: the step is a pixel
    // measurement, so a resize must re-measure rather than leave the track
    // parked mid-way between two slides.
    window.addEventListener('resize', () => {
      // A narrow screen can carry a different per-view figure, so the custom
      // properties and the end stop move with it, not just the step.
      this.syncVars();
      this.syncDots();
      this.lastIndex = Math.max(0, this.count - this.perView);
      this.measure();
      this.place();
    });
    matchMedia(REDUCE_MOTION).addEventListener('change', () => {
      this.applySpeed();
      if (this.reduceMotion) this.jump(0);
    });

    if (this.options.autoplay) {
      // Hover or keyboard focus holds the strip still (WCAG 2.2.2); leaving the
      // carousel restarts the timer it was showing.
      const hold = (): void => this.clearTimer();
      const release = (): void => this.schedule();
      this.root.addEventListener('pointerenter', hold);
      this.root.addEventListener('pointerleave', release);
      this.root.addEventListener('focusin', hold);
      this.root.addEventListener('focusout', (event) => {
        if (!this.root.contains(event.relatedTarget as Node | null)) release();
      });
      // A hidden tab still burns its timers unless they are dropped.
      document.addEventListener('visibilitychange', () =>
        document.hidden ? this.clearTimer() : this.schedule(),
      );
      this.schedule();
    }
  }
}

/**
 * Initialise every carousel on the page. Configuration comes from the markup's
 * data attributes; `overrides` exists only for callers that must differ from the
 * declared measurement.
 */
export function initCarousel(root: HTMLElement, overrides?: Partial<CarouselOptions>): void {
  new Carousel(root, overrides);
}

export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => initCarousel(root));
}

/**
 * Scroll reveal. `fade-up` is added by JS at init — never hard-coded in the
 * markup — so with JS off nothing is hidden and every block stays readable.
 * The source runs the same `fade-up` / 1000ms ease reveal (AOS on the source).
 */
export function initReveal(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  const showAll = (): void => targets.forEach((target) => target.classList.add('is-inview'));
  if (matchMedia(REDUCE_MOTION).matches || typeof IntersectionObserver === 'undefined') {
    showAll();
    return;
  }

  targets.forEach((target) =>
    target.classList.add(target.dataset.reveal === 'zoom' ? 'zoom-in' : 'fade-up'),
  );
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  targets.forEach((target) => observer.observe(target));
}

if (typeof document !== 'undefined') {
  // Module scripts run after parsing, and this module is evaluated once however
  // many components import it, so the two entry points need no per-component boot.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCarousels();
      initReveal();
    });
  } else {
    initCarousels();
    initReveal();
  }
}
