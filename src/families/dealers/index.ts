/**
 * Dealer family: the `/he-thong-dai-ly` hub and the three regional dealer lists.
 * Source: `.scratch/capture/dealers.json`.
 *
 * The capture stores each region as flat `p`/`ul` paragraphs plus one normalised
 * `[area, shop, address]` table. The table is kept as captured and grouped back
 * into its «Khu vực …» headings at render time — shop names and addresses are
 * emitted verbatim, byte for byte.
 *
 * ponytail: no map image, iframe or map-service URL is emitted here. The capture
 *   confirms none exists on any of the 4 routes (no map <img>, no <iframe>, no map
 *   anchor, no inline background-image), and the replica may not add an embedded map
 *   service. Add one only when the owner supplies a licensed static map asset.
 * ponytail: the hub cards preview the child region tables instead of the stale copy
 *   the source embeds there (capture notes: 65/20 rows, missing «PET YÊU» and
 *   «SƠN SPA - TIỆM CẮT LÔNG CHÓ MÈO», one trailing period dropped). Rendering the
 *   child tables keeps one source of truth; revert to a captured copy only if the
 *   source's own divergence ever has to be reproduced verbatim.
 */
import type { FamilyModule } from '@/families/types';
import type { PageRecord } from '@/data/pages/types';
import type { ContentBlock, ContentFamily, TableBlock } from '@/content/types';
import { escapeHtml, link, renderBlock, requireContent } from '@/lib/blocks';
import dealersCss from '@/styles/dealers.css?raw';


// A bare `import '@/styles/dealers.css'` from a `.ts` module is not picked up by
// Astro's CSS pipeline, so the sheet is imported as text and emitted by the view.
const withStyles = (body: string) => `<style>${dealersCss}</style>${body}`;
const CAPTURED_AT = '30/09/2026 10:46 (GMT+7)';

const routes: PageRecord[] = [
  {
    path: '/he-thong-dai-ly',
    kind: 'dealers',
    section: 'Hệ thống đại lý',
    h1: 'Hệ thống đại lý',
    seo: {
      title: 'Hệ thống đại lý - The Boss Việt Nam',
      description:
        'Hệ thống đại lý The Boss Việt Nam: danh sách đại lý ở Hồ Chí Minh, Bình Dương và hướng dẫn liên hệ cho các khu vực khác.',
    },
    contentRef: 'dealers:he-thong-dai-ly',
  },
  {
    path: '/danh-sach-dai-ly-o-ho-chi-minh',
    kind: 'dealer-region',
    section: 'DANH SÁCH ĐẠI LÝ Ở HỒ CHÍ MINH',
    parentPath: '/he-thong-dai-ly',
    h1: 'DANH SÁCH ĐẠI LÝ Ở HỒ CHÍ MINH',
    seo: {
      title: 'DANH SÁCH ĐẠI LÝ Ở HỒ CHÍ MINH - The Boss Việt Nam',
      description:
        '66 đại lý The Boss tại Hồ Chí Minh theo 18 khu vực, gồm Quận 1, 4, 6, 7, 8, 10, 12, Bình Tân, Gò Vấp, Bình Thạnh, Thủ Đức, Phú Nhuận, Tân Bình, Tân Phú, Hóc Môn, Củ Chi, Bình Chánh, Cần Giờ.',
    },
    contentRef: 'dealers:danh-sach-dai-ly-o-ho-chi-minh',
  },
  {
    path: '/danh-sach-dai-ly-o-binh-duong-binh-phuoc',
    kind: 'dealer-region',
    section: 'DANH SÁCH ĐẠI LÝ Ở BÌNH DƯƠNG',
    parentPath: '/he-thong-dai-ly',
    h1: 'DANH SÁCH ĐẠI LÝ Ở BÌNH DƯƠNG',
    seo: {
      title: 'DANH SÁCH ĐẠI LÝ Ở BÌNH DƯƠNG - The Boss Việt Nam',
      description:
        '21 đại lý The Boss tại Bình Dương theo 6 khu vực, gồm Thủ Dầu Một, Thuận An, Dĩ An, Tân Uyên, Bến Cát và Bàu Bàng.',
    },
    contentRef: 'dealers:danh-sach-dai-ly-o-binh-duong-binh-phuoc',
  },
  {
    path: '/danh-sach-dai-ly-o-khu-vuc-khac',
    kind: 'dealer-region',
    section: 'DANH SÁCH ĐẠI LÝ Ở KHU VỰC KHÁC',
    parentPath: '/he-thong-dai-ly',
    h1: 'DANH SÁCH ĐẠI LÝ Ở KHU VỰC KHÁC',
    seo: {
      title: 'DANH SÁCH ĐẠI LÝ Ở KHU VỰC KHÁC - The Boss Việt Nam',
      description:
        'Khu vực khác chưa có danh sách đại lý. Quý khách quan tâm đến đại lý ở các khu vực khác, vui lòng liên hệ với chúng tôi để được tư vấn và cung cấp thông tin phù hợp.',
    },
    contentRef: 'dealers:danh-sach-dai-ly-o-khu-vuc-khac',
  },
];

