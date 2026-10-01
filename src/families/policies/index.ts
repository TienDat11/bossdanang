/**
 * Policies + contact family: `/chinh-sach-bao-mat`, `/chinh-sach-tuyen-dung`, `/lien-he`.
 *
 * Source: `.scratch/capture/company-home.json` → those three routes. Every line of
 * copy below is the captured source text, byte-exact and in source order.
 *
 * Source defects fixed here (recorded in each route's `seoDefects` in the capture):
 *  - empty `metaDescription` → real descriptions written from the first body paragraph;
 *  - `<h1 class="hidden-seoh">` (invisible) → the visible `<h1 class="page-title">`
 *    rendered by `src/pages/[slug].astro` from `PageRecord.h1`.
 *
 * The source's two capture annotations on `/lien-he` ("Contact data: …" and
 * "Phone: …; working hours: not shown; map link: not shown.") are extractor notes:
 * `grep` proves neither string exists in `.scratch/raw/company/lien-he.html`, so
 * they are metadata, not page copy, and are not rendered.
 */
import type { FamilyModule } from '@/families/types';
import type { ContentBlock, ContentFamily } from '@/content/types';
import type { PageRecord } from '@/data/pages/types';
import { escapeHtml, prose, requireContent, tag } from '@/lib/blocks';

const routes: PageRecord[] = [
  {
    path: '/chinh-sach-bao-mat',
    kind: 'policy',
    section: 'Chính sách bảo mật',
    h1: 'Chính sách bảo mật.',
    seo: {
      title: 'Chính sách bảo mật - The Boss Việt Nam',
      description:
        'Khi truy cập và sử dụng các dịch vụ trên website The Boss, khách hàng đồng ý với các điều khoản được quy định trong Chính sách bảo mật này. Chúng tôi cam kết…',
    },
    contentRef: 'policies:chinh-sach-bao-mat',
  },
  {
    path: '/chinh-sach-tuyen-dung',
    kind: 'policy',
    section: 'Chính sách tuyển dụng',
    h1: 'Chính sách tuyển dụng.',
    seo: {
      title: 'Chính sách tuyển dụng - The Boss Việt Nam',
      description: 'Chính sách tuyển dụng của The Boss Việt Nam. Nội dung trang đang được cập nhật.',
    },
    contentRef: 'policies:chinh-sach-tuyen-dung',
  },
  {
    path: '/lien-he',
    kind: 'contact',
    section: 'Liên hệ',
    h1: 'Liên hệ',
    seo: {
      title: 'Liên hệ - The Boss Việt Nam',
      description:
        'Địa chỉ: 225A Kênh Đông, ấp Bàu Tre 1, xã Tân An Hội, Huyện Củ Chi, TP. Hồ Chí Minh. Phone: 0965153621 - 0978202063. Zalo: 0965153621.',
    },
    contentRef: 'policies:lien-he',
  },
];

/**
 * `routes[path="/chinh-sach-bao-mat"].blocks`, verbatim. The source marks the eight
 * numbered clause titles with `<p><strong>…</strong></p>`; they are the page's real
 * headings, so they are carried as `h2` — the text is unchanged, only the level is.
 */
