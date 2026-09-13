import {
  DairyGlyph,
  DefaultGlyph,
  DessertGlyph,
  DrinkGlyph,
  EggGlyph,
  FishGlyph,
  FruitGlyph,
  GrainGlyph,
  MeatGlyph,
  NoodleGlyph,
  ProcessedGlyph,
  SeasoningGlyph,
  VegetableGlyph,
} from './categoryGlyphs'
import './CategoryIcon.css'

const CATEGORY_STYLE = {
  육류: { glyph: MeatGlyph, bg: '#fbe4e2', fg: '#c2452f' },
  해산물: { glyph: FishGlyph, bg: '#e1f1fb', fg: '#1c7fb8' },
  '달걀·두부·콩': { glyph: EggGlyph, bg: '#fdf2d8', fg: '#c98a12' },
  채소: { glyph: VegetableGlyph, bg: '#e6f5e2', fg: '#3d9142' },
  과일: { glyph: FruitGlyph, bg: '#fde7e9', fg: '#d5495f' },
  유제품: { glyph: DairyGlyph, bg: '#eef1fb', fg: '#5468c2' },
  '곡류·떡·빵': { glyph: GrainGlyph, bg: '#f6ecdd', fg: '#a4732f' },
  면류: { glyph: NoodleGlyph, bg: '#fdf0e3', fg: '#c97a26' },
  가공식품: { glyph: ProcessedGlyph, bg: '#eaeef0', fg: '#5c6b73' },
  '양념·소스': { glyph: SeasoningGlyph, bg: '#fbe9df', fg: '#c15a2c' },
  '간식·디저트': { glyph: DessertGlyph, bg: '#fbe6f0', fg: '#c34e86' },
  '음료·주류': { glyph: DrinkGlyph, bg: '#e3f2f0', fg: '#0e8a76' },
}

const FALLBACK_STYLE = { glyph: DefaultGlyph, bg: '#eef1f0', fg: '#6b7c76' }

export default function CategoryIcon({ categoryName, size = 40 }) {
  const style = CATEGORY_STYLE[categoryName] ?? FALLBACK_STYLE
  const Glyph = style.glyph
  return (
    <span
      className="category-icon"
      style={{ width: size, height: size, background: style.bg, color: style.fg }}
      title={categoryName || '기타'}
    >
      <Glyph />
    </span>
  )
}
