export const FOOD_CATEGORY = ["전체", "냉장", "냉동", "실온"]

// Hotdeal Data
export const mockHotdeals = [
  {
    id: "h1",
    name: "유기농 아보카도 3개입",
    price: 12000,
    discountPrice: 7900,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
    category: "과일"
  },
  {
    id: "h2",
    name: "프리미엄 삼겹살 500g",
    price: 18000,
    discountPrice: 12900,
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=300&fit=crop",
    category: "정육"
  },
  {
    id: "h3",
    name: "밀키트 김치찌개 2인분",
    price: 9900,
    discountPrice: 5900,
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
    category: "밀키트"
  },
  {
    id: "h4",
    name: "프리미엄 계란 30구",
    price: 8900,
    discountPrice: 5900,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop",
    category: "유제품"
  },
  {
    id: "h5",
    name: "국내산 감자 3kg",
    price: 15000,
    discountPrice: 9900,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber11a?w=400&h=300&fit=crop",
    category: "채소"
  },
  {
    id: "h6",
    name: "냉동 새우 1kg",
    price: 25000,
    discountPrice: 16900,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    category: "해산물"
  }
]

// Account Data
export const ACCOUNT_CATEGORIES = {
  INCOME: ["급여", "용돈", "부수입", "기타수입"],
  EXPENSE: ["식비", "교통", "쇼핑", "문화", "의료", "주거", "기타지출"]
}

export const mockAccounts = [
  // April 2026
  { id: "a1", type: "INCOME", category: "급여", amount: 2500000, date: "2026-04-01", memo: "4월 월급" },
  { id: "a2", type: "EXPENSE", category: "식비", amount: 45000, date: "2026-04-15", memo: "마트 장보기" },
  { id: "a3", type: "EXPENSE", category: "교통", amount: 50000, date: "2026-04-10", memo: "교통카드 충전" },
  { id: "a4", type: "EXPENSE", category: "쇼핑", amount: 89000, date: "2026-04-18", memo: "생필품 구매" },
  { id: "a5", type: "EXPENSE", category: "문화", amount: 15000, date: "2026-04-19", memo: "영화 관람" },
  { id: "a6", type: "INCOME", category: "부수입", amount: 200000, date: "2026-04-15", memo: "부업 수입" },
  { id: "a7", type: "EXPENSE", category: "식비", amount: 32000, date: "2026-04-20", memo: "외식" },
  { id: "a8", type: "EXPENSE", category: "주거", amount: 650000, date: "2026-04-05", memo: "월세" },
  { id: "a9", type: "EXPENSE", category: "식비", amount: 28000, date: "2026-04-08", memo: "편의점" },
  { id: "a10", type: "EXPENSE", category: "의료", amount: 35000, date: "2026-04-12", memo: "병원비" },
  { id: "a11", type: "EXPENSE", category: "쇼핑", amount: 120000, date: "2026-04-22", memo: "옷 구매" },
  { id: "a12", type: "EXPENSE", category: "식비", amount: 15000, date: "2026-04-25", memo: "카페" },
  { id: "a13", type: "EXPENSE", category: "교통", amount: 25000, date: "2026-04-28", memo: "택시비" },
  // March 2026 (previous month for comparison)
  { id: "a14", type: "INCOME", category: "급여", amount: 2500000, date: "2026-03-01", memo: "3월 월급" },
  { id: "a15", type: "EXPENSE", category: "식비", amount: 180000, date: "2026-03-05", memo: "마트" },
  { id: "a16", type: "EXPENSE", category: "교통", amount: 80000, date: "2026-03-08", memo: "교통비" },
  { id: "a17", type: "EXPENSE", category: "쇼핑", amount: 250000, date: "2026-03-12", memo: "전자제품" },
  { id: "a18", type: "EXPENSE", category: "주거", amount: 650000, date: "2026-03-05", memo: "월세" },
  { id: "a19", type: "EXPENSE", category: "문화", amount: 45000, date: "2026-03-15", memo: "공연 관람" },
  { id: "a20", type: "INCOME", category: "부수입", amount: 150000, date: "2026-03-20", memo: "부업" },
  { id: "a21", type: "EXPENSE", category: "의료", amount: 120000, date: "2026-03-22", memo: "치과" },
  { id: "a22", type: "EXPENSE", category: "식비", amount: 65000, date: "2026-03-25", memo: "외식" },
  // February 2026
  { id: "a23", type: "INCOME", category: "급여", amount: 2500000, date: "2026-02-01", memo: "2월 월급" },
  { id: "a24", type: "EXPENSE", category: "식비", amount: 220000, date: "2026-02-10", memo: "식비" },
  { id: "a25", type: "EXPENSE", category: "주거", amount: 650000, date: "2026-02-05", memo: "월세" },
  { id: "a26", type: "EXPENSE", category: "쇼핑", amount: 180000, date: "2026-02-14", memo: "선물" },
  { id: "a27", type: "EXPENSE", category: "교통", amount: 60000, date: "2026-02-18", memo: "교통비" },
  // January 2026
  { id: "a28", type: "INCOME", category: "급여", amount: 2500000, date: "2026-01-01", memo: "1월 월급" },
  { id: "a29", type: "EXPENSE", category: "식비", amount: 280000, date: "2026-01-15", memo: "새해 회식" },
  { id: "a30", type: "EXPENSE", category: "주거", amount: 650000, date: "2026-01-05", memo: "월세" },
  { id: "a31", type: "EXPENSE", category: "쇼핑", amount: 350000, date: "2026-01-10", memo: "세일" },
  { id: "a32", type: "INCOME", category: "기타수입", amount: 500000, date: "2026-01-20", memo: "보너스" }
]

