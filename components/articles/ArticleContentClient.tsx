'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  read_time: string;
  date: string;
  summary: string;
  content: string;
}

const ARTICLES_DATA: Record<string, ArticleItem[]> = {
  en: [
    {
      slug: 'western-astrodienst-ephemeris',
      title: 'Astronomical Precision in Western Astrology: Swiss Ephemeris Standard',
      category: 'Implemented Engine',
      read_time: '6 min read',
      date: 'October 2026',
      summary: 'How Converglyph Research implements sub-arcsecond planetary coordinates using pyswisseph, Placidus house trisection, and geometric aspect matrices.',
      content: `### 1. Astronomical Foundation\nWestern Astrology relies upon geocentric ecliptic longitudes measured along the Tropical Zodiac, anchored at the Vernal Equinox ($0^\\circ$ Aries). Unlike casual horoscope apps that approximate positions through average orbital velocities, Converglyph Research calculates coordinates using \`pyswisseph\` (Swiss Ephemeris v2.10.3.2), derived from NASA JPL DE431 ephemerides.\n\n### 2. Time Standards & Local Mean Time (LMT)\nPrior to international standard time zones (established between 1884 and 1920), local clocks operated on Local Mean Time (LMT), where noon corresponded to the Sun's meridian transit at that specific longitude. Converglyph Research explicitly calculates LMT offsets ($LMT = \\text{Longitude} / 15.0$ hours) for historical benchmarks such as Albert Einstein (1879, Ulm, Germany: $\\text{UTC}+0\\text{h}39\\text{m}57\\text{s}$).\n\n### 3. House Cusps & Aspect Geometry\nHouse divisions are calculated using Placidus semi-arc division, with Whole Sign secondary cross-checking. Aspect angles (Conjunction $0^\\circ$, Sextile $60^\\circ$, Square $90^\\circ$, Trine $120^\\circ$, Opposition $180^\\circ$) are evaluated against classical strict orbs ($6^\\circ - 8^\\circ$), eliminating false angular claims.`
    },
    {
      slug: 'bazi-four-pillars-lst',
      title: 'Four Pillars of Destiny (BaZi): Solar Terms & True Solar Time',
      category: 'Implemented Engine',
      read_time: '7 min read',
      date: 'October 2026',
      summary: 'Calculating the 10 Heavenly Stems and 12 Earthly Branches via astronomical 24 Solar Terms (Jie Qi) and Local Solar Time (LST).',
      content: `### 1. The Solar Principle in BaZi\nWhile popular culture often conflates Chinese metaphysics with the Lunar New Year, authentic Four Pillars of Destiny (BaZi / Tứ Trụ) is strictly a solar calendar system based on the Sun's apparent longitude along the ecliptic. The year transition occurs precisely at the onset of *Lichun* (Start of Spring, $315^\\circ$ solar longitude), not the Lunar New Year.\n\n### 2. True Solar Time ($LST$) Adjustment\nBecause mean clock time assumes a uniform 24-hour day across broad longitudinal zones, BaZi hour pillars require two corrections:\n1. **Longitudinal Offset:** $4 \\text{ minutes per degree}$ from the standard meridian.\n2. **Equation of Time ($EoT$):** Earth's orbital eccentricity and axial tilt shift true solar noon by up to $\\pm 16 \\text{ minutes}$ across the seasons.\n\n### 3. Elemental Dynamic Balance\nThe Day Master (the Heavenly Stem of the Day Pillar) represents the foundational self. Converglyph computes elemental weightings across Wood, Fire, Earth, Metal, and Water using Classical Ten Gods (*Shi Shen*) relationships: Resource, Output, Wealth, and Officer.`
    },
    {
      slug: 'tu-vi-dau-so-classical-matrix',
      title: 'Tử Vi Đẩu Số: 12 Palaces, Star Brightness & Major Luck Cycles',
      category: 'Implemented Engine',
      read_time: '8 min read',
      date: 'October 2026',
      summary: 'An orthodox computational pipeline mapping 14 Major Stars, Auxiliary Stars, and 10-year major luck cycles using the Ho Ngoc Duc Lunisolar calendar.',
      content: `### 1. Lunisolar Mechanics\nTử Vi Đẩu Số (Zi Wei Dou Shu) operates on the authentic Lunisolar Calendar, where months are measured from astronomical New Moon to New Moon. Converglyph implements the Ho Ngoc Duc calendar algorithm, which calculates lunar phases via Jean Meeus ephemeris equations to accurately resolve leap months (*tháng nhuận*).\n\n### 2. Palace Assignment Matrix\nThe 12 Palaces (*Thập Nhị Cung*) represent life domains: Life (*Mệnh*), Body (*Thân*), Career (*Quan Lộc*), Wealth (*Tài Bạch*), Marriage (*Phu Thê*), Ancestral Mind (*Phúc Đức*), and Assets (*Điền Trạch*). Life and Body palaces are established by intersecting the lunar birth month with the two-hour birth branch (*Chi giờ*).\n\n### 3. Star Distribution & Transformation\nConverglyph establishes the Bureau (*Cục*) through the interaction of the Life Palace branch with the Year Stem. Once the Bureau number (2, 3, 4, 5, or 6) is established, the Emperor Star (*Tử Vi*) and Treasury Star (*Thiên Phủ*) are mapped deterministically, followed by the 4 Transformation Stars (*Tứ Hóa*: Khoa, Quyền, Lộc, Kỵ).`
    },
    {
      slug: 'pythagorean-numerology-reductions',
      title: 'Pythagorean Numerology: Master Number Preservation vs Period Reduction',
      category: 'Implemented Engine',
      read_time: '5 min read',
      date: 'October 2026',
      summary: 'Resolving the mathematical divergence between full-digit summation (Master 33/22/11) and period reduction formulas.',
      content: `### 1. Two Distinct Mathematical Canons\nIn Pythagorean Numerology, calculating the Life Path number often creates hidden divergences depending on which reduction rule is applied:\n- **Formula A (Full Digit Sum):** Summing all individual digits of the birth date before reduction. For Albert Einstein ($1879-03-14$): $1+8+7+9+0+3+1+4 = 33$. Because 33 is an esoteric Master Number, it is preserved without further reduction.\n- **Formula B (Period Reduction):** Reducing year, month, and day independently: Year $1879 \\rightarrow 7$, Month $03 \\rightarrow 3$, Day $14 \\rightarrow 5$. Then summing: $7 + 3 + 5 = 15 \\rightarrow 6$ (The Guardian).\n\n### 2. Converglyph Research's Standard\nRather than arbitrarily choosing one formula and presenting it as universal truth, Converglyph Research documents, calculates, and exposes both formulas in every report, allowing users to understand the exact mathematical lineage of each interpretation.`
    },
    {
      slug: 'iching-divination-archetypes',
      title: 'I Ching & Divination: Binary State Mutations & Exploratory Models',
      category: 'Exploratory Prototype',
      read_time: '6 min read',
      date: 'October 2026',
      summary: 'Representing the 64 hexagrams as binary progression states ($2^6$) and clarifying the boundary between dynamic casting and birth mapping.',
      content: `### 1. Mathematical Structure of the Zhouyi\nThe 64 hexagrams of the *I Ching* represent a rigorous 6-bit binary progression system, as recognized by Gottfried Wilhelm Leibniz in 1703. Each hexagram consists of two trigrams formed by binary yin ($0$) and yang ($1$) lines.\n\n### 2. Traditional Casting vs Algorithmic Prototype Mapping\nAuthentic *I Ching* consultation requires a physical stochastic ritual (yarrow stalks or 3 coins) producing moving lines ($6, 7, 8, 9$). In our proof of concept, temporal coordinates map to a seed hexagram to demonstrate cross-tradition representation. Converglyph Research explicitly labels this as an **exploratory prototype model**, distinguishing it from traditional consultation rituals.`
    },
    {
      slug: 'prospective-prediction-ledger-brier',
      title: 'The Empirical Evaluation Framework: SHA-256 Ledger & Brier Loss',
      category: 'Research Protocol',
      read_time: '7 min read',
      date: 'October 2026',
      summary: 'How Converglyph Research tests predictive claims out-of-sample using cryptographic state locks, double-blind cohorts, and proper scoring rules.',
      content: `### 1. Eliminating Post-Hoc Rationalization\nThe primary flaw in conventional astrological testing is hindsight bias: interpretations are retrofitted after events become public knowledge. Converglyph Research enforces prospective locking: predictions must be serialized and locked with a full 64-hex SHA-256 cryptographic digest before the observation window commences.\n\n### 2. The Brier Scoring Rule\nProbabilistic predictions are evaluated using the Brier score:\n$$Brier = \\frac{1}{N} \\sum_{t=1}^N (f_t - o_t)^2$$\nWhere $f_t \\in [0, 1]$ is the forecast probability and $o_t \\in \\{0, 1\\}$ is the binary observed outcome. Predictions that claim high certainty but fail are penalized quadratically.\n\n### 3. Benchmarking Against the Null\nA forecasting system only possesses predictive resolution if its Brier score improves upon uncalibrated random coin-flip nulls ($0.250$) and historical base-rate baselines.`
    }
  ],
  vi: [
    {
      slug: 'western-astrodienst-ephemeris',
      title: 'Độ Chính Xác Thiên Văn Trong Chiêm Tinh Học: Tiêu Chuẩn Swiss Ephemeris',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '6 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Cách Converglyph Research tính toán tọa độ hành tinh chính xác đến từng giây cung bằng pyswisseph, hệ thống nhà Placidus và mạng lưới góc chiếu hình học.',
      content: `### 1. Nền Tảng Thiên Văn Học\nChiêm Tinh học Tây phương dựa trên kinh độ hoàng đạo địa tâm dọc theo Vòng Hoàng Đạo Nhiệt Đới (Tropical Zodiac), neo tại điểm Xuân Phân ($0^\\circ$ Bạch Dương). Khác với các ứng dụng bói toán thông thường chỉ ước lượng vị trí bằng vận tốc quỹ đạo trung bình, Converglyph Research tính toán tọa độ bằng thư viện \`pyswisseph\` (Swiss Ephemeris v2.10.3.2), phát triển từ dữ liệu JPL DE431 của NASA.\n\n### 2. Quy Chuẩn Giờ Địa Phương (LMT)\nTrước khi múi giờ chuẩn quốc tế được áp dụng rộng rãi (giai đoạn 1884–1920), đồng hồ địa phương vận hành theo Giờ Mặt Trời Trung Bình (LMT), trong đó 12 giờ trưa ứng với thời điểm Mặt Trời đi qua kinh tuyến địa phương. Converglyph Research tính toán chính xác độ lệch LMT ($LMT = \\text{Kinh độ} / 15.0$ giờ) đối với các nhân vật lịch sử như Albert Einstein (1879, Ulm, Đức: $\\text{UTC}+0\\text{h}39\\text{m}57\\text{s}$).\n\n### 3. Cung Địa Bàn (House) và Góc Chiếu Hình Học\nCác cung nhà được tính theo phương pháp chia bán cung Placidus, kết hợp đối chiếu phương pháp Whole Sign. Các góc chiếu (Trùng tụ $0^\\circ$, Lục hợp $60^\\circ$, Vuông góc $90^\\circ$, Tam hợp $120^\\circ$, Đối đỉnh $180^\\circ$) được áp dụng sai số nghiêm ngặt ($6^\\circ - 8^\\circ$), loại bỏ hoàn toàn các nhận định sai lệch.`
    },
    {
      slug: 'bazi-four-pillars-lst',
      title: 'Bát Tự (Tứ Trụ): Tiết Khí Thiên Văn & Giờ Mặt Trời Thực',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '7 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Tính toán 10 Thiên Can và 12 Địa Chi theo 24 Tiết Khí thiên văn và Giờ Mặt Trời Thực (Local Solar Time).',
      content: `### 1. Bản Chất Dương Lịch Của Bát Tự\nBát Tự (Tứ Trụ) thực chất là hệ thống lịch dương thiên văn dựa trên vị trí của Mặt Trời trên đường hoàng đạo. Mốc khởi đầu năm mới trong Bát Tự không phải là Tết Âm Lịch (Mùng 1 Tháng Giêng) mà là thời điểm Lập Xuân (kinh độ Mặt Trời đạt đúng $315^\\circ$).\n\n### 2. Hiệu Chỉnh Giờ Mặt Trời Thực ($LST$)\nĐồng hồ chuẩn giả định mỗi ngày đều tròn 24 giờ trên cả múi giờ rộng lớn, do đó giờ Bát Tự cần hai bước hiệu chỉnh:\n1. **Độ lệch kinh độ:** $4 \\text{ phút trên mỗi độ kinh}$.\n2. **Phương trình thời gian ($EoT$):** Do độ nghiêng trục Trái Đất và quỹ đạo elip, thời điểm chính ngọ dao động đến $\\pm 16 \\text{ phút}$ qua các mùa.\n\n### 3. Cân Bằng Ngũ Hành\nNhật Chủ (Thiên Can của ngày sinh) đại diện cho bản thể cốt lõi. Converglyph tính toán tỷ lệ phân bổ của Kim, Mộc, Thủy, Hỏa, Thổ dựa trên Thập Thần cổ điển: Ấn Tinh, Thực Thương, Tài Tinh và Quan Sát.`
    },
    {
      slug: 'tu-vi-dau-so-classical-matrix',
      title: 'Tử Vi Đẩu Số: 12 Cung Số, Đắc Hãm & Các Chu Kỳ Đại Hạn',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '8 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Quy trình an sao chính phái lập lá số 12 cung, 14 chính tinh và chu kỳ Đại Hạn 10 năm theo thuật toán Lịch Vạn Niên Hồ Ngọc Đức.',
      content: `### 1. Thuật Toán Âm Dương Lịch\nTử Vi Đẩu Số vận hành trên nền tảng Lịch Âm Dương, trong đó tháng được đo từ Sóc này đến Sóc kế tiếp. Converglyph Research áp dụng thuật toán Hồ Ngọc Đức, xác định chính xác các điểm sóc thiên văn theo công thức Jean Meeus để xử lý chuẩn xác tháng nhuận.\n\n### 2. Thiết Lập 12 Cung Số\nThập Nhị Cung bao gồm: Mệnh, Thân, Quan Lộc, Tài Bạch, Phu Thê, Phúc Đức, Điền Trạch, v.v. Vị trí cung Mệnh và cung Thân được xác định bằng cách đối chiếu tháng sinh âm lịch với Chi giờ sinh.\n\n### 3. An Sao và Tứ Hóa\nSau khi lập Cục (Thủy nhị Cục, Mộc tam Cục, Kim tứ Cục, Thổ ngũ Cục, Hỏa lục Cục), chòm sao Tử Vi và Thiên Phủ được an định, tiếp nối là các bộ phụ tinh và Tứ Hóa (Khoa, Quyền, Lộc, Kỵ).`
    },
    {
      slug: 'pythagorean-numerology-reductions',
      title: 'Thần Số Học Pythagore: Giữ Số Master Hay Rút Gọn Từng Phần',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '5 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Minh bạch hóa sự khác biệt toán học giữa công thức cộng tổng toàn bộ chữ số và công thức rút gọn độc lập từng chu kỳ.',
      content: `### 1. Hai Trường Phái Tính Toán Độc Lập\nTrong Thần Số Học, con số Đường Đời (Life Path) có sự phân kỳ rõ ràng:\n- **Công thức A (Cộng tổng chữ số):** Cộng tất cả các chữ số của ngày sinh. Với Albert Einstein ($1879-03-14$): $1+8+7+9+0+3+1+4 = 33$. Do 33 là Số Master, kết quả được giữ nguyên là Master 33.\n- **Công thức B (Rút gọn từng phần):** Rút gọn năm, tháng, ngày độc lập: Năm $1879 \\rightarrow 7$, Tháng $03 \\rightarrow 3$, Ngày $14 \\rightarrow 5$. Tổng lại: $7 + 3 + 5 = 15 \\rightarrow 6$ (Người Bảo Hộ).\n\n### 2. Nguyên Tắc Của Converglyph Research\nThay vì tự chọn một công thức và tuyên bố đó là chân lý duy nhất, Converglyph Research tính toán và hiển thị song song cả hai công thức để người dùng hiểu rõ nguồn gốc toán học.`
    },
    {
      slug: 'iching-divination-archetypes',
      title: 'Kinh Dịch & Chiêm Đoán: Biến Dịch Nhị Phân & Mô Hình Thử Nghiệm',
      category: 'Mô Hình Thử Nghiệm',
      read_time: '6 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Biểu diễn 64 quẻ Dịch dưới dạng chuỗi biến dịch nhị phân ($2^6$) và phân định rõ ràng giữa gieo quẻ truyền thống với ánh xạ thời gian.',
      content: `### 1. Cấu Trúc Toán Học Chu Dịch\n64 quẻ Kinh Dịch là hệ thống lũy thừa nhị phân 6-bit ($2^6$), từng được nhà toán học Gottfried Wilhelm Leibniz nghiên cứu và ca ngợi năm 1703. Mỗi quẻ được tạo bởi 2 quái đơn gồm các hào âm ($0$) và dương ($1$).\n\n### 2. Gieo Quẻ Truyền Thống vs Mô Hình Thuật Toán\nGieo quẻ Chu Dịch thực thụ đòi hỏi nghi thức ngẫu nhiên (gieo 3 đồng xu hoặc cỏ thi) để sinh hào biến ($6, 7, 8, 9$). Trong phiên bản thử nghiệm, Converglyph sử dụng tọa độ thời gian để làm mẫu đối sánh biểu tượng và minh bạch ghi chú đây là **mô hình thử nghiệm**.`
    },
    {
      slug: 'prospective-prediction-ledger-brier',
      title: 'Khung Đánh Giá Định Lượng: Sổ Cái Khóa SHA-256 & Chỉ Số Brier Loss',
      category: 'Giao Thức Nghiên Cứu',
      read_time: '7 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Cách Converglyph Research kiểm tra các dự đoán tương lai bằng mã băm trạng thái, thử nghiệm mù đôi và thang đo Brier score.',
      content: `### 1. Loại Bỏ Thiên Lệch Hồi Tố\nHạn chế lớn nhất của chiêm tinh truyền thống là xu hướng gán ghép lời giải thích sau khi sự kiện đã xảy ra. Converglyph Research áp dụng cơ chế khóa dự đoán: mọi nhận định phải được chuỗi hóa và tạo mã băm SHA-256 trước khi khoảng thời gian sự kiện bắt đầu.\n\n### 2. Thang Đo Xác Suất Brier Score\nCác dự đoán xác suất được đánh giá qua công thức Brier:\n$$Brier = \\frac{1}{N} \\sum_{t=1}^N (f_t - o_t)^2$$\nCác dự đoán tự tin thái quá nhưng sai sót sẽ bị phạt bình phương.\n\n### 3. Đối Chiếu Baseline\nMột hệ thống biểu tượng chỉ được xem là có năng lực dự đoán nếu đạt điểm Brier vượt trội so với xác suất ngẫu nhiên ($0.250$) và tỷ lệ nền lịch sử.`
    }
  ]
};

