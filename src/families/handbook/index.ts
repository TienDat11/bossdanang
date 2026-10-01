/**
 * Cẩm nang family: the `/cam-nang` hub and the three articles it lists.
 * Source: `.scratch/capture/handbook.json` → `routes[].blocks`, verbatim.
 *
 * Source defects corrected here:
 *  - every article's only `<h1>` is CSS-hidden (`class="hidden-seoh"`); the
 *    visible `<h1>` the shared dispatcher prints is `record.h1` — the captured title.
 *  - all four `<meta name="description">` are empty. `seo.description` below is
 *    the first captured paragraph cut on a word boundary (the hub has no intro
 *    paragraph, so its description lists the three articles it actually contains).
 *
 * The capture holds no author byline, no category and no reading time, so this
 * family renders none. A missing fact is a finding, not licence to invent.
 *
 * Finding, not fixed: `notes[]` in the capture claims 20 / 25 / 38 content
 * blocks; the captured `blocks` arrays actually hold 18 / 26 / 34. This family
 * renders the arrays verbatim — the arrays are the only captured body there is,
 * and the source is not re-fetched. Every captured block is rendered in source
 * order; the built-HTML block counts are checked by the build smoke run.
 *
 * ponytail: the source article template also ships a JS-built table of contents
 * (`data-toc="article"`) and an AddToAny + Zalo share bar. Both are omitted:
 * the share bar is a third-party SDK the replica bans outright, and the TOC is
 * generated client-side from headings that are already in the HTML. Ceiling: an
 * article page has no in-page jump list. Upgrade: build a static anchor list from
 * the `h2` blocks in `article()` — no JS needed — and re-add sharing only if the
 * owner supplies a first-party endpoint.
 *
 * The hub card dates are the articles' own captured publish dates; the source hub
 * cards carry no date (capture `notes` for `/cam-nang`), so this is added context
 * from the same capture, not a source fact about the hub markup.
 */
import type { FamilyModule } from '@/families/types';
import type { PageRecord } from '@/data/pages/types';
import type { ContentFamily } from '@/content/types';
import { escapeHtml, imageTag, link, prose, requireContent } from '@/lib/blocks';
import { mediaPath } from '@/lib/media';
import handbookCss from '@/styles/handbook.css?raw';


// A bare `import '@/styles/handbook.css'` from a `.ts` module is not picked up by
// Astro's CSS pipeline, so the sheet is imported as text and emitted by the view.
const withStyles = (body: string) => `<style>${handbookCss}</style>${body}`;
const routes: PageRecord[] = [
  {
    path: "/cam-nang",
    kind: 'handbook',
    section: "Cẩm nang",
    h1: "Cẩm nang",
    seo: {
      title: "Cẩm nang - The Boss Việt Nam",
      description: "Cẩm nang của The Boss gồm 3 bài viết: hướng dẫn chuyển đổi thức ăn an toàn cho chó, mèo, những thực phẩm nguy hiểm không nên cho chó, mèo ăn và cách chăm sóc sức khỏe toàn diện.",
    },
    contentRef: 'handbook:cam-nang',
  },
  {
    path: "/huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan",
    kind: 'article',
    section: "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN.",
    parentPath: '/cam-nang',
    h1: "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN.",
    seo: {
      title: "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN. - The Boss Việt Nam",
      description: "Chuyển đổi thức ăn cho chó, mèo cần được thực hiện từ từ để tránh rối loạn tiêu hóa, như tiêu chảy, nôn mửa hoặc chán ăn. Hệ tiêu hóa của thú cưng cần thời gian…",
      image: mediaPath("https://thebossvietnam.com/upload/filemanager/files/Chuy%E1%BB%83n%20%C4%91%E1%BB%95i%20th%E1%BB%A9c%20%C4%83n%20cho%20ch%C3%B3%20m%C3%A8o%20an%20to%C3%A0n.png"),
    },
    contentRef: 'handbook:huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan',
  },
  {
    path: "/nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an",
    kind: 'article',
    section: "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN.",
    parentPath: '/cam-nang',
    h1: "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN.",
    seo: {
      title: "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN. - The Boss Việt Nam",
      description: "Chó và mèo là những người bạn trung thành của con người. Việc chăm sóc chế độ ăn uống hợp lý sẽ giúp thú cưng có một sức khỏe tốt và tuổi thọ cao. Tuy nhiên, có…",
      image: mediaPath("https://thebossvietnam.com/upload/filemanager/files/Th%E1%BB%B1c%20ph%E1%BA%A9m%20nguy%20hi%E1%BB%83m%20cho%20ch%C3%B3%20m%C3%A8o.png"),
    },
    contentRef: 'handbook:nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an',
  },
  {
    path: "/cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong",
    kind: 'article',
    section: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG.",
    parentPath: '/cam-nang',
    h1: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG.",
    seo: {
      title: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG. - The Boss Việt Nam",
      description: "Chăm sóc sức khỏe cho chó, mèo không chỉ giới hạn ở việc cung cấp một chế độ ăn uống đầy đủ dinh dưỡng mà còn cần quan tâm đến nhiều khía cạnh khác như vận…",
      image: mediaPath("https://thebossvietnam.com/upload/filemanager/files/Ch%C4%83m%20s%C3%B3c%20s%E1%BB%A9c%20kh%E1%BB%8Fe%20to%C3%A0n%20di%E1%BB%87n.png"),
    },
    contentRef: 'handbook:cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong',
  },
];