// Routine Data
export const TIME_SLOTS = ["MORNING", "LUNCH", "DINNER"]
export const TIME_SLOT_LABELS = {
  MORNING: "아침",
  LUNCH: "점심",
  DINNER: "저녁"
}

export const mockRoutines = [
  { id: "r1", title: "물 한잔 마시기", timeSlot: "MORNING", completed: true },
  { id: "r2", title: "스트레칭 10분", timeSlot: "MORNING", completed: false },
  { id: "r3", title: "비타민 챙겨먹기", timeSlot: "MORNING", completed: true },
  { id: "r4", title: "산책 30분", timeSlot: "LUNCH", completed: false },
  { id: "r5", title: "명상 5분", timeSlot: "LUNCH", completed: false },
  { id: "r6", title: "일기 쓰기", timeSlot: "DINNER", completed: false },
  { id: "r7", title: "내일 할 일 정리", timeSlot: "DINNER", completed: false }
]

// Community Data
export const mockCommunity = [
  {
    id: "c1",
    title: "1인가구 냉장고 정리 꿀팁",
    content: "냉장고 정리함을 활용하면 공간 활용이 2배! 투명 용기를 사용하면 유통기한 관리도 쉬워요.",
    type: "TIP",
    status: "DONE",
    likes: 24,
    createdAt: "2026-04-18"
  },
  {
    id: "c2",
    title: "에어프라이어로 만드는 초간단 요리?",
    content: "에어프라이어 하나로 뭘 만들 수 있을까요? 추천 레시피 부탁드려요!",
    type: "QNA",
    status: "WAIT",
    likes: 8,
    createdAt: "2026-04-19"
  },
  {
    id: "c3",
    title: "전기세 절약하는 방법 공유",
    content: "대기전력 차단 멀티탭 사용, 냉장고 온도 적정 유지, LED 조명 교체 등으로 월 2만원 절약 중입니다.",
    type: "TIP",
    status: "DONE",
    likes: 45,
    createdAt: "2026-04-17"
  },
  {
    id: "c4",
    title: "소량 요리할 때 재료 보관법",
    content: "1인분 요리할 때 남는 재료는 어떻게 보관하시나요?",
    type: "QNA",
    status: "DONE",
    likes: 12,
    createdAt: "2026-04-16"
  },
  {
    id: "c5",
    title: "월세 자동이체 설정 꿀팁",
    content: "급여일 다음날로 자동이체 설정하면 연체 걱정 없어요. 알림도 설정해두세요!",
    type: "TIP",
    status: "DONE",
    likes: 31,
    createdAt: "2026-04-15"
  }
]

export const RECIPE_CATEGORIES = ["전체", "한식", "중식", "양식", "일식", "간식", "음료"]

export const DIFFICULTY_OPTIONS = ["쉬움", "보통", "어려움"]

