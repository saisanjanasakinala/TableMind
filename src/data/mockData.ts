import { Restaurant, RestaurantTable, Reservation, User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'CUSTOMER',
    phone: '+1 (555) 234-8891',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'user-owner-1',
    name: 'Chef Julian Vance',
    email: 'julian.vance@letoile.com',
    role: 'RESTAURANT_OWNER',
    phone: '+1 (555) 892-4412',
    restaurantId: 'rest-1',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'user-owner-2',
    name: 'Kenji Takahashi',
    email: 'kenji@sakuragrill.com',
    role: 'RESTAURANT_OWNER',
    phone: '+1 (555) 431-7788',
    restaurantId: 'rest-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'user-admin-1',
    name: 'Elena Rostova',
    email: 'admin@tablemind.ai',
    role: 'PLATFORM_ADMIN',
    phone: '+1 (555) 901-2233',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  // 1. SURAMPALEM RESTAURANTS
  {
    id: 'rest-surampalem-1',
    name: 'Aditya Royal Spice Pavilion',
    tagline: 'Authentic Coastal Andhra Delicacies & Live Charcoal Tandoor',
    description: 'Renowned culinary landmark on ADB Road near Aditya Educational Campus, celebrated for Rayalaseema spiced curries, Konaseema fresh coconut fish fry, and aromatic dum biryanis.',
    cuisine: 'Coastal Andhra & Tandoori',
    priceRange: '$$',
    rating: 4.9,
    reviewCount: 420,
    address: 'ADB Road, Near Aditya Educational Campus',
    area: 'Aditya Educational City / ADB Road',
    neighborhood: 'Campus Corridor',
    city: 'Surampalem',
    state: 'Andhra Pradesh',
    latitude: 17.0863,
    longitude: 82.0620,
    phone: '+91 884 232 4410',
    email: 'spice.pavilion@adityasurampalem.com',
    openingHours: {
      open: '11:30',
      close: '23:00',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Konaseema Royyala Vepudu', description: 'Crisp tiger prawns tossed in crushed peppercorn & curry leaves', price: '₹380', category: 'Appetizers', isChefSpecial: true },
      { name: 'Royal Bamboo Mutton Biryani', description: 'Slow-cooked in natural green bamboo with fragrant seeraga samba rice', price: '₹460', category: 'Mains', isChefSpecial: true },
      { name: 'Gongura Mamsam Curry', description: 'Tender country mutton braised with tangy sorrel leaves', price: '₹420', category: 'Mains' },
      { name: 'Kakinada Kaja Ice Cream Sundae', description: 'Crisp syrup-soaked traditional pastry with chilled kulfi', price: '₹180', category: 'Desserts' },
    ],
    ownerId: 'user-owner-1',
    featured: true,
  },
  {
    id: 'rest-surampalem-2',
    name: 'Surampalem Bistro & Garden Terrace',
    tagline: 'Artisanal Sourdough Pizzas, Continental Grills & Open-Air Greenery',
    description: 'A stylish open-sky retreat near campus featuring fairy-lit garden gazebos, Italian wood-fired ovens, handcrafted coffee, and chilled mocktails.',
    cuisine: 'Multi-Cuisine & Garden Café',
    priceRange: '$$',
    rating: 4.8,
    reviewCount: 310,
    address: 'Campus West Avenue, Opposite Engineering Block',
    area: 'Campus West Avenue',
    neighborhood: 'Aditya Campus Green',
    city: 'Surampalem',
    state: 'Andhra Pradesh',
    latitude: 17.0885,
    longitude: 82.0645,
    phone: '+91 884 232 8820',
    email: 'contact@surampalembistro.com',
    openingHours: {
      open: '12:00',
      close: '23:30',
      days: 'Tuesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Wood-Fired Truffle Funghi Pizza', description: 'Shiitake, mozzarella di bufala, thyme, white truffle drizzle', price: '₹450', category: 'Mains', isChefSpecial: true },
      { name: 'Grilled Peri Peri Cottage Cheese Steak', description: 'Herbed brown rice, butter glazed garden veggies, spiced salsa', price: '₹340', category: 'Mains' },
      { name: 'Avocado Bruschetta Crostini', description: 'Crushed avocado, sun-dried cherry tomatoes, feta crumble', price: '₹240', category: 'Appetizers' },
      { name: 'Belgian Dark Chocolate Molten Lava', description: 'Gooey dark chocolate center, madagascar vanilla scoop', price: '₹220', category: 'Desserts' },
    ],
    ownerId: 'user-owner-2',
    featured: true,
  },
  {
    id: 'rest-surampalem-3',
    name: 'The Godavari Heritage Grand',
    tagline: 'Royal Traditional Andhra Thalis & Godavari River Catches',
    description: 'Warm brass and teakwood ambiance showcasing 24-dish traditional Godavari banana leaf feasts, freshwater pulasa curries, and heritage sweets.',
    cuisine: 'Traditional South Indian & Thalis',
    priceRange: '$$$',
    rating: 4.9,
    reviewCount: 460,
    address: 'NH-216 Bypass Junction, ADB Highway',
    area: 'NH-216 Bypass Junction',
    neighborhood: 'Highway Crossroads',
    city: 'Surampalem',
    state: 'Andhra Pradesh',
    latitude: 17.0820,
    longitude: 82.0590,
    phone: '+91 884 232 9955',
    email: 'reservations@godavariheritage.in',
    openingHours: {
      open: '11:00',
      close: '22:30',
      days: 'Everyday',
    },
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Raju Gari Special Kodi Pulao', description: 'Country chicken infused with green chili paste & aromatic spices', price: '₹410', category: 'Mains', isChefSpecial: true },
      { name: 'Godavari Freshwater Chepala Pulusu', description: 'Slow-simmered fish in aged tamarind, fenugreek & shallot gravy', price: '₹390', category: 'Mains', isChefSpecial: true },
      { name: 'Ulavacharu Chicken Dum Biryani', description: 'Horsegram extract gravy, tender farm chicken, fried cashews', price: '₹440', category: 'Mains' },
    ],
    ownerId: 'user-owner-1',
    featured: false,
  },
  {
    id: 'rest-kakinada-1',
    name: 'Bayleaf Coastal Seafood & Grills',
    tagline: 'Fresh Sea Catch, Coastal Robata & Breezy Portside Dining',
    description: 'Panoramic views of Kakinada port breezes with live charcoal robata skewers, mud crab masala, and signature coastal tandoor.',
    cuisine: 'Coastal Seafood & Grills',
    priceRange: '$$$',
    rating: 4.8,
    reviewCount: 380,
    address: 'Bhanugudi Junction, Main Coastal Road',
    area: 'Bhanugudi Junction & Main Road',
    neighborhood: 'Bhanugudi',
    city: 'Kakinada',
    state: 'Andhra Pradesh',
    latitude: 16.9891,
    longitude: 82.2475,
    phone: '+91 884 237 7799',
    email: 'bayleaf@kakinadacoastal.com',
    openingHours: {
      open: '12:00',
      close: '23:00',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Stuffed Crab Malabar Roast', description: 'Fresh mud crab spiced with shallots, crushed pepper & coconut milk', price: '₹550', category: 'Mains', isChefSpecial: true },
      { name: 'Tandoori Pomfret Fry', description: 'Whole silver pomfret marinated in coastal yellow chili masala', price: '₹490', category: 'Appetizers' },
    ],
    ownerId: 'user-owner-2',
    featured: false,
  },

  // 2. HYDERABAD RESTAURANTS
  {
    id: 'rest-hyderabad-1',
    name: 'Jewel of Nizam - The Minar',
    tagline: 'Royal Nizami Fine Dining with 100ft High Skyline Views',
    description: 'Iconic tower dining overlooking Gandipet lake, serving authentic royal Asaf Jahi cuisine, slow-cooked Kacchi Dum Biryani, and saffron-scented Haleem.',
    cuisine: 'Royal Hyderabadi & Mughlai',
    priceRange: '$$$$',
    rating: 4.9,
    reviewCount: 540,
    address: 'The Golkonda Resort, Gandipet Lake View',
    area: 'Masab Tank / Banjara Hills & Gandipet',
    neighborhood: 'Banjara Hills & Gandipet',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.3912,
    longitude: 78.4485,
    phone: '+91 40 3069 6969',
    email: 'jewelofnizam@golkondaresorts.com',
    openingHours: {
      open: '12:30',
      close: '23:30',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Nizami Kacchi Gosht Biryani', description: 'Tender marinated mutton layered with aged basmati, slow dum with pure saffron and ghee', price: '₹620', category: 'Mains', isChefSpecial: true },
      { name: 'Anokhi Kheer', description: 'Heritage onion and milk reduction scented with green cardamom and 24k silver leaf', price: '₹280', category: 'Desserts', isChefSpecial: true },
      { name: 'Shahi Murgh Dum Kebab', description: 'Chicken minced with royal spices and pistachios, charcoal grilled', price: '₹480', category: 'Appetizers' },
    ],
    ownerId: 'user-owner-1',
    featured: true,
  },
  {
    id: 'rest-hyderabad-2',
    name: 'Paradise Heritage Biryani & Kebabs',
    tagline: 'World-Renowned Hyderabadi Biryani Legend Since 1953',
    description: 'The golden culinary benchmark of Hyderabad, revered for its legendary secret spice blend, tender cuts, and aromatic mirchi ka salan.',
    cuisine: 'Authentic Hyderabadi Dum Biryani',
    priceRange: '$$',
    rating: 4.8,
    reviewCount: 920,
    address: 'Hitec City Cyber Towers Road, Madhapur',
    area: 'Hitec City & Madhapur',
    neighborhood: 'Hitec City',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4486,
    longitude: 78.3908,
    phone: '+91 40 6666 5588',
    email: 'info@paradisebiryani.in',
    openingHours: {
      open: '11:30',
      close: '23:30',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Special Mutton Dum Biryani', description: 'Double portion of succulent bone-in lamb, basmati rice, hard-boiled egg', price: '₹440', category: 'Mains', isChefSpecial: true },
      { name: 'Mirchi Ka Salan', description: 'Spiced bhavnagri chili stew in roasted peanut and sesame gravy', price: '₹180', category: 'Mains' },
      { name: 'Mutton Seekh Kebab', description: 'Spiced minced lamb skewers roasted in deep clay tandoor', price: '₹380', category: 'Appetizers' },
      { name: 'Double Ka Meetha', description: 'Fried milk bread soaked in saffron syrup, condensed milk & pistachios', price: '₹190', category: 'Desserts' },
    ],
    ownerId: 'user-owner-2',
    featured: true,
  },
  {
    id: 'rest-hyderabad-3',
    name: 'Dakshin Coastal & Deccan Dining',
    tagline: 'Treasured Recipes from the Princely Southern States',
    description: 'An elegant temple-carved dining sanctuary presenting rare coastal delicacies from Andhra, Telangana, Chettinad, and Malabar coasts.',
    cuisine: 'Coastal Deccan & South Indian Gourmet',
    priceRange: '$$$',
    rating: 4.9,
    reviewCount: 390,
    address: 'Road No. 36, Jubilee Hills',
    area: 'Jubilee Hills',
    neighborhood: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4319,
    longitude: 78.4073,
    phone: '+91 40 2355 8899',
    email: 'dakshin@itcjubileehills.com',
    openingHours: {
      open: '12:00',
      close: '23:00',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Meen Pollichathu', description: 'Pearl spot fish smeared with shallots and curry leaves, banana leaf steamed', price: '₹580', category: 'Mains', isChefSpecial: true },
      { name: 'Telangana Kodi Kura', description: 'Spicy country chicken curry with crushed coriander seeds and poppy paste', price: '₹460', category: 'Mains' },
      { name: 'Elaneer Payasam', description: 'Tender coconut kernel simmered in sweetened cardamom coconut milk', price: '₹220', category: 'Desserts' },
    ],
    ownerId: 'user-owner-1',
    featured: false,
  },
  {
    id: 'rest-hyderabad-4',
    name: 'The Olive Bistro & Lake Terrace',
    tagline: 'Sun-Drenched Mediterranean Garden overlooking Durgam Cheruvu',
    description: 'White-washed stone walls, bougainvillea blossoms, and panoramic sunset views across the lake, serving artisan pastas and handcrafted cocktails.',
    cuisine: 'Mediterranean & Continental',
    priceRange: '$$$',
    rating: 4.7,
    reviewCount: 480,
    address: 'Atop Durgam Cheruvu Lake, Road 46, Jubilee Hills',
    area: 'Durgam Cheruvu / Jubilee Hills',
    neighborhood: 'Jubilee Hills Lakefront',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4340,
    longitude: 78.3880,
    phone: '+91 40 6999 9127',
    email: 'reservations@olivebistroi.in',
    openingHours: {
      open: '17:00',
      close: '23:30',
      days: 'Tuesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Handmade Ricotta & Spinach Ravioli', description: 'Sage brown butter, toasted walnuts, shaved parmigiano', price: '₹490', category: 'Mains', isChefSpecial: true },
      { name: 'Smoked Burrata & Peach Salad', description: 'Wild arugula, pomegranate glaze, pine nut crunch', price: '₹380', category: 'Appetizers' },
    ],
    ownerId: 'user-owner-2',
    featured: false,
  },

  // 3. SAN FRANCISCO RESTAURANTS
  {
    id: 'rest-1',
    name: "L'Étoile Brasserie & Lounge",
    tagline: 'Refined Parisian Culinary Artistry with Contemporary Flair',
    description: 'Award-winning French brasserie showcasing seasonal tasting menus, premier Burgundy cellars, and intimate velvet booths overlooking the city skyline.',
    cuisine: 'French Fine Dining',
    priceRange: '$$$$',
    rating: 4.9,
    reviewCount: 384,
    address: '420 Grand Avenue, Suite 100',
    area: 'Downtown Financial District',
    neighborhood: 'Downtown Financial District',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7915,
    longitude: -122.4010,
    phone: '+1 (415) 555-0192',
    email: 'concierge@letoile.com',
    openingHours: {
      open: '17:00',
      close: '23:00',
      days: 'Tuesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Pan-Seared Duck Breast à l’Orange', description: 'Heirloom carrots, grand marnier reduction, crispy skin', price: '$48', category: 'Mains', isChefSpecial: true },
      { name: 'Burgundy Truffle Risotto', description: 'Aged acquerello rice, 36-month parmigiano, shaved black winter truffle', price: '$42', category: 'Mains' },
    ],
    ownerId: 'user-owner-1',
    featured: true,
  },
  {
    id: 'rest-2',
    name: 'Sakura Omakase & Robata',
    tagline: 'Master-Crafted Edo-style Sushi and Bincho-tan Grilling',
    description: 'An immersive counter experience bringing Toyosu fish market delicacies, aged sashimi, and sizzling A5 Wagyu robata skewers to an architectural cedar sanctuary.',
    cuisine: 'Japanese Contemporary',
    priceRange: '$$$$',
    rating: 4.8,
    reviewCount: 295,
    address: '88 Waterfront Pier, Marina Boulevard',
    area: 'Embarcadero & Waterfront Pier',
    neighborhood: 'Embarcadero',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7960,
    longitude: -122.3950,
    phone: '+1 (415) 555-0821',
    email: 'info@sakuragrill.com',
    openingHours: {
      open: '17:30',
      close: '22:30',
      days: 'Wednesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: '18-Course Seasonal Omakase', description: 'Chef Kenji selection of aged nigiri and seasonal appetizers', price: '$185', category: 'Chef Tasting', isChefSpecial: true },
      { name: 'Miyazaki A5 Wagyu Robata', description: 'Fresh wasabi stem, smoked sea salt, tare glaze', price: '$72', category: 'Mains', isChefSpecial: true },
    ],
    ownerId: 'user-owner-2',
    featured: true,
  },
  {
    id: 'rest-3',
    name: 'Trattoria Bella Vista',
    tagline: 'Hand-Rolled Pasta & Wood-Fired Tuscan Classics',
    description: 'Warm terracotta rustic charm, hand-pulled burrata, 48-hour fermented sourdough focaccia, and scenic open-air piazza garden seating.',
    cuisine: 'Italian Artisan',
    priceRange: '$$$',
    rating: 4.7,
    reviewCount: 420,
    address: '315 Columbus Avenue',
    area: 'North Beach',
    neighborhood: 'North Beach',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7990,
    longitude: -122.4075,
    phone: '+1 (415) 555-4490',
    email: 'ciao@bellavistasf.com',
    openingHours: {
      open: '12:00',
      close: '22:00',
      days: 'Everyday',
    },
    heroImage: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    menuHighlights: [
      { name: 'Handmade Tagliolini al Tartufo', description: 'Cultured butter, parmigiano reggiano DOP, fresh black truffles', price: '$38', category: 'Mains', isChefSpecial: true },
    ],
    ownerId: 'user-owner-1',
    featured: true,
  },
  {
    id: 'rest-4',
    name: 'The Botanist Garden Kitchen',
    tagline: 'Vibrant Greenhouse Farm-to-Table & Botanical Mixology',
    description: 'Surrounded by lush living walls and skylights, celebrating organic regenerative agriculture, heritage grains, and handcrafted botanical elixirs.',
    cuisine: 'Modern Farm-to-Table',
    priceRange: '$$$',
    rating: 4.8,
    reviewCount: 310,
    address: '710 Mission Street',
    area: 'SoMa Arts District',
    neighborhood: 'SoMa Arts District',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7850,
    longitude: -122.4020,
    phone: '+1 (415) 555-8911',
    email: 'hello@botanistsf.com',
    openingHours: {
      open: '11:30',
      close: '22:00',
      days: 'Tuesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [],
    menuHighlights: [
      { name: 'Charred Heritage Cauliflower Steak', description: 'Green tahini, pomegranate molasses, toasted pine nuts', price: '$29', category: 'Mains' },
    ],
    ownerId: 'user-owner-2',
    featured: false,
  },
  {
    id: 'rest-5',
    name: 'Fuego & Masa Mezcaleria',
    tagline: 'Ancestral Oaxacan Wood-Fire Cuisine & Agave Bar',
    description: 'Hand-pressed heirloom nixtamal tortillas, rich multi-day moles, grilled seafood over mesquite coals, and one of the country’s deepest artisanal mezcal collections.',
    cuisine: 'Contemporary Mexican',
    priceRange: '$$',
    rating: 4.6,
    reviewCount: 260,
    address: '1020 Valencia Street',
    area: 'Mission District',
    neighborhood: 'Mission District',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7590,
    longitude: -122.4215,
    phone: '+1 (415) 555-3377',
    email: 'reservas@fuegomasa.com',
    openingHours: {
      open: '16:00',
      close: '23:30',
      days: 'Monday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [],
    menuHighlights: [
      { name: 'Short Rib Mole Negro', description: 'Slow-braised Prime rib, 32-ingredient Oaxacan chocolate mole', price: '$36', category: 'Mains', isChefSpecial: true },
    ],
    ownerId: 'user-owner-1',
    featured: false,
  },
  {
    id: 'rest-6',
    name: 'Spice Symphony Lounge',
    tagline: 'Progressive Coastal Indian Gastronomy & Craft Cocktails',
    description: 'Elevated spice profiles from the Malabar coast to Kashmir, pairing progressive molecular techniques with aromatic clay tandoor specialties.',
    cuisine: 'Contemporary Indian',
    priceRange: '$$$',
    rating: 4.7,
    reviewCount: 215,
    address: '540 Sutter Street',
    area: 'Union Square',
    neighborhood: 'Union Square',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7890,
    longitude: -122.4070,
    phone: '+1 (415) 555-6612',
    email: 'host@spicesymphony.com',
    openingHours: {
      open: '17:00',
      close: '22:30',
      days: 'Tuesday - Sunday',
    },
    heroImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [],
    menuHighlights: [
      { name: 'Smoked Butter Chicken Roulade', description: 'Sous-vide chicken breast, velvet makhani emulsion, fenugreek dust', price: '$32', category: 'Mains', isChefSpecial: true },
    ],
    ownerId: 'user-owner-2',
    featured: false,
  },
];

export const INITIAL_TABLES: RestaurantTable[] = [
  // L'Étoile Brasserie Tables (rest-1)
  { id: 'tab-1-01', restaurantId: 'rest-1', tableNumber: 'T-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 14, posY: 18, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-02', restaurantId: 'rest-1', tableNumber: 'T-2', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 14, posY: 45, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-03', restaurantId: 'rest-1', tableNumber: 'T-3', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 14, posY: 72, isActive: true, currentStatus: 'available' },
  
  { id: 'tab-1-04', restaurantId: 'rest-1', tableNumber: 'T-4', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 40, posY: 20, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-05', restaurantId: 'rest-1', tableNumber: 'T-5', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 40, posY: 50, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-06', restaurantId: 'rest-1', tableNumber: 'T-6', capacity: 4, minCapacity: 2, seatingType: 'indoor', shape: 'square', posX: 40, posY: 80, isActive: true, currentStatus: 'available' },

  { id: 'tab-1-07', restaurantId: 'rest-1', tableNumber: 'T-7', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 65, posY: 22, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-08', restaurantId: 'rest-1', tableNumber: 'T-8', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 65, posY: 54, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-09', restaurantId: 'rest-1', tableNumber: 'T-9', capacity: 4, minCapacity: 2, seatingType: 'patio', shape: 'round', posX: 65, posY: 82, isActive: true, currentStatus: 'available' },

  { id: 'tab-1-10', restaurantId: 'rest-1', tableNumber: 'T-10', capacity: 8, minCapacity: 6, seatingType: 'private', shape: 'rectangle', posX: 88, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-11', restaurantId: 'rest-1', tableNumber: 'Bar-1', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'round', posX: 88, posY: 62, isActive: true, currentStatus: 'available' },
  { id: 'tab-1-12', restaurantId: 'rest-1', tableNumber: 'Bar-2', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'round', posX: 88, posY: 80, isActive: true, currentStatus: 'available' },

  // Sakura Omakase Tables (rest-2)
  { id: 'tab-2-01', restaurantId: 'rest-2', tableNumber: 'Counter-1', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'rectangle', posX: 20, posY: 25, isActive: true },
  { id: 'tab-2-02', restaurantId: 'rest-2', tableNumber: 'Counter-2', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'rectangle', posX: 20, posY: 55, isActive: true },
  { id: 'tab-2-03', restaurantId: 'rest-2', tableNumber: 'Counter-3', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'rectangle', posX: 20, posY: 80, isActive: true },
  { id: 'tab-2-04', restaurantId: 'rest-2', tableNumber: 'S-4', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 52, posY: 30, isActive: true },
  { id: 'tab-2-05', restaurantId: 'rest-2', tableNumber: 'S-5', capacity: 4, minCapacity: 2, seatingType: 'indoor', shape: 'square', posX: 52, posY: 65, isActive: true },
  { id: 'tab-2-06', restaurantId: 'rest-2', tableNumber: 'S-6', capacity: 6, minCapacity: 4, seatingType: 'window', shape: 'rectangle', posX: 78, posY: 30, isActive: true },
  { id: 'tab-2-07', restaurantId: 'rest-2', tableNumber: 'VIP-Tatami', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 78, posY: 70, isActive: true },

  // Bella Vista Tables (rest-3)
  { id: 'tab-3-01', restaurantId: 'rest-3', tableNumber: 'B-1', capacity: 2, minCapacity: 1, seatingType: 'patio', shape: 'round', posX: 18, posY: 22, isActive: true },
  { id: 'tab-3-02', restaurantId: 'rest-3', tableNumber: 'B-2', capacity: 2, minCapacity: 1, seatingType: 'patio', shape: 'round', posX: 18, posY: 52, isActive: true },
  { id: 'tab-3-03', restaurantId: 'rest-3', tableNumber: 'B-3', capacity: 4, minCapacity: 2, seatingType: 'patio', shape: 'round', posX: 18, posY: 80, isActive: true },
  { id: 'tab-3-04', restaurantId: 'rest-3', tableNumber: 'B-4', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 48, posY: 30, isActive: true },
  { id: 'tab-3-05', restaurantId: 'rest-3', tableNumber: 'B-5', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 48, posY: 65, isActive: true },
  { id: 'tab-3-06', restaurantId: 'rest-3', tableNumber: 'B-6', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 78, posY: 45, isActive: true },

  // Aditya Royal Spice Pavilion Tables (rest-surampalem-1)
  { id: 'tab-s1-01', restaurantId: 'rest-surampalem-1', tableNumber: 'A-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 16, posY: 20, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-02', restaurantId: 'rest-surampalem-1', tableNumber: 'A-2', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 16, posY: 50, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-03', restaurantId: 'rest-surampalem-1', tableNumber: 'A-3', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 42, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-04', restaurantId: 'rest-surampalem-1', tableNumber: 'A-4', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 42, posY: 55, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-05', restaurantId: 'rest-surampalem-1', tableNumber: 'A-5', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 70, posY: 30, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-06', restaurantId: 'rest-surampalem-1', tableNumber: 'A-6', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 70, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-s1-07', restaurantId: 'rest-surampalem-1', tableNumber: 'Courtyard-1', capacity: 4, minCapacity: 2, seatingType: 'patio', shape: 'round', posX: 88, posY: 40, isActive: true, currentStatus: 'available' },

  // Surampalem Bistro Tables (rest-surampalem-2)
  { id: 'tab-s2-01', restaurantId: 'rest-surampalem-2', tableNumber: 'Terrace-1', capacity: 2, minCapacity: 1, seatingType: 'patio', shape: 'round', posX: 18, posY: 22, isActive: true, currentStatus: 'available' },
  { id: 'tab-s2-02', restaurantId: 'rest-surampalem-2', tableNumber: 'Terrace-2', capacity: 4, minCapacity: 2, seatingType: 'patio', shape: 'round', posX: 18, posY: 55, isActive: true, currentStatus: 'available' },
  { id: 'tab-s2-03', restaurantId: 'rest-surampalem-2', tableNumber: 'Garden-3', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 45, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-s2-04', restaurantId: 'rest-surampalem-2', tableNumber: 'Garden-4', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 45, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-s2-05', restaurantId: 'rest-surampalem-2', tableNumber: 'Bistro-5', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 75, posY: 30, isActive: true, currentStatus: 'available' },
  { id: 'tab-s2-06', restaurantId: 'rest-surampalem-2', tableNumber: 'VIP-Lounge', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 75, posY: 68, isActive: true, currentStatus: 'available' },

  // The Godavari Heritage Tables (rest-surampalem-3)
  { id: 'tab-s3-01', restaurantId: 'rest-surampalem-3', tableNumber: 'G-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-s3-02', restaurantId: 'rest-surampalem-3', tableNumber: 'G-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 20, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-s3-03', restaurantId: 'rest-surampalem-3', tableNumber: 'G-3', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 50, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-s3-04', restaurantId: 'rest-surampalem-3', tableNumber: 'G-4', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 50, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-s3-05', restaurantId: 'rest-surampalem-3', tableNumber: 'Royal-Thali-1', capacity: 8, minCapacity: 6, seatingType: 'private', shape: 'rectangle', posX: 80, posY: 45, isActive: true, currentStatus: 'available' },

  // Bayleaf Kakinada Tables (rest-kakinada-1)
  { id: 'tab-k1-01', restaurantId: 'rest-kakinada-1', tableNumber: 'Coast-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-k1-02', restaurantId: 'rest-kakinada-1', tableNumber: 'Coast-2', capacity: 4, minCapacity: 2, seatingType: 'window', shape: 'rectangle', posX: 20, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-k1-03', restaurantId: 'rest-kakinada-1', tableNumber: 'Robata-3', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 52, posY: 30, isActive: true, currentStatus: 'available' },
  { id: 'tab-k1-04', restaurantId: 'rest-kakinada-1', tableNumber: 'SeaBreeze-4', capacity: 6, minCapacity: 4, seatingType: 'patio', shape: 'rectangle', posX: 52, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-k1-05', restaurantId: 'rest-kakinada-1', tableNumber: 'Captain-Deck', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 80, posY: 45, isActive: true, currentStatus: 'available' },

  // Jewel of Nizam - The Minar Tables (rest-hyderabad-1)
  { id: 'tab-hyd1-01', restaurantId: 'rest-hyderabad-1', tableNumber: 'Minar-Sky-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 16, posY: 20, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd1-02', restaurantId: 'rest-hyderabad-1', tableNumber: 'Minar-Sky-2', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 16, posY: 55, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd1-03', restaurantId: 'rest-hyderabad-1', tableNumber: 'Nizam-Booth-3', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 45, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd1-04', restaurantId: 'rest-hyderabad-1', tableNumber: 'Nizam-Booth-4', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 45, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd1-05', restaurantId: 'rest-hyderabad-1', tableNumber: 'LakeView-5', capacity: 6, minCapacity: 4, seatingType: 'window', shape: 'rectangle', posX: 75, posY: 30, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd1-06', restaurantId: 'rest-hyderabad-1', tableNumber: 'Royal-Durbar', capacity: 8, minCapacity: 6, seatingType: 'private', shape: 'rectangle', posX: 75, posY: 68, isActive: true, currentStatus: 'available' },

  // Paradise Heritage Biryani Tables (rest-hyderabad-2)
  { id: 'tab-hyd2-01', restaurantId: 'rest-hyderabad-2', tableNumber: 'Cyber-1', capacity: 2, minCapacity: 1, seatingType: 'indoor', shape: 'round', posX: 18, posY: 22, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd2-02', restaurantId: 'rest-hyderabad-2', tableNumber: 'Cyber-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 18, posY: 58, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd2-03', restaurantId: 'rest-hyderabad-2', tableNumber: 'Dum-Table-3', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 48, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd2-04', restaurantId: 'rest-hyderabad-2', tableNumber: 'Dum-Table-4', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 48, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd2-05', restaurantId: 'rest-hyderabad-2', tableNumber: 'Family-Feast-1', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 80, posY: 45, isActive: true, currentStatus: 'available' },

  // Dakshin Coastal Tables (rest-hyderabad-3)
  { id: 'tab-hyd3-01', restaurantId: 'rest-hyderabad-3', tableNumber: 'Deccan-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd3-02', restaurantId: 'rest-hyderabad-3', tableNumber: 'Deccan-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 20, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd3-03', restaurantId: 'rest-hyderabad-3', tableNumber: 'Jubilee-3', capacity: 4, minCapacity: 3, seatingType: 'booth', shape: 'rectangle', posX: 50, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd3-04', restaurantId: 'rest-hyderabad-3', tableNumber: 'Jubilee-4', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 50, posY: 65, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd3-05', restaurantId: 'rest-hyderabad-3', tableNumber: 'Temple-Sanctuary', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 80, posY: 45, isActive: true, currentStatus: 'available' },

  // The Olive Bistro Tables (rest-hyderabad-4)
  { id: 'tab-hyd4-01', restaurantId: 'rest-hyderabad-4', tableNumber: 'LakeTerrace-1', capacity: 2, minCapacity: 1, seatingType: 'patio', shape: 'round', posX: 18, posY: 22, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd4-02', restaurantId: 'rest-hyderabad-4', tableNumber: 'LakeTerrace-2', capacity: 2, minCapacity: 1, seatingType: 'patio', shape: 'round', posX: 18, posY: 55, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd4-03', restaurantId: 'rest-hyderabad-4', tableNumber: 'Olive-Garden-3', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 45, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd4-04', restaurantId: 'rest-hyderabad-4', tableNumber: 'Olive-Garden-4', capacity: 4, minCapacity: 2, seatingType: 'indoor', shape: 'rectangle', posX: 45, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd4-05', restaurantId: 'rest-hyderabad-4', tableNumber: 'Sunset-Piazza', capacity: 6, minCapacity: 4, seatingType: 'patio', shape: 'rectangle', posX: 75, posY: 35, isActive: true, currentStatus: 'available' },
  { id: 'tab-hyd4-06', restaurantId: 'rest-hyderabad-4', tableNumber: 'VIP-Pergola', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 75, posY: 70, isActive: true, currentStatus: 'available' },

  // The Botanist Tables (rest-4)
  { id: 'tab-4-01', restaurantId: 'rest-4', tableNumber: 'Greenhouse-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-4-02', restaurantId: 'rest-4', tableNumber: 'Greenhouse-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 20, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-4-03', restaurantId: 'rest-4', tableNumber: 'Garden-3', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 50, posY: 45, isActive: true, currentStatus: 'available' },

  // Fuego & Masa Tables (rest-5)
  { id: 'tab-5-01', restaurantId: 'rest-5', tableNumber: 'Mezcal-1', capacity: 2, minCapacity: 1, seatingType: 'bar', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-5-02', restaurantId: 'rest-5', tableNumber: 'Agave-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 20, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-5-03', restaurantId: 'rest-5', tableNumber: 'Oaxacan-3', capacity: 6, minCapacity: 4, seatingType: 'indoor', shape: 'rectangle', posX: 50, posY: 45, isActive: true, currentStatus: 'available' },

  // Spice Symphony Tables (rest-6)
  { id: 'tab-6-01', restaurantId: 'rest-6', tableNumber: 'Symphony-1', capacity: 2, minCapacity: 1, seatingType: 'window', shape: 'round', posX: 20, posY: 25, isActive: true, currentStatus: 'available' },
  { id: 'tab-6-02', restaurantId: 'rest-6', tableNumber: 'Symphony-2', capacity: 4, minCapacity: 2, seatingType: 'booth', shape: 'rectangle', posX: 20, posY: 60, isActive: true, currentStatus: 'available' },
  { id: 'tab-6-03', restaurantId: 'rest-6', tableNumber: 'Tandoor-VIP', capacity: 8, minCapacity: 5, seatingType: 'private', shape: 'rectangle', posX: 50, posY: 45, isActive: true, currentStatus: 'available' },
];

export interface PresetLocation {
  id: string;
  name: string;
  area: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  restaurantCount: number;
  popularCuisines: string[];
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    id: 'loc-hyderabad',
    name: 'Hyderabad',
    area: 'Hitec City, Jubilee Hills & Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4435,
    longitude: 78.3772,
    restaurantCount: 4,
    popularCuisines: ['Royal Hyderabadi', 'Dum Biryani', 'Deccan Gourmet', 'Mediterranean'],
  },
  {
    id: 'loc-surampalem',
    name: 'Surampalem',
    area: 'Aditya Educational City / ADB Road',
    city: 'Surampalem',
    state: 'Andhra Pradesh',
    latitude: 17.0863,
    longitude: 82.0620,
    restaurantCount: 3,
    popularCuisines: ['Coastal Andhra', 'Tandoori', 'Garden Café'],
  },
  {
    id: 'loc-kakinada',
    name: 'Kakinada',
    area: 'Bhanugudi Junction & Coastal Road',
    city: 'Kakinada',
    state: 'Andhra Pradesh',
    latitude: 16.9891,
    longitude: 82.2475,
    restaurantCount: 1,
    popularCuisines: ['Coastal Seafood', 'Robata Grills'],
  },
  {
    id: 'loc-rajahmundry',
    name: 'Rajahmundry',
    area: 'Godavari Riverfront & Danavaipeta',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    latitude: 17.0005,
    longitude: 81.8040,
    restaurantCount: 3, // within regional proximity
    popularCuisines: ['Andhra Thalis', 'Freshwater Catch'],
  },
  {
    id: 'loc-sf-downtown',
    name: 'San Francisco Downtown',
    area: 'Financial District & Union Square',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7915,
    longitude: -122.4010,
    restaurantCount: 6,
    popularCuisines: ['French Fine Dining', 'Japanese Omakase', 'Italian Artisan'],
  },
  {
    id: 'loc-sf-waterfront',
    name: 'San Francisco Waterfront',
    area: 'Embarcadero & North Beach',
    city: 'San Francisco',
    state: 'California',
    latitude: 37.7980,
    longitude: -122.4050,
    restaurantCount: 2,
    popularCuisines: ['Japanese Omakase', 'Italian Artisan'],
  },
];

// Haversine distance calculator in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm} km away`;
}

/**
 * Robust Location-based Restaurant Filter:
 * Ensures restaurant results strictly belong to the selected location.
 * - If Hyderabad is selected -> returns only Hyderabad restaurants (never Surampalem or others)
 * - If Surampalem is selected -> returns only Surampalem / Kakinada-area regional restaurants (never Hyderabad)
 * - If current location is used -> filters within configured search radius based on coordinates
 * - If location has no restaurants -> returns false (proper empty state)
 */
import { UserLocation } from '../types';

export function filterRestaurantByLocation(
  restaurant: Restaurant,
  userLocation: UserLocation | null,
  searchRadiusKm: number = 25
): boolean {
  if (!userLocation) return true; // Show all when no location filter is active

  // 1. Current Location mode: calculate coordinate distance within radius
  if (userLocation.mode === 'current') {
    if (restaurant.latitude === undefined || restaurant.longitude === undefined) return false;
    const dist = calculateDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      restaurant.latitude,
      restaurant.longitude
    );
    const maxRadius = searchRadiusKm > 0 ? searchRadiusKm : 50;
    return dist <= maxRadius;
  }

  // 2. Preset or Manual Location mode: filter by selected city/area
  const targetCity = (userLocation.city || '').toLowerCase().trim();
  const targetArea = (userLocation.area || '').toLowerCase().trim();
  const targetLabel = (userLocation.label || '').toLowerCase().trim();

  // Check for Hyderabad
  const isHyderabad =
    targetCity === 'hyderabad' ||
    targetLabel.includes('hyderabad') ||
    targetArea.includes('hyderabad') ||
    targetLabel.includes('hitec') ||
    targetLabel.includes('banjara') ||
    targetLabel.includes('jubilee') ||
    targetLabel.includes('gandipet') ||
    targetLabel.includes('madhapur');

  if (isHyderabad) {
    return restaurant.city.toLowerCase() === 'hyderabad';
  }

  // Check for Surampalem (show Surampalem and regional Kakinada)
  const isSurampalem =
    targetCity === 'surampalem' ||
    targetLabel.includes('surampalem') ||
    targetArea.includes('surampalem') ||
    targetLabel.includes('aditya') ||
    targetLabel.includes('adb');

  if (isSurampalem) {
    return (
      restaurant.city.toLowerCase() === 'surampalem' ||
      restaurant.city.toLowerCase() === 'kakinada'
    );
  }

  // Check for Kakinada
  const isKakinada =
    targetCity === 'kakinada' ||
    targetLabel.includes('kakinada') ||
    targetArea.includes('kakinada') ||
    targetLabel.includes('bhanugudi');

  if (isKakinada) {
    return (
      restaurant.city.toLowerCase() === 'kakinada' ||
      restaurant.city.toLowerCase() === 'surampalem'
    );
  }

  // Check for San Francisco
  const isSF =
    targetCity === 'san francisco' ||
    targetLabel.includes('san francisco') ||
    targetLabel.includes('sf') ||
    targetArea.includes('san francisco') ||
    targetArea.includes('soma') ||
    targetArea.includes('mission');

  if (isSF) {
    return restaurant.city.toLowerCase() === 'san francisco';
  }

  // General fallback for manual searches: match structured city, area, state, or neighborhood
  const restCity = restaurant.city.toLowerCase();
  const restArea = restaurant.area.toLowerCase();
  const restNeighborhood = restaurant.neighborhood.toLowerCase();
  const restState = restaurant.state.toLowerCase();

  if (targetCity && restCity.includes(targetCity)) return true;
  if (targetArea && restArea.includes(targetArea)) return true;

  const words = targetLabel.split(/[\s,]+/).filter((w) => w.length > 2);
  return words.some(
    (w) =>
      restCity.includes(w) ||
      restArea.includes(w) ||
      restNeighborhood.includes(w) ||
      restState.includes(w)
  );
}

export const getTodayDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getTomorrowDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    reservationCode: 'TM-74291',
    restaurantId: 'rest-1',
    restaurantName: "L'Étoile Brasserie & Lounge",
    tableId: 'tab-1-04',
    tableNumber: 'T-4',
    customerId: 'user-cust-1',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    customerPhone: '+1 (555) 234-8891',
    date: getTodayDateString(),
    time: '19:00',
    durationMinutes: 90,
    guestCount: 4,
    seatingPreference: 'booth',
    specialRequests: 'Celebrating wedding anniversary. Quiet table appreciated.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiAssisted: true,
  },
  {
    id: 'res-102',
    reservationCode: 'TM-88210',
    restaurantId: 'rest-1',
    restaurantName: "L'Étoile Brasserie & Lounge",
    tableId: 'tab-1-01',
    tableNumber: 'T-1',
    customerId: 'cust-sarah',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 442-9988',
    date: getTodayDateString(),
    time: '19:30',
    durationMinutes: 90,
    guestCount: 2,
    seatingPreference: 'window',
    specialRequests: 'Window seat for skyline view.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    aiAssisted: false,
  },
  {
    id: 'res-103',
    reservationCode: 'TM-91544',
    restaurantId: 'rest-1',
    restaurantName: "L'Étoile Brasserie & Lounge",
    tableId: 'tab-1-07',
    tableNumber: 'T-7',
    customerId: 'cust-david',
    customerName: 'David Chen',
    customerEmail: 'dchen@corporate.com',
    customerPhone: '+1 (555) 662-1190',
    date: getTodayDateString(),
    time: '20:00',
    durationMinutes: 90,
    guestCount: 6,
    seatingPreference: 'indoor',
    specialRequests: 'Client dinner, pre-selected Burgundy wine.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'res-104',
    reservationCode: 'TM-63112',
    restaurantId: 'rest-1',
    restaurantName: "L'Étoile Brasserie & Lounge",
    tableId: 'tab-1-05',
    tableNumber: 'T-5',
    customerId: 'cust-emma',
    customerName: 'Emma Watson',
    customerEmail: 'emma.w@example.com',
    customerPhone: '+1 (555) 771-3342',
    date: getTodayDateString(),
    time: '17:30',
    durationMinutes: 90,
    guestCount: 4,
    seatingPreference: 'booth',
    status: 'completed',
    createdAt: new Date(Date.now() - 95000000).toISOString(),
  },
  {
    id: 'res-105',
    reservationCode: 'TM-55910',
    restaurantId: 'rest-2',
    restaurantName: 'Sakura Omakase & Robata',
    tableId: 'tab-2-01',
    tableNumber: 'Counter-1',
    customerId: 'user-cust-1',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    customerPhone: '+1 (555) 234-8891',
    date: getTomorrowDateString(),
    time: '18:30',
    durationMinutes: 90,
    guestCount: 2,
    seatingPreference: 'bar',
    specialRequests: 'No shellfish allergy.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    aiAssisted: true,
  },
];