/**
 * Publish date and view counter, exactly as rendered by the source. The counter is
 * a live value on the source that changes between requests, so it is published here
 * as the capture snapshot and labelled as one on the page.
 */
const snapshots: Record<string, { published: string; views: string }> = {
  '/danh-sach-dai-ly-o-ho-chi-minh': { published: '18/09/2024 04:36 PM', views: '1410 Lượt xem' },
  '/danh-sach-dai-ly-o-binh-duong-binh-phuoc': { published: '18/09/2024 04:38 PM', views: '2735 Lượt xem' },
  '/danh-sach-dai-ly-o-khu-vuc-khac': { published: '16/02/2025 11:23 AM', views: '516 Lượt xem' },
};

const CAPTURE_NOTE = `Danh sách đại lý được ghi nhận từ website The Boss Việt Nam tại thời điểm chụp ${CAPTURED_AT}; tên cửa hàng và địa chỉ chưa được chủ sở hữu xác minh lại.`;

const content: ContentFamily = {
  // The hub has no prose of its own: its three cards are the child records below.
  'dealers:he-thong-dai-ly': [],
  'dealers:danh-sach-dai-ly-o-ho-chi-minh': [
    { type: 'table', headers: [], rows: [
      ["Khu vực Quận 1:", "DOG PARADISE", "7 Trần Khắc Chân, phường Tân Định, quận 1, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 4:", "PHÒNG KHÁM THÚ Y PET ZONE", "U48-U50-U52-U54 Nguyễn Hữu Hào, phường 8, quận 4, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 6:", "ARALE PETSHOP", "213D Minh Phụng, phường 6, quận 6, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 6:", "RANZILLA PET CARE", "179 Bình Tiên, phường 8, quận 6, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 6:", "VCT PET", "892 Hậu Giang, phường 12, quận 6, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 7:", "PHÒNG KHÁM THÚ Y HOME PET CARE", "49 Đường số 85, phường Tân Quy, quận 7, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 7:", "THÚ Y VET & PET MART", "1470 Huỳnh Tấn Phát, phường Phú Mỹ, quận 7, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 7:", "PET FRIEND", "62/47 Lâm Văn Bền, phường Tân Kiểng, quận 7, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 8:", "PHÒNG KHÁM THÚ Y PET ZONE", "967-969 Tạ Quang Bửu, phường 6, quận 8, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 8:", "PHÒNG KHÁM THÚ Y 199", "93 Liên Tỉnh 5, phường 5, quận 8, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 8:", "PHÒNG KHÁM THÚ Y 199", "218 Tạ Quảng Bửu, phường 13, quận 8, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 10:", "PHÒNG KHÁM THÚ Y PET ZONE", "59 Hòa Hưng, phường 12, quận 10, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 10:", "PET SAIGON", "285/55 Cách Mạng Tháng 8, phường 12, quận 10, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 12:", "DOCA PET PLUS", "281 Lê Văn Khương, phường Hiệp Thành, quận 12, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 12:", "THÚ Y RED", "51 Phan Văn Hớn, phường Tân Thới Nhất, quận 12, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 12:", "PHÒNG KHÁM THÚ Y ĐĂNG KHÔI", "668 Hà Huy Giáp, phường Thạnh Lộc, quận 12, Tp.Hồ Chí Minh"],
      ["Khu vực Quận 12:", "PHÒNG KHÁM THÚ Y BẢO BỐI", "807 Hà Huy Giáp, phường Thạnh Xuân, quận 12, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Tân:", "PHÒNG KHÁM THÚ Y HOME PET CARE", "15 Miếu Bình Đông, phường Bình Hưng Hòa, quận Bình Tân, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Tân:", "PHÒNG KHÁM THÚ Y MÃ LÒ", "317 Mã Lò, phường Bình Trị Đông A, quận Bình Tân, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Tân:", "PET HOUSE 126", "128 đường 26/3, phường Bình Hưng Hòa, quận Bình Tân, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Tân:", "TRUNG TÂM THÚ Y VET & PET", "78 đường số 2, KDC Vĩnh Lộc, phường Bình Hưng Hòa B, quận Bình Tân, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "ARALE PETSHOP", "731 Tân Sơn, phường 12, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PET LOVE", "760 Phan Văn Trị, phường 10, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PET STATION", "A1 Phan Văn Trị, phường 7, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PHÒNG KHÁM THÚ Y MEKONG", "446 Phan Huy Ích, phường 12, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PETXINH.NET", "730 Lê Đức Thọ, phường 15, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PHÒNG KHÁM THÚ Y KANG PET", "123 đường số 3, phường 9, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Gò Vấp:", "PHÒNG KHÁM THÚ Y CHICOPET", "497 Lê Văn Thọ, phường 9, quận Gò Vấp, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "DOG SALON MOMO", "217 Ngô Tất Tố, phường 12, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "CHU CHU PET", "283 Nguyễn Văn Đậu, phường 13, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "SAM SAM PET SHOP", "140 Nơ Trang Long, phường 14, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "CELA PAW", "574 Điện Biên Phủ, phường 22, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "BỆNH VIỆN THÚ Y MIỀN NAM", "401 Phạm Văn Đồng, phường 11, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Bình Thạnh:", "NHÀ PHÔ MAI", "30A Vũ Ngọc Phan, phường 13, quận Bình Thạnh, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "ỈN PET SHOP", "45 đường 9A, phường Long Bình, quận 9, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "LUCA PET SHOP", "328 Nguyễn Duy Trinh, phường Bình Trưng Tây, quận 2, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "PET SAIGON", "178 Nguyễn Thị Định, phường Bình Trưng Tây, quận 2, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "PAWS & CLAWS", "16 Nguyễn Văn Hưởng, phường Thảo Điền, TP.Thủ Đức, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "PHÒNG KHÁM THÚ Y FUNY PET", "46A Làng Tăng Phú, phường Tăng Nhơn Phú A, TP.Thủ Đức, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "IU PET", "422 Liên Phường, phường Phước Long B, TP.Thủ Đức, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "PHÒNG KHÁM THÚ Y LINH ĐÔNG", "214A đường Linh Đông, phường Linh Đông, TP.Thủ Đức, Tp.Hồ Chí Minh"],
      ["Khu vực Thành phố Thủ Đức:", "PET CARE", "15B Tam Bình, phường Hiệp Bình Chánh, Tp.Thủ Đức, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Phú Nhuận:", "PET STORE & SPA - NHÀ PHÔ MAI", "Số 4 Hoa Cau, phường 7, quận Phú Nhuận, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Phú Nhuận:", "PET YÊU", "413 Nguyễn Kiệm, phường 9, quận Phú Nhuận, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Bình:", "VCT PET", "379 Nguyễn Thái Bình, phường 12, quận Tân Bình, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "MR GÂU", "99 Trương Vĩnh Ký, phường Tân Thành, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "PET STATION", "369A Tân Sơn Nhì, phường Tân Thành, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "PHÒNG KHÁM THÚ Y THANH TÂN", "86 Tây Thạnh, phường Tây Thạnh, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "LILDAN PET SPA HOTEL & CLINIC", "309A Tân Hương, phường Tân Quý, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "PHÒNG KHÁM THÚ Y ONEE'S PET", "325A Nguyễn Sơn, phường Phú Thạnh, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "PHINTHECAT", "239/54 Khuông Việt, phường Phú Trung, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "TI TI SHOP", "65 Trịnh Đình Trọng, phường Phú Trung, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Quận Tân Phú:", "RIN RIN PETCARE", "45 Tân Quý, phường Tân Quý, quận Tân Phú, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "PHÒNG KHÁM THÚ Y IBU", "89 Bùi Công Trừng, phường Đông Thạnh, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "PHÒNG KHÁM THÚ Y IBU 2", "6/2 Lê Thị Hà, Khu Phố 8, Thị trấn Hóc Môn, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "PHÒNG KHÁM THÚ Y NGỌC CHÂU", "223 Đặng Thúc Vịnh, xã Đông Thạnh, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "PHÒNG KHÁM THÚ Y DC VET", "12/1B Tô Ký, xã Thới Tam Thôn, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "THI THI PET CLINIC", "146 Nguyễn Ảnh Thủ, xã Trung Chánh, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "THANH VY PETCARE", "61 đường XTT7, ấp 3, xã Xuân Thới Thượng, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Hóc Môn:", "PHÒNG KHÁM THÚ Y HÓC MÔN", "49 Đỗ Văn Dậy, xã Tân Hiệp, huyện Hóc Môn, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Củ Chi:", "PHÒNG KHÁM THÚ Y QUANG BÌNH - CN1", "410 Tỉnh lộ 2, ấp Gia Bẹ, xã Trung Lập Hạ, huyện Củ Chi, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Củ Chi:", "PHÒNG KHÁM THÚ Y QUANG BÌNH - CN3", "636 Quốc lộ 22 , KP2, Thị trấn Củ Chi, huyện Củ Chi, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Củ Chi:", "PET SHOP LINH LANH 2", "210 Liêu Bình Hương, xã Tân Thông Hội, huyện Củ Chi, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Bình Chánh:", "DOG PARADISE 3", "1099 Quốc lộ 50, xã Bình Hưng, huyện Bình Chánh, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Bình Chánh:", "VĨNH LỘC PET FAMILY", "E8/7 Ấp 5, xã Vĩnh Lộc B, huyện Bình Chánh, Tp.Hồ Chí Minh"],
      ["Khu vực Huyện Cần Giờ:", "SUNNY PET SHOP", "2/95 Đồng Hoà, xã Long Hòa, huyện Cần Giờ, Tp.Hồ Chí Minh."]
    ] },
  ],
  'dealers:danh-sach-dai-ly-o-binh-duong-binh-phuoc': [
    { type: 'table', headers: [], rows: [
      ["Khu vực Thủ Dầu Một:", "PETSHOP HANG GẤU Ú - CN1", "53 Huỳnh Văn Nghệ, phường Phú Lợi, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "PETSHOP HANG GẤU Ú - CN3", "207 đường 30/4, phường Phú Thọ, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "PHÒNG KHÁM THÚ Y VÀ SIÊU THỊ THÚ CƯNG HƯƠNG NỞ", "235-237 Phú Lợi, phường Phú Lợi, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "BỆNH VIỆN THÚ Y BẰNG PHẠM", "232 đường Phú Lợi, phường Phú Hòa, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "MIMI PET SHOP", "135 Trần Văn Ơn, phường Phú Hòa, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "GẠO PET HOUSE", "453/26 Lê Hồng Phong, phường Phú Hòa, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thủ Dầu Một:", "LUCKY PET SHOP", "784 Huỳnh Văn Lũy, phường Phú Mỹ, TP.Thủ Dầu Một, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "PETSHOP HANG GẤU Ú - CN2", "46 Nguyễn Văn Tiết, phường Lái Thiêu, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "PETSHOP HANG GẤU Ú - CN4", "500D Nguyễn Trãi, phường Lái Thiêu, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "PHÒNG KHÁM THÚ Y DŨNG - CN1", "51B/3 Hồ Văn Mên, phường An Thạnh, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "PHÒNG KHÁM THÚ Y DŨNG - CN2", "14 Cách Mạng Tháng 8, phường Hưng Định, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "INFINITY SIÊU THỊ THÚ CƯNG - CN1", "B12/19 Đường D2, KDC Thuận Giao, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "INFINITY SIÊU THỊ THÚ CƯNG - CN2", "D19 KDC VSIP1, phường An Phú, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Thuận An:", "SƠN SPA - TIỆM CẮT LÔNG CHÓ MÈO", "506 Nguyễn Trãi, phường Lái Thiêu, TP.Thuận An, tỉnh Bình Dương"],
      ["Khu vực Dĩ An:", "PHÒNG KHÁM THÚ Y HALLO PET", "559A, DT743, Khu phố Đông Tân, TP. Dĩ An, tỉnh Bình Dương"],
      ["Khu vực Dĩ An:", "PHÒNG KHÁM THÚ Y GIA PHÁT", "810 Quốc lộ 1K, xã Bình An, TP. Dĩ An, tỉnh Bình Dương"],
      ["Khu vực Tân Uyên:", "PHÒNG KHÁM THÚ Y Ơ VET", "Đường DH 409, KP Ông Đông, phường Tân Hiệp, TP. Tân Uyên, tỉnh Bình Dương"],
      ["Khu vực Tân Uyên:", "THÚ Y ROYAL PET", "172 KP. Bình Hòa 2, phường Tân Phước Khánh, TP. Tân Uyên, tỉnh Bình Dương"],
      ["Khu vực Bến Cát:", "PHÒNG KHÁM THÚ Y NHÂN TRÍ", "34 Quốc lộ 13, KP3, phường Tân Định, Bến Cát, tỉnh Bình Dương"],
      ["Khu vực Bến Cát:", "SALON & HOTEL NHÀ CỦA ĐỐM", "C1-22 TC3 Mỹ Phước 2, Bến Cát, tỉnh Bình Dương"],
      ["Khu vực Bàu Bàng:", "PHÒNG KHÁM THÚ Y HIỆP PHÁT", "TĐS 33, xã Long Nguyên, huyện Bàu Bàng, tỉnh Bình Dương"]
    ] },
  ],
  // The source publishes no dealer list for the other regions — only this call to
  // action, linking the captured contact route.
  'dealers:danh-sach-dai-ly-o-khu-vuc-khac': [
    {
      type: 'p',
      href: '/lien-he',
      text: 'Quý khách quan tâm đến đại lý ở các khu vực khác, vui lòng liên hệ với chúng tôi để được tư vấn và cung cấp thông tin phù hợp.',
    },
  ],
};

type AreaGroup = { area: string; dealers: { name: string; address: string }[] };

/** Group the captured `[area, shop, address]` rows back under their «Khu vực …» headings. */
function areaGroups(rows: string[][]): AreaGroup[] {
  const groups: AreaGroup[] = [];
  for (const [area, name, address] of rows) {
    const current = groups[groups.length - 1];
    if (current && current.area === area) current.dealers.push({ name, address });
    else groups.push({ area, dealers: [{ name, address }] });
  }
  return groups;
}

/** `id` carries the record slug: the hub inlines two region tables, so a per-record
 *  index alone would emit the same DOM id twice and mis-resolve `aria-labelledby`. */
function dealerTable(group: AreaGroup, heading: 'h2' | 'h3', id: string): string {
  const rows = group.dealers
    .map(
      ({ name, address }) =>
        `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(address)}</td></tr>`,
    )
    .join('');
  return [
    `<${heading} id="${id}">${escapeHtml(group.area)}</${heading}>`,
    // The box scrolls itself, so a 66-row list never widens the page.
    `<div class="table-scroll" role="region" tabindex="0" aria-labelledby="${id}">`,
    '<table class="dealer-table">',
    '<thead><tr><th scope="col">Tên cửa hàng</th><th scope="col">Địa chỉ</th></tr></thead>',
    `<tbody>${rows}</tbody>`,
    '</table>',
    '</div>',
  ].join('');
}

const isTable = (block: ContentBlock): block is TableBlock => block.type === 'table';

/** Tables become grouped dealer tables; prose blocks go through the shared renderer. */
function body(record: PageRecord, heading: 'h2' | 'h3'): string {
  return requireContent(record, content)
    .map((block) =>
      isTable(block)
        ? areaGroups(block.rows)
            .map((group, index) =>
              dealerTable(group, heading, `dai-ly-${record.path.slice(1)}-${index + 1}`),
            )
            .join('')
        : renderBlock(block),
    )
    .join('');
}

const note = `<p class="dealer-note">${escapeHtml(CAPTURE_NOTE)}</p>`;

function hubView(record: PageRecord): string {
  const cards = routes
    .filter((child) => child.parentPath === record.path)
    .map(
      (child) =>
        `<article class="dealer-card"><h2>${link(child.path, child.h1)}</h2>${body(child, 'h3')}</article>`,
    )
    .join('');
  return withStyles(`<div class="wrap-content prose dealers">${note}${cards}</div>`);
}

function regionView(record: PageRecord): string {
  const snapshot = snapshots[record.path];
  const meta = snapshot
    ? `<p class="dealer-meta">${escapeHtml(snapshot.published)} · ${escapeHtml(snapshot.views)} <span class="dealer-snapshot">(số liệu tại thời điểm chụp, không phải số xem trực tiếp)</span></p>`
    : '';
  return withStyles(`<div class="wrap-content prose dealers">${note}${meta}${body(record, 'h2')}</div>`);
}

const dealers: FamilyModule = {
  name: 'dealers',
  routes,
  content,
  views: {
    dealers: hubView,
    'dealer-region': regionView,
  },
};

export default dealers;