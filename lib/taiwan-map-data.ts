/**
 * Simplified SVG path data for Taiwan's 22 administrative divisions.
 * Paths are designed for a 400x600 viewBox.
 * Each path represents a county/city boundary simplified for visual clarity.
 */

export interface MapRegion {
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

export const TAIWAN_MAP_REGIONS: MapRegion[] = [
  // 北部
  {
    name: '基隆市',
    path: 'M285,72 L305,65 L315,75 L310,88 L295,90 L280,82 Z',
    labelX: 297, labelY: 78,
  },
  {
    name: '台北市',
    path: 'M255,88 L275,80 L295,90 L290,105 L270,110 L255,102 Z',
    labelX: 273, labelY: 96,
  },
  {
    name: '新北市',
    path: 'M240,65 L270,55 L305,65 L315,75 L310,88 L295,90 L290,105 L300,120 L295,135 L275,140 L255,130 L235,115 L230,95 L235,78 Z M255,88 L275,80 L295,90 L290,105 L270,110 L255,102 Z',
    labelX: 310, labelY: 105,
  },
  {
    name: '桃園市',
    path: 'M210,100 L235,95 L255,102 L255,130 L240,145 L215,140 L205,120 Z',
    labelX: 228, labelY: 122,
  },
  {
    name: '新竹縣',
    path: 'M205,120 L240,145 L255,130 L275,140 L270,160 L245,175 L215,165 L195,145 Z',
    labelX: 235, labelY: 152,
  },
  {
    name: '新竹市',
    path: 'M195,145 L215,140 L215,165 L200,162 L190,155 Z',
    labelX: 203, labelY: 153,
  },
  // 中部
  {
    name: '苗栗縣',
    path: 'M190,155 L215,165 L245,175 L250,200 L235,220 L210,215 L190,195 L180,175 Z',
    labelX: 215, labelY: 190,
  },
  {
    name: '台中市',
    path: 'M180,175 L210,215 L235,220 L260,215 L275,235 L260,260 L235,265 L210,255 L190,235 L175,210 Z',
    labelX: 225, labelY: 235,
  },
  {
    name: '彰化縣',
    path: 'M175,210 L190,235 L195,260 L180,280 L160,275 L155,250 L160,225 Z',
    labelX: 173, labelY: 252,
  },
  {
    name: '南投縣',
    path: 'M190,235 L210,255 L235,265 L260,260 L270,280 L260,310 L240,320 L215,310 L195,290 L180,280 L195,260 Z',
    labelX: 228, labelY: 285,
  },
  {
    name: '雲林縣',
    path: 'M155,250 L160,275 L180,280 L195,290 L190,310 L165,320 L145,310 L135,285 L140,265 Z',
    labelX: 163, labelY: 293,
  },
  // 南部
  {
    name: '嘉義縣',
    path: 'M140,265 L165,320 L190,310 L215,310 L220,335 L200,355 L170,355 L145,340 L130,315 L135,285 Z',
    labelX: 175, labelY: 328,
  },
  {
    name: '嘉義市',
    path: 'M155,335 L170,330 L175,345 L160,348 Z',
    labelX: 165, labelY: 340,
  },
  {
    name: '台南市',
    path: 'M130,315 L145,340 L170,355 L200,355 L210,380 L200,405 L175,410 L150,400 L130,380 L120,350 Z',
    labelX: 162, labelY: 378,
  },
  {
    name: '高雄市',
    path: 'M150,400 L175,410 L200,405 L220,420 L240,400 L260,310 L270,280 L260,260 L275,235 L290,250 L295,280 L285,320 L270,360 L255,400 L245,430 L235,450 L215,460 L190,455 L165,440 L145,420 Z',
    labelX: 230, labelY: 390,
  },
  {
    name: '屏東縣',
    path: 'M165,440 L190,455 L215,460 L235,450 L245,470 L250,500 L240,530 L225,550 L205,555 L185,540 L170,515 L160,490 L155,465 Z',
    labelX: 205, labelY: 500,
  },
  // 東部
  {
    name: '宜蘭縣',
    path: 'M275,140 L295,135 L320,120 L335,135 L330,165 L315,185 L295,190 L270,175 L270,160 Z',
    labelX: 302, labelY: 158,
  },
  {
    name: '花蓮縣',
    path: 'M270,175 L295,190 L315,185 L325,210 L320,260 L310,300 L295,330 L280,340 L270,360 L260,310 L270,280 L260,260 L275,235 L260,215 L250,200 L260,185 Z',
    labelX: 295, labelY: 265,
  },
  {
    name: '台東縣',
    path: 'M270,360 L280,340 L295,330 L310,350 L310,390 L300,420 L280,445 L260,465 L250,500 L245,470 L235,450 L245,430 L255,400 Z',
    labelX: 282, labelY: 410,
  },
  // 離島
  {
    name: '澎湖縣',
    path: 'M90,330 L105,325 L115,335 L115,355 L105,365 L90,360 L85,345 Z',
    labelX: 100, labelY: 345,
  },
  {
    name: '金門縣',
    path: 'M30,280 L55,275 L60,290 L50,300 L30,295 Z',
    labelX: 45, labelY: 288,
  },
  {
    name: '連江縣',
    path: 'M55,200 L70,195 L75,208 L65,215 L55,210 Z',
    labelX: 65, labelY: 205,
  },
];