const privacy: ContentBlock[] = [
  { type: 'h2', text: "1. QUY ĐỊNH CHUNG." },
  { type: "p", text: "Khi truy cập và sử dụng các dịch vụ trên website The Boss, khách hàng đồng ý với các điều khoản được quy định trong Chính sách bảo mật này. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng theo đúng quy định pháp luật Việt Nam." },
  { type: 'h2', text: "2. MỤC ĐÍCH VÀ PHẠM VI THU THẬP THÔNG TIN CÁ NHÂN." },
  { type: "p", text: "Chúng tôi chỉ thu thập thông tin cá nhân cần thiết để cung cấp dịch vụ, bao gồm nhưng không giới hạn:" },
  { type: "ul", items: ["Họ và tên.", "Số điện thoại.", "Địa chỉ email.", "Địa chỉ giao hàng.", "Thông tin thanh toán (nếu có)."] },
  { type: "p", text: "Thông tin này được sử dụng nhằm mục đích:" },
  { type: "ul", items: ["Xử lý đơn hàng và cung cấp dịch vụ theo yêu cầu của khách hàng.", "Hỗ trợ khách hàng, chăm sóc khách hàng.", "Cải thiện chất lượng dịch vụ và nghiên cứu thị trường.", "Gửi thông báo về chương trình khuyến mãi, ưu đãi (chỉ khi có sự đồng ý từ khách hàng)."] },
  { type: 'h2', text: "3. PHƯƠNG THỨC THU THẬP THÔNG TIN." },
  { type: "p", text: "Chúng tôi thu thập thông tin cá nhân từ khách hàng thông qua các phương thức sau:" },
  { type: "ul", items: ["Khi khách hàng trực tiếp cung cấp thông tin trên website.", "Khi khách hàng tương tác với chúng tôi thông qua email, điện thoại hoặc mạng xã hội.", "Khi hệ thống tự động ghi nhận thông tin trong quá trình khách hàng sử dụng dịch vụ."] },
  { type: "p", text: "Khách hàng có quyền từ chối cung cấp thông tin hoặc yêu cầu xóa dữ liệu cá nhân bằng cách liên hệ với chúng tôi qua email info.thebossvietnam@gmail.com." },
  { type: 'h2', text: "4. PHẠM VI SỬ DỤNG THÔNG TIN" },
  { type: "p", text: "Chúng tôi cam kết không sử dụng thông tin cá nhân của khách hàng ngoài các mục đích đã nêu và chỉ chia sẻ thông tin trong các trường hợp sau:" },
  { type: "ul", items: ["Với các đơn vị vận chuyển để thực hiện giao hàng.", "Với các đối tác thanh toán khi khách hàng thực hiện giao dịch trực tuyến.", "Với cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp."] },
  { type: "p", text: "Chúng tôi không bán, trao đổi hoặc chia sẻ thông tin khách hàng với bên thứ ba ngoài phạm vi này." },
  { type: "p", text: "Nếu khách hàng theo dõi hoặc/và tương tác với chúng tôi trên các trang xã hội như Facebook hoặc Zalo, thông tin cá nhân của khách hàng cũng sẽ chịu sự quản lý của cơ quan cung cấp dịch vụ trên. Chúng tôi khuyến nghị khách hàng xem xét chính sách bảo mật của các nền tảng mạng xã hội đó để hiểu rõ cách thức thông tin của họ được thu thập, sử dụng và bảo vệ." },
  { type: 'h2', text: "5. THỜI GIAN LƯU TRỮ THÔNG TIN" },
  { type: "p", text: "Thông tin cá nhân sẽ được lưu trữ trong vòng 03 năm kể từ lần cập nhật gần nhất của khách hàng hoặc theo quy định pháp luật. Sau thời gian này, dữ liệu sẽ được xóa hoặc ẩn danh trừ khi có yêu cầu khác từ khách hàng." },
  { type: 'h2', text: "6. BẢO MẬT THÔNG TIN" },
  { type: "p", text: "Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin cá nhân khỏi truy cập trái phép, bao gồm:" },
  { type: "ul", items: ["Mã hóa dữ liệu khi truyền tải.", "Kiểm soát truy cập hệ thống nội bộ.", "Cập nhật và nâng cấp hệ thống bảo mật thường xuyên."] },
  { type: "p", text: "Trong trường hợp xảy ra vi phạm bảo mật dữ liệu, chúng tôi sẽ thông báo kịp thời cho khách hàng và cơ quan chức năng theo quy định pháp luật." },
  { type: 'h2', text: "7. QUYỀN LỢI CỦA KHÁCH HÀNG" },
  { type: "p", text: "Khách hàng có quyền:" },
  { type: "ul", items: ["Kiểm tra, cập nhật hoặc điều chỉnh thông tin cá nhân bất kỳ lúc nào.", "Yêu cầu xóa thông tin cá nhân khi không còn sử dụng dịch vụ.", "Khiếu nại nếu phát hiện thông tin bị sử dụng sai mục đích."] },
  { type: "p", text: "Mọi yêu cầu liên quan đến thông tin cá nhân, khách hàng có thể liên hệ qua email info.thebossvietnam@gmail.com." },
  { type: 'h2', text: "8. THAY ĐỔI CHÍNH SÁCH BẢO MẬT" },
  { type: "p", text: "Chúng tôi có quyền cập nhật Chính sách bảo mật này và sẽ thông báo cho khách hàng trên website hoặc qua email. Khách hàng tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc chấp nhận các nội dung mới." },
  { type: "p", text: "Chúng tôi khuyến khích khách hàng thường xuyên kiểm tra Chính sách bảo mật để cập nhật các thay đổi mới nhất." },
];

/** `routes[path="/chinh-sach-tuyen-dung"].blocks` — the whole captured body. */
const recruitment: ContentBlock[] = [{ type: 'p', text: 'Nội dung đang cập nhật' }];

