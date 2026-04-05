// Mock data — API/DB hazır olunca bu dosyadaki veriler gerçek endpoint'lerle değiştirilecek

export const revenueStats = {
  mrr: 4280,
  arr: 51360,
  mrrGrowth: 12.4,
  arrGrowth: 12.4,
  totalRevenue: 18740,
  activeUsers: 347,
  newUsersThisMonth: 42,
  churnRate: 2.1
}

export const dailyRevenue = [
  { date: '26 Mar', amount: 98 },
  { date: '27 Mar', amount: 142 },
  { date: '28 Mar', amount: 119 },
  { date: '29 Mar', amount: 205 },
  { date: '30 Mar', amount: 178 },
  { date: '31 Mar', amount: 231 },
  { date: '1 Nis', amount: 167 },
  { date: '2 Nis', amount: 189 },
  { date: '3 Nis', amount: 244 },
  { date: '4 Nis', amount: 198 },
  { date: '5 Nis', amount: 267 }
]

export const usageBreakdown = {
  ttsRevenue: 2960,
  videoRevenue: 1320
}

export const recentTransactions = [
  { id: 'txn_001', user: 'alex@devtools.io',   type: 'TTS',   amount: 4.20,  chars: 140000, time: '5 dk önce' },
  { id: 'txn_002', user: 'maria@startup.com',  type: 'Video', amount: 9.00,  secs: 200,     time: '12 dk önce' },
  { id: 'txn_003', user: 'john@agency.co',     type: 'TTS',   amount: 1.50,  chars: 50000,  time: '28 dk önce' },
  { id: 'txn_004', user: 'sara@elearning.net', type: 'Video', amount: 13.50, secs: 300,     time: '41 dk önce' },
  { id: 'txn_005', user: 'mike@podcast.fm',    type: 'TTS',   amount: 6.30,  chars: 210000, time: '1 sa önce' }
]

export const users = [
  {
    id: 'usr_001', email: 'alex@devtools.io',   name: 'Alex Chen',
    status: 'active', plan: 'payg', credit: 24.50,
    joined: '2024-01-15', lastSeen: '5 dk önce',
    ttsChars: 4200000, videoSecs: 0, totalSpent: 126.00,
    notes: []
  },
  {
    id: 'usr_002', email: 'maria@startup.com',  name: 'Maria Silva',
    status: 'active', plan: 'payg', credit: 8.20,
    joined: '2024-02-03', lastSeen: '12 dk önce',
    ttsChars: 890000, videoSecs: 1840, totalSpent: 109.80,
    notes: ['Stripe ödeme gecikmesi — takipte']
  },
  {
    id: 'usr_003', email: 'john@agency.co',     name: 'John Doe',
    status: 'active', plan: 'payg', credit: 2.10,
    joined: '2024-02-20', lastSeen: '28 dk önce',
    ttsChars: 2100000, videoSecs: 420, totalSpent: 81.90,
    notes: []
  },
  {
    id: 'usr_004', email: 'sara@elearning.net', name: 'Sara Johnson',
    status: 'active', plan: 'payg', credit: 45.00,
    joined: '2024-03-01', lastSeen: '41 dk önce',
    ttsChars: 560000, videoSecs: 3200, totalSpent: 160.80,
    notes: []
  },
  {
    id: 'usr_005', email: 'mike@podcast.fm',    name: 'Mike Torres',
    status: 'active', plan: 'payg', credit: 12.70,
    joined: '2024-03-10', lastSeen: '1 sa önce',
    ttsChars: 7800000, videoSecs: 0, totalSpent: 234.00,
    notes: ['Enterprise görüşmesi istedi']
  },
  {
    id: 'usr_006', email: 'bad@spammer.xyz',    name: 'Unknown',
    status: 'banned', plan: 'payg', credit: 0,
    joined: '2024-03-18', lastSeen: '2 gün önce',
    ttsChars: 12000000, videoSecs: 0, totalSpent: 0,
    notes: ['API abuse — kart fraud tespit edildi, ban uygulandı']
  },
  {
    id: 'usr_007', email: 'trial@newuser.dev',  name: 'Trial User',
    status: 'trial', plan: 'free', credit: 5.00,
    joined: '2024-04-04', lastSeen: '3 sa önce',
    ttsChars: 45000, videoSecs: 12, totalSpent: 0,
    notes: []
  },
  {
    id: 'usr_008', email: 'content@creator.io', name: 'Lisa Park',
    status: 'active', plan: 'payg', credit: 31.40,
    joined: '2024-03-25', lastSeen: '2 sa önce',
    ttsChars: 1200000, videoSecs: 980, totalSpent: 80.10,
    notes: []
  }
]

export const jobs = [
  {
    id: 'job_a1b2', type: 'TTS',   user: 'alex@devtools.io',
    status: 'processing', chars: 85000,  duration: null,
    started: '2 dk önce', queue: 1
  },
  {
    id: 'job_c3d4', type: 'Video', user: 'sara@elearning.net',
    status: 'processing', chars: 12000, duration: null,
    started: '4 dk önce', queue: 2
  },
  {
    id: 'job_e5f6', type: 'TTS',   user: 'mike@podcast.fm',
    status: 'completed', chars: 210000, duration: '00:07:22',
    started: '18 dk önce', queue: null
  },
  {
    id: 'job_g7h8', type: 'Video', user: 'john@agency.co',
    status: 'completed', chars: 4500, duration: '00:01:40',
    started: '25 dk önce', queue: null
  },
  {
    id: 'job_i9j0', type: 'TTS',   user: 'maria@startup.com',
    status: 'error', chars: 34000, duration: null,
    started: '31 dk önce', queue: null,
    error: 'Kokoro model timeout — karakter limiti aşıldı'
  },
  {
    id: 'job_k1l2', type: 'Video', user: 'content@creator.io',
    status: 'completed', chars: 9800, duration: '00:03:15',
    started: '45 dk önce', queue: null
  },
  {
    id: 'job_m3n4', type: 'TTS',   user: 'trial@newuser.dev',
    status: 'completed', chars: 1200, duration: '00:00:08',
    started: '1 sa önce', queue: null
  },
  {
    id: 'job_o5p6', type: 'Video', user: 'bad@spammer.xyz',
    status: 'error', chars: 500000, duration: null,
    started: '2 gün önce', queue: null,
    error: 'Kullanıcı ban nedeniyle job iptal edildi'
  }
]

export const systemMetrics = {
  cpu: 38,
  ram: 62,
  disk: 44,
  uptime: '14 gün 7 sa 23 dk',
  activeJobs: 2,
  queuedJobs: 1,
  completedToday: 127,
  errorsToday: 3,
  apiLatency: 142,
  services: [
    { name: 'speeko-api',    status: 'up', latency: 142 },
    { name: 'PostgreSQL',    status: 'up', latency: 4 },
    { name: 'Redis',         status: 'up', latency: 1 },
    { name: 'Kokoro Worker', status: 'up', latency: null },
    { name: 'ffmpeg Worker', status: 'up', latency: null },
    { name: 'Stripe Webhook',status: 'up', latency: 88 }
  ]
}
