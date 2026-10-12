/**
 * Aetheria Research Profile Repositories & Score Derivation Logic
 */
import { BirthProfile, LifeMapResult } from './types';

export const BENCHMARK_PROFILES: Record<string, LifeMapResult> = {
  einstein: {
    profile: {
      name: "Albert Einstein",
      year: 1879,
      month: 3,
      day: 14,
      hour: 11,
      minute: 30,
      isTimeUnknown: false,
      useLmt: true,
      latitude: 48.4011,
      longitude: 9.9876,
      locationName: "Ulm, Germany (LMT)"
    },
    calculationVersion: "pyswisseph-v2.10.3 / Meeus-Ephem",
    domain_scores: {
      "Intellect & First Principles": { w: 0.95, b: 0.92, t: 0.94, n: 0.96 },
      "Vocation & Autonomy": { w: 0.89, b: 0.91, t: 0.90, n: 0.88 },
      "Material Resources": { w: 0.76, b: 0.82, t: 0.78, n: 0.80 },
      "Personal Well-being": { w: 0.70, b: 0.74, t: 0.75, n: 0.72 },
      "Partnership & Covenant": { w: 0.62, b: 0.68, t: 0.74, n: 0.65 },
      "Inner Transformation": { w: 0.88, b: 0.92, t: 0.91, n: 0.89 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "High consensus across all 4 systems. Characterized by rigorous deductive examination and foundational physical synthesis.",
        western_driver: "Mercury conjunct Saturn in Aries (orb 1.05°); Jupiter in Aquarius",
        eastern_driver: "Yang Fire Day Master; Cung Phúc Đức in Dần (Wood)"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "Convergence on independent research directorship and institutional founding over managerial administration.",
        western_driver: "Midheaven at 12° Pisces ruled by Jupiter",
        eastern_driver: "Cung Quan Lộc (Career) in Ngọ with sovereign command stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Moderate alignment. Resources accrued as byproducts of intellectual standing rather than commercial risk appetite.",
        western_driver: "2nd/8th house planetary aspects",
        eastern_driver: "Cung Tài Bạch in Thân"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "Somatic stamina sustained through philosophical equanimity; periods of deep cognitive absorption require rhythmic pacing.",
        western_driver: "Sun in Pisces; Moon in Sagittarius",
        eastern_driver: "Cung Tật Ách in Sửu; Five Element distribution"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Tension detected: Western charts highlight contractual friction; Tử Vi points to lasting fraternal alliances.",
        western_driver: "Venus in Aries semi-square Mars in Capricorn (80° orb)",
        eastern_driver: "Cung Phu Thê in Thìn"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Continuous reflective evolution through solitude and philosophical detachment.",
        western_driver: "Saturn in Aries conjunct Mercury",
        eastern_driver: "Cung Phúc Đức (Ancestral Mind) in Dần"
      }
    ]
  },
  da_vinci: {
    profile: {
      name: "Leonardo da Vinci",
      year: 1452,
      month: 4,
      day: 15,
      hour: 21,
      minute: 40,
      isTimeUnknown: false,
      useLmt: true,
      latitude: 43.7874,
      longitude: 10.9262,
      locationName: "Vinci, Italy (LMT)"
    },
    calculationVersion: "Meeus-Trig-v1.4 / TrueSolarTime",
    domain_scores: {
      "Intellect & First Principles": { w: 0.98, b: 0.95, t: 0.96, n: 0.97 },
      "Vocation & Autonomy": { w: 0.86, b: 0.85, t: 0.88, n: 0.84 },
      "Material Resources": { w: 0.68, b: 0.72, t: 0.70, n: 0.69 },
      "Personal Well-being": { w: 0.80, b: 0.82, t: 0.81, n: 0.79 },
      "Partnership & Covenant": { w: 0.58, b: 0.62, t: 0.64, n: 0.60 },
      "Inner Transformation": { w: 0.94, b: 0.93, t: 0.95, n: 0.92 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "Polymathic cognitive architecture uniting visual empiricism with engineering mechanics and anatomical dissection.",
        western_driver: "Sun in Taurus; Moon in Pisces; Mercury in Aries",
        eastern_driver: "Water-Wood generative cycle in Month pillar"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "Independent court polymath and master inventor; non-linear vocational output spanning military and fine arts.",
        western_driver: "Midheaven in Libra trine Mercury",
        eastern_driver: "Quan Lộc Palace with creative transformation stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Patronage-dependent capital flow; financial stability tied to aristocratic commissions rather than commercial trade.",
        western_driver: "2nd House in Sagittarius; Jupiter in aspect",
        eastern_driver: "Tài Bạch Palace influenced by mobility stars"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "High somatic vitality and physical dexterity supported by vegetarian lifestyle and polyphasic rest cycles.",
        western_driver: "Mars in Aquarius sextile Sun",
        eastern_driver: "Equilibrium between Wood and Earth elements"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Fraternal studio apprenticeship covenant; preference for solitary intellectual creation over formal marital contracts.",
        western_driver: "Venus in Taurus in 7th House boundary",
        eastern_driver: "Phu Thê Palace in solitary branch position"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Continuous observational wonder regarding natural geometry, vortex dynamics, and sacred proportionality.",
        western_driver: "Neptune / Uranus angular correlations",
        eastern_driver: "Phúc Đức Palace governed by high-order wisdom stars"
      }
    ]
  },
  curie: {
    profile: {
      name: "Marie Curie",
      year: 1867,
      month: 11,
      day: 7,
      hour: 12,
      minute: 0,
      isTimeUnknown: false,
      useLmt: true,
      latitude: 52.2297,
      longitude: 21.0122,
      locationName: "Warsaw, Poland (LMT)"
    },
    calculationVersion: "pyswisseph-v2.10.3 / Meeus-Ephem",
    domain_scores: {
      "Intellect & First Principles": { w: 0.96, b: 0.94, t: 0.95, n: 0.96 },
      "Vocation & Autonomy": { w: 0.92, b: 0.94, t: 0.93, n: 0.91 },
      "Material Resources": { w: 0.65, b: 0.70, t: 0.68, n: 0.66 },
      "Personal Well-being": { w: 0.58, b: 0.62, t: 0.60, n: 0.59 },
      "Partnership & Covenant": { w: 0.80, b: 0.78, t: 0.82, n: 0.79 },
      "Inner Transformation": { w: 0.89, b: 0.90, t: 0.91, n: 0.88 }
    },
    theme_details: [
      {
        theme: "Intellect & First Principles",
        icon: "🧠",
        synthesis: "Relentless empirical scrutiny and isolation of novel physical elements through disciplined chemical crystallization.",
        western_driver: "Sun in Scorpio conjunct Saturn; Mercury in Scorpio",
        eastern_driver: "Yin Metal Day Master with concentrated Earth support"
      },
      {
        theme: "Vocation & Autonomy",
        icon: "🏛️",
        synthesis: "First dual Nobel laureate; established sovereign radium research institute despite patriarchal institutional barriers.",
        western_driver: "Midheaven in Scorpio conjunct Mars",
        eastern_driver: "Quan Lộc Palace with unyielding endurance stars"
      },
      {
        theme: "Material Resources",
        icon: "💎",
        synthesis: "Deliberate disavowal of patent royalties; radium process unpatented to ensure unimpeded scientific access.",
        western_driver: "2nd House in Pisces; Jupiter in aspect",
        eastern_driver: "Tài Bạch Palace showing detached capital accumulation"
      },
      {
        theme: "Personal Well-being",
        icon: "🌱",
        synthesis: "Cumulative radiation exposure and somatic fatigue; exceptional psychological fortitude enduring physical strain.",
        western_driver: "Pluto angular aspects; Saturn in Scorpio",
        eastern_driver: "Tật Ách Palace showing structural endurance with energetic strain"
      },
      {
        theme: "Partnership & Covenant",
        icon: "🤝",
        synthesis: "Profound intellectual and personal synergy with Pierre Curie; unified research partnership sharing Nobel recognition.",
        western_driver: "7th House in Taurus ruled by Venus",
        eastern_driver: "Phu Thê Palace with mutually reinforcing nobility stars"
      },
      {
        theme: "Inner Transformation",
        icon: "🔮",
        synthesis: "Unwavering stoicism, scientific altruism, and dedication to humanitarian medical radiological service.",
        western_driver: "Sun-Saturn conjunction in Scorpio",
        eastern_driver: "Phúc Đức Palace anchored in deep perseverance"
      }
    ]
  }
};

