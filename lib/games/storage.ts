// Storage abstraction — localStorage now, Vercel KV later.
// Swap by implementing the same interface in a server action / route handler.

export type LeaderboardEntry = {
  name: string;
  score: number;
  meta?: Record<string, string | number>;
  createdAt: number;
};

const LB_KEY = (game: string) => `lessen-games:lb:${game}`;
const SAVE_KEY = (game: string) => `lessen-games:save:${game}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded etc. - ignore, it's a game
  }
}

export function getLeaderboard(game: string): LeaderboardEntry[] {
  const list = read<LeaderboardEntry[]>(LB_KEY(game), []);
  return [...list].sort((a, b) => b.score - a.score).slice(0, 10);
}

export function submitScore(game: string, entry: Omit<LeaderboardEntry, 'createdAt'>) {
  const list = read<LeaderboardEntry[]>(LB_KEY(game), []);
  list.push({ ...entry, createdAt: Date.now() });
  list.sort((a, b) => b.score - a.score);
  write(LB_KEY(game), list.slice(0, 50));
}

export function loadSave<T>(game: string, fallback: T): T {
  return read<T>(SAVE_KEY(game), fallback);
}

export function saveSave<T>(game: string, data: T) {
  write(SAVE_KEY(game), data);
}

export function getPlayerName(): string {
  return read<string>('lessen-games:player', '');
}

export function setPlayerName(name: string) {
  write('lessen-games:player', name);
}
