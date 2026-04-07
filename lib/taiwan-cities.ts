export type Region = '北部' | '中部' | '南部' | '東部' | '離島';

export interface TaiwanCity {
  name: string;
  region: Region;
}

export const TAIWAN_CITIES: TaiwanCity[] = [
  // 北部
  { name: '台北市', region: '北部' },
  { name: '新北市', region: '北部' },
  { name: '基隆市', region: '北部' },
  { name: '桃園市', region: '北部' },
  { name: '新竹市', region: '北部' },
  { name: '新竹縣', region: '北部' },
  // 中部
  { name: '苗栗縣', region: '中部' },
  { name: '台中市', region: '中部' },
  { name: '彰化縣', region: '中部' },
  { name: '南投縣', region: '中部' },
  { name: '雲林縣', region: '中部' },
  // 南部
  { name: '嘉義市', region: '南部' },
  { name: '嘉義縣', region: '南部' },
  { name: '台南市', region: '南部' },
  { name: '高雄市', region: '南部' },
  { name: '屏東縣', region: '南部' },
  // 東部
  { name: '宜蘭縣', region: '東部' },
  { name: '花蓮縣', region: '東部' },
  { name: '台東縣', region: '東部' },
  // 離島
  { name: '澎湖縣', region: '離島' },
  { name: '金門縣', region: '離島' },
  { name: '連江縣', region: '離島' },
];

export const CITY_NAMES = TAIWAN_CITIES.map((c) => c.name);
