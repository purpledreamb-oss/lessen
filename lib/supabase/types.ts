export type UserRole = 'parent' | 'helper';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url: string | null;
  city: string;
  district: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface HelperProfile {
  id: string;
  user_id: string;
  categories: string[];       // 家教, 陪玩, 管家, etc.
  tags: string[];              // 國小數學, 英文, 接送, etc.
  hourly_rate: number | null;
  experience_years: number | null;
  certifications: string[];    // 教師證, 保母證, etc.
  portfolio_urls: string[];    // 作品集照片
  available_days: string[];    // 一, 二, 三, etc.
  available_time_start: string | null; // "09:00"
  available_time_end: string | null;   // "18:00"
  status: 'approved' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface ParentProfile {
  id: string;
  user_id: string;
  children_ages: string[];     // "3歲", "5歲", etc.
  needs: string[];             // 家教, 陪玩, 管家
  preferred_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
