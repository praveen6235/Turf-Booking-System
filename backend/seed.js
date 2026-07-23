const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Turf = require('./src/models/Turf');
const User = require('./src/models/User');

dotenv.config();

const turfs = [
  // Mumbai Turfs
  {
    name: 'Kicks & Sticks Arena',
    description: 'A premium 5v5 and 7v7 football and cricket turf with FIFA-approved artificial grass. Located in the heart of the city with amazing floodlights.',
    location: { address: 'Andheri West', city: 'Mumbai', state: 'MH', zip: '400053' },
    pricePerHour: 1500,
    images: ['https://images.unsplash.com/photo-1574629810360-7efbb9886407?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Washroom', 'Parking', 'Bibs & Ball', 'Seating Area'],
    sports: ['Football', 'Cricket'],
    isApproved: true
  },
  {
    name: 'Bandra Box Cricket & Turf',
    description: 'The perfect spot for late-night Box Cricket tournaments. Covered netting to prevent ball loss, and premium floodlights.',
    location: { address: 'Bandra Kurla Complex', city: 'Mumbai', state: 'MH', zip: '400051' },
    pricePerHour: 2000,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Washroom', 'Valet Parking', 'Canteen'],
    sports: ['Cricket', 'Football'],
    isApproved: true
  },
  {
    name: 'Juhu Sports Club',
    description: 'Elite multi-sport facility facing the sea. Premium tennis and basketball courts.',
    location: { address: 'Juhu Tara Road', city: 'Mumbai', state: 'MH', zip: '400049' },
    pricePerHour: 2500,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Locker Room', 'Shower', 'Cafe', 'Parking'],
    sports: ['Tennis', 'Basketball'],
    isApproved: true
  },
  {
    name: 'Andheri West Football Ground',
    description: 'Large 11-a-side natural grass ground perfect for professional matches and corporate events.',
    location: { address: 'Lokhandwala', city: 'Mumbai', state: 'MH', zip: '400053' },
    pricePerHour: 3500,
    images: ['https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Seating Area', 'Washroom', 'First Aid'],
    sports: ['Football'],
    isApproved: true
  },
  {
    name: 'Powai Turf Park',
    description: 'Scenic turf surrounded by greenery. Ideal for evening football and cricket matches.',
    location: { address: 'Powai', city: 'Mumbai', state: 'MH', zip: '400076' },
    pricePerHour: 1800,
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Parking', 'Water Cooler', 'Seating Area'],
    sports: ['Football', 'Cricket'],
    isApproved: true
  },
  {
    name: 'Marine Drive Tennis Courts',
    description: 'Open-air hard courts with an ocean view. Great for early morning sessions.',
    location: { address: 'Marine Drive', city: 'Mumbai', state: 'MH', zip: '400020' },
    pricePerHour: 1200,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Seating Area', 'Washroom'],
    sports: ['Tennis'],
    isApproved: true
  },
  
  // Bengaluru Turfs
  {
    name: 'Smash Tennis & Badminton Club',
    description: 'Professional grade synthetic courts for Tennis and Badminton. Ideal for coaching, tournaments, or casual matches with friends.',
    location: { address: 'Koramangala', city: 'Bangalore', state: 'KA', zip: '560034' },
    pricePerHour: 800,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Locker Room', 'Water Cooler', 'Equipment Rent', 'Parking'],
    sports: ['Tennis', 'Badminton'],
    isApproved: true
  },
  {
    name: 'Whitefield Sports Arena',
    description: 'A massive multi-sport arena offering an 11-a-side football ground and 3 separate cricket nets.',
    location: { address: 'Whitefield', city: 'Bangalore', state: 'KA', zip: '560066' },
    pricePerHour: 2500,
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Shower', 'Locker Room', 'Cafe', 'Large Parking'],
    sports: ['Football', 'Cricket'],
    isApproved: true
  },
  {
    name: 'Koramangala Play Zone',
    description: 'A top-rated indoor box cricket and futsal arena.',
    location: { address: 'Koramangala 4th Block', city: 'Bangalore', state: 'KA', zip: '560034' },
    pricePerHour: 1400,
    images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Indoor', 'AC', 'Canteen', 'Washroom'],
    sports: ['Cricket', 'Football'],
    isApproved: true
  },
  {
    name: 'Indiranagar Futsal',
    description: 'Premium FIFA certified turf specifically meant for 5v5 futsal.',
    location: { address: 'Indiranagar', city: 'Bangalore', state: 'KA', zip: '560038' },
    pricePerHour: 1600,
    images: ['https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Seating Area', 'Parking'],
    sports: ['Football'],
    isApproved: true
  },
  {
    name: 'HSR Layout Cricket Box',
    description: 'Dedicated cricket nets with automated bowling machines and speed trackers.',
    location: { address: 'HSR Layout Sector 2', city: 'Bangalore', state: 'KA', zip: '560102' },
    pricePerHour: 1000,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Bowling Machine', 'Washroom', 'Water Cooler'],
    sports: ['Cricket'],
    isApproved: true
  },
  {
    name: 'Marathahalli Sports Center',
    description: 'Multi-sport complex featuring synthetic tennis courts and indoor basketball.',
    location: { address: 'Marathahalli', city: 'Bangalore', state: 'KA', zip: '560037' },
    pricePerHour: 1500,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Locker Room', 'Shower', 'Parking'],
    sports: ['Tennis', 'Basketball'],
    isApproved: true
  },

  // Hyderabad Turfs
  {
    name: 'Urban Box Cricket',
    description: 'Covered rooftop box cricket arena. Play anytime, regardless of rain or sun. Comes with automated bowling machines.',
    location: { address: 'Banjara Hills', city: 'Hyderabad', state: 'TS', zip: '500034' },
    pricePerHour: 1200,
    images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Rooftop', 'Bowling Machine', 'Canteen', 'Washroom'],
    sports: ['Cricket'],
    isApproved: true
  },
  {
    name: 'Hitech City Futsal Park',
    description: 'A dedicated 5v5 futsal court with shock-pad underlay. Designed to prevent injuries and provide a fast-paced game.',
    location: { address: 'Madhapur', city: 'Hyderabad', state: 'TS', zip: '500081' },
    pricePerHour: 1800,
    images: ['https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Shock-pad', 'Floodlights', 'Washroom', 'First Aid'],
    sports: ['Football'],
    isApproved: true
  },
  {
    name: 'Gachibowli Sports Village',
    description: 'Massive Olympic-standard complex for tennis and basketball. Used for national tournaments.',
    location: { address: 'Gachibowli Stadium Road', city: 'Hyderabad', state: 'TS', zip: '500032' },
    pricePerHour: 2000,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Stadium Seating', 'Lockers', 'Showers', 'Large Parking'],
    sports: ['Tennis', 'Basketball'],
    isApproved: true
  },
  {
    name: 'Jubilee Hills Tennis Club',
    description: 'Exclusive club offering premium clay and synthetic courts. Highly recommended for advanced players.',
    location: { address: 'Jubilee Hills Checkpost', city: 'Hyderabad', state: 'TS', zip: '500033' },
    pricePerHour: 1500,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Clubhouse', 'Cafe', 'Locker Room'],
    sports: ['Tennis'],
    isApproved: true
  },
  {
    name: 'Secunderabad Play Arena',
    description: 'Excellent turf for casual 6v6 football and box cricket. Family-friendly environment.',
    location: { address: 'Secunderabad', city: 'Hyderabad', state: 'TS', zip: '500003' },
    pricePerHour: 1100,
    images: ['https://images.unsplash.com/photo-1574629810360-7efbb9886407?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Washroom', 'Water Cooler'],
    sports: ['Football', 'Cricket'],
    isApproved: true
  },
  {
    name: 'Kondapur Badminton Hub',
    description: 'Six state-of-the-art wooden badminton courts with BWF certified synthetic mats.',
    location: { address: 'Kondapur', city: 'Hyderabad', state: 'TS', zip: '500084' },
    pricePerHour: 900,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Wooden Courts', 'Changing Room', 'Parking'],
    sports: ['Badminton'],
    isApproved: true
  },

  // Delhi Turfs
  {
    name: 'Delhi Sports Complex (DDA)',
    description: 'World-class tennis and basketball courts maintained by DDA. Large seating capacity and great for weekend tournaments.',
    location: { address: 'Saket', city: 'Delhi', state: 'DL', zip: '110017' },
    pricePerHour: 1000,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Seating Area', 'Washroom', 'Drinking Water', 'Free Parking'],
    sports: ['Tennis', 'Basketball'],
    isApproved: true
  },
  {
    name: 'Vasant Kunj Football Hub',
    description: 'Lush green astroturf designed for 7v7 football. Premium nets and excellent nighttime lighting.',
    location: { address: 'Vasant Kunj', city: 'Delhi', state: 'DL', zip: '110070' },
    pricePerHour: 2200,
    images: ['https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'Changing Room', 'Lockers', 'Energy Drinks available'],
    sports: ['Football'],
    isApproved: true
  },
  {
    name: 'Connaught Place Cricket Ground',
    description: 'Historic ground in the heart of Delhi. Offers professional pitches and full ground booking.',
    location: { address: 'Connaught Place', city: 'Delhi', state: 'DL', zip: '110001' },
    pricePerHour: 5000,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Pavilion', 'Washroom', 'Large Parking', 'Canteen'],
    sports: ['Cricket'],
    isApproved: true
  },
  {
    name: 'Dwarka Sports Complex',
    description: 'A massive community sports complex featuring excellent tennis, badminton, and basketball facilities.',
    location: { address: 'Sector 11 Dwarka', city: 'Delhi', state: 'DL', zip: '110075' },
    pricePerHour: 800,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Locker Room', 'Washroom', 'Parking'],
    sports: ['Tennis', 'Badminton', 'Basketball'],
    isApproved: true
  },
  {
    name: 'Rohini Turf Arena',
    description: 'Perfect 5v5 turf for quick matches. Known for highly maintained grass and bright lighting.',
    location: { address: 'Sector 9 Rohini', city: 'Delhi', state: 'DL', zip: '110085' },
    pricePerHour: 1400,
    images: ['https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Floodlights', 'First Aid', 'Washroom'],
    sports: ['Football'],
    isApproved: true
  },
  {
    name: 'Hauz Khas Tennis Club',
    description: 'Boutique tennis club situated near the vibrant Hauz Khas village. Great ambiance and clay courts.',
    location: { address: 'Hauz Khas', city: 'Delhi', state: 'DL', zip: '110016' },
    pricePerHour: 1600,
    images: ['https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=1000'],
    amenities: ['Clay Courts', 'Cafe', 'Locker Room'],
    sports: ['Tennis'],
    isApproved: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/turf-booking');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing
    await Turf.deleteMany();
    
    // Create a dummy owner
    let owner = await User.findOne({ email: 'owner@test.com' });
    if (!owner) {
      owner = await User.create({
        name: 'Demo Owner',
        email: 'owner@test.com',
        password: 'password123',
        role: 'Owner'
      });
    }

    // Assign owner to turfs
    const seedTurfs = turfs.map(turf => ({ ...turf, ownerId: owner._id }));
    await Turf.insertMany(seedTurfs);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
