/**
 * Taiwan SVG map data from @svg-maps/taiwan package.
 * viewBox: 0 0 1000 1295
 */
import taiwanMap from '@svg-maps/taiwan';

export interface MapRegion {
  name: string;
  id: string;
  path: string;
  labelX: number;
  labelY: number;
}

const ID_TO_CHINESE: Record<string, string> = {
  'changhua-county': '彰化縣',
  'chiayi-city': '嘉義市',
  'chiayi-county': '嘉義縣',
  'hualien-county': '花蓮縣',
  'hsinchu-city': '新竹市',
  'hsinchu-county': '新竹縣',
  'kaohsiung-city': '高雄市',
  'keelung-city': '基隆市',
  'kinmen-county': '金門縣',
  'lienchiang-county': '連江縣',
  'miaoli-county': '苗栗縣',
  'nantou-county': '南投縣',
  'new-taipei-city': '新北市',
  'penghu-county': '澎湖縣',
  'pingtung-county': '屏東縣',
  'taichung-city': '台中市',
  'tainan-city': '台南市',
  'taipei-city': '台北市',
  'taitung-county': '台東縣',
  'taoyuan-city': '桃園市',
  'yilan-county': '宜蘭縣',
  'yunlin-county': '雲林縣',
};

// Approximate label positions for each region (in viewBox 0 0 1000 1295)
const LABEL_POSITIONS: Record<string, { x: number; y: number }> = {
  'changhua-county': { x: 580, y: 700 },
  'chiayi-city': { x: 580, y: 845 },
  'chiayi-county': { x: 620, y: 830 },
  'hualien-county': { x: 880, y: 750 },
  'hsinchu-city': { x: 700, y: 480 },
  'hsinchu-county': { x: 750, y: 450 },
  'kaohsiung-city': { x: 700, y: 1000 },
  'keelung-city': { x: 880, y: 260 },
  'kinmen-county': { x: 150, y: 540 },
  'lienchiang-county': { x: 150, y: 200 },
  'miaoli-county': { x: 680, y: 560 },
  'nantou-county': { x: 720, y: 750 },
  'new-taipei-city': { x: 850, y: 350 },
  'penghu-county': { x: 400, y: 830 },
  'pingtung-county': { x: 720, y: 1150 },
  'taichung-city': { x: 660, y: 640 },
  'tainan-city': { x: 580, y: 950 },
  'taipei-city': { x: 830, y: 300 },
  'taitung-county': { x: 800, y: 1050 },
  'taoyuan-city': { x: 750, y: 400 },
  'yilan-county': { x: 900, y: 420 },
  'yunlin-county': { x: 560, y: 780 },
};

export const TAIWAN_MAP_VIEWBOX = '0 0 1000 1295';

export const TAIWAN_MAP_REGIONS: MapRegion[] = taiwanMap.locations.map((loc: { id: string; path: string }) => {
  const pos = LABEL_POSITIONS[loc.id] || { x: 500, y: 500 };
  return {
    name: ID_TO_CHINESE[loc.id] || loc.id,
    id: loc.id,
    path: loc.path,
    labelX: pos.x,
    labelY: pos.y,
  };
});