const content: ContentFamily = {
  'handbook:cam-nang': [
    {
      "type": "h2",
      "text": "Cẩm nang"
    },
    {
      "type": "p",
      "text": "HƯỚNG DẪN CÁCH CHUYỂN ĐỔI THỨC ĂN CHO CHÓ, MÈO AN TOÀN."
    },
    {
      "type": "p",
      "text": "Chuyển đổi thức ăn cho chó, mèo cần được thực hiện từ từ để tránh rối loạn tiêu hóa, như tiêu chảy, nôn mửa hoặc chán ăn. Hệ tiêu hóa của thú cưng cần thời gian để thích nghi với thành phần dinh dưỡng và kết cấu thức ăn mới."
    },
    {
      "type": "p",
      "text": "NHỮNG THỰC PHẨM NGUY HIỂM KHÔNG NÊN CHO CHÓ, MÈO ĂN."
    },
    {
      "type": "p",
      "text": "Chó và mèo là những người bạn trung thành của con người. Việc chăm sóc chế độ ăn uống hợp lý sẽ giúp thú cưng có một sức khỏe tốt và tuổi thọ cao. Tuy nhiên, có một số loại thực phẩm có thể gây nguy hiểm cho chúng, thậm chí dẫn đến ngộ độc hoặc tử vong."
    },
    {
      "type": "p",
      "text": "CHĂM SÓC SỨC KHỎE TOÀN DIỆN CHO CHÓ, MÈO NGOÀI CHẾ ĐỘ DINH DƯỠNG."
    },
    {
      "type": "p",
      "text": "Chăm sóc sức khỏe cho chó, mèo không chỉ giới hạn ở việc cung cấp một chế độ ăn uống đầy đủ dinh dưỡng mà còn cần quan tâm đến nhiều khía cạnh khác như vận động, vệ sinh, tinh thần và kiểm tra y tế định kỳ. Một chú chó hoặc mèo khỏe mạnh không chỉ sống lâu hơn mà còn mang lại niềm vui và sự gắn kết sâu sắc hơn với chủ nhân."
    }
  ],
  'handbook:huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan': [
    {
      "type": "h2",
      "text": "1. Tại sao cần chuyển đổi thức ăn dần dần?"
    },
    {
      "type": "p",
      "text": "Chuyển đổi thức ăn cho chó, mèo cần được thực hiện từ từ để tránh rối loạn tiêu hóa, như tiêu chảy, nôn mửa hoặc chán ăn. Hệ tiêu hóa của thú cưng cần thời gian để thích nghi với thành phần dinh dưỡng và kết cấu thức ăn mới."
    },
    {
      "type": "img",
      "url": "https://thebossvietnam.com/upload/filemanager/files/Chuy%E1%BB%83n%20%C4%91%E1%BB%95i%20th%E1%BB%A9c%20%C4%83n%20cho%20ch%C3%B3%20m%C3%A8o%20an%20to%C3%A0n.png",
      "alt": "",
      "role": "editorial",
      "width": 600,
      "height": 393
    },
    {
      "type": "h2",
      "text": "2. Nguyên tắc chuyển đổi thức ăn an toàn:"
    },
    {
      "type": "ul",
      "items": [
        "Chuyển đổi từ từ trong 7 - 10 ngày: Giúp hệ tiêu hóa thích nghi, giảm nguy cơ rối loạn đường ruột.",
        "Kết hợp thức ăn cũ và mới theo tỷ lệ phù hợp: Tăng dần lượng thức ăn mới theo thời gian.",
        "Quan sát phản ứng của thú cưng: Điều chỉnh tốc độ chuyển đổi nếu có dấu hiệu bất thường.",
        "Đảm bảo dinh dưỡng cân bằng: Đảm bảo thức ăn mới đáp ứng nhu cầu dinh dưỡng của chó, mèo."
      ]
    },
    {
      "type": "h2",
      "text": "3. Các bước chuyển đổi thức ăn:"
    },
    {
      "type": "table",
      "headers": [
        "Ngày",
        "Tỉ lệ thức ăn cũ",
        "Tỉ lệ thức ăn mới"
      ],
      "rows": [
        [
          "1 - 2",
          "75%",
          "25%"
        ],
        [
          "3 - 4",
          "50%",
          "50%"
        ],
        [
          "5 - 6",
          "25%",
          "75%"
        ],
        [
          "7 - 10",
          "0%",
          "100%"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Lưu ý:"
    },
    {
      "type": "ul",
      "items": [
        "Nếu thú cưng có dấu hiệu tiêu chảy hoặc rối loạn tiêu hóa, hãy giảm tốc độ chuyển đổi.",
        "Không ép ăn nếu chó, mèo từ chối thức ăn mới. Hãy kiên nhẫn và thử lại sau.",
        "Đảm bảo cung cấp đủ nước sạch để hỗ trợ hệ tiêu hóa."
      ]
    },
    {
      "type": "h2",
      "text": "4. Dấu hiệu cần lưu ý khi chuyển đổi thức ăn:"
    },
    {
      "type": "ul",
      "items": [
        "Tiêu chảy hoặc phân lỏng kéo dài.",
        "Nôn mửa hoặc biếng ăn.",
        "Ngứa ngáy, rụng lông nhiều hơn bình thường.",
        "Hành vi thay đổi (lờ đờ, cáu kỉnh, mất năng lượng)."
      ]
    },
    {
      "type": "p",
      "text": "Nếu thú cưng có những triệu chứng trên kéo dài quá 48 giờ, hãy tham khảo ý kiến bác sĩ thú y."
    },
    {
      "type": "h2",
      "text": "5. Kết luận:"
    },
    {
      "type": "p",
      "text": "Chuyển đổi thức ăn cho chó, mèo cần thực hiện từ từ, theo dõi kỹ phản ứng của thú cưng để điều chỉnh phù hợp. Việc chuyển đổi đúng cách giúp thú cưng duy trì hệ tiêu hóa khỏe mạnh, thích nghi tốt với chế độ ăn mới và đảm bảo cung cấp đầy đủ dinh dưỡng."
    },
    {
      "type": "p",
      "text": "Hãy luôn quan tâm đến sức khỏe của thú cưng và lựa chọn chế độ ăn phù hợp nhất!"
    },
    {
      "type": "img",
      "url": "https://thebossvietnam.com/upload/filemanager/files/T%E1%BB%89%20l%E1%BB%87%20cho%20%C4%83n%20khi%20%C4%91%E1%BB%95i%20th%E1%BB%A9c%20%C4%83n%20m%E1%BB%9Bi-01.png",
      "alt": "",
      "role": "editorial",
      "width": 600,
      "height": 250
    },
    {
      "type": "p",
      "text": "Nguồn: Sưu tầm"
    },
    {
      "type": "p",
      "text": " "
    }
  ],
  'handbook:nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an': [
    {
      "type": "h2",
      "text": "THỰC PHẨM GÂY NGUY HIỂM KHÔNG NÊN CHO CHÓ MÈO ĂN."
    },
    {
      "type": "img",
      "url": "https://thebossvietnam.com/upload/filemanager/files/Th%E1%BB%B1c%20ph%E1%BA%A9m%20nguy%20hi%E1%BB%83m%20cho%20ch%C3%B3%20m%C3%A8o.png",
      "alt": "",
      "role": "editorial",
      "width": 600,
      "height": 424
    },
    {
      "type": "p",
      "text": "Chó và mèo là những người bạn trung thành của con người. Việc chăm sóc chế độ ăn uống hợp lý sẽ giúp thú cưng có một sức khỏe tốt và tuổi thọ cao. Tuy nhiên, có một số loại thực phẩm có thể gây nguy hiểm cho chúng, thậm chí dẫn đến ngộ độc hoặc tử vong. Dưới đây là danh sách những thực phẩm nguy hiểm mà bạn không nên cho chó, mèo ăn."
    },
    {
      "type": "p",
      "text": "1. Sô cô la và cà phê"
    },
    {
      "type": "p",
      "text": "Sô cô la chứa theobromine, một chất kích thích hệ thần kinh trung ương có thể gây ngộ độc cho chó và mèo. Các triệu chứng ngộ độc bao gồm run rẩy, co giật, nhịp tim nhanh, nôn mửa và tiêu chảy. Cà phê cũng chứa caffeine, gây tác động tương tự và có thể dẫn đến tử vong nếu tiêu thụ với số lượng lớn."
    },
    {
      "type": "p",
      "text": "2. Hành, tỏi và hẹ"
    },
    {
      "type": "p",
      "text": "Những thực phẩm này có chứa hợp chất lưu huỳnh có thể gây tổn thương hồng cầu của chó và mèo, dẫn đến thiếu máu. Triệu chứng bao gồm lờ đờ, yếu ớt, thở khó và nước tiểu có màu sẫm."
    },
    {
      "type": "p",
      "text": "3. Nho và nho khô"
    },
    {
      "type": "p",
      "text": "Nho và nho khô có thể gây suy thận cấp tính ở chó, thậm chí một lượng nhỏ cũng có thể nguy hiểm. Các dấu hiệu ngộ độc bao gồm nôn mửa, tiêu chảy, chán ăn và mệt mỏi."
    },
    {
      "type": "p",
      "text": "4. Đồ ăn nhiều muối và gia vị"
    },
    {
      "type": "p",
      "text": "Các loại thực phẩm có chứa nhiều muối như khoai tây chiên, thịt xông khói có thể gây mất nước, suy thận hoặc thậm chí ngộ độc muối, dẫn đến co giật và tử vong."
    },
    {
      "type": "p",
      "text": "5. Đồ ngọt và thực phẩm chứa xylitol"
    },
    {
      "type": "p",
      "text": "Xylitol là một chất tạo ngọt nhân tạo thường có trong kẹo cao su, bánh kẹo không đường. Chó và mèo tiêu thụ xylitol có thể bị hạ đường huyết nghiêm trọng, suy gan, thậm chí tử vong."
    },
    {
      "type": "p",
      "text": "6. Bơ, kem, sữa và các sản phẩm từ sữa"
    },
    {
      "type": "p",
      "text": "Hầu hết chó và mèo trưởng thành không có enzyme lactase để tiêu hóa lactose trong sữa, dẫn đến rối loạn tiêu hóa như tiêu chảy và đầy hơi."
    },
    {
      "type": "p",
      "text": "7. Thực phẩm lên men hoặc chứa cồn"
    },
    {
      "type": "p",
      "text": "Thực phẩm như bột lên men, bia, rượu có thể gây ngộ độc cồn ở thú cưng, làm ảnh hưởng đến hệ thần kinh, gây suy hô hấp và tử vong."
    },
    {
      "type": "p",
      "text": "8. Một số loại hạt và quả"
    },
    {
      "type": "p",
      "text": "Hạt mắc ca có thể gây suy yếu cơ bắp, nôn mửa, run rẩy và tăng thân nhiệt ở chó. Quả bơ chứa persin, một hợp chất có thể gây nôn mửa và tiêu chảy."
    },
    {
      "type": "h2",
      "text": "GIẢI PHÁP THAY THẾ."
    },
    {
      "type": "p",
      "text": "Thay vì cho chó, mèo ăn các thực phẩm nguy hiểm trên, bạn có thể lựa chọn những thực phẩm an toàn như:"
    },
    {
      "type": "ul",
      "items": [
        "Thịt nạc (gà, bò, cá,...)",
        "Rau củ (bí đỏ, cà rốt, khoai lang, đậu xanh)",
        "Trái cây an toàn (táo không hạt, chuối, dâu tây)",
        "Thực phẩm chuyên dụng cho thú cưng từ các thương hiệu uy tín."
      ]
    },
    {
      "type": "img",
      "url": "https://thebossvietnam.com/upload/filemanager/files/Nguy%C3%AAn%20li%E1%BB%87u%20t%C6%B0%C6%A1i.png",
      "alt": "",
      "role": "editorial",
      "width": 600,
      "height": 395
    },
    {
      "type": "h2",
      "text": "KẾT LUẬN."
    },
    {
      "type": "p",
      "text": "Hiểu rõ những thực phẩm nguy hiểm sẽ giúp bạn bảo vệ sức khỏe cho thú cưng và tránh những rủi ro không đáng có. Nếu chó hoặc mèo của bạn vô tình ăn phải thực phẩm độc hại, hãy liên hệ ngay với bác sĩ thú y để được hướng dẫn kịp thời. Hãy luôn quan tâm đến chế độ ăn uống của thú cưng để đảm bảo chúng có một cuộc sống khỏe mạnh và hạnh phúc!"
    },
    {
      "type": "p",
      "text": "Nguồn: Sưu tầm."
    }
  ],
  'handbook:cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong': [
    {
      "type": "img",
      "url": "https://thebossvietnam.com/upload/filemanager/files/Ch%C4%83m%20s%C3%B3c%20s%E1%BB%A9c%20kh%E1%BB%8Fe%20to%C3%A0n%20di%E1%BB%87n.png",
      "alt": "",
      "role": "editorial",
      "width": 600,
      "height": 396
    },
    {
      "type": "p",
      "text": "Chăm sóc sức khỏe cho chó, mèo không chỉ giới hạn ở việc cung cấp một chế độ ăn uống đầy đủ dinh dưỡng mà còn cần quan tâm đến nhiều khía cạnh khác như vận động, vệ sinh, tinh thần và kiểm tra y tế định kỳ. Một chú chó hoặc mèo khỏe mạnh không chỉ sống lâu hơn mà còn mang lại niềm vui và sự gắn kết sâu sắc hơn với chủ nhân."
    },
    {
      "type": "p",
      "text": "Bài viết này sẽ cung cấp những thông tin quan trọng để giúp bạn xây dựng một kế hoạch chăm sóc toàn diện cho thú cưng của mình, đảm bảo chúng luôn khỏe mạnh và hạnh phúc."
    },
    {
      "type": "h2",
      "text": "1. Chăm sóc sức khỏe thể chất."
    },
    {
      "type": "p",
      "text": "1.1. Vận động và tập thể dục."
    },
    {
      "type": "p",
      "text": "Chó và mèo cần được vận động thường xuyên để duy trì sức khỏe thể chất và tinh thần. Việc tập luyện giúp kiểm soát cân nặng, tăng cường hệ miễn dịch và hỗ trợ sự phát triển cơ bắp, xương khớp."
    },
    {
      "type": "ul",
      "items": [
        "Đối với chó: Nên dắt chó đi dạo từ 30-60 phút mỗi ngày hoặc cho chúng tham gia các hoạt động như chạy bộ, ném bóng, bơi lội.",
        "Đối với mèo: Cung cấp môi trường chơi trong nhà với đồ chơi tương tác, trụ cào móng, đường hầm hoặc bánh xe chạy."
      ]
    },
    {
      "type": "p",
      "text": "1.2. Chăm sóc lông và da."
    },
    {
      "type": "p",
      "text": "Bộ lông và làn da phản ánh rõ ràng sức khỏe tổng thể của thú cưng. Việc chăm sóc lông không chỉ giúp loại bỏ lông rụng mà còn phát hiện sớm các dấu hiệu bệnh lý."
    },
    {
      "type": "ul",
      "items": [
        "Chải lông thường xuyên để giảm lông rụng, đặc biệt với giống chó, mèo lông dài.",
        "Tắm định kỳ (1-2 lần/tháng) với sữa tắm chuyên dụng để giữ da sạch và tránh ký sinh trùng.",
        "Kiểm tra dấu hiệu viêm da, vảy gàu, hoặc rụng lông bất thường."
      ]
    },
    {
      "type": "p",
      "text": "1.3. Vệ sinh răng miệng."
    },
    {
      "type": "p",
      "text": "Sức khỏe răng miệng ảnh hưởng lớn đến hệ tiêu hóa và sức khỏe tổng thể của thú cưng. Mảng bám và cao răng có thể gây viêm nhiễm, hôi miệng và ảnh hưởng đến tim mạch."
    },
    {
      "type": "ul",
      "items": [
        "Đánh răng cho chó, mèo ít nhất 2-3 lần/tuần bằng bàn chải và kem đánh răng chuyên dụng.",
        "Sử dụng xương gặm hoặc đồ chơi hỗ trợ làm sạch răng.",
        "Kiểm tra định kỳ để phát hiện sớm các bệnh về răng miệng."
      ]
    },
    {
      "type": "p",
      "text": "1.4. Kiểm soát ký sinh trùng."
    },
    {
      "type": "p",
      "text": "Bọ chét, ve chó, giun sán là mối đe dọa lớn đối với sức khỏe của thú cưng."
    },
    {
      "type": "ul",
      "items": [
        "Sử dụng thuốc phòng chống ký sinh trùng định kỳ theo hướng dẫn của bác sĩ thú y.",
        "Kiểm tra lông và da thường xuyên để phát hiện sớm dấu hiệu nhiễm ký sinh.",
        "Giữ môi trường sống sạch sẽ để giảm nguy cơ lây nhiễm."
      ]
    },
    {
      "type": "h2",
      "text": "2. Chăm sóc sức khỏe tinh thần."
    },
    {
      "type": "p",
      "text": "2.1. Giảm căng thẳng và lo âu."
    },
    {
      "type": "p",
      "text": "Chó và mèo có thể bị stress do thay đổi môi trường sống, cô đơn hoặc thiếu kích thích."
    },
    {
      "type": "ul",
      "items": [
        "Dành thời gian chơi đùa và tương tác với thú cưng mỗi ngày.",
        "Sử dụng các trò chơi kích thích trí não như đồ chơi nhồi thức ăn, mê cung thông minh.",
        "Đảm bảo môi trường sống yên tĩnh, an toàn và thoải mái."
      ]
    },
    {
      "type": "p",
      "text": "2.2. Giao tiếp và huấn luyện."
    },
    {
      "type": "p",
      "text": "Việc huấn luyện giúp thú cưng có kỷ luật, giảm hành vi xấu và tăng cường kết nối với chủ nhân."
    },
    {
      "type": "ul",
      "items": [
        "Sử dụng phương pháp huấn luyện tích cực (thưởng thức ăn, khen ngợi) để dạy các lệnh cơ bản như ngồi, nằm, đi vệ sinh đúng chỗ.",
        "Đối với mèo, có thể huấn luyện dùng hộp cát, chơi bắt đồ chơi hoặc làm quen với dây dắt."
      ]
    },
    {
      "type": "h2",
      "text": "3. Kiểm tra sức khỏe định kỳ."
    },
    {
      "type": "p",
      "text": "3.1. Khám thú y thường xuyên."
    },
    {
      "type": "p",
      "text": "Ngay cả khi chó mèo không có dấu hiệu bệnh, việc kiểm tra sức khỏe định kỳ giúp phát hiện sớm các vấn đề tiềm ẩn."
    },
    {
      "type": "ul",
      "items": [
        "Tiêm phòng đầy đủ các bệnh nguy hiểm như dại, Care, Parvo, cúm mèo.",
        "Kiểm tra máu, siêu âm hoặc xét nghiệm cần thiết theo khuyến nghị của bác sĩ.",
        "Đánh giá tình trạng sức khỏe tổng thể như cân nặng, da lông, tim mạch."
      ]
    },
    {
      "type": "p",
      "text": "3.2. Chăm sóc sức khỏe theo độ tuổi."
    },
    {
      "type": "ul",
      "items": [
        "Thú cưng con: Tăng cường tiêm phòng, tẩy giun, chế độ dinh dưỡng hợp lý.",
        "Thú cưng trưởng thành: Duy trì vận động, kiểm tra sức khỏe định kỳ.",
        "Thú cưng già: Kiểm soát bệnh mãn tính, giảm vận động quá sức, bổ sung thực phẩm chức năng hỗ trợ xương khớp."
      ]
    },
    {
      "type": "h2",
      "text": "4. Môi trường sống an toàn."
    },
    {
      "type": "ul",
      "items": [
        "Đảm bảo nơi ở sạch sẽ, thoáng mát, có đủ ánh sáng tự nhiên.",
        "Tránh để thú cưng tiếp xúc với hóa chất độc hại như thuốc tẩy rửa, thuốc trừ sâu.",
        "Cung cấp không gian riêng tư để thú cưng có thể nghỉ ngơi thoải mái."
      ]
    },
    {
      "type": "p",
      "text": "KẾT LUẬN."
    },
    {
      "type": "p",
      "text": "Việc chăm sóc sức khỏe toàn diện cho chó, mèo không chỉ dừng lại ở chế độ ăn uống mà còn bao gồm vận động, vệ sinh, sức khỏe tinh thần và kiểm tra y tế định kỳ. Một kế hoạch chăm sóc toàn diện sẽ giúp thú cưng sống khỏe mạnh, vui vẻ và kéo dài tuổi thọ."
    },
    {
      "type": "p",
      "text": "Nguồn: Sưu tầm"
    }
  ],
};

/** `handbook.json` → `media[]`: the three hub-card thumbnails, `usedOn: ["/cam-nang"]`. */
const covers: Record<string, string> = {
  "/huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan": "https://thebossvietnam.com/thumbs/210x144x1/upload/news/chuyen-doi-thuc-an-cho-cho-meo-an-toan-3612.png",
  "/nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an": "https://thebossvietnam.com/thumbs/210x144x1/upload/news/2-3691.png",
  "/cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong": "https://thebossvietnam.com/thumbs/210x144x1/upload/news/cham-soc-suc-khoe-toan-dien-2472.png"
};

/** `handbook.json` → each article's `notes[0]` "Date shown: …". Kept verbatim: the
 *  source prints dd/mm/yyyy with a time and no machine-readable date attribute,
 *  so inventing an ISO value for `<time datetime>` would be a guess. */
const dates: Record<string, string> = {
  "/huong-dan-cach-chuyen-doi-thuc-an-cho-cho-meo-an-toan": "04/03/2025 05:38 PM",
  "/nhung-thuc-pham-nguy-hiem-khong-nen-cho-cho-meo-an": "03/10/2024 12:07 AM",
  "/cham-soc-suc-khoe-toan-dien-cho-cho-meo-ngoai-che-do-dinh-duong": "03/10/2024 12:08 AM"
};

const articles = routes.filter((route) => route.kind === 'article');

const publishedOn = (path: string): string =>
  dates[path] ? `<p class="handbook-date">${escapeHtml(dates[path])}</p>` : '';

const handbook: FamilyModule = {
  name: 'handbook',
  routes,
  content,
  views: {
    handbook: (record) => {
      // The hub's captured body is its three cards flattened to "title, excerpt"
      // paragraphs in source order; pairing them positionally keeps one source
      // of truth for the copy. Fail the build if that pairing ever stops holding.
      const cardText = requireContent(record, content).flatMap((block) => (block.type === 'p' ? [block.text] : []));
      if (cardText.length !== articles.length * 2) {
        throw new Error(
          `[handbook] "${record.contentRef}" holds ${cardText.length} card paragraphs; ` +
            `expected ${articles.length * 2} (title + excerpt per article).`,
        );
      }
      const cards = articles.map((article, index) => {
        const title = cardText[index * 2] ?? '';
        const excerpt = cardText[index * 2 + 1] ?? '';
        return [
          '<article class="handbook-card">',
          imageTag(covers[article.path] ?? '', title, {
            className: 'handbook-card__thumb',
            width: 210,
            height: 144,
          }),
          `<h2 class="handbook-card__title">${link(article.path, title)}</h2>`,
          `<p class="handbook-card__excerpt">${escapeHtml(excerpt)}</p>`,
          publishedOn(article.path),
          '</article>',
        ].join('');
      });
      return withStyles(`<div class="wrap-content handbook-hub">${cards.join('')}</div>`);
    },
    article: (record) => {
      const related = articles.filter((article) => article.path !== record.path);
      return withStyles(
        [
          '<div class="wrap-content handbook-article">',
          publishedOn(record.path),
          prose(requireContent(record, content)),
          '<nav class="handbook-related" aria-label="Bài viết liên quan">',
          '<h2 class="handbook-related__title">Bài viết liên quan</h2>',
          `<ul>${related.map((article) => `<li>${link(article.path, article.h1)}</li>`).join('')}</ul>`,
          '</nav>',
          '</div>',
        ].join(''),
      );
    },
  },
};

export default handbook;