/** `routes[path="/lien-he"].blocks[0..3]` — the four paragraphs the source actually renders. */
const contactDetails: ContentBlock[] = [
  { type: 'p', text: 'THE BOSS VIỆT NAM' },
  { type: 'p', text: 'Địa chỉ: 225A Kênh Đông, ấp Bàu Tre 1, xã Tân An Hội, Huyện Củ Chi, TP. Hồ Chí Minh.' },
  { type: 'p', text: 'Phone: 0965153621 - 0978202063' },
  { type: 'p', text: 'Zalo: 0965153621' },
];

/**
 * `routes[path="/lien-he"].forms[0]`: name, id, label, placeholder and the server
 * validation strings, verbatim. `type` is the one deliberate markup fix — the
 * source uses `type="number"` for the phone, which blocks `+84` and shows spinners.
 * `type="tel"` keeps the same field and the same label.
 */
type ContactField = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  requiredMessage: string;
  multiline?: boolean;
  type?: string;
  minLength?: number;
  checkMessage?: string;
};

const contactFields: ContactField[] = [
  {
    id: 'fullname-contact',
    name: 'dataContact[fullname]',
    label: 'Họ tên',
    placeholder: 'Họ tên',
    requiredMessage: 'Vui lòng nhập họ và tên',
  },
  {
    id: 'phone-contact',
    name: 'dataContact[phone]',
    label: 'Điện thoại',
    placeholder: 'Điện thoại',
    type: 'tel',
    requiredMessage: 'Vui lòng nhập số điện thoại',
  },
  {
    id: 'address-contact',
    name: 'dataContact[address]',
    label: 'Địa chỉ',
    placeholder: 'Địa chỉ',
    requiredMessage: 'Vui lòng nhập địa chỉ',
  },
  {
    id: 'email-contact',
    name: 'dataContact[email]',
    label: 'Email',
    placeholder: 'Email',
    type: 'email',
    requiredMessage: 'Vui lòng nhập địa chỉ email',
    checkMessage: 'Vui lòng nhập địa chỉ email hợp lệ',
  },
  {
    id: 'subject-contact',
    name: 'dataContact[subject]',
    label: 'Chủ đề',
    placeholder: 'Chủ đề',
    requiredMessage: 'Vui lòng nhập chủ đề',
  },
  {
    id: 'content-contact',
    name: 'dataContact[content]',
    label: 'Nội dung',
    placeholder: 'Nội dung',
    multiline: true,
    minLength: 10,
    requiredMessage: 'Vui lòng nhập nội dung',
    checkMessage: 'Vui lòng nhập nội dung ít nhất 10 ký tự',
  },
];

/**
 * Scoped to the two classes below, so it cannot leak into another family.
 * ponytail: the source uses Bootstrap `form-floating` (label overlapping the input
 * border) inside a 2-column `row`; labels here sit above their control and the
 * grid collapses to one column under 768px. Ceiling: not pixel-identical at
 * 1366px. Upgrade: add the floating-label transform when visual parity is required.
 */
const contactStyles = `<style>
.contact-layout{display:grid;grid-template-columns:1fr;gap:2rem;align-items:start}
@media (min-width:768px){.contact-layout{grid-template-columns:1fr 1fr;gap:2.5rem}}
.contact-details h2{font-size:20px;margin:0 0 .6em}
.contact-details p,.contact-form p{text-align:left}
.contact-form .field{margin:0 0 1rem}
.contact-form label{display:block;margin:0 0 .35rem;font-weight:700}
.contact-form input,.contact-form textarea{box-sizing:border-box;width:100%;padding:.6rem .75rem;border:1px solid #b9bcc0;border-radius:4px;font:inherit;color:inherit}
.contact-form textarea{min-height:9rem;resize:vertical}
.contact-form [aria-invalid="true"]{border-color:var(--color-dark-red)}
.contact-form .field-error{margin:.35rem 0 0;color:var(--color-dark-red);font-size:13px}
.contact-form .form-actions{display:flex;flex-wrap:wrap;gap:.75rem}
.contact-form button{padding:.6rem 1.5rem;border:0;border-radius:4px;font:inherit;cursor:pointer}
.contact-form .btn-send{background:var(--color-dark-red);color:#fff}
.contact-form .btn-send[disabled]{background:#b9bcc0;cursor:not-allowed}
.contact-form .btn-reset{background:#eceff1;color:var(--color-black)}
.contact-form .form-notice{margin:1rem 0 0;color:var(--color-gray);font-size:13px}
</style>`;

const NOT_CONFIGURED =
  'Biểu mẫu chưa được cấu hình: hiện chưa có địa chỉ email nhận thông tin nên nút Gửi đang tạm ngưng. ' +
  'Vui lòng liên hệ trực tiếp theo số điện thoại hoặc Zalo ở mục thông tin liên hệ.';

