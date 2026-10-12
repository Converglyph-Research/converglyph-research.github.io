'use client';

import React from 'react';
import Link from 'next/link';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { useLocale } from '@/lib/LocaleContext';

const ARTICLES_DATA = {
  en: [
    {
      slug: 'western-astrodienst-ephemeris',
      title: 'Astronomical Precision in Western Astrology: Swiss Ephemeris Standard',
      category: 'Implemented Engine',
      read_time: '6 min read',
      date: 'October 2026',
      summary: 'How Converglyph Research implements sub-arcsecond planetary coordinates using pyswisseph, Placidus house trisection, and geometric aspect matrices.',
      content: `### 1. Astronomical Foundation
Western Astrology relies upon geocentric ecliptic longitudes measured along the Tropical Zodiac, anchored at the Vernal Equinox ($0^\\circ$ Aries). Unlike casual horoscope apps that approximate positions through average orbital velocities, Converglyph Research calculates coordinates using \`pyswisseph\` (Swiss Ephemeris v2.10.3.2), derived from NASA JPL DE431 ephemerides.

### 2. Time Standards & Local Mean Time (LMT)
Prior to international standard time zones (established between 1884 and 1920), local clocks operated on Local Mean Time (LMT), where noon corresponded to the Sun's meridian transit at that specific longitude. Converglyph Research explicitly calculates LMT offsets ($LMT = \\text{Longitude} / 15.0$ hours) for historical benchmarks such as Albert Einstein (1879, Ulm, Germany: $\\text{UTC}+0\\text{h}39\\text{m}57\\text{s}$).

### 3. House Cusps & Aspect Geometry
House divisions are calculated using Placidus semi-arc division, with Whole Sign secondary cross-checking. Aspect angles (Conjunction $0^\\circ$, Sextile $60^\\circ$, Square $90^\\circ$, Trine $120^\\circ$, Opposition $180^\\circ$) are evaluated against classical strict orbs ($6^\\circ - 8^\\circ$), eliminating false angular claims.`
    },
    {
      slug: 'bazi-four-pillars-lst',
      title: 'Four Pillars of Destiny (BaZi): Solar Terms & True Solar Time',
      category: 'Implemented Engine',
      read_time: '7 min read',
      date: 'October 2026',
      summary: 'Calculating the 10 Heavenly Stems and 12 Earthly Branches via astronomical 24 Solar Terms (Jie Qi) and Local Solar Time (LST).',
      content: `### 1. The Solar Principle in BaZi
While popular culture often conflates Chinese metaphysics with the Lunar New Year, authentic Four Pillars of Destiny (BaZi / Tứ Trụ) is strictly a solar calendar system based on the Sun's apparent longitude along the ecliptic. The year transition occurs precisely at the onset of *Lichun* (Start of Spring, $315^\\circ$ solar longitude), not the Lunar New Year.

### 2. True Solar Time ($LST$) Adjustment
Because mean clock time assumes a uniform 24-hour day across broad longitudinal zones, BaZi hour pillars require two corrections:
1. **Longitudinal Offset:** $4 \\text{ minutes per degree}$ from the standard meridian.
2. **Equation of Time ($EoT$):** Earth's orbital eccentricity and axial tilt shift true solar noon by up to $\\pm 16 \\text{ minutes}$ across the seasons.

### 3. Elemental Dynamic Balance
The Day Master (the Heavenly Stem of the Day Pillar) represents the foundational self. Converglyph computes elemental weightings across Wood, Fire, Earth, Metal, and Water using Classical Ten Gods (*Shi Shen*) relationships: Resource, Output, Wealth, and Officer.`
    },
    {
      slug: 'tu-vi-dau-so-classical-matrix',
      title: 'Tử Vi Đẩu Số: 12 Palaces, Star Brightness & Major Luck Cycles',
      category: 'Implemented Engine',
      read_time: '8 min read',
      date: 'October 2026',
      summary: 'An orthodox computational pipeline mapping 14 Major Stars, Auxiliary Stars, and 10-year major luck cycles using the Ho Ngoc Duc Lunisolar calendar.',
      content: `### 1. Lunisolar Mechanics
Tử Vi Đẩu Số (Zi Wei Dou Shu) operates on the authentic Lunisolar Calendar, where months are measured from astronomical New Moon to New Moon. Converglyph implements the Ho Ngoc Duc calendar algorithm, which calculates lunar phases via Jean Meeus ephemeris equations to accurately resolve leap months (*tháng nhuận*).

### 2. Palace Assignment Matrix
The 12 Palaces (*Thập Nhị Cung*) represent life domains: Life (*Mệnh*), Body (*Thân*), Career (*Quan Lộc*), Wealth (*Tài Bạch*), Marriage (*Phu Thê*), Ancestral Mind (*Phúc Đức*), and Assets (*Điền Trạch*). Life and Body palaces are established by intersecting the lunar birth month with the two-hour birth branch (*Chi giờ*).

### 3. Star Distribution & Transformation
Converglyph establishes the Bureau (*Cục*) through the interaction of the Life Palace branch with the Year Stem. Once the Bureau number (2, 3, 4, 5, or 6) is established, the Emperor Star (*Tử Vi*) and Treasury Star (*Thiên Phủ*) are mapped deterministically, followed by the 4 Transformation Stars (*Tứ Hóa*: Khoa, Quyền, Lộc, Kỵ).`
    },
    {
      slug: 'pythagorean-numerology-reductions',
      title: 'Pythagorean Numerology: Master Number Preservation vs Period Reduction',
      category: 'Implemented Engine',
      read_time: '5 min read',
      date: 'October 2026',
      summary: 'Resolving the mathematical divergence between full-digit summation (Master 33/22/11) and period reduction formulas.',
      content: `### 1. Two Distinct Mathematical Canons
In Pythagorean Numerology, calculating the Life Path number often creates hidden divergences depending on which reduction rule is applied:
- **Formula A (Full Digit Sum):** Summing all individual digits of the birth date before reduction. For Albert Einstein ($1879-03-14$): $1+8+7+9+0+3+1+4 = 33$. Because 33 is an esoteric Master Number, it is preserved without further reduction.
- **Formula B (Period Reduction):** Reducing year, month, and day independently: Year $1879 \\rightarrow 7$, Month $03 \\rightarrow 3$, Day $14 \\rightarrow 5$. Then summing: $7 + 3 + 5 = 15 \\rightarrow 6$ (The Guardian).

### 2. Converglyph Research's Standard
Rather than arbitrarily choosing one formula and presenting it as universal truth, Converglyph Research documents, calculates, and exposes both formulas in every report, allowing users to understand the exact mathematical lineage of each interpretation.`
    },
    {
      slug: 'iching-divination-archetypes',
      title: 'I Ching & Divination: Binary State Mutations & Exploratory Models',
      category: 'Exploratory Prototype',
      read_time: '6 min read',
      date: 'October 2026',
      summary: 'Representing the 64 hexagrams as binary progression states ($2^6$) and clarifying the boundary between dynamic casting and birth mapping.',
      content: `### 1. Mathematical Structure of the Zhouyi
The 64 hexagrams of the *I Ching* represent a rigorous 6-bit binary progression system, as recognized by Gottfried Wilhelm Leibniz in 1703. Each hexagram consists of two trigrams formed by binary yin ($0$) and yang ($1$) lines.

### 2. Traditional Casting vs Algorithmic Prototype Mapping
Authentic *I Ching* consultation requires a physical stochastic ritual (yarrow stalks or 3 coins) producing moving lines ($6, 7, 8, 9$). In our proof of concept, temporal coordinates map to a seed hexagram to demonstrate cross-tradition representation. Converglyph Research explicitly labels this as an **exploratory prototype model**, distinguishing it from traditional consultation rituals.`
    },
    {
      slug: 'prospective-prediction-ledger-brier',
      title: 'The Empirical Evaluation Framework: SHA-256 Ledger & Brier Loss',
      category: 'Research Protocol',
      read_time: '7 min read',
      date: 'October 2026',
      summary: 'How Converglyph Research tests predictive claims out-of-sample using cryptographic state locks, double-blind cohorts, and proper scoring rules.',
      content: `### 1. Eliminating Post-Hoc Rationalization
The primary flaw in conventional astrological testing is hindsight bias: interpretations are retrofitted after events become public knowledge. Converglyph Research enforces prospective locking: predictions must be serialized and locked with a full 64-hex SHA-256 cryptographic digest before the observation window commences.

### 2. The Brier Scoring Rule
Probabilistic predictions are evaluated using the Brier score:
$$Brier = \\frac{1}{N} \\sum_{t=1}^N (f_t - o_t)^2$$
Where $f_t \\in [0, 1]$ is the forecast probability and $o_t \\in \\{0, 1\\}$ is the binary observed outcome. Predictions that claim high certainty but fail are penalized quadratically.

### 3. Benchmarking Against the Null
A forecasting system only possesses predictive resolution if its Brier score improves upon uncalibrated random coin-flip nulls ($0.250$) and historical base-rate baselines.`
    }
  ],
  vi: [
    {
      slug: 'western-astrodienst-ephemeris',
      title: 'Độ Chính Xác Thiên Văn Trong Chiêm Tinh Học: Tiêu Chuẩn Swiss Ephemeris',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '6 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Cách Converglyph tính toán tọa độ hành tinh chính xác đến từng giây cung bằng pyswisseph, hệ thống nhà Placidus và mạng lưới góc chiếu hình học.',
      content: `### 1. Nền Tảng Thiên Văn Học
Chiêm Tinh học Tây phương dựa trên kinh độ hoàng đạo địa tâm dọc theo Vòng Hoàng Đạo Nhiệt Đới (Tropical Zodiac), neo tại điểm Xuân Phân ($0^\\circ$ Bạch Dương). Khác với các ứng dụng bói toán thông thường chỉ ước lượng vị trí bằng vận tốc quỹ đạo trung bình, Converglyph tính toán tọa độ bằng thư viện \`pyswisseph\` (Swiss Ephemeris v2.10.3.2), phát triển từ dữ liệu JPL DE431 của NASA.

### 2. Quy Chuẩn Giờ Địa Phương (LMT)
Trước khi múi giờ chuẩn quốc tế được áp dụng rộng rãi (giai đoạn 1884–1920), đồng hồ địa phương vận hành theo Giờ Mặt Trời Trung Bình (LMT), trong đó 12 giờ trưa ứng với thời điểm Mặt Trời đi qua kinh tuyến địa phương. Converglyph tính toán chính xác độ lệch LMT ($LMT = \\text{Kinh độ} / 15.0$ giờ) đối với các nhân vật lịch sử như Albert Einstein (1879, Ulm, Đức: $\\text{UTC}+0\\text{h}39\\text{m}57\\text{s}$).

### 3. Cung Địa Bàn (House) và Góc Chiếu Hình Học
Các cung nhà được tính theo phương pháp chia bán cung Placidus, kết hợp đối chiếu phương pháp Whole Sign. Các góc chiếu (Trùng tụ $0^\\circ$, Lục hợp $60^\\circ$, Vuông góc $90^\\circ$, Tam hợp $120^\\circ$, Đối đỉnh $180^\\circ$) được áp dụng sai số nghiêm ngặt ($6^\\circ - 8^\\circ$), loại bỏ hoàn toàn các nhận định sai lệch.`
    },
    {
      slug: 'bazi-four-pillars-lst',
      title: 'Bát Tự (Tứ Trụ): Tiết Khí Thiên Văn & Giờ Mặt Trời Thực',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '7 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Tính toán 10 Thiên Can và 12 Địa Chi theo 24 Tiết Khí thiên văn và Giờ Mặt Trời Thực (Local Solar Time).',
      content: `### 1. Bản Chất Dương Lịch Của Bát Tự
Bát Tự (Tứ Trụ) thực chất là hệ thống lịch dương thiên văn dựa trên vị trí của Mặt Trời trên đường hoàng đạo. Mốc khởi đầu năm mới trong Bát Tự không phải là Tết Âm Lịch (Mùng 1 Tháng Giêng) mà là thời điểm Lập Xuân (kinh độ Mặt Trời đạt đúng $315^\\circ$).

### 2. Hiệu Chỉnh Giờ Mặt Trời Thực ($LST$)
Đồng hồ chuẩn giả định mỗi ngày đều tròn 24 giờ trên cả múi giờ rộng lớn, do đó giờ Bát Tự cần hai bước hiệu chỉnh:
1. **Độ lệch kinh độ:** $4 \\text{ phút trên mỗi độ kinh}$.
2. **Phương trình thời gian ($EoT$):** Do độ nghiêng trục Trái Đất và quỹ đạo elip, thời điểm chính ngọ dao động đến $\\pm 16 \\text{ phút}$ qua các mùa.

### 3. Cân Bằng Ngũ Hành
Nhật Chủ (Thiên Can của ngày sinh) đại diện cho bản thể cốt lõi. Converglyph tính toán tỷ lệ phân bổ của Kim, Mộc, Thủy, Hỏa, Thổ dựa trên Thập Thần cổ điển: Ấn Tinh, Thực Thương, Tài Tinh và Quan Sát.`
    },
    {
      slug: 'tu-vi-dau-so-classical-matrix',
      title: 'Tử Vi Đẩu Số: 12 Cung Số, Đắc Hãm & Các Chu Kỳ Đại Hạn',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '8 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Quy trình an sao chính phái lập lá số 12 cung, 14 chính tinh và chu kỳ Đại Hạn 10 năm theo thuật toán Lịch Vạn Niên Hồ Ngọc Đức.',
      content: `### 1. Cơ Chế Lịch Âm Dương
Tử Vi Đẩu Số vận hành trên nền tảng Lịch Âm Dương đích thực, trong đó các tháng được xác định chính xác từ điểm Sóc (Trăng Non) thiên văn. Converglyph áp dụng thuật toán Hồ Ngọc Đức kết hợp cơ học thiên thể Jean Meeus để xác định chính xác tháng nhuận.

### 2. Ma Trận Thiết Lập 12 Cung
12 cung địa bàn đại diện cho các phương diện đời sống: Mệnh, Thân, Quan Lộc, Tài Bạch, Phu Thê, Phúc Đức, Điền Trạch. Cung Mệnh và Thân được an bằng cách giao thoa giữa tháng sinh âm lịch và canh giờ sinh (12 Chi giờ).

### 3. Phân Bổ Tinh Đẩu & Tứ Hóa
Converglyph xác định Cục (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục) dựa trên Can Chi cung Mệnh. Từ Cục số và ngày sinh, vị trí sao Tử Vi và Thiên Phủ được an chính xác tuyệt đối, tiếp nối bởi an sao Tứ Hóa (Khoa, Quyền, Lộc, Kỵ).`
    },
    {
      slug: 'pythagorean-numerology-reductions',
      title: 'Thần Số Học Pythagoras: Bảo Lưu Số Chủ Đạo 11/22/33 vs Rút Gọn Từng Phần',
      category: 'Động Cơ Đã Triển Khai',
      read_time: '5 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Giải quyết xung đột toán học giữa công thức cộng tổng toàn bộ chữ số và công thức rút gọn từng chu kỳ độc lập.',
      content: `### 1. Hai Trường Phái Toán Học Khác Biệt
Trong thần số học Pythagoras, việc tính Số Đường Đời (Life Path) thường tạo ra kết quả sai lệch tùy thuộc vào quy tắc rút gọn được áp dụng:
- **Công thức A (Cộng tổng toàn bộ):** Cộng tất cả các chữ số của ngày tháng năm sinh trước khi rút gọn. Với Albert Einstein ($1879-03-14$): $1+8+7+9+0+3+1+4 = 33$. Vì 33 là Số Bậc Thầy (Master Number), nó được bảo lưu trọn vẹn.
- **Công thức B (Rút gọn từng phần):** Rút gọn độc lập năm, tháng, ngày: Năm $1879 \\rightarrow 7$, Tháng $03 \\rightarrow 3$, Ngày $14 \\rightarrow 5$. Sau đó cộng lại: $7 + 3 + 5 = 15 \\rightarrow 6$.

### 2. Chuẩn Mực Của Converglyph
Thay vì tự ý chọn một công thức và tuyên bố đó là chân lý duy nhất, Converglyph Research ghi nhận, tính toán và hiển thị cả hai công thức trong báo cáo để người dùng hiểu rõ nguồn gốc toán học của từng luận điểm.`
    },
    {
      slug: 'iching-divination-archetypes',
      title: 'Kinh Dịch & Bói Toán: Biến Trạng Nhị Phân & Mô Hình Thử Nghiệm',
      category: 'Mô Hình Thử Nghiệm',
      read_time: '6 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Mô tả 64 quẻ dịch dưới dạng hệ thống nhị phân 6-bit ($2^6$) và phân định ranh giới giữa chiêm bói ngẫu nhiên và lập quẻ bản mệnh.',
      content: `### 1. Cấu Trúc Toán Học Chu Dịch
64 quẻ Kinh Dịch đại diện cho một hệ tiến trình nhị phân 6-bit chặt chẽ, từng được Gottfried Wilhelm Leibniz công nhận vào năm 1703. Mỗi quẻ bao gồm hai đơn quái (quẻ đơn) tạo bởi các hào âm ($0$) và dương ($1$).

### 2. Gieo Quẻ Truyền Thống vs Khởi Quẻ Theo Tọa Độ
Chiêm quẻ đích thực đòi hỏi nghi thức ngẫu nhiên thực tế (cỏ thi hoặc 3 đồng xu) tạo ra các hào biến ($6, 7, 8, 9$). Trong bản thử nghiệm, chúng tôi khởi tạo quẻ gốc qua tọa độ thời gian nhằm minh họa khả năng kết nối đa hệ thống biểu tượng. Converglyph Research phân định rõ đây là **mô hình thử nghiệm**, không thay thế nghi thức gieo quẻ truyền thống.`
    },
    {
      slug: 'prospective-prediction-ledger-brier',
      title: 'Khung Đánh Giá Thực Nghiệm: Sổ Cái Mật Mã SHA-256 & Chỉ Số Mất Mát Brier',
      category: 'Giao Thức Nghiên Cứu',
      read_time: '7 phút đọc',
      date: 'Tháng 10, 2026',
      summary: 'Cách Converglyph kiểm định các dự đoán tương lai thông qua khóa mật mã, kiểm nghiệm mù đôi và thang đo xác suất chặt chẽ.',
      content: `### 1. Loại Bỏ Thiên Kiến Nhìn Lại (Hindsight Bias)
Lỗ hổng lớn nhất của việc kiểm chứng chiêm tinh thông thường là sự hợp lý hóa sau khi sự kiện đã xảy ra. Converglyph áp dụng cơ chế khóa tương lai (prospective locking): mọi dự đoán đều được mã hóa và khóa bằng mã băm SHA-256 64 ký tự trước khi khung thời gian quan sát bắt đầu.

### 2. Quy Tắc Đo Lường Brier Score
Các dự đoán xác suất được đánh giá thông qua thang đo Brier:
$$Brier = \\frac{1}{N} \\sum_{t=1}^N (f_t - o_t)^2$$
Trong đó $f_t \\in [0, 1]$ là xác suất dự báo và $o_t \\in \\{0, 1\\}$ là kết quả nhị phân thực tế. Các dự đoán tuyên bố độ chắc chắn cao nhưng thất bại sẽ bị phạt theo hàm bậc hai.

### 3. So Sánh Với Giả Thuyết Vô Hiệu
Một hệ thống dự báo chỉ được công nhận có năng lực dự đoán nếu chỉ số Brier của nó vượt trội hơn phép thử tung đồng xu ngẫu nhiên ($0.250$) và tỷ lệ xác suất nền lịch sử.`
    }
  ]
};

