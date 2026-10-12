/**
 * Aetheria Research Localization Dictionary
 * Clear, plain-language translations based on paste-8 recommendations
 */

export type Locale = 'en' | 'vi';

export const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    nav_explore: "Explore",
    nav_research: "Research",
    nav_docs: "Documentation",
    nav_articles: "Articles",
    nav_sample_cta: "Try a Sample Report",
    nav_create_report: "Create My Report",
    brand_subtitle: "Personal Life Reports & Research",

    proto_banner: "Prototype: sample data only. Research and prediction testing are still in development.",

    hero_eyebrow: "FOUR TRADITIONS. ONE COMPARATIVE VIEW.",
    hero_title: "One life.<br /><em>Many celestial lenses.</em>",
    hero_desc: "Explore how Western astrology, Bát Tự, Tử Vi, and numerology interpret the same aspects of life. Compare their interpretations, discover where they agree or differ, and see the methods behind each result.",
    btn_explore_sample: "Explore a Sample Report",
    btn_create_report: "Create My Personal Report",
    hero_disclaimer: "For reflection and comparative study. Personal interpretations are not established scientific predictions.",

    how_title: "How It Works",
    how_desc: "Three straightforward steps to explore your life through multiple traditions.",
    how_step1_title: "1. Select or Enter a Profile",
    how_step1_desc: "Choose an established benchmark profile or enter birth date, time, and birthplace coordinates.",
    how_step2_title: "2. Compare Interpretations",
    how_step2_desc: "See how each system evaluates career, relationships, intellect, and personal pacing side by side.",
    how_step3_title: "3. Examine the Methods",
    how_step3_desc: "Inspect the classical rules behind each claim and see where traditions agree or disagree.",

    preview_title: "What You Get",
    preview_desc: "A unified comparative report that preserves original traditional vocabulary while mapping shared themes.",
    preview_badge: "Illustrative Preview",
    preview_caveat: "Example interpretation: the three systems are mapped to similar themes of intellectual independence. This thematic comparison is illustrative and does not establish predictive accuracy.",

    trust_title: "Trust, Limitations & Open Science",
    trust_desc: "We build tools to investigate what traditions say, how they differ, and what the evidence supports.",
    trust_p1: "• Computed Facts vs. Interpretations: Astronomical planetary degrees and calendar conversions are calculated deterministically via Swiss Ephemeris and solar term algorithms.",
    trust_p2: "• Empirical Testing under Peer Review: We do not assume symbolic systems can predict the future. We maintain a pre-registered forecast ledger to test claims against objective outcomes over time.",
    trust_p3: "• Privacy by Design: We never ask for invasive device tracking, messages, or calendar access. Your personal data remains yours.",

    cta_title: "Ready to explore your life map?",
    cta_desc: "Start with an illustrative sample report or investigate our reproducible calculation methods.",
    btn_cta_explore: "View Sample Report",
    btn_cta_research: "Inspect Research Ledger"
  },
  vi: {
    nav_explore: "Khám Phá",
    nav_research: "Nghiên Cứu",
    nav_docs: "Tài Liệu",
    nav_articles: "Chuyên Đề",
    nav_sample_cta: "Xem Bản Mẫu",
    nav_create_report: "Lập Bản Đồ",
    brand_subtitle: "Bản Đồ Cuộc Đời & Nghiên Cứu",

    proto_banner: "Bản thử nghiệm: dữ liệu minh họa. Phương pháp nghiên cứu và kiểm chứng dự đoán đang trong quá trình phát triển.",

    hero_eyebrow: "BỐN TRƯỜNG PHÁI. MỘT GÓC NHÌN ĐỐI SÁNH.",
    hero_title: "Một đời người.<br /><em>Đa chiều tinh tú.</em>",
    hero_desc: "Khám phá cách Chiêm Tinh Tây phương, Bát Tự, Tử Vi và Thần Số Học cùng giải nghĩa những khía cạnh của cuộc sống. Đối chiếu các diễn giải, nhận diện điểm tương đồng hay khác biệt, và tìm hiểu phương pháp đằng sau mỗi kết quả.",
    btn_explore_sample: "Khám Phá Bản Báo Cáo Mẫu",
    btn_create_report: "Tạo Bản Báo Cáo Cá Nhân",
    hero_disclaimer: "Phục vụ tự phản tư và đối chiếu học thuật. Các lời diễn giải cá nhân không phải là dự báo khoa học đã được chứng minh.",

    how_title: "Cách Thức Hoạt Động",
    how_desc: "Ba bước đơn giản để khám phá cuộc sống qua nhiều hệ thống biểu tượng.",
    how_step1_title: "1. Chọn hoặc Nhập Hồ Sơ",
    how_step1_desc: "Chọn một hồ sơ mẫu có sẵn hoặc nhập ngày, giờ và nơi sinh của bạn.",
    how_step2_title: "2. Đối Chiếu Các Lời Diễn Giải",
    how_step2_desc: "Xem cách từng hệ thống luận giải sự nghiệp, tình cảm, trí tuệ và nhịp sống cạnh nhau.",
    how_step3_title: "3. Tìm Hiểu Phương Pháp",
    how_step3_desc: "Kiểm tra quy tắc cổ điển đằng sau từng mệnh đề và nhận diện nơi các môn phái đồng thuận hay phân kỳ.",

    preview_title: "Những Gì Bạn Nhận Được",
    preview_desc: "Một bản báo cáo đối sánh toàn diện, tôn trọng nguyên bản thuật ngữ của từng môn phái song song với chủ đề chung.",
    preview_badge: "Bản Xem Trước Minh Họa",
    preview_caveat: "Ví dụ diễn giải: ba hệ thống cùng được ánh xạ tới chủ đề tính độc lập trí tuệ. Đối sánh này mang tính minh họa phương pháp và không khẳng định tính chính xác dự đoán số mệnh.",

    trust_title: "Độ Tin Cậy, Giới Hạn & Khoa Học Mở",
    trust_desc: "Chúng tôi xây dựng công cụ để tìm hiểu các hệ thống nói gì, chúng khác nhau ra sao, và bằng chứng thực tế ủng hộ điều gì.",
    trust_p1: "• Dữ Liệu Tính Toán vs Lời Diễn Giải: Tọa độ hành tinh và chuyển đổi âm dương lịch được tính toán xác thực theo Swiss Ephemeris và tiết khí thiên văn.",
    trust_p2: "• Kiểm Chứng Thực Nghiệm Mù Đôi: Chúng tôi không mặc định huyền học có thể đoán trước tương lai. Chúng tôi duy trì sổ cái khóa trước để kiểm tra dự đoán theo kết quả thực tế qua thời gian.",
    trust_p3: "• Quyền Riêng Tư: Không thu thập thông tin thiết bị, tin nhắn hay định vị xâm nhập. Dữ liệu cá nhân luôn thuộc về bạn.",

    cta_title: "Sẵn sàng khám phá bản đồ cuộc đời?",
    cta_desc: "Bắt đầu với bản báo cáo mẫu minh họa hoặc tìm hiểu phương pháp nghiên cứu có thể tái lập của chúng tôi.",
    btn_cta_explore: "Xem Báo Cáo Mẫu",
    btn_cta_research: "Khám Phá Sổ Cái Nghiên Cứu"
  }
};
