
export interface PhoneReview {
  name: string;
  highlight: string;
  specs: {
    processor: string;
    processorReview: string;
    ram: string;
    ramReview: string;
    storage: string;
    storageReview: string;
    battery: string;
    batteryReview: string;
    screen: string;
    screenReview: string;
    cameraSummary: string;
    cameraReview: string;
    network: string;
    networkReview: string;
    connectivity: string;
    connectivityReview: string;
    releaseDate: string;
    releaseReview: string;
    availabilityStatus: string;
    price: string;
  };
  performance: {
    antutu: string;
    description: string;
    rivals: { name: string; score: string }[];
  };
  gamingPerformance: {
    game: string;
    setting: string;
    experience: string;
  }[];
  overallGamingSummary: string;
  camera: {
    score: string;
    dxoMarkClass: string;
    description: string;
  };
  pros: string[];
  cons: string[];
  targetAudience: string;
}

export interface ComparisonScores {
  chipset: number;
  memory: number;
  camera: number;
  gaming: number;
  battery: number;
  charging: number;
}

export interface ComparisonResult {
  conclusion: string;
  recommendation: string;
  tableData: {
    feature: string;
    phone1: string;
    phone2: string;
    phone3?: string;
    winnerIndex: number;
  }[];
  performanceScores: {
    phone1: ComparisonScores;
    phone2: ComparisonScores;
    phone3?: ComparisonScores;
  };
}

export interface RecommendedPhone {
  name: string;
  reason: string;
  price: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    battery: string;
    charging: string;
    screen: string;
    cameraSummary: string;
    network: string;
    connectivity: string;
    releaseDate: string;
  };
  performance: {
    antutu: string;
  };
  camera: {
    score: string;
  };
}

export interface RecommendationResponse {
  primary: RecommendedPhone;
  alternatives: RecommendedPhone[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  status: 'draft' | 'published';
  publishDate: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  date: string;
}
