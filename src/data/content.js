export const navItems = [
  { label: 'HOME', labelKr: '홈', href: '#home' },
  { label: 'MENU', labelKr: '메뉴', href: '#menu' },
  { label: 'OUR STORIES', labelKr: '우리의 이야기', href: '#stories' },
  { label: 'BOOK', labelKr: '예약', href: '#book' },
];

// Editorial menu items — 6 dishes for the visual magazine spread
export const editorialMenuItems = [
  {
    id: 'e1',
    name: 'Ramen',
    nameKr: '라멘',
    category: 'Signature Bowl',
    description:
      'A soul-warming broth, steeped twelve hours in pork bone and dried anchovies, crowned with silken noodles and a soft-boiled egg whose golden yolk breaks like dawn. Each spoonful carries the quiet warmth of a Korean kitchen in winter.',
    imageSrc: '/assets/menu/Ramen1.jpeg',
    secondarySrc: '/assets/menu/Ramen2.jpeg',
    videoSrc: null,
    layout: 'hero',
    priceINR: 450,
    priceKRW: 7500,
  },
  {
    id: 'e2',
    name: 'Bibimbap',
    nameKr: '비빔밥',
    category: 'Rice Bowl',
    description:
      'Seven ingredients, one bowl, infinite harmony. Garden vegetables sautéed in sesame oil, glazed beef, and a jewel-bright egg arranged in the ancient tradition of five-colour cuisine — 오방색 — then united in a swirl of scarlet gochujang.',
    imageSrc: '/assets/menu/Bibimbap.jpeg',
    secondarySrc: null,
    videoSrc: null,
    layout: 'portrait',
    priceINR: 380,
    priceKRW: 6300,
  },
  {
    id: 'e3',
    name: 'Kimbap',
    nameKr: '김밥',
    category: 'Korean Roll',
    description:
      'Seasoned rice, crisp vegetables, and tender fillings wrapped in sheets of toasted gim — a deceptively simple craft perfected over centuries. Each cross-section is a still life of colour and care, meant to be savoured slowly.',
    imageSrc: '/assets/menu/Kimbap.jpeg',
    secondarySrc: '/assets/menu/Kimbap2.jpeg',
    videoSrc: null,
    layout: 'landscape',
    priceINR: 320,
    priceKRW: 5300,
  },
  {
    id: 'e4',
    name: 'Tteokbokki',
    nameKr: '떡볶이',
    category: 'Street Classic',
    description:
      'Pillowy cylinders of hand-crafted rice cake, simmered low and slow in a glossy gochujang reduction that blurs the line between fire and sweetness. Seoul\'s most beloved street comfort, elevated for the table.',
    imageSrc: '/assets/menu/Tteokbokki.jpeg',
    secondarySrc: null,
    videoSrc: null,
    layout: 'detail',
    priceINR: 280,
    priceKRW: 4600,
  },
  {
    id: 'e5',
    name: 'Korean Corn Dog',
    nameKr: '핫도그',
    category: 'Street Bites',
    description:
      'A golden column of panko-crusted revelation — the Himal Tree take on Korea\'s most joyful street food. Pulled-cheese mozzarella stretches infinitely beneath a crust dusted with sugar, striped with house ketchup and mustard.',
    imageSrc: '/assets/menu/KoreanCornDog.jpeg',
    secondarySrc: null,
    videoSrc: '/assets/menu/KoreanCornDog.mp4',
    layout: 'portrait',
    priceINR: 240,
    priceKRW: 4000,
  },
  {
    id: 'e6',
    name: 'Cappuccino',
    nameKr: '카푸치노',
    category: 'Café Signature',
    description:
      'A morning ritual made sacred. Single-origin espresso blooms beneath a cloud of micro-foamed milk, the barista\'s tulip drawn with the patience of a calligrapher. Served in golden afternoon light — best consumed in silence.',
    imageSrc: '/assets/menu/Cappuccino.jpeg',
    secondarySrc: null,
    videoSrc: '/assets/menu/Cappuccino.mp4',
    layout: 'landscape',
    priceINR: 200,
    priceKRW: 3300,
  },
];

