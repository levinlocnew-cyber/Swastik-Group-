import { Property, Testimonial, TeamMember } from './types';

export const LUCKNOW_LOCALITIES = [
  'Gomti Nagar',
  'Gomti Nagar Extension',
  'Hazratganj',
  'Shaheed Path',
  'Sultanpur Road',
  'Aliganj',
  'Indira Nagar',
  'Vrindavan Yojna',
  'Jankipuram'
];

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-1',
    name: 'Swastik Royal Orchid Villas',
    category: 'villa',
    type: 'buy',
    price: 28500000,
    priceFormatted: '₹2.85 Cr',
    location: 'Gomti Nagar Extension',
    address: 'Sector 6, Near Janeshwar Mishra Park, Gomti Nagar Extension, Lucknow',
    area: '3,200 sq.ft.',
    bedrooms: 4,
    bathrooms: 5,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613977257592-4871e5fdd7c0?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    status: 'Ready to Move',
    description: 'Swastik Royal Orchid Villas offer the pinnacle of luxurious living in Lucknow. Situated near the lush Janeshwar Mishra Park, these standalone 4 BHK triplex villas boast private landscaped gardens, premium Italian marble flooring, modern smart-home automation, and private parking. Experience high-society community living with round-the-clock five-tier security and elite neighbors.',
    amenities: ['Private Garden', 'Smart Home Integration', 'Clubhouse Access', '24/7 Security', 'Swimming Pool', 'Modular Kitchen', 'Power Backup'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ873615',
    agent: {
      name: 'Amit Tripathi',
      role: 'Senior Sales Director',
      phone: '+91 89532 11182',
      email: 'amit@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-2',
    name: 'Swastik Elevate Residency',
    category: 'apartment',
    type: 'buy',
    price: 13500000,
    priceFormatted: '₹1.35 Cr',
    location: 'Hazratganj',
    address: 'Shahnajaf Road, Near Hazratganj Metro Station, Lucknow',
    area: '1,850 sq.ft.',
    bedrooms: 3,
    bathrooms: 3,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    status: 'Ready to Move',
    description: 'Live in the heart of classic Lucknow. Swastik Elevate Residency brings high-rise luxury to Hazratganj. Featuring architectural elements inspired by the Awadhi heritage combined with modern high-rise technology, this 3 BHK flat offers spectacular views of the Lucknow cityscape and the Gomti River. Finished with high-quality woodwork, false ceilings, and ultra-premium fixtures.',
    amenities: ['Gymnasium', 'High-speed Elevators', 'Indoor Games Arena', 'Piped Gas Line', 'Covered Parking', 'Intercom Facility', 'Rooftop Lounge'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ442211',
    agent: {
      name: 'Rohan Mehra',
      role: 'Residential Sales Lead',
      phone: '+91 89532 11182',
      email: 'rohan@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-3',
    name: 'Swastik Skyline Corporate Plaza',
    category: 'commercial',
    type: 'buy',
    price: 42000000,
    priceFormatted: '₹4.20 Cr',
    location: 'Shaheed Path',
    address: 'Cyber Greens, Outer Ring Road Interchange, Shaheed Path, Lucknow',
    area: '5,000 sq.ft.',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    status: 'Under Construction',
    description: 'Swastik Skyline Corporate Plaza is the ultimate fast-appreciating business space on Shaheed Path. Best suited for high-end IT offices, premium corporate branches, or multi-brand showrooms. The building features double-glazed glass facades, grand central atrium, centralized VRV air-conditioning systems, smart building management, and high retail footfalls guaranteed.',
    amenities: ['Valet Parking', 'Central AC', 'High-speed Fiber Optic', 'Conference Center', 'Cafeteria', 'Fire Sprinkler Systems'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ119933',
    agent: {
      name: 'Amit Tripathi',
      role: 'Senior Sales Director',
      phone: '+91 89532 11182',
      email: 'amit@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-4',
    name: 'Swastik Golden Meadows (Plots)',
    category: 'plot',
    type: 'buy',
    price: 4800000,
    priceFormatted: '₹48 Lakhs',
    location: 'Sultanpur Road',
    address: 'Swastik Township Main Entrance, Sultanpur Road Expressway, Lucknow',
    area: '1,500 sq.ft.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    status: 'Newly Launched',
    description: 'Swastik Golden Meadows is an exquisite, fully-gated township plot ecosystem. Ideal for constructing your dream residential villa or investing for spectacular future appreciation. Strategically close to Purvanchal Expressway start and the Outer Ring Road, Lucknow. Features wide tarmac roads, pre-installed sewerage, underground cabling, and beautifully landscaped security gates.',
    amenities: ['Black Carpet Roads', 'Gated Community Security', 'Storm Water Drainage', 'Sewerage Water Treatment', 'Jogging Tracks', 'Street Lighting'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ334415',
    agent: {
      name: 'Priya Sharma',
      role: 'Land & Investment Specialist',
      phone: '+91 89532 11182',
      email: 'priya@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-5',
    name: 'Swastik Majestic Park Suite',
    category: 'apartment',
    type: 'buy',
    price: 8800000,
    priceFormatted: '₹88 Lakhs',
    location: 'Vrindavan Yojna',
    address: 'Sector 10A, Near SGPGI Crossing, Vrindavan Yojna, Lucknow',
    area: '1,450 sq.ft.',
    bedrooms: 2,
    bathrooms: 2,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    status: 'Under Construction',
    description: 'Enjoy smart and compact luxury. Swastik Majestic Park Suite features modern architectural geometry, ensuring maximize natural light and cross-ventilation in every room. Perfectly located on Vrindavan Yojna, with rapid connectivity to SGPGI, Airport, and central Hazratganj. Comes equipped with luxury bathroom fittings and double glazed soundproof windows.',
    amenities: ['Power Backup', 'Water Harvesting System', 'Children Play Zone', 'Community Hall', 'Jogging Track', 'CCTV Protection'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ445582',
    agent: {
      name: 'Rohan Mehra',
      role: 'Residential Sales Lead',
      phone: '+91 89532 11182',
      email: 'rohan@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-6',
    name: 'Exquisite Aliganj Villa',
    category: 'villa',
    type: 'buy',
    price: 35000000,
    priceFormatted: '₹3.50 Cr',
    location: 'Aliganj',
    address: 'Sector B, Kapoorthala Road, Lucknow',
    area: '4,100 sq.ft.',
    bedrooms: 5,
    bathrooms: 5,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    status: 'Resale',
    description: 'An architectural masterwork in posh Aliganj. This luxury 5 BHK resale villa has been meticulously upgraded with double height drawing room ceilings, imported woodwork, glass railing balconies, external natural stone wall elements, and a private terrace bar setup. Situated within walking distance to premium markets and renowned Lucknow educational spots.',
    amenities: ['Modular Kitchen', 'Servant Quarter', 'Private Terrace Bar', 'Vastu Compliant', 'Four Car Parking Space', 'Lush lawns'],
    reraApproved: false, // Old title build
    agent: {
      name: 'Priya Sharma',
      role: 'Land & Investment Specialist',
      phone: '+91 89532 11182',
      email: 'priya@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-7',
    name: 'Gomti Nagar Premium Office Suite',
    category: 'commercial',
    type: 'rent',
    price: 65000,
    priceFormatted: '₹65,000 / mo',
    location: 'Gomti Nagar',
    address: 'TC-54V, Vibhuti Khand, Lucknow',
    area: '1,200 sq.ft.',
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: true,
    status: 'For Rent',
    description: 'Fully furnished ultra-modern office suite in Vibhuti Khand, Lucknow\'s premium commercial hub. Setup includes 14 brand-new workstations, luxury glass-walled CEO cabin, a modular conference room for 8, secure server racks, pre-fitted multi-split air conditioning systems, and dynamic reception desk. Power backup and building security included.',
    amenities: ['100% Power Backup', 'Acoustic Soundproofing', 'Furnished Desks', 'Fiber Optic Ready', 'Pantry & Cafeteria', 'Centralized Security'],
    reraApproved: false,
    agent: {
      name: 'Amit Tripathi',
      role: 'Senior Sales Director',
      phone: '+91 89532 11182',
      email: 'amit@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-8',
    name: 'Luxury Apartment At Vrindavan Yojna',
    category: 'apartment',
    type: 'rent',
    price: 32000,
    priceFormatted: '₹32,000 / mo',
    location: 'Vrindavan Yojna',
    address: 'Signature Elite Block D, Vrindavan Yojna, Lucknow',
    area: '1,650 sq.ft.',
    bedrooms: 3,
    bathrooms: 3,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    status: 'For Rent',
    description: 'Spacious and semi-furnished 3 BHK flat ready for immediate lease. Located in the popular Signature Elite society on Vrindavan Yojna. Comes with modular chimneys, heavy-duty built-in wardrobes, geysers, dual balconies overlooking central manicured gardens, active car canopy parking, and high-frequency elevator security cards.',
    amenities: ['Clubhouse & Pool', 'Central Park View', 'Jogging Path', 'Piped Gas', 'In-unit Laundry room', '24/7 Security Patrol'],
    reraApproved: true,
    reraNumber: 'UPRERAPRJ234509',
    agent: {
      name: 'Rohan Mehra',
      role: 'Residential Sales Lead',
      phone: '+91 89532 11182',
      email: 'rohan@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  },
  {
    id: 'prop-9',
    name: 'Executive Studio Penthouse',
    category: 'apartment',
    type: 'rent',
    price: 24000,
    priceFormatted: '₹24,000 / mo',
    location: 'Gomti Nagar',
    address: 'C-72, Patrakar Puram Crossing, Gomti Nagar, Lucknow',
    area: '900 sq.ft.',
    bedrooms: 1,
    bathrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200'
    ],
    featured: false,
    status: 'For Rent',
    description: 'Perfect for working couples, regional business directors, or medical practitioners. This elegant fully-furnished studio penthouse is nested in central Patrakar Puram. Highlights an expansive private terrace offering beautiful evening views, sleek ultra-modern modular kitchen, plush king bed, complete linen setups, washer-dryer, and high-performance climate control.',
    amenities: ['Fully Furnished', 'Private Sky Terrace', 'High-speed Wi-Fi', 'Smart LED TV', 'Concierge Service', 'CCTV System'],
    reraApproved: false,
    agent: {
      name: 'Rohan Mehra',
      role: 'Residential Sales Lead',
      phone: '+91 89532 11182',
      email: 'rohan@swastikgrouplko.com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    }
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Vijay Kumar Mishra',
    role: 'Retired Government Officer',
    rating: 5,
    review: 'Swastik Group helped me acquire my luxury retirement villa in Gomti Nagar Extension. Their documentation assistance was incredibly structured. They handled the land allotment checking and registry hassle-free. Best real estate company in Lucknow!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    date: 'April 2026'
  },
  {
    id: 'test-2',
    name: 'Dr. Shruti Srivastav',
    role: 'SGPGI Senior Specialist Specialist',
    rating: 5,
    review: 'Renting a premium property near SGPGI through Swastik Group was super quick. They found a modern semi-furnished flat in Vrindavan Yojna that perfectly matched my shifts. Extremely professional, prompt, and highly recommended!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    date: 'May 2026'
  },
  {
    id: 'test-3',
    name: 'Shashank Rastogi',
    role: 'Founder, Awadh Tech Labs',
    rating: 5,
    review: 'Our corporate office search on Shaheed Path ended with the beautiful office suite suggested by Amit Tripathi. Real, actual verified listing with clear commercial terms. Highly trustworthy local knowledge.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    date: 'June 2026'
  }
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Amit Tripathi',
    role: 'Senior Sales Director & Partner',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=450',
    experience: '14+ Years in Lucknow Real Estate'
  },
  {
    id: 'team-2',
    name: 'Priya Sharma',
    role: 'Land & Investment Specialist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=450',
    experience: '8+ Years in Commercial Valuations'
  },
  {
    id: 'team-3',
    name: 'Rohan Mehra',
    role: 'Residential Sales Lead',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=450',
    experience: '6+ Years in Luxury Appraisals'
  }
];

export const OFFICE_CONTACT = {
  address: 'Beg tower, Shield Defence Academy Boy, Near Lekhraj Metro Station, Indiranagar, Lucknow, Uttar- Pradesh',
  phone: '+91 89532 11182',
  phoneSec: '+91 89532 11182',
  whatsapp: '+918953211182',
  email: 'info@swastikgrouplko.com',
  timings: 'Monday - Saturday: 10:00 AM - 7:30 PM (Sunday Closed)',
  gmapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.62933939632!2d80.9996614407842!3d26.866750371694677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be293b6e828a5%3A0x6e90e44efb65fd38!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1718037320000!5m2!1sen!2sin'
};