export interface CalculationPayload {
  western?: {
    elements?: { Fire?: number; Earth?: number; Air?: number; Water?: number };
    midheaven?: { degree?: number };
  };
  numerology?: {
    life_path_reduced?: { number?: number };
  };
  bazi?: {
    elements_distribution?: { Wood?: number; Fire?: number; Metal?: number; Water?: number; Earth?: number };
  };
  tuvi?: {
    palaces?: unknown[];
  };
}

/**
 * Deterministically derives domain scores from raw calculation response data
 */
export function deriveDomainScores(calcData: CalculationPayload | null): Record<string, { w: number; b: number; t: number; n: number }> {
  const clampScore = (v: number): number => Math.round(Math.min(1.0, Math.max(0.4, v)) * 100) / 100;
  
  const wElem = calcData?.western?.elements || { Fire: 2, Earth: 2, Air: 2, Water: 2 };
  const fireAirWeight = Math.min(1.0, Math.max(0.5, ((wElem.Fire || 0) + (wElem.Air || 0)) / 10.0 + 0.35));
  const earthWaterWeight = Math.min(1.0, Math.max(0.5, ((wElem.Earth || 0) + (wElem.Water || 0)) / 10.0 + 0.35));
  
  const lpVal = ((calcData?.numerology?.life_path_reduced?.number || 6) % 9) / 10.0 + 0.55;
  const baziElem = calcData?.bazi?.elements_distribution || { Wood: 20, Fire: 20, Metal: 20, Water: 20, Earth: 20 };
  const baziWood = ((baziElem.Wood || 20) / 100.0) * 0.4 + 0.6;
  const baziFire = ((baziElem.Fire || 20) / 100.0) * 0.4 + 0.6;
  const baziMetal = ((baziElem.Metal || 20) / 100.0) * 0.4 + 0.6;
  const baziWater = ((baziElem.Water || 20) / 100.0) * 0.4 + 0.6;

  const mcDeg = calcData?.western?.midheaven?.degree || 12;
  const tuviPalaces = calcData?.tuvi?.palaces || [];

  return {
    "Intellect & First Principles": { 
      w: clampScore(fireAirWeight * 0.95), 
      b: clampScore(baziWood * 0.90), 
      t: clampScore(0.85 + (tuviPalaces.length > 0 ? 0.05 : 0)), 
      n: clampScore(lpVal * 0.98) 
    },
    "Vocation & Autonomy": { 
      w: clampScore(0.75 + (mcDeg % 15) / 60.0), 
      b: clampScore(baziFire * 0.88), 
      t: clampScore(0.88), 
      n: clampScore(lpVal * 0.92) 
    },
    "Material Resources": { 
      w: clampScore(earthWaterWeight * 0.85), 
      b: clampScore(baziMetal * 0.85), 
      t: clampScore(0.78), 
      n: clampScore(0.72) 
    },
    "Personal Well-being": { 
      w: clampScore(earthWaterWeight * 0.80), 
      b: clampScore(baziWater * 0.82), 
      t: clampScore(0.75), 
      n: clampScore(0.70) 
    },
    "Partnership & Covenant": { 
      w: clampScore(0.65 + ((wElem.Air || 2) / 15.0)), 
      b: clampScore(0.70), 
      t: clampScore(0.76), 
      n: clampScore(0.68) 
    },
    "Inner Transformation": { 
      w: clampScore(0.85 + ((wElem.Water || 2) / 20.0)), 
      b: clampScore(baziWood * 0.92), 
      t: clampScore(0.90), 
      n: clampScore(lpVal * 0.95) 
    }
  };
}