export const menuItems = [
  { id: 'm1', name: 'Tonkotsu Ramen', nameKr: '돈코츠 라멘', description: 'Rich pork bone broth with chashu, soft boiled egg, and wood ear mushrooms.', priceINR: 450, priceKRW: 7500, category: 'Ramen', featured: true },
  { id: 'm2', name: 'Spicy Miso Ramen', nameKr: '스파이시 미소 라멘', description: 'Spicy fermented soybean paste broth, sweet corn, and minced pork.', priceINR: 420, priceKRW: 7000, category: 'Ramen', featured: false },
  { id: 'm3', name: 'Bibimbap', nameKr: '비빔밥', description: 'Mixed rice with assorted vegetables, beef, gochujang, and a fried egg.', priceINR: 380, priceKRW: 6300, category: 'Rice Bowls', featured: true },
  { id: 'm4', name: 'Kimchi Jjigae', nameKr: '김치찌개', description: 'Spicy stew made with aged kimchi, pork belly, and tofu.', priceINR: 350, priceKRW: 5800, category: 'Rice Bowls', featured: false },
  { id: 'm5', name: 'Tteokbokki', nameKr: '떡볶이', description: 'Simmered rice cakes in a sweet and spicy gochujang sauce.', priceINR: 280, priceKRW: 4600, category: 'Small Plates', featured: false },
  { id: 'm6', name: 'Japchae', nameKr: '잡채', description: 'Sweet and savory stir-fried glass noodles and vegetables.', priceINR: 320, priceKRW: 5300, category: 'Small Plates', featured: false },
  { id: 'm7', name: 'Gyoza', nameKr: '교자', description: 'Pan-fried dumplings filled with pork and cabbage.', priceINR: 220, priceKRW: 3600, category: 'Small Plates', featured: false },
  { id: 'm8', name: 'Edamame', nameKr: '에다마메', description: 'Steamed young soybeans sprinkled with sea salt.', priceINR: 180, priceKRW: 3000, category: 'Small Plates', featured: false },
  { id: 'm9', name: 'Korean Fried Chicken', nameKr: '양념치킨', description: 'Double-fried chicken coated in a sticky, sweet, and spicy sauce.', priceINR: 400, priceKRW: 6600, category: 'Small Plates', featured: true },
  { id: 'm10', name: 'Matcha Latte', nameKr: '말차 라떼', description: 'Premium green tea powder whisked with steamed milk.', priceINR: 200, priceKRW: 3300, category: 'Beverages', featured: false },
  { id: 'm11', name: 'Yuzu Honey Tea', nameKr: '유자차', description: 'Traditional Korean tea made with citron and honey.', priceINR: 180, priceKRW: 3000, category: 'Beverages', featured: false },
  { id: 'm12', name: 'Soju Cocktail', nameKr: '소주 칵테일', description: 'Refreshing blend of Korean soju and fruit juices.', priceINR: 280, priceKRW: 4600, category: 'Beverages', featured: false },
];

export const storyItems = [
  { id: 's1', title: 'The Sanctuary', titleKr: '안식처', subtitle: 'Our cafe interior blends minimalism with warmth.', aspect: 'landscape', placeholder: 'linear-gradient(135deg, #E6DFD3, #CFC5B4)' },
  { id: 's2', title: 'Art of Broth', titleKr: '국물의 예술', subtitle: 'Simmered for 12 hours for deep, complex flavors.', aspect: 'portrait', placeholder: 'linear-gradient(135deg, #D4B896, #A68B6B)' },
  { id: 's3', title: 'Seoul to Siliguri', titleKr: '서울에서 실리구리까지', subtitle: 'Bringing authentic Korean culture to the Himalayas.', aspect: 'square', placeholder: 'linear-gradient(135deg, #F0EAD6, #D1C7B7)' },
  { id: 's4', title: 'Pure Ingredients', titleKr: '순수한 재료', subtitle: 'Locally sourced produce meets imported Korean staples.', aspect: 'portrait', placeholder: 'linear-gradient(135deg, #C2B280, #8A795D)' },
  { id: 's5', title: 'Our Family', titleKr: '우리의 가족', subtitle: 'Meet the passionate team behind Himal Tree.', aspect: 'landscape', placeholder: 'linear-gradient(135deg, #B5A642, #8B8031)' },
  { id: 's6', title: 'Evening Glow', titleKr: '저녁의 빛', subtitle: 'The tranquil ambiance as the sun sets.', aspect: 'portrait', placeholder: 'linear-gradient(135deg, #E3DAC9, #B8AD99)' },
];

export const heroQuotes = [
  { main: 'The taste of culture', sub: '문화의 맛', range: [0.03, 0.26] },
  { main: 'Travelling southwest', sub: '남서쪽으로의 여정', range: [0.26, 0.50] },
  { main: 'Layered to perfection', sub: '완벽한 조화', range: [0.50, 0.74] },
  { main: 'Only for you', sub: '오직 당신을 위해', range: [0.74, 0.98] },
];

export const cafeInfo = {
  name: 'HIMAL TREE',
  nameKr: '히말 트리',
  tagline: 'A Korean Café',
  address: 'Hill Cart Road, Siliguri, West Bengal 734001',
  phone: '+91 98835 97341',
  email: 'hello@himaltree.cafe',
  hours: 'Tue–Sun · 11:00 AM – 10:00 PM',
  social: {
    instagram: '@himaltree.cafe',
    facebook: 'himaltreecafe',
  },
};
