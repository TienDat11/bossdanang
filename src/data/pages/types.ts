export type PageKind =
  | 'home'
  | 'company'
  | 'catalog'
  | 'category'
  | 'product'
  | 'handbook'
  | 'search'
  | 'article'
  | 'gallery'
  | 'album'
  | 'dealers'
  | 'policy'
  | 'contact'
  | 'dealer-region';

export type Crumb = { label: string; path: string };

export type PageRecord = {
  path: string; // "/gioi-thieu", "/" for home, no trailing slash
  kind: PageKind;
  section: string; // human label for breadcrumbs
  parentPath?: string; // must itself exist in the registry
  h1: string;
  seo: {
    title: string;
    description: string;
    image?: string; // public path, e.g. "/media/misc/x.webp"
  };
  noindex?: boolean;
  contentRef: string; // opaque key into the family's content module, e.g. "company:gioi-thieu"
};