/**
 * ponytail: the send button stays `disabled` until the owner supplies a real
 * recipient and an endpoint — there is no `action`, no `mailto:` and no success
 * screen, because each of those would drop the message silently. Ceiling: nothing
 * the visitor types can leave the page. Upgrade: drop `disabled` and replace the
 * `submit` handler with a `fetch()` to the approved endpoint — a one-line handler
 * swap; everything else (validation, announceable errors) already works.
 */
const contactScript = `<script>
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var fields = form.querySelectorAll('[data-required-message]');

  function problem(field) {
    if (field.value.trim() === '') return field.dataset.requiredMessage;
    if (field.dataset.checkMessage && (field.validity.tooShort || field.validity.typeMismatch)) {
      return field.dataset.checkMessage;
    }
    return '';
  }

  // The message is written into the element each control points at through
  // aria-describedby, so a screen reader reads it with the field, not just a colour.
  function show(field, message) {
    var error = document.getElementById(field.id + '-error');
    error.textContent = message;
    error.hidden = message === '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return message === '';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    for (var i = 0; i < fields.length; i += 1) {
      if (!show(fields[i], problem(fields[i]))) {
        fields[i].focus();
        return;
      }
    }
  });

  // The reset event fires before the values are cleared, so clear directly
  // instead of re-validating values that are about to disappear.
  form.addEventListener('reset', function () {
    for (var i = 0; i < fields.length; i += 1) show(fields[i], '');
  });

  fields.forEach(function (field) {
    field.addEventListener('blur', function () { show(field, problem(field)); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') show(field, problem(field));
    });
  });
})();
</script>`;

function control(field: ContactField): string {
  const attributes = [
    `id="${field.id}"`,
    `name="${field.name}"`,
    `placeholder="${escapeHtml(field.placeholder)}"`,
    'required',
    `aria-describedby="${field.id}-error"`,
    field.minLength ? `minlength="${field.minLength}"` : '',
    `data-required-message="${escapeHtml(field.requiredMessage)}"`,
    field.checkMessage ? `data-check-message="${escapeHtml(field.checkMessage)}"` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return field.multiline
    ? `<textarea ${attributes} rows="6"></textarea>`
    : `<input type="${field.type ?? 'text'}" ${attributes} />`;
}

const content: ContentFamily = {
  'policies:chinh-sach-bao-mat': privacy,
  'policies:chinh-sach-tuyen-dung': recruitment,
  'policies:lien-he': contactDetails,
};

function contactView(record: PageRecord): string {
  const [brand = '', address = '', phone = '', zalo = ''] = requireContent(record, content).map((block) =>
    block.type === 'p' ? block.text : '',
  );
  // "Phone: 0965153621 - 0978202063" — the label stays text, each number is dialable
  // on its own, and the rendered text is still byte-identical to the capture.
  const firstSpace = phone.indexOf(' ');
  const phoneLabel = phone.slice(0, firstSpace + 1);
  const phoneNumbers = phone.slice(firstSpace + 1).split(' - ');

  return [
    contactStyles,
    '<div class="prose wrap-content contact-layout">',
    '<div class="contact-details">',
    tag('h2', brand),
    `<p>${escapeHtml(address)}</p>`,
    `<p>${escapeHtml(phoneLabel)}${phoneNumbers
      .map((number) => `<a href="tel:${escapeHtml(number)}">${escapeHtml(number)}</a>`)
      .join(' - ')}</p>`,
    `<p>${escapeHtml(zalo)}</p>`,
    '</div>',
    '<form class="contact-form" id="contact-form" novalidate aria-label="Liên hệ">',
    contactFields
      .map(
        (field) =>
          `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label>` +
          `${control(field)}` +
          `<p class="field-error" id="${field.id}-error" hidden></p></div>`,
      )
      .join(''),
    '<div class="form-actions">',
    '<button type="submit" class="btn-send" disabled aria-describedby="contact-form-notice">Gửi</button>',
    '<button type="reset" class="btn-reset">Nhập lại</button>',
    '</div>',
    `<p class="form-notice" id="contact-form-notice">${escapeHtml(NOT_CONFIGURED)}</p>`,
    '</form>',
    '</div>',
    contactScript,
  ].join('');
}

const policies: FamilyModule = {
  name: 'policies',
  routes,
  content,
  views: {
    policy: (record: PageRecord) => prose(requireContent(record, content)),
    contact: (record: PageRecord) => contactView(record),
  },
};

export default policies;
