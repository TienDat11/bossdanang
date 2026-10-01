/**
 * Company family: `/gioi-thieu` plus the policy and contact routes.
 * Source: `.scratch/capture/company-home.json`.
 */
import type { FamilyModule } from '@/families/types';
import type { PageRecord } from '@/data/pages/types';
import { companyContent } from '@/content/company';
import { prose, requireContent } from '@/lib/blocks';

const routes: PageRecord[] = [
  {
    path: '/gioi-thieu',
    kind: 'company',
    section: 'Giới thiệu',
    h1: 'the boss',
    seo: {
      title: 'Giới thiệu - The Boss Việt Nam',
      description:
        'The Boss là một trong những đơn vị tiên phong trong lĩnh vực sản xuất thức ăn tươi dành cho chó mèo tại Viêt Nam. Với sứ mệnh và tầm nhìn rõ ràng,…',
    },
    contentRef: 'company:gioi-thieu',
  },
];

const company: FamilyModule = {
  name: 'company',
  routes,
  content: companyContent,
  views: {
    company: (record) => prose(requireContent(record, companyContent)),
  },
};

export default company;
