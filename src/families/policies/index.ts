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
  half?: boolean;
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
    half: true,
  },
  {
    id: 'phone-contact',
    name: 'dataContact[phone]',
    label: 'Điện thoại',
    placeholder: 'Điện thoại',
    type: 'tel',
    requiredMessage: 'Vui lòng nhập số điện thoại',
    half: true,
  },
  {
    id: 'address-contact',
    name: 'dataContact[address]',
    label: 'Địa chỉ',
    placeholder: 'Địa chỉ',
    requiredMessage: 'Vui lòng nhập địa chỉ',
    half: true,
  },
  {
    id: 'email-contact',
    name: 'dataContact[email]',
    label: 'Email',
    placeholder: 'Email',
    type: 'email',
    requiredMessage: 'Vui lòng nhập địa chỉ email',
    checkMessage: 'Vui lòng nhập địa chỉ email hợp lệ',
    half: true,
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
 * The source's own Bootstrap `form-floating` geometry, measured on
 * `https://thebossvietnam.com/lien-he` at 1366px: a 2-column `row-20` (10px
 * gutters) inside the 1200px frame, each control a 45px box with a single 1px
 * bottom border, and the label sitting inside the control and floating to the
 * top-left on focus or once the field has content. The left column keeps the
 * source's own type: the brand line is 20px bold in Arial and the three labels
 * below it ("Địa chỉ: ", "Phone: ", "Zalo: ") are bold while their values stay
 * regular.
 *
 * Scoped to `.contact-article` / `.contact-form`, so it cannot leak into another
 * family. `.btn-primary` / `.btn-secondary` carry the source's own Bootstrap
 * colours; the disabled primary keeps Bootstrap's 65% opacity.
 */
const contactStyles = `<style>
.contact-article{display:flex;flex-wrap:wrap;margin:0 -12px}
.contact-article>*{padding:0 12px}
.contact-text,.contact-form{flex:0 0 100%;max-width:100%}
@media (min-width:992px){.contact-text,.contact-form{flex:0 0 50%;max-width:50%}}
.contact-text h2{margin:0 0 16px;font-size:20px;line-height:1.5;font-family:Arial,Helvetica,sans-serif}
.contact-text p{margin:0 0 16px;font-size:16px;line-height:1.5}
.contact-row{display:flex;flex-wrap:wrap;margin:0 -10px}
.contact-input{position:relative;margin:0 0 20px}
.contact-input--half{flex:0 0 100%;max-width:100%;padding:0 10px}
@media (min-width:576px){.contact-input--half{flex:0 0 50%;max-width:50%}}
.form-floating{position:relative}
.form-floating>.form-control{display:block;width:100%;height:45px;padding:16px 12px;font-family:inherit;font-size:14px;line-height:1.25;color:var(--color-black);background-color:#fff;border:0;border-bottom:1px solid #ced4da;border-radius:0;transition:border-color .15s ease-in-out}
.form-floating>.form-control:focus{outline:0;border-bottom-color:#86b7fe}
.form-floating>.form-control:focus,.form-floating>.form-control:not(:placeholder-shown){padding-top:26px;padding-bottom:10px}
.form-floating>.form-control::placeholder{color:transparent}
.form-floating>textarea.form-control{height:100px;resize:none}
.form-floating>label{position:absolute;top:0;left:0;height:100%;padding:10px;color:var(--color-gray);font-size:14px;line-height:1.5;pointer-events:none;border:1px solid transparent;transform-origin:0 0;transition:opacity .1s ease-in-out,transform .1s ease-in-out}
.form-floating>.form-control:focus~label,.form-floating>.form-control:not(:placeholder-shown)~label{opacity:.65;transform:scale(.85) translateY(-.5rem) translateX(.15rem)}
.invalid-feedback{display:none;width:100%;margin-top:4px;font-size:12.25px;color:#dc3545}
.contact-input.is-invalid .invalid-feedback{display:block}
.contact-input.is-invalid .form-control{border-bottom-color:#dc3545}
.form-actions{display:flex;flex-wrap:wrap;gap:4px}
.btn{display:inline-block;padding:6px 12px;font-family:inherit;font-size:16px;line-height:1.5;text-align:center;border:1px solid transparent;border-radius:4px;cursor:pointer}
.btn-primary{color:#fff;background-color:#0d6efd;border-color:#0d6efd}
.btn-primary:disabled{opacity:.65;cursor:not-allowed}
.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}
.btn-secondary:hover{background-color:#5c636a;border-color:#565e64}
.form-notice{margin:16px 0 0;color:var(--color-gray);font-size:13px}
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
    var wrap = field.closest('.contact-input');
    error.textContent = message;
    if (wrap) wrap.classList.toggle('is-invalid', message !== '');
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

function fieldHtml(field: ContactField): string {
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
  const input = field.multiline
    ? `<textarea class="form-control" ${attributes} rows="6"></textarea>`
    : `<input class="form-control" type="${field.type ?? 'text'}" ${attributes} />`;
  return (
    `<div class="${field.half ? 'contact-input contact-input--half' : 'contact-input'}">` +
    `<div class="form-floating">${input}<label for="${field.id}">${escapeHtml(field.label)}</label></div>` +
    `<div class="invalid-feedback" id="${field.id}-error"></div>` +
    `</div>`
  );
}

const content: ContentFamily = {
  'policies:chinh-sach-bao-mat': privacy,
  'policies:chinh-sach-tuyen-dung': recruitment,
  'policies:lien-he': contactDetails,
};

/**
 * The source wraps each label in `<strong>` and leaves the value regular —
 * measured live: label `font-weight: 700`, value `400`. The split is on the
 * first ": ", which all of these captured strings have; the guard keeps a copy
 * edit from silently dropping the bold rather than throwing.
 */
const withBoldLabel = (text: string): string => {
  const at = text.indexOf(': ');
  if (at === -1) return escapeHtml(text);
  return `<strong>${escapeHtml(text.slice(0, at + 2))}</strong>${escapeHtml(text.slice(at + 2))}`;
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
    '<div class="wrap-content">',
    '<div class="contact-article">',
    '<div class="contact-text">',
    tag('h2', brand),
    `<p>${withBoldLabel(address)}</p>`,
    `<p><strong>${escapeHtml(phoneLabel)}</strong>${phoneNumbers
      .map((number) => `<a href="tel:${escapeHtml(number)}">${escapeHtml(number)}</a>`)
      .join(' - ')}</p>`,
    `<p>${withBoldLabel(zalo)}</p>`,
    '</div>',
    '<form class="contact-form" id="contact-form" novalidate aria-label="Liên hệ">',
    '<div class="contact-row">',
    contactFields
      .filter((field) => field.half)
      .map(fieldHtml)
      .join(''),
    '</div>',
    contactFields
      .filter((field) => !field.half)
      .map(fieldHtml)
      .join(''),
    '<div class="form-actions">',
    '<button type="submit" class="btn btn-primary" disabled aria-describedby="contact-form-notice">Gửi</button>',
    '<button type="reset" class="btn btn-secondary">Nhập lại</button>',
    '</div>',
    `<p class="form-notice" id="contact-form-notice">${escapeHtml(NOT_CONFIGURED)}</p>`,
    '</form>',
    '</div>',
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
