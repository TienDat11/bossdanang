/**
 * Client-side product pager, shared by the catalogue and the homepage grid.
 *
 * The source requests
 * `GET /api/product.php?perpage=9&idList=0&eShow=.paging-product-category-0`,
 * so a static grid keeps 9 cards per page and swaps them in place — there is
 * deliberately no `?page=` URL to crawl or share.
 *
 * This is a module rather than a `.astro` component because a `PageView` returns
 * an HTML string (see `withStyles` in the families), so views here cannot mount
 * an Astro component. The pager markup is built by `paginationHtml`, the wiring
 * lives in `PAGER_SCRIPT`, and both families inline the script once.
 */

/** Cards per page, taken from the source's `perpage=9`. */
export const PRODUCTS_PER_PAGE = 9;

// The stepper buttons carry a chevron, not a word: "Trang trước" as a caption on
// a 40px pill is cramped, and the arrow reads as "previous page" on its own. The
// full phrase stays on `aria-label` for anyone who cannot see the glyph.
const stepper = (label: string, glyph: string, page: number, role: 'prev' | 'next') =>
  `<button type="button" class="catalog-pagination__btn" data-page="${page}" data-role="${role}"` +
  ` aria-label="${label}"><span aria-hidden="true">${glyph}</span></button>`;

/**
 * The pager for `total` cards. Renders nothing when everything fits on one page.
 * Stays `hidden` until `PAGER_SCRIPT` can drive it, so a JS-off page shows no
 * dead buttons.
 */
export function paginationHtml(total: number, perPage = PRODUCTS_PER_PAGE, label = 'Phân trang sản phẩm'): string {
  const size = Math.max(1, perPage);
  const pageCount = Math.ceil(Math.max(0, total) / size);
  if (pageCount < 2) return '';

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return [
    `<nav class="catalog-pagination" aria-label="${label}" data-catalog-pagination data-per-page="${size}" hidden>`,
    stepper('Trang trước', '&lsaquo;', 1, 'prev'),
    pages
      .map((page, index) => {
        const active = index === 0;
        return (
          `<button type="button" class="catalog-pagination__btn" data-page="${page}"` +
          ` aria-label="Trang ${page}"${active ? ' aria-current="page"' : ''}` +
          `${active ? ' disabled' : ''}>${page}</button>`
        );
      })
      .join(''),
    stepper('Trang sau', '&rsaquo;', pageCount, 'next'),
    '</nav>',
  ].join('');
}

/**
 * One owner for which cards are visible.
 *
 * A grid can be narrowed twice over — a category tab and a page — and two
 * scripts writing `card.hidden` would fight over it. So the pager script is the
 * only thing that touches `hidden`: it reads the active category tab, pages
 * within whatever survives that filter, and the tab script asks it to re-run
 * with `filterchange`.
 *
 * ponytail: the nav is rendered for the unfiltered card count and every filter
 * is a subset of it, so no filter can need more pages than the markup has. If a
 * grid ever gains a filter with more cards than the default page, the nav has
 * to be rebuilt server-side too.
 */
export const PAGER_SCRIPT = `
(function () {
  var activeFilter = function (grid) {
    var tab = grid.querySelector('[role="tab"][aria-selected="true"]');
    return tab ? tab.getAttribute('data-filter') : 'all';
  };

  var visibleCards = function (grid) {
    var filter = activeFilter(grid);
    return [].filter.call(grid.querySelectorAll('[data-product-card]'), function (card) {
      return filter === 'all' || card.getAttribute('data-category') === filter;
    });
  };

  var render = function (grid, page, perPage) {
    var all = grid.querySelectorAll('[data-product-card]');
    var cards = visibleCards(grid);
    var window = cards.slice((page - 1) * perPage, page * perPage);
    // Every card first, not just the filtered ones: a card excluded by the
    // active filter is also outside the window, and leaving it alone would keep
    // it on screen from the page it was last shown on.
    all.forEach(function (card) { card.hidden = window.indexOf(card) === -1; });

    var nav = grid.querySelector('[data-catalog-pagination]');
    if (nav) nav.hidden = cards.length <= perPage;

    var live = grid.querySelector('[data-product-status]');
    if (live) {
      live.textContent = 'Đang hiển thị sản phẩm ' + ((page - 1) * perPage + 1) + '–' +
        Math.min(page * perPage, cards.length) + ' trong tổng ' + cards.length + ' sản phẩm';
    }
  };

  for (const grid of document.querySelectorAll('[data-product-grid]')) {
    const nav = grid.querySelector('[data-catalog-pagination]');
    if (!nav) continue;
    const perPage = Number(nav.getAttribute('data-per-page')) || 1;
    const pageButtons = [].slice.call(nav.querySelectorAll('[data-page]:not([data-role])'));
    const prev = nav.querySelector('[data-role="prev"]');
    const next = nav.querySelector('[data-role="next"]');
    const last = pageButtons.length;
    let current = 1;

    const move = function (page) {
      current = page;
      pageButtons.forEach(function (el) {
        var here = Number(el.getAttribute('data-page')) === current;
        el.toggleAttribute('disabled', here);
        if (here) el.setAttribute('aria-current', 'page');
        else el.removeAttribute('aria-current');
      });
      if (prev) {
        prev.setAttribute('data-page', String(current - 1));
        prev.disabled = current === 1;
      }
      if (next) {
        next.setAttribute('data-page', String(current + 1));
        next.disabled = current === last;
      }
    };

    nav.addEventListener('click', function (event) {
      var hit = event.target.closest('[data-page]');
      if (!hit || hit.disabled) return;
      var page = Number(hit.getAttribute('data-page'));
      if (page === current) return;
      move(page);
      render(grid, page, perPage);
    });

    // A new filter is a new list: back to the first page rather than page 2 of
    // whatever now fits.
    grid.addEventListener('filterchange', function () {
      move(1);
      render(grid, 1, perPage);
    });

    // Move before render, so the stepper starts disabled on page 1 instead of
    // offering a "previous page" that has nowhere to go.
    move(1);
    render(grid, 1, perPage);
  }
})();
`;