export default function ArticlesIndexPage() {
  const { locale, dict } = useLocale();
  const articles = locale === 'vi' ? ARTICLES_DATA.vi : ARTICLES_DATA.en;

  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />

      <main className="section">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="section-editorial-eyebrow">
              {locale === 'vi' ? 'HỆ THỐNG PHƯƠNG PHÁP & CHUYÊN ĐỀ' : 'METHODOLOGY MONOGRAPHS & RESEARCH PAPERS'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--moon-ivory)', marginTop: '0.75rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              {locale === 'vi' ? 'Chuyên Đề Phương Pháp Luận' : 'Methodology Monographs'}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.7' }}>
              {locale === 'vi'
                ? 'Tìm hiểu chi tiết cơ chế toán học, thiên văn học và giao thức thực nghiệm phía sau từng hệ thống phân tích của Converglyph Research.'
                : 'Examine the detailed astronomical mechanics, mathematical formulas, and empirical evaluation protocols behind each Converglyph engine.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {articles.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article
                  className="matrix-editorial-card"
                  style={{
                    height: '100%',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="status-chip confirmed" style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {item.read_time}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginBottom: '0.85rem', lineHeight: '1.3' }}>
                      {item.title}
                    </h2>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                      {item.summary}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--celestial-gold)', fontFamily: 'var(--font-mono)' }}>
                      {item.date}
                    </span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--astral-lilac)', fontWeight: 600 }}>
                      {locale === 'vi' ? 'Đọc chuyên đề →' : 'Read Paper →'}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
