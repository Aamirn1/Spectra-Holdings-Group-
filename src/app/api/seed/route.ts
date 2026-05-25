import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, slugify } from '@/lib/auth'

export async function POST() {
  try {
    // Check if data already exists
    const existingCategories = await db.category.count()
    if (existingCategories > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded. Skipping to avoid duplicates.',
      })
    }

    // ===========================
    // Seed Categories
    // ===========================
    const categoryData = [
      { name: 'Plumbing', slug: 'plumbing', icon: '🔧', description: 'Plumbing services, repairs, and installations' },
      { name: 'Electrical', slug: 'electrical', icon: '⚡', description: 'Electrical services, wiring, and repairs' },
      { name: 'HVAC', slug: 'hvac', icon: '❄️', description: 'Heating, ventilation, and air conditioning' },
      { name: 'Landscaping', slug: 'landscaping', icon: '🌿', description: 'Lawn care, garden design, and outdoor maintenance' },
      { name: 'Healthcare', slug: 'healthcare', icon: '🏥', description: 'Medical, dental, and health services' },
      { name: 'Restaurants', slug: 'restaurants', icon: '🍽️', description: 'Dining, takeout, and catering services' },
      { name: 'Auto Repair', slug: 'auto-repair', icon: '🚗', description: 'Car maintenance, repair, and detailing' },
      { name: 'Cleaning', slug: 'cleaning', icon: '✨', description: 'Residential and commercial cleaning services' },
      { name: 'Legal', slug: 'legal', icon: '⚖️', description: 'Legal advice, representation, and notary services' },
      { name: 'Education', slug: 'education', icon: '📚', description: 'Tutoring, training, and educational programs' },
      { name: 'Fitness', slug: 'fitness', icon: '💪', description: 'Gyms, personal training, and wellness programs' },
      { name: 'Beauty & Spa', slug: 'beauty-spa', icon: '💆', description: 'Salons, spas, and beauty treatments' },
      { name: 'Pet Services', slug: 'pet-services', icon: '🐾', description: 'Veterinary, grooming, and pet care' },
      { name: 'Home Security', slug: 'home-security', icon: '🔒', description: 'Security systems, cameras, and monitoring' },
      { name: 'Moving Services', slug: 'moving-services', icon: '📦', description: 'Moving, packing, and storage solutions' },
    ]

    const categories = await Promise.all(
      categoryData.map((cat) => db.category.create({ data: cat }))
    )

    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

    // ===========================
    // Seed Users
    // ===========================
    const adminPasswordHash = await hashPassword('admin123')
    const adminUser = await db.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@spectra.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '(555) 100-0000',
        city: 'Houston',
        state: 'TX',
      },
    })

    const businessPasswordHash = await hashPassword('test123')
    const businessUser = await db.user.create({
      data: {
        name: 'Test Business Owner',
        email: 'business@test.com',
        passwordHash: businessPasswordHash,
        role: 'business',
        phone: '(555) 200-0000',
        city: 'Houston',
        state: 'TX',
      },
    })

    const userPasswordHash = await hashPassword('test123')
    const residentUser = await db.user.create({
      data: {
        name: 'Test Resident',
        email: 'user@test.com',
        passwordHash: userPasswordHash,
        role: 'user',
        phone: '(555) 300-0000',
        city: 'Houston',
        state: 'TX',
      },
    })

    // ===========================
    // Seed Businesses
    // ===========================
    const businessData = [
      {
        userId: businessUser.id,
        name: 'Lone Star Plumbing Co.',
        description: 'Full-service plumbing company serving the Greater Houston area. From leaky faucets to complete repiping, we handle it all with professionalism and care. Available 24/7 for emergency calls.',
        address: '1234 Main Street, Suite 100',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Midtown',
        phone: '(713) 555-0101',
        whatsapp: '+17135550101',
        website: 'https://lonestarplumbing.example.com',
        email: 'info@lonestarplumbing.example.com',
        categoryId: categoryMap.get('plumbing')!,
        hours: JSON.stringify({ mon: '7AM-7PM', tue: '7AM-7PM', wed: '7AM-7PM', thu: '7AM-7PM', fri: '7AM-7PM', sat: '8AM-5PM', sun: 'Emergency only' }),
        services: JSON.stringify(['Leak Repair', 'Drain Cleaning', 'Water Heater Installation', 'Pipe Replacement', 'Emergency Plumbing']),
        licenseInfo: 'TX License #M-40291',
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'Sunshine Electric LLC',
        description: 'Licensed electricians providing residential and commercial electrical services. Specializing in new construction, renovations, and emergency repairs throughout South Florida.',
        address: '567 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'South Beach',
        phone: '(305) 555-0202',
        website: 'https://sunshineelectric.example.com',
        email: 'contact@sunshineelectric.example.com',
        categoryId: categoryMap.get('electrical')!,
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-6PM', fri: '8AM-6PM', sat: '9AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['Wiring', 'Panel Upgrades', 'Generator Installation', 'Lighting Design', 'Outlet Installation']),
        licenseInfo: 'FL License #EC13008547',
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'Cool Breeze HVAC',
        description: 'Premier heating and air conditioning services for homes and businesses. We install, repair, and maintain all major brands. Energy-efficient solutions and indoor air quality experts.',
        address: '890 Sunset Boulevard',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Hollywood',
        phone: '(310) 555-0303',
        whatsapp: '+13105550303',
        website: 'https://coolbreezehvac.example.com',
        categoryId: categoryMap.get('hvac')!,
        hours: JSON.stringify({ mon: '7AM-8PM', tue: '7AM-8PM', wed: '7AM-8PM', thu: '7AM-8PM', fri: '7AM-8PM', sat: '8AM-6PM', sun: '10AM-4PM' }),
        services: JSON.stringify(['AC Repair', 'Heating Repair', 'Duct Cleaning', 'New Installation', 'Maintenance Plans']),
        licenseInfo: 'CA License #942135',
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'Green Thumb Landscaping',
        description: 'Transform your outdoor space with our expert landscaping services. From garden design to regular maintenance, we bring your yard to life with creative and sustainable solutions.',
        address: '456 Garden Way',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Buckhead',
        phone: '(404) 555-0404',
        email: 'info@greenthumb.example.com',
        categoryId: categoryMap.get('landscaping')!,
        hours: JSON.stringify({ mon: '7AM-5PM', tue: '7AM-5PM', wed: '7AM-5PM', thu: '7AM-5PM', fri: '7AM-5PM', sat: '8AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['Lawn Maintenance', 'Garden Design', 'Tree Trimming', 'Irrigation Systems', 'Hardscaping']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Metro Health Clinic',
        description: 'Comprehensive healthcare services for the whole family. Our experienced medical team provides primary care, preventive services, and chronic disease management in a welcoming environment.',
        address: '789 Wellness Avenue',
        city: 'New York',
        state: 'NY',
        neighborhood: 'Upper East Side',
        phone: '(212) 555-0505',
        website: 'https://metrohealthclinic.example.com',
        email: 'appointments@metrohealth.example.com',
        categoryId: categoryMap.get('healthcare')!,
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-8PM', fri: '8AM-5PM', sat: '9AM-1PM', sun: 'Closed' }),
        services: JSON.stringify(['Primary Care', 'Pediatrics', 'Vaccinations', 'Lab Work', 'Telehealth']),
        licenseInfo: 'NY Medical License #280513',
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'Taste of Texas BBQ',
        description: 'Authentic Texas-style barbecue smoked low and slow. From brisket to ribs, experience the best BBQ in Houston. Catering available for events of all sizes.',
        address: '321 Smokehouse Lane',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Heights',
        phone: '(713) 555-0606',
        whatsapp: '+17135550606',
        website: 'https://tasteoftexasbbq.example.com',
        categoryId: categoryMap.get('restaurants')!,
        hours: JSON.stringify({ mon: '11AM-9PM', tue: '11AM-9PM', wed: '11AM-9PM', thu: '11AM-10PM', fri: '11AM-10PM', sat: '10AM-10PM', sun: '10AM-8PM' }),
        services: JSON.stringify(['Dine-in', 'Takeout', 'Catering', 'Delivery', 'Private Events']),
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'PitStop Auto Care',
        description: 'Your one-stop shop for all auto repair and maintenance needs. ASE-certified mechanics providing honest, reliable service for all makes and models since 2005.',
        address: '654 Mechanic Row',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'Little Havana',
        phone: '(305) 555-0707',
        email: 'service@pitstopauto.example.com',
        categoryId: categoryMap.get('auto-repair')!,
        hours: JSON.stringify({ mon: '7:30AM-6PM', tue: '7:30AM-6PM', wed: '7:30AM-6PM', thu: '7:30AM-6PM', fri: '7:30AM-5PM', sat: '8AM-2PM', sun: 'Closed' }),
        services: JSON.stringify(['Oil Change', 'Brake Repair', 'Engine Diagnostics', 'Tire Service', 'AC Repair']),
        licenseInfo: 'FL Auto Repair License #AR28947',
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Sparkle Clean Pro',
        description: 'Professional residential and commercial cleaning services. Eco-friendly products, trained staff, and satisfaction guaranteed. Book recurring or one-time deep cleaning.',
        address: '987 Clean Street',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Santa Monica',
        phone: '(310) 555-0808',
        website: 'https://sparklecleanpro.example.com',
        categoryId: categoryMap.get('cleaning')!,
        hours: JSON.stringify({ mon: '6AM-8PM', tue: '6AM-8PM', wed: '6AM-8PM', thu: '6AM-8PM', fri: '6AM-8PM', sat: '7AM-6PM', sun: 'Closed' }),
        services: JSON.stringify(['Deep Cleaning', 'Regular Maintenance', 'Move-in/Move-out', 'Office Cleaning', 'Post-Construction']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Johnson & Associates Law',
        description: 'Experienced legal team specializing in family law, real estate, and business litigation. Personal attention and dedicated representation for every client.',
        address: '246 Justice Boulevard',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Midtown',
        phone: '(404) 555-0909',
        website: 'https://johnsonlaw.example.com',
        email: 'consult@johnsonlaw.example.com',
        categoryId: categoryMap.get('legal')!,
        hours: JSON.stringify({ mon: '9AM-5PM', tue: '9AM-5PM', wed: '9AM-5PM', thu: '9AM-5PM', fri: '9AM-4PM', sat: 'By Appointment', sun: 'Closed' }),
        services: JSON.stringify(['Family Law', 'Real Estate', 'Business Law', 'Estate Planning', 'Mediation']),
        licenseInfo: 'GA Bar #458921',
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Bright Futures Learning Center',
        description: 'Personalized tutoring and educational programs for students K-12. SAT/ACT prep, STEM workshops, and college counseling. Helping students reach their full potential.',
        address: '135 Education Drive',
        city: 'New York',
        state: 'NY',
        neighborhood: 'Brooklyn',
        phone: '(718) 555-1010',
        email: 'info@brightfutures.example.com',
        categoryId: categoryMap.get('education')!,
        hours: JSON.stringify({ mon: '2PM-8PM', tue: '2PM-8PM', wed: '2PM-8PM', thu: '2PM-8PM', fri: '2PM-6PM', sat: '9AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['K-12 Tutoring', 'SAT/ACT Prep', 'STEM Programs', 'College Counseling', 'Homework Help']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Iron Temple Gym',
        description: 'State-of-the-art fitness facility with personal training, group classes, and nutrition coaching. Open 24/7 for members. No contracts, cancel anytime.',
        address: '789 Fitness Way',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Galleria',
        phone: '(713) 555-1111',
        website: 'https:://irontemplegym.example.com',
        categoryId: categoryMap.get('fitness')!,
        hours: JSON.stringify({ mon: '24/7', tue: '24/7', wed: '24/7', thu: '24/7', fri: '24/7', sat: '24/7', sun: '24/7' }),
        services: JSON.stringify(['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Sauna & Recovery', 'Boxing']),
        isApproved: true,
        isFeatured: true,
      },
      {
        userId: businessUser.id,
        name: 'Serenity Day Spa',
        description: 'Luxury spa experience with massage therapy, facials, body treatments, and more. Escape the everyday and treat yourself to relaxation and rejuvenation.',
        address: '321 Tranquil Lane',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'Coral Gables',
        phone: '(305) 555-1212',
        website: 'https://serenitydayspa.example.com',
        email: 'book@serenityspa.example.com',
        categoryId: categoryMap.get('beauty-spa')!,
        hours: JSON.stringify({ mon: '9AM-8PM', tue: '9AM-8PM', wed: '9AM-8PM', thu: '9AM-9PM', fri: '9AM-9PM', sat: '8AM-7PM', sun: '10AM-5PM' }),
        services: JSON.stringify(['Massage', 'Facials', 'Manicure/Pedicure', 'Body Wraps', 'Aromatherapy']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Happy Paws Veterinary',
        description: 'Caring veterinary services for your furry family members. Wellness exams, vaccinations, surgery, and emergency care. We treat pets like family.',
        address: '567 Paws Parkway',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Virginia Highland',
        phone: '(404) 555-1313',
        whatsapp: '+14045551313',
        email: 'care@happypaws.example.com',
        categoryId: categoryMap.get('pet-services')!,
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-7PM', fri: '8AM-6PM', sat: '9AM-2PM', sun: 'Emergency only' }),
        services: JSON.stringify(['Wellness Exams', 'Vaccinations', 'Surgery', 'Dental Care', 'Emergency Services']),
        licenseInfo: 'GA Veterinary License #VG-0891',
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'SecureHome Systems',
        description: 'Advanced home security solutions including smart cameras, alarm systems, and 24/7 professional monitoring. Protect what matters most with cutting-edge technology.',
        address: '890 Shield Drive',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Beverly Hills',
        phone: '(310) 555-1414',
        website: 'https://securehomesystems.example.com',
        categoryId: categoryMap.get('home-security')!,
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-6PM', fri: '8AM-6PM', sat: '9AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['Security Cameras', 'Alarm Systems', 'Smart Home Integration', '24/7 Monitoring', 'Access Control']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Easy Move Houston',
        description: 'Stress-free moving services for local and long-distance relocations. Packing, loading, transportation, and unpacking — we handle it all so you can focus on your new home.',
        address: '234 Carrier Court',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Spring Branch',
        phone: '(713) 555-1515',
        email: 'quote@easymovehouston.example.com',
        categoryId: categoryMap.get('moving-services')!,
        hours: JSON.stringify({ mon: '7AM-7PM', tue: '7AM-7PM', wed: '7AM-7PM', thu: '7AM-7PM', fri: '7AM-7PM', sat: '8AM-5PM', sun: 'Closed' }),
        services: JSON.stringify(['Local Moving', 'Long Distance', 'Packing Services', 'Storage Solutions', 'Office Relocation']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Bayshore Electric',
        description: 'Reliable electrical services for the Tampa Bay area. Residential rewiring, commercial installations, and energy-efficient lighting solutions by certified electricians.',
        address: '456 Bay View Road',
        city: 'Tampa',
        state: 'FL',
        neighborhood: 'Ybor City',
        phone: '(813) 555-1616',
        categoryId: categoryMap.get('electrical')!,
        hours: JSON.stringify({ mon: '7AM-5PM', tue: '7AM-5PM', wed: '7AM-5PM', thu: '7AM-5PM', fri: '7AM-5PM', sat: '8AM-2PM', sun: 'Closed' }),
        services: JSON.stringify(['Rewiring', 'Panel Upgrades', 'Lighting', 'EV Charger Installation', 'Inspections']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Golden Gate Fitness',
        description: 'Premium fitness center in San Francisco offering yoga, pilates, cycling, and strength training. Expert instructors and a welcoming community atmosphere.',
        address: '789 Marina Drive',
        city: 'San Francisco',
        state: 'CA',
        neighborhood: 'Marina District',
        phone: '(415) 555-1717',
        website: 'https://goldengatefitness.example.com',
        categoryId: categoryMap.get('fitness')!,
        hours: JSON.stringify({ mon: '5AM-11PM', tue: '5AM-11PM', wed: '5AM-11PM', thu: '5AM-11PM', fri: '5AM-10PM', sat: '6AM-9PM', sun: '7AM-8PM' }),
        services: JSON.stringify(['Yoga', 'Pilates', 'Cycling', 'Strength Training', 'Wellness Coaching']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Empire Legal Group',
        description: 'Top-rated law firm in Manhattan handling corporate law, intellectual property, and immigration. Strategic counsel for businesses and individuals.',
        address: '1 Wall Street, Suite 4500',
        city: 'New York',
        state: 'NY',
        neighborhood: 'Financial District',
        phone: '(212) 555-1818',
        website: 'https://empirelegal.example.com',
        email: 'intake@empirelegal.example.com',
        categoryId: categoryMap.get('legal')!,
        hours: JSON.stringify({ mon: '8:30AM-6PM', tue: '8:30AM-6PM', wed: '8:30AM-6PM', thu: '8:30AM-6PM', fri: '8:30AM-5PM', sat: 'Closed', sun: 'Closed' }),
        services: JSON.stringify(['Corporate Law', 'Intellectual Property', 'Immigration', 'Contract Review', 'Litigation']),
        licenseInfo: 'NY Bar #5287941',
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Peachtree Cleaning Co.',
        description: 'Atlanta\'s trusted cleaning service for homes and offices. Bonded and insured, using eco-friendly products. Flexible scheduling and competitive rates.',
        address: '567 Peachtree Lane',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Sandy Springs',
        phone: '(404) 555-1919',
        categoryId: categoryMap.get('cleaning')!,
        hours: JSON.stringify({ mon: '7AM-7PM', tue: '7AM-7PM', wed: '7AM-7PM', thu: '7AM-7PM', fri: '7AM-7PM', sat: '8AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['House Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Organization']),
        isApproved: true,
        isFeatured: false,
      },
      {
        userId: businessUser.id,
        name: 'Dallas Auto Spa',
        description: 'Premium auto detailing and repair shop. From basic oil changes to full ceramic coatings, we keep your vehicle looking and running its best.',
        address: '890 Motor Avenue',
        city: 'Dallas',
        state: 'TX',
        neighborhood: 'Uptown',
        phone: '(214) 555-2020',
        whatsapp: '+12145552020',
        website: 'https://dallasautospa.example.com',
        categoryId: categoryMap.get('auto-repair')!,
        hours: JSON.stringify({ mon: '7AM-6PM', tue: '7AM-6PM', wed: '7AM-6PM', thu: '7AM-6PM', fri: '7AM-6PM', sat: '8AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['Detailing', 'Ceramic Coating', 'Oil Change', 'Brake Service', 'Paint Correction']),
        isApproved: true,
        isFeatured: false,
      },
    ]

    // Generate slugs for businesses
    const businessesWithSlugs = businessData.map((b) => ({
      ...b,
      slug: slugify(b.name),
    }))

    await Promise.all(
      businessesWithSlugs.map((b) => db.business.create({ data: b }))
    )

    // ===========================
    // Seed Events
    // ===========================
    const now = new Date()
    const eventData = [
      {
        title: 'Houston Community Health Fair',
        slug: 'houston-community-health-fair',
        description: 'Free health screenings, wellness workshops, and family activities. Meet local healthcare providers and learn about services available in your community.',
        content: '<p>Join us for the annual Houston Community Health Fair! This free event features:</p><ul><li>Free blood pressure and glucose screenings</li><li>Flu vaccinations (while supplies last)</li><li>Healthy cooking demonstrations</li><li>Kids\' activities and face painting</li><li>Meet & greet with local healthcare providers</li></ul>',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: 'Hermann Park Convention Center',
        city: 'Houston',
        state: 'TX',
        category: 'Health & Wellness',
        isPublished: true,
      },
      {
        title: 'Small Business Workshop: Digital Marketing 101',
        slug: 'small-business-workshop-digital-marketing-101',
        description: 'Learn essential digital marketing strategies to grow your local business. Topics include social media, SEO, and online advertising.',
        content: '<p>This hands-on workshop covers:</p><ul><li>Social media marketing for local businesses</li><li>Google My Business optimization</li><li>SEO fundamentals</li><li>Email marketing that converts</li><li>Paid advertising on a budget</li></ul><p>Registration includes lunch and workshop materials.</p>',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        location: 'Miami Innovation Center',
        city: 'Miami',
        state: 'FL',
        category: 'Business',
        isPublished: true,
      },
      {
        title: 'Atlanta Neighborhood Cleanup Day',
        slug: 'atlanta-neighborhood-cleanup-day',
        description: 'Join your neighbors for a community cleanup event. Supplies provided. Together we can keep our community beautiful!',
        content: '<p>Help us keep Atlanta beautiful! This community cleanup event is a great way to meet neighbors and make a positive impact.</p><ul><li>Meet at the community center at 8 AM</li><li>Gloves and bags provided</li><li>Refreshments for all volunteers</li><li>T-shirt for the first 100 participants</li></ul>',
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
        location: 'Piedmont Park Community Center',
        city: 'Atlanta',
        state: 'GA',
        category: 'Community',
        isPublished: true,
      },
      {
        title: 'Local Restaurant Week Kickoff',
        slug: 'local-restaurant-week-kickoff',
        description: 'Celebrate our local culinary scene! Special menus, tastings, and chef demonstrations from the best restaurants in the area.',
        content: '<p>Experience the best of local dining during Restaurant Week!</p><ul><li>Special prix fixe menus at participating restaurants</li><li>Chef demonstrations and tastings</li><li>Food truck festival on Saturday</li><li>Cooking classes for kids and adults</li></ul>',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        endDate: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000),
        location: 'Various Locations',
        city: 'New York',
        state: 'NY',
        category: 'Food & Dining',
        isPublished: true,
      },
      {
        title: 'Tech Talks: Smart Home Security',
        slug: 'tech-talks-smart-home-security',
        description: 'Learn about the latest smart home security technology and how to protect your home and family. Free demos and expert Q&A.',
        content: '<p>Stay safe with the latest in smart home security!</p><ul><li>Smart camera demos</li><li>DIY vs professional monitoring</li><li>Privacy and cybersecurity tips</li><li>Smart home integration workshop</li><li>Exclusive discounts on security packages</li></ul>',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: 'LA Tech Hub',
        city: 'Los Angeles',
        state: 'CA',
        category: 'Technology',
        isPublished: true,
      },
    ]

    await Promise.all(
      eventData.map((e) => db.event.create({ data: e }))
    )

    // ===========================
    // Seed News
    // ===========================
    const newsData = [
      {
        title: 'Spectra Holdings Group Expands Community Platform to Five States',
        slug: 'spectra-holdings-group-expands-community-platform',
        excerpt: 'Our community directory now connects residents with local businesses across Texas, Florida, California, New York, and Georgia.',
        content: '<p>Spectra Holdings Group is proud to announce the expansion of its community platform to five major states. This growth means more residents can discover trusted local businesses, services, and community events in their area.</p><p>The platform now serves communities in Texas, Florida, California, New York, and Georgia, with plans to expand further in the coming months.</p><p>"Our mission has always been to strengthen the connection between residents and local businesses," said the platform director. "This expansion allows us to make an even greater impact in communities across the country."</p>',
        category: 'Platform News',
        isPublished: true,
        authorId: adminUser.id,
      },
      {
        title: 'New Verification Process Ensures Business Quality',
        slug: 'new-verification-process-ensures-business-quality',
        excerpt: 'We\'ve implemented a rigorous verification process to ensure all listed businesses meet our quality standards.',
        content: '<p>To maintain the highest quality standards on our platform, we\'ve introduced an enhanced verification process for all business listings.</p><p>Every business listed on the Spectra Holdings Group Community Platform now undergoes a thorough review, including:</p><ul><li>License and certification verification</li><li>Insurance confirmation</li><li>Background checks for key personnel</li><li>Customer review monitoring</li></ul><p>This ensures that when residents find a business through our platform, they can trust they\'re getting a quality service provider.</p>',
        category: 'Platform News',
        isPublished: true,
        authorId: adminUser.id,
      },
      {
        title: 'Houston Community Rallies Behind Local Businesses Post-Pandemic',
        slug: 'houston-community-rallies-behind-local-businesses',
        excerpt: 'Houston residents are showing strong support for local businesses as the city continues its economic recovery.',
        content: '<p>Houston\'s local business community is seeing a significant uptick in support from residents, marking a positive trend in the city\'s economic recovery.</p><p>Data from the Spectra Holdings Group platform shows a 45% increase in local business searches compared to last year, with plumbing, HVAC, and home improvement services leading the way.</p><p>"It\'s inspiring to see Houstonians supporting their neighbors," said one local business owner. "The community platform has been a game-changer for connecting us with new customers."</p>',
        category: 'Community',
        isPublished: true,
        authorId: adminUser.id,
      },
      {
        title: 'Miami Launches Green Business Initiative',
        slug: 'miami-launches-green-business-initiative',
        excerpt: 'Miami\'s new initiative encourages eco-friendly business practices with incentives and recognition programs.',
        content: '<p>The city of Miami has launched a new Green Business Initiative aimed at encouraging local businesses to adopt sustainable practices.</p><p>Businesses that participate can receive tax incentives, marketing support, and a special "Green Certified" badge on platforms like ours.</p><p>The initiative covers areas including:</p><ul><li>Energy efficiency improvements</li><li>Waste reduction programs</li><li>Sustainable sourcing</li><li>Water conservation measures</li></ul><p>Several businesses on our platform have already signed up for the program.</p>',
        category: 'Community',
        isPublished: true,
        authorId: adminUser.id,
      },
      {
        title: '5 Tips for Choosing the Right Local Service Provider',
        slug: '5-tips-for-choosing-right-local-service-provider',
        excerpt: 'Expert advice on how to evaluate and select the best local service providers for your needs.',
        content: '<p>Finding the right local service provider can be overwhelming. Here are five tips to help you make the best choice:</p><ol><li><strong>Check Reviews and Ratings:</strong> Look at what other community members say about their experiences.</li><li><strong>Verify Credentials:</strong> Make sure the business is properly licensed and insured for the services they offer.</li><li><strong>Get Multiple Quotes:</strong> Don\'t settle for the first estimate. Compare prices and services from at least three providers.</li><li><strong>Ask About Experience:</strong> How long have they been in business? Do they specialize in what you need?</li><li><strong>Trust Your Gut:</strong> Professionalism, communication, and responsiveness matter as much as price.</li></ol><p>Use the Spectra Holdings Group platform to find verified, reviewed businesses in your area!</p>',
        category: 'Tips & Guides',
        isPublished: true,
        authorId: adminUser.id,
      },
    ]

    await Promise.all(
      newsData.map((n) => db.news.create({ data: n }))
    )

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categoryData.length,
        users: 3,
        businesses: businessData.length,
        events: eventData.length,
        news: newsData.length,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