export const mockRecipes = [
  {
    id: "1",
    title: "간단 김치볶음밥",
    description: "남은 밥과 김치로 5분만에 만드는 간편 한끼",
    cookingTime: "10분",
    servings: "1인분",
    difficulty: "쉬움",
    category: "한식",
    thumbnail: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
    liked: true,
    ingredients: [
      { id: "i1", name: "밥", amount: "1공기" },
      { id: "i2", name: "김치", amount: "1/2컵" },
      { id: "i3", name: "계란", amount: "1개" },
      { id: "i4", name: "참기름", amount: "1큰술" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "먼저 김치를 잘게 썰어 준비합니다." },
      { id: "b2", type: "IMAGE", content: "https://images.unsplash.com/photo-1583224994076-0e5d96f3c4f4?w=400&h=300&fit=crop" },
      { id: "b3", type: "TEXT", content: "팬에 기름을 두르고 김치를 볶아줍니다." },
      { id: "b4", type: "TEXT", content: "밥을 넣고 함께 볶아준 뒤, 계란을 올려 완성합니다." }
    ]
  },
  {
    id: "2",
    title: "토마토 파스타",
    description: "기본 재료로 만드는 정통 이탈리안 파스타",
    cookingTime: "20분",
    servings: "1인분",
    difficulty: "보통",
    category: "양식",
    thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    liked: false,
    ingredients: [
      { id: "i1", name: "스파게티면", amount: "100g" },
      { id: "i2", name: "토마토소스", amount: "200ml" },
      { id: "i3", name: "마늘", amount: "3쪽" },
      { id: "i4", name: "올리브오일", amount: "2큰술" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "끓는 물에 소금을 넣고 파스타를 삶아줍니다." },
      { id: "b2", type: "TEXT", content: "팬에 올리브오일과 마늘을 볶아 향을 냅니다." },
      { id: "b3", type: "TEXT", content: "토마토소스를 넣고 끓인 후 삶은 면을 넣어 섞어줍니다." }
    ]
  },
  {
    id: "3",
    title: "계란말이",
    description: "부드럽고 촉촉한 한국식 계란말이",
    cookingTime: "15분",
    servings: "1인분",
    difficulty: "쉬움",
    category: "한식",
    thumbnail: "https://images.unsplash.com/photo-1482049016gy-16d35efd5aa9?w=400&h=300&fit=crop",
    liked: true,
    ingredients: [
      { id: "i1", name: "계란", amount: "3개" },
      { id: "i2", name: "파", amount: "1대" },
      { id: "i3", name: "소금", amount: "약간" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "계란을 풀고 잘게 썬 파와 소금을 넣어 섞어줍니다." },
      { id: "b2", type: "TEXT", content: "약불에서 계란물을 조금씩 부어가며 말아줍니다." }
    ]
  },
  {
    id: "4",
    title: "참치마요 덮밥",
    description: "초간단 참치캔 활용 레시피",
    cookingTime: "5분",
    servings: "1인분",
    difficulty: "쉬움",
    category: "일식",
    thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    liked: false,
    ingredients: [
      { id: "i1", name: "참치캔", amount: "1캔" },
      { id: "i2", name: "마요네즈", amount: "2큰술" },
      { id: "i3", name: "밥", amount: "1공기" },
      { id: "i4", name: "김가루", amount: "약간" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "참치캔의 기름을 빼고 마요네즈와 섞어줍니다." },
      { id: "b2", type: "TEXT", content: "따뜻한 밥 위에 참치마요를 올리고 김가루를 뿌려 완성합니다." }
    ]
  },
  {
    id: "5",
    title: "된장찌개",
    description: "구수한 한국의 대표 국물요리",
    cookingTime: "25분",
    servings: "2인분",
    difficulty: "보통",
    category: "한식",
    thumbnail: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
    liked: true,
    ingredients: [
      { id: "i1", name: "된장", amount: "2큰술" },
      { id: "i2", name: "두부", amount: "1/2모" },
      { id: "i3", name: "애호박", amount: "1/4개" },
      { id: "i4", name: "양파", amount: "1/4개" },
      { id: "i5", name: "청양고추", amount: "1개" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "냄비에 물을 붓고 된장을 풀어줍니다." },
      { id: "b2", type: "TEXT", content: "야채와 두부를 넣고 끓여줍니다." },
      { id: "b3", type: "TEXT", content: "고추를 넣고 마무리합니다." }
    ]
  },
  {
    id: "6",
    title: "아보카도 토스트",
    description: "건강한 브런치 메뉴",
    cookingTime: "10분",
    servings: "1인분",
    difficulty: "쉬움",
    category: "양식",
    thumbnail: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
    liked: false,
    ingredients: [
      { id: "i1", name: "식빵", amount: "2장" },
      { id: "i2", name: "아보카도", amount: "1개" },
      { id: "i3", name: "계란", amount: "1개" },
      { id: "i4", name: "소금/후추", amount: "약간" }
    ],
    blockList: [
      { id: "b1", type: "TEXT", content: "식빵을 토스터에 구워줍니다." },
      { id: "b2", type: "TEXT", content: "아보카도를 으깨서 토스트 위에 펴 바릅니다." },
      { id: "b3", type: "TEXT", content: "수란 또는 반숙 계란을 올려 완성합니다." }
    ]
  }
]

export const mockFoods = [
  {
    id: "f1",
    name: "우유",
    count: 1,
    expireDate: "2026-04-25",
    storageType: "냉장",
    category: "냉장"
  },
  {
    id: "f2",
    name: "계란",
    count: 10,
    expireDate: "2026-05-01",
    storageType: "냉장",
    category: "냉장"
  },
  {
    id: "f3",
    name: "김치",
    count: 1,
    expireDate: "2026-04-30",
    storageType: "냉장",
    category: "냉장"
  },
  {
    id: "f4",
    name: "냉동 만두",
    count: 2,
    expireDate: "2026-08-15",
    storageType: "냉동",
    category: "냉동"
  },
  {
    id: "f5",
    name: "삼겹살",
    count: 1,
    expireDate: "2026-04-22",
    storageType: "냉동",
    category: "냉동"
  },
  {
    id: "f6",
    name: "라면",
    count: 5,
    expireDate: "2026-12-01",
    storageType: "실온",
    category: "실온"
  },
  {
    id: "f7",
    name: "참치캔",
    count: 3,
    expireDate: "2027-06-01",
    storageType: "실온",
    category: "실온"
  },
  {
    id: "f8",
    name: "요거트",
    count: 4,
    expireDate: "2026-04-21",
    storageType: "냉장",
    category: "냉장"
  }
]