export function ArticleContentClient({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const list = ARTICLES_DATA[locale] || ARTICLES_DATA.en;
  const article = list.find(a => a.slug === slug) || ARTICLES_DATA.en.find(a => a.slug === slug) || {
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    category: locale === 'vi' ? "Chuyên Đề Nghiên Cứu" : "Research Monograph",
    read_time: locale === 'vi' ? "6 phút đọc" : "6 min read",
    date: locale === 'vi' ? "Tháng 10, 2026" : "October 2026",
    summary: "",
    content: locale === 'vi' ? "Chuyên đề phương pháp luận chi tiết đang trong giai đoạn phát triển và đối chiếu." : "Detailed methodology monograph under active peer development."
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/articles" style={{ color: 'var(--celestial-gold)', fontSize: '0.85rem', textDecoration: 'none' }}>
          {locale === 'vi' ? '← Quay lại Danh Sách Chuyên Đề' : '← Return to Articles Overview'}
        </Link>
      </div>

      <article className="matrix-editorial-card" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <span className="status-chip confirmed">{article.category}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--moon-ivory)', marginTop: '0.65rem', marginBottom: '0.5rem', lineHeight: 1.15 }}>
            {article.title}
          </h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {article.read_time} • {article.date} • Converglyph Research
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--moon-ivory)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {article.content}
        </div>
      </article>
    </div>
  );
}
