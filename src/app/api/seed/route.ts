import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, slugify } from '@/lib/auth'

export async function POST() {
  const results: Record<string, number | string> = {}

  // ===========================
  // Seed States
  // ===========================
  try {
    const stateData = [
      { name: 'Texas', slug: 'texas', abbreviation: 'TX' },
      { name: 'California', slug: 'california', abbreviation: 'CA' },
      { name: 'New York', slug: 'new-york', abbreviation: 'NY' },
      { name: 'Florida', slug: 'florida', abbreviation: 'FL' },
      { name: 'Illinois', slug: 'illinois', abbreviation: 'IL' },
      { name: 'Georgia', slug: 'georgia', abbreviation: 'GA' },
      { name: 'North Carolina', slug: 'north-carolina', abbreviation: 'NC' },
      { name: 'Ohio', slug: 'ohio', abbreviation: 'OH' },
      { name: 'Pennsylvania', slug: 'pennsylvania', abbreviation: 'PA' },
      { name: 'Michigan', slug: 'michigan', abbreviation: 'MI' },
    ]

    let statesCreated = 0
    for (const state of stateData) {
      const existing = await db.state.findUnique({ where: { slug: state.slug } })
      if (!existing) {
        await db.state.create({ data: state })
        statesCreated++
      }
    }
    results.states = statesCreated

    const allStates = await db.state.findMany()
    const stateMap = new Map(allStates.map(s => [s.abbreviation, s.id]))

    // ===========================
    // Seed Cities
    // ===========================
    const cityData = [
      // Texas
      { name: 'Houston', slug: 'houston', stateId: stateMap.get('TX')! },
      { name: 'Dallas', slug: 'dallas', stateId: stateMap.get('TX')! },
      { name: 'Austin', slug: 'austin', stateId: stateMap.get('TX')! },
      // California
      { name: 'Los Angeles', slug: 'los-angeles', stateId: stateMap.get('CA')! },
      { name: 'San Francisco', slug: 'san-francisco', stateId: stateMap.get('CA')! },
      // New York
      { name: 'New York City', slug: 'new-york-city', stateId: stateMap.get('NY')! },
      // Florida
      { name: 'Miami', slug: 'miami', stateId: stateMap.get('FL')! },
      // Illinois
      { name: 'Chicago', slug: 'chicago', stateId: stateMap.get('IL')! },
      // Georgia
      { name: 'Atlanta', slug: 'atlanta', stateId: stateMap.get('GA')! },
      // North Carolina
      { name: 'Charlotte', slug: 'charlotte', stateId: stateMap.get('NC')! },
      // Ohio
      { name: 'Cleveland', slug: 'cleveland', stateId: stateMap.get('OH')! },
      // Pennsylvania
      { name: 'Philadelphia', slug: 'philadelphia', stateId: stateMap.get('PA')! },
      // Michigan
      { name: 'Detroit', slug: 'detroit', stateId: stateMap.get('MI')! },
    ]

    let citiesCreated = 0
    for (const city of cityData) {
      if (!city.stateId) continue
      const existing = await db.city.findUnique({ where: { slug: city.slug } })
      if (!existing) {
        await db.city.create({ data: city })
        citiesCreated++
      }
    }
    results.cities = citiesCreated

    const allCities = await db.city.findMany()
    const cityMap = new Map(allCities.map(c => [c.slug, c.id]))

    // ===========================
    // Seed Communities
    // ===========================
    const communityData = [
      // Houston communities
      { name: 'Spectra Sunset Heights', slug: 'spectra-sunset-heights', cityId: cityMap.get('houston')!, description: 'A vibrant community in the heart of Houston\'s historic Sunset Heights neighborhood, offering affordable housing and strong community bonds.' },
      { name: 'Spectra Garden District', slug: 'spectra-garden-district', cityId: cityMap.get('houston')!, description: 'Beautiful garden-style living in Houston\'s beloved Garden District with lush landscapes and family-friendly amenities.' },
      { name: 'Spectra Lakeside', slug: 'spectra-lakeside', cityId: cityMap.get('houston')!, description: 'Serene lakeside community offering waterfront views and peaceful living just minutes from downtown Houston.' },
      // Dallas communities
      { name: 'Spectra Uptown Village', slug: 'spectra-uptown-village', cityId: cityMap.get('dallas')!, description: 'Modern urban living in Dallas\'s upscale Uptown district with walkable access to dining and entertainment.' },
      { name: 'Spectra Oak Cliff', slug: 'spectra-oak-cliff', cityId: cityMap.get('dallas')!, description: 'A charming community in historic Oak Cliff, blending vintage character with modern convenience.' },
      // Austin communities
      { name: 'Spectra Riverside', slug: 'spectra-riverside', cityId: cityMap.get('austin')!, description: 'Dynamic riverside community in Austin with easy access to the city\'s famous music and tech scene.' },
      // Los Angeles communities
      { name: 'Spectra Hollywood Hills', slug: 'spectra-hollywood-hills', cityId: cityMap.get('los-angeles')!, description: 'Premium hillside living in the iconic Hollywood Hills with stunning city and ocean views.' },
      { name: 'Spectra Venice Beach', slug: 'spectra-venice-beach', cityId: cityMap.get('los-angeles')!, description: 'Coastal community living near Venice Beach boardwalk with a creative, artistic atmosphere.' },
      // San Francisco communities
      { name: 'Spectra Marina District', slug: 'spectra-marina-district', cityId: cityMap.get('san-francisco')!, description: 'Elegant Marina District community offering bay views and proximity to San Francisco\'s best dining and culture.' },
      // New York City communities
      { name: 'Spectra Brooklyn Heights', slug: 'spectra-brooklyn-heights', cityId: cityMap.get('new-york-city')!, description: 'Historic Brooklyn Heights community with tree-lined streets and stunning Manhattan skyline views.' },
      { name: 'Spectra Harlem Rise', slug: 'spectra-harlem-rise', cityId: cityMap.get('new-york-city')!, description: 'A renaissance community in Harlem celebrating culture, heritage, and neighborhood growth.' },
      // Miami communities
      { name: 'Spectra Coral Gables', slug: 'spectra-coral-gables', cityId: cityMap.get('miami')!, description: 'Mediterranean-style community in the City Beautiful with historic charm and modern amenities.' },
      // Chicago communities
      { name: 'Spectra Lincoln Park', slug: 'spectra-lincoln-park', cityId: cityMap.get('chicago')!, description: 'Vibrant Lincoln Park community with park access, great schools, and lively neighborhood scene.' },
      // Atlanta communities
      { name: 'Spectra Buckhead', slug: 'spectra-buckhead', cityId: cityMap.get('atlanta')!, description: 'Upscale Buckhead community offering luxury living in Atlanta\'s premier shopping and dining district.' },
      { name: 'Spectra Midtown Atlanta', slug: 'spectra-midtown-atlanta', cityId: cityMap.get('atlanta')!, description: 'Energetic Midtown community at the heart of Atlanta\'s cultural and business corridor.' },
      // Charlotte communities
      { name: 'Spectra South End', slug: 'spectra-south-end', cityId: cityMap.get('charlotte')!, description: 'Trendy South End community in Charlotte with breweries, galleries, and light rail access.' },
      // Cleveland communities
      { name: 'Spectra Ohio City', slug: 'spectra-ohio-city', cityId: cityMap.get('cleveland')!, description: 'Revitalized Ohio City community with historic architecture and a thriving local market scene.' },
      // Philadelphia communities
      { name: 'Spectra Fairmount', slug: 'spectra-fairmount', cityId: cityMap.get('philadelphia')!, description: 'Charming Fairmount community near the Philadelphia Museum of Art with a cozy neighborhood feel.' },
      // Detroit communities
      { name: 'Spectra Corktown', slug: 'spectra-corktown', cityId: cityMap.get('detroit')!, description: 'Historic Corktown community in Detroit\'s oldest neighborhood, embracing renewal and community spirit.' },
    ]

    let communitiesCreated = 0
    for (const community of communityData) {
      if (!community.cityId) continue
      const existing = await db.community.findUnique({ where: { slug: community.slug } })
      if (!existing) {
        await db.community.create({ data: community })
        communitiesCreated++
      }
    }
    results.communities = communitiesCreated

    const allCommunities = await db.community.findMany()
    const communityMap = new Map(allCommunities.map(c => [c.slug, c.id]))

    // ===========================
    // Seed Categories
    // ===========================
    const categoryData = [
      { name: 'Plumbers', slug: 'plumbers', icon: '🔧', description: 'Plumbing services, repairs, and installations' },
      { name: 'Electricians', slug: 'electricians', icon: '⚡', description: 'Electrical services, wiring, and repairs' },
      { name: 'Restaurants', slug: 'restaurants', icon: '🍽️', description: 'Dining, takeout, and catering services' },
      { name: 'Healthcare', slug: 'healthcare', icon: '🏥', description: 'Medical, dental, and health services' },
      { name: 'Education', slug: 'education', icon: '📚', description: 'Tutoring, training, and educational programs' },
      { name: 'Home Services', slug: 'home-services', icon: '🏠', description: 'HVAC, landscaping, cleaning, and home maintenance' },
      { name: 'IT Services', slug: 'it-services', icon: '💻', description: 'Computer repair, networking, and tech support' },
      { name: 'Beauty & Salon', slug: 'beauty-salon', icon: '💆', description: 'Salons, spas, and beauty treatments' },
      { name: 'Legal Services', slug: 'legal-services', icon: '⚖️', description: 'Legal advice, representation, and notary services' },
      { name: 'Fitness & Wellness', slug: 'fitness-wellness', icon: '💪', description: 'Gyms, personal training, and wellness programs' },
      { name: 'Auto Repair', slug: 'auto-repair', icon: '🚗', description: 'Car maintenance, repair, and detailing' },
      { name: 'Grocery & Markets', slug: 'grocery-markets', icon: '🛒', description: 'Grocery stores, farmers markets, and specialty foods' },
    ]

    let categoriesCreated = 0
    for (const cat of categoryData) {
      const existing = await db.category.findUnique({ where: { slug: cat.slug } })
      if (!existing) {
        await db.category.create({ data: cat })
        categoriesCreated++
      }
    }
    results.categories = categoriesCreated

    const allCategories = await db.category.findMany()
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]))

    // ===========================
    // Seed Users
    // ===========================
    let usersCreated = 0

    // Admin user
    const adminEmail = 'admin@spectraholdings.com'
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
    let adminUser = existingAdmin
    if (!existingAdmin) {
      const adminPasswordHash = await hashPassword('admin123')
      adminUser = await db.user.create({
        data: {
          name: 'Admin User',
          email: adminEmail,
          passwordHash: adminPasswordHash,
          role: 'ADMIN',
          phone: '(555) 100-0000',
          city: 'Houston',
          state: 'TX',
          isVerified: true,
        },
      })
      usersCreated++
    }

    // Business users
    const businessUsers = [
      { name: 'Carlos Rivera', email: 'carlos@spectrabiz.com', phone: '(713) 555-0101', city: 'Houston', state: 'TX' },
      { name: 'Maria Santos', email: 'maria@spectrabiz.com', phone: '(305) 555-0202', city: 'Miami', state: 'FL' },
      { name: 'David Chen', email: 'david@spectrabiz.com', phone: '(310) 555-0303', city: 'Los Angeles', state: 'CA' },
      { name: 'Sarah Johnson', email: 'sarah@spectrabiz.com', phone: '(404) 555-0404', city: 'Atlanta', state: 'GA' },
      { name: 'Michael Brown', email: 'michael@spectrabiz.com', phone: '(212) 555-0505', city: 'New York City', state: 'NY' },
      { name: 'Lisa Patel', email: 'lisa@spectrabiz.com', phone: '(312) 555-0606', city: 'Chicago', state: 'IL' },
      { name: 'James Wilson', email: 'james@spectrabiz.com', phone: '(214) 555-0707', city: 'Dallas', state: 'TX' },
      { name: 'Emily Davis', email: 'emily@spectrabiz.com', phone: '(415) 555-0808', city: 'San Francisco', state: 'CA' },
    ]

    const createdBusinessUsers: { id: string }[] = []
    const bizPasswordHash = await hashPassword('business123')
    for (const bu of businessUsers) {
      const existing = await db.user.findUnique({ where: { email: bu.email } })
      if (!existing) {
        const user = await db.user.create({
          data: {
            name: bu.name,
            email: bu.email,
            passwordHash: bizPasswordHash,
            role: 'BUSINESS',
            phone: bu.phone,
            city: bu.city,
            state: bu.state,
            isVerified: true,
          },
        })
        createdBusinessUsers.push(user)
        usersCreated++
      } else {
        createdBusinessUsers.push(existing)
      }
    }

    // Resident users
    const residentUsers = [
      { name: 'Alex Thompson', email: 'alex@resident.com', phone: '(713) 555-1001', city: 'Houston', state: 'TX' },
      { name: 'Priya Sharma', email: 'priya@resident.com', phone: '(305) 555-1002', city: 'Miami', state: 'FL' },
      { name: 'Robert Kim', email: 'robert@resident.com', phone: '(310) 555-1003', city: 'Los Angeles', state: 'CA' },
      { name: 'Jennifer Lee', email: 'jennifer@resident.com', phone: '(212) 555-1004', city: 'New York City', state: 'NY' },
      { name: 'Marcus Williams', email: 'marcus@resident.com', phone: '(404) 555-1005', city: 'Atlanta', state: 'GA' },
      { name: 'Amanda Garcia', email: 'amanda@resident.com', phone: '(312) 555-1006', city: 'Chicago', state: 'IL' },
    ]

    const resPasswordHash = await hashPassword('resident123')
    for (const ru of residentUsers) {
      const existing = await db.user.findUnique({ where: { email: ru.email } })
      if (!existing) {
        await db.user.create({
          data: {
            name: ru.name,
            email: ru.email,
            passwordHash: resPasswordHash,
            role: 'RESIDENT',
            phone: ru.phone,
            city: ru.city,
            state: ru.state,
          },
        })
        usersCreated++
      }
    }
    results.users = usersCreated

    // ===========================
    // Seed Businesses
    // ===========================
    const businessData = [
      {
        userId: createdBusinessUsers[0]?.id,
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
        categorySlug: 'plumbers',
        communitySlug: 'spectra-sunset-heights',
        hours: JSON.stringify({ mon: '7AM-7PM', tue: '7AM-7PM', wed: '7AM-7PM', thu: '7AM-7PM', fri: '7AM-7PM', sat: '8AM-5PM', sun: 'Emergency only' }),
        services: JSON.stringify(['Leak Repair', 'Drain Cleaning', 'Water Heater Installation', 'Pipe Replacement', 'Emergency Plumbing']),
        licenseInfo: 'TX License #M-40291',
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[1]?.id,
        name: 'Sunshine Electric LLC',
        description: 'Licensed electricians providing residential and commercial electrical services. Specializing in new construction, renovations, and emergency repairs throughout South Florida.',
        address: '567 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'South Beach',
        phone: '(305) 555-0202',
        website: 'https://sunshineelectric.example.com',
        email: 'contact@sunshineelectric.example.com',
        categorySlug: 'electricians',
        communitySlug: 'spectra-coral-gables',
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-6PM', fri: '8AM-6PM', sat: '9AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['Wiring', 'Panel Upgrades', 'Generator Installation', 'Lighting Design', 'Outlet Installation']),
        licenseInfo: 'FL License #EC13008547',
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[2]?.id,
        name: 'Cool Breeze HVAC',
        description: 'Premier heating and air conditioning services for homes and businesses. We install, repair, and maintain all major brands. Energy-efficient solutions and indoor air quality experts.',
        address: '890 Sunset Boulevard',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Hollywood',
        phone: '(310) 555-0303',
        whatsapp: '+13105550303',
        website: 'https://coolbreezehvac.example.com',
        categorySlug: 'home-services',
        communitySlug: 'spectra-hollywood-hills',
        hours: JSON.stringify({ mon: '7AM-8PM', tue: '7AM-8PM', wed: '7AM-8PM', thu: '7AM-8PM', fri: '7AM-8PM', sat: '8AM-6PM', sun: '10AM-4PM' }),
        services: JSON.stringify(['AC Repair', 'Heating Repair', 'Duct Cleaning', 'New Installation', 'Maintenance Plans']),
        licenseInfo: 'CA License #942135',
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[3]?.id,
        name: 'Green Thumb Landscaping',
        description: 'Transform your outdoor space with our expert landscaping services. From garden design to regular maintenance, we bring your yard to life with creative and sustainable solutions.',
        address: '456 Garden Way',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Buckhead',
        phone: '(404) 555-0404',
        email: 'info@greenthumb.example.com',
        categorySlug: 'home-services',
        communitySlug: 'spectra-buckhead',
        hours: JSON.stringify({ mon: '7AM-5PM', tue: '7AM-5PM', wed: '7AM-5PM', thu: '7AM-5PM', fri: '7AM-5PM', sat: '8AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['Lawn Maintenance', 'Garden Design', 'Tree Trimming', 'Irrigation Systems', 'Hardscaping']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[4]?.id,
        name: 'Metro Health Clinic',
        description: 'Comprehensive healthcare services for the whole family. Our experienced medical team provides primary care, preventive services, and chronic disease management in a welcoming environment.',
        address: '789 Wellness Avenue',
        city: 'New York City',
        state: 'NY',
        neighborhood: 'Upper East Side',
        phone: '(212) 555-0505',
        website: 'https://metrohealthclinic.example.com',
        email: 'appointments@metrohealth.example.com',
        categorySlug: 'healthcare',
        communitySlug: 'spectra-brooklyn-heights',
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-8PM', fri: '8AM-5PM', sat: '9AM-1PM', sun: 'Closed' }),
        services: JSON.stringify(['Primary Care', 'Pediatrics', 'Vaccinations', 'Lab Work', 'Telehealth']),
        licenseInfo: 'NY Medical License #280513',
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[0]?.id,
        name: 'Taste of Texas BBQ',
        description: 'Authentic Texas-style barbecue smoked low and slow. From brisket to ribs, experience the best BBQ in Houston. Catering available for events of all sizes.',
        address: '321 Smokehouse Lane',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Heights',
        phone: '(713) 555-0606',
        whatsapp: '+17135550606',
        website: 'https://tasteoftexasbbq.example.com',
        categorySlug: 'restaurants',
        communitySlug: 'spectra-garden-district',
        hours: JSON.stringify({ mon: '11AM-9PM', tue: '11AM-9PM', wed: '11AM-9PM', thu: '11AM-10PM', fri: '11AM-10PM', sat: '10AM-10PM', sun: '10AM-8PM' }),
        services: JSON.stringify(['Dine-in', 'Takeout', 'Catering', 'Delivery', 'Private Events']),
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[1]?.id,
        name: 'PitStop Auto Care',
        description: 'Your one-stop shop for all auto repair and maintenance needs. ASE-certified mechanics providing honest, reliable service for all makes and models since 2005.',
        address: '654 Mechanic Row',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'Little Havana',
        phone: '(305) 555-0707',
        email: 'service@pitstopauto.example.com',
        categorySlug: 'auto-repair',
        communitySlug: 'spectra-coral-gables',
        hours: JSON.stringify({ mon: '7:30AM-6PM', tue: '7:30AM-6PM', wed: '7:30AM-6PM', thu: '7:30AM-6PM', fri: '7:30AM-5PM', sat: '8AM-2PM', sun: 'Closed' }),
        services: JSON.stringify(['Oil Change', 'Brake Repair', 'Engine Diagnostics', 'Tire Service', 'AC Repair']),
        licenseInfo: 'FL Auto Repair License #AR28947',
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[2]?.id,
        name: 'Sparkle Clean Pro',
        description: 'Professional residential and commercial cleaning services. Eco-friendly products, trained staff, and satisfaction guaranteed. Book recurring or one-time deep cleaning.',
        address: '987 Clean Street',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Santa Monica',
        phone: '(310) 555-0808',
        website: 'https://sparklecleanpro.example.com',
        categorySlug: 'home-services',
        communitySlug: 'spectra-venice-beach',
        hours: JSON.stringify({ mon: '6AM-8PM', tue: '6AM-8PM', wed: '6AM-8PM', thu: '6AM-8PM', fri: '6AM-8PM', sat: '7AM-6PM', sun: 'Closed' }),
        services: JSON.stringify(['Deep Cleaning', 'Regular Maintenance', 'Move-in/Move-out', 'Office Cleaning', 'Post-Construction']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[3]?.id,
        name: 'Johnson & Associates Law',
        description: 'Experienced legal team specializing in family law, real estate, and business litigation. Personal attention and dedicated representation for every client.',
        address: '246 Justice Boulevard',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Midtown',
        phone: '(404) 555-0909',
        website: 'https://johnsonlaw.example.com',
        email: 'consult@johnsonlaw.example.com',
        categorySlug: 'legal-services',
        communitySlug: 'spectra-midtown-atlanta',
        hours: JSON.stringify({ mon: '9AM-5PM', tue: '9AM-5PM', wed: '9AM-5PM', thu: '9AM-5PM', fri: '9AM-4PM', sat: 'By Appointment', sun: 'Closed' }),
        services: JSON.stringify(['Family Law', 'Real Estate', 'Business Law', 'Estate Planning', 'Mediation']),
        licenseInfo: 'GA Bar #458921',
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[4]?.id,
        name: 'Bright Futures Learning Center',
        description: 'Personalized tutoring and educational programs for students K-12. SAT/ACT prep, STEM workshops, and college counseling. Helping students reach their full potential.',
        address: '135 Education Drive',
        city: 'New York City',
        state: 'NY',
        neighborhood: 'Brooklyn',
        phone: '(718) 555-1010',
        email: 'info@brightfutures.example.com',
        categorySlug: 'education',
        communitySlug: 'spectra-harlem-rise',
        hours: JSON.stringify({ mon: '2PM-8PM', tue: '2PM-8PM', wed: '2PM-8PM', thu: '2PM-8PM', fri: '2PM-6PM', sat: '9AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['K-12 Tutoring', 'SAT/ACT Prep', 'STEM Programs', 'College Counseling', 'Homework Help']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[6]?.id,
        name: 'Iron Temple Gym',
        description: 'State-of-the-art fitness facility with personal training, group classes, and nutrition coaching. Open 24/7 for members. No contracts, cancel anytime.',
        address: '789 Fitness Way',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Galleria',
        phone: '(713) 555-1111',
        website: 'https://irontemplegym.example.com',
        categorySlug: 'fitness-wellness',
        communitySlug: 'spectra-lakeside',
        hours: JSON.stringify({ mon: '24/7', tue: '24/7', wed: '24/7', thu: '24/7', fri: '24/7', sat: '24/7', sun: '24/7' }),
        services: JSON.stringify(['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Sauna & Recovery', 'Boxing']),
        status: 'approved',
        isFeatured: true,
      },
      {
        userId: createdBusinessUsers[1]?.id,
        name: 'Serenity Day Spa',
        description: 'Luxury spa experience with massage therapy, facials, body treatments, and more. Escape the everyday and treat yourself to relaxation and rejuvenation.',
        address: '321 Tranquil Lane',
        city: 'Miami',
        state: 'FL',
        neighborhood: 'Coral Gables',
        phone: '(305) 555-1212',
        website: 'https://serenitydayspa.example.com',
        email: 'book@serenityspa.example.com',
        categorySlug: 'beauty-salon',
        communitySlug: 'spectra-coral-gables',
        hours: JSON.stringify({ mon: '9AM-8PM', tue: '9AM-8PM', wed: '9AM-8PM', thu: '9AM-9PM', fri: '9AM-9PM', sat: '8AM-7PM', sun: '10AM-5PM' }),
        services: JSON.stringify(['Massage', 'Facials', 'Manicure/Pedicure', 'Body Wraps', 'Aromatherapy']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[5]?.id,
        name: 'TechFix IT Solutions',
        description: 'Expert IT services for homes and businesses. Computer repair, network setup, cybersecurity, and cloud solutions. Same-day service available in the Chicago area.',
        address: '456 Tech Plaza',
        city: 'Chicago',
        state: 'IL',
        neighborhood: 'Loop',
        phone: '(312) 555-1313',
        website: 'https://techfixit.example.com',
        email: 'support@techfixit.example.com',
        categorySlug: 'it-services',
        communitySlug: 'spectra-lincoln-park',
        hours: JSON.stringify({ mon: '8AM-7PM', tue: '8AM-7PM', wed: '8AM-7PM', thu: '8AM-7PM', fri: '8AM-6PM', sat: '9AM-3PM', sun: 'Closed' }),
        services: JSON.stringify(['Computer Repair', 'Network Setup', 'Cybersecurity', 'Cloud Solutions', 'Data Recovery']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[7]?.id,
        name: 'Golden Gate Fitness',
        description: 'Premium fitness center in San Francisco offering yoga, pilates, cycling, and strength training. Expert instructors and a welcoming community atmosphere.',
        address: '789 Marina Drive',
        city: 'San Francisco',
        state: 'CA',
        neighborhood: 'Marina District',
        phone: '(415) 555-1414',
        website: 'https://goldengatefitness.example.com',
        categorySlug: 'fitness-wellness',
        communitySlug: 'spectra-marina-district',
        hours: JSON.stringify({ mon: '5AM-11PM', tue: '5AM-11PM', wed: '5AM-11PM', thu: '5AM-11PM', fri: '5AM-10PM', sat: '6AM-9PM', sun: '7AM-8PM' }),
        services: JSON.stringify(['Yoga', 'Pilates', 'Cycling', 'Strength Training', 'Wellness Coaching']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[6]?.id,
        name: 'Dallas Auto Spa',
        description: 'Premium auto detailing and repair shop. From basic oil changes to full ceramic coatings, we keep your vehicle looking and running its best.',
        address: '890 Motor Avenue',
        city: 'Dallas',
        state: 'TX',
        neighborhood: 'Uptown',
        phone: '(214) 555-1515',
        whatsapp: '+12145551515',
        website: 'https://dallasautospa.example.com',
        categorySlug: 'auto-repair',
        communitySlug: 'spectra-uptown-village',
        hours: JSON.stringify({ mon: '7AM-6PM', tue: '7AM-6PM', wed: '7AM-6PM', thu: '7AM-6PM', fri: '7AM-6PM', sat: '8AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['Detailing', 'Ceramic Coating', 'Oil Change', 'Brake Service', 'Paint Correction']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[5]?.id,
        name: 'Fresh Mart Grocery',
        description: 'Your neighborhood grocery store with fresh produce, organic options, and international foods. Weekly specials and delivery available in the Chicago area.',
        address: '123 Market Street',
        city: 'Chicago',
        state: 'IL',
        neighborhood: 'Lincoln Park',
        phone: '(312) 555-1616',
        website: 'https://freshmartgrocery.example.com',
        categorySlug: 'grocery-markets',
        communitySlug: 'spectra-lincoln-park',
        hours: JSON.stringify({ mon: '6AM-10PM', tue: '6AM-10PM', wed: '6AM-10PM', thu: '6AM-10PM', fri: '6AM-10PM', sat: '7AM-10PM', sun: '8AM-9PM' }),
        services: JSON.stringify(['Fresh Produce', 'Organic Options', 'International Foods', 'Delivery', 'Catering']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[2]?.id,
        name: 'SecureHome Systems',
        description: 'Advanced home security solutions including smart cameras, alarm systems, and 24/7 professional monitoring. Protect what matters most with cutting-edge technology.',
        address: '890 Shield Drive',
        city: 'Los Angeles',
        state: 'CA',
        neighborhood: 'Beverly Hills',
        phone: '(310) 555-1717',
        website: 'https://securehomesystems.example.com',
        categorySlug: 'home-services',
        communitySlug: 'spectra-hollywood-hills',
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-6PM', fri: '8AM-6PM', sat: '9AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['Security Cameras', 'Alarm Systems', 'Smart Home Integration', '24/7 Monitoring', 'Access Control']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[3]?.id,
        name: 'Peachtree Cleaning Co.',
        description: "Atlanta's trusted cleaning service for homes and offices. Bonded and insured, using eco-friendly products. Flexible scheduling and competitive rates.",
        address: '567 Peachtree Lane',
        city: 'Atlanta',
        state: 'GA',
        neighborhood: 'Sandy Springs',
        phone: '(404) 555-1818',
        categorySlug: 'home-services',
        communitySlug: 'spectra-buckhead',
        hours: JSON.stringify({ mon: '7AM-7PM', tue: '7AM-7PM', wed: '7AM-7PM', thu: '7AM-7PM', fri: '7AM-7PM', sat: '8AM-4PM', sun: 'Closed' }),
        services: JSON.stringify(['House Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Organization']),
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[4]?.id,
        name: 'Empire Legal Group',
        description: 'Top-rated law firm in Manhattan handling corporate law, intellectual property, and immigration. Strategic counsel for businesses and individuals.',
        address: '1 Wall Street, Suite 4500',
        city: 'New York City',
        state: 'NY',
        neighborhood: 'Financial District',
        phone: '(212) 555-1919',
        website: 'https://empirelegal.example.com',
        email: 'intake@empirelegal.example.com',
        categorySlug: 'legal-services',
        communitySlug: 'spectra-brooklyn-heights',
        hours: JSON.stringify({ mon: '8:30AM-6PM', tue: '8:30AM-6PM', wed: '8:30AM-6PM', thu: '8:30AM-6PM', fri: '8:30AM-5PM', sat: 'Closed', sun: 'Closed' }),
        services: JSON.stringify(['Corporate Law', 'Intellectual Property', 'Immigration', 'Contract Review', 'Litigation']),
        licenseInfo: 'NY Bar #5287941',
        status: 'approved',
        isFeatured: false,
      },
      {
        userId: createdBusinessUsers[0]?.id,
        name: 'Houston IT Pros',
        description: 'Professional IT services for small businesses and home users in Houston. Network setup, computer repair, cloud migration, and cybersecurity solutions.',
        address: '456 Innovation Drive',
        city: 'Houston',
        state: 'TX',
        neighborhood: 'Energy Corridor',
        phone: '(713) 555-2020',
        website: 'https://houstonitpros.example.com',
        categorySlug: 'it-services',
        communitySlug: 'spectra-sunset-heights',
        hours: JSON.stringify({ mon: '8AM-6PM', tue: '8AM-6PM', wed: '8AM-6PM', thu: '8AM-6PM', fri: '8AM-5PM', sat: '9AM-1PM', sun: 'Closed' }),
        services: JSON.stringify(['Network Setup', 'Computer Repair', 'Cloud Migration', 'Cybersecurity', 'Managed IT']),
        status: 'approved',
        isFeatured: false,
      },
    ]

    let businessesCreated = 0
    for (const biz of businessData) {
      if (!biz.userId) continue
      const slug = slugify(biz.name)
      const existing = await db.business.findUnique({ where: { slug } })
      if (!existing) {
        const { categorySlug, communitySlug, ...data } = biz
        const categoryId = categoryMap.get(categorySlug)
        const communityId = communitySlug ? communityMap.get(communitySlug) : undefined
        if (!categoryId) continue

        await db.business.create({
          data: {
            ...data,
            slug,
            categoryId,
            communityId: communityId || null,
          },
        })
        businessesCreated++
      }
    }
    results.businesses = businessesCreated

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
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: 'Hermann Park Convention Center',
        city: 'Houston',
        state: 'TX',
        category: 'Health & Wellness',
        communityId: communityMap.get('spectra-sunset-heights') || null,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'Small Business Workshop: Digital Marketing 101',
        slug: 'small-business-workshop-digital-marketing-101',
        description: 'Learn essential digital marketing strategies to grow your local business. Topics include social media, SEO, and online advertising.',
        content: '<p>This hands-on workshop covers:</p><ul><li>Social media marketing for local businesses</li><li>Google My Business optimization</li><li>SEO fundamentals</li><li>Email marketing that converts</li><li>Paid advertising on a budget</li></ul><p>Registration includes lunch and workshop materials.</p>',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        location: 'Miami Innovation Center',
        city: 'Miami',
        state: 'FL',
        category: 'Business',
        communityId: communityMap.get('spectra-coral-gables') || null,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'Atlanta Neighborhood Cleanup Day',
        slug: 'atlanta-neighborhood-cleanup-day',
        description: 'Join your neighbors for a community cleanup event. Supplies provided. Together we can keep our community beautiful!',
        content: '<p>Help us keep Atlanta beautiful! This community cleanup event is a great way to meet neighbors and make a positive impact.</p><ul><li>Meet at the community center at 8 AM</li><li>Gloves and bags provided</li><li>Refreshments for all volunteers</li><li>T-shirt for the first 100 participants</li></ul>',
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
        location: 'Piedmont Park Community Center',
        city: 'Atlanta',
        state: 'GA',
        category: 'Community',
        communityId: communityMap.get('spectra-midtown-atlanta') || null,
        isPublished: true,
        isFeatured: false,
      },
      {
        title: 'Local Restaurant Week Kickoff',
        slug: 'local-restaurant-week-kickoff',
        description: 'Celebrate our local culinary scene! Special menus, tastings, and chef demonstrations from the best restaurants in the area.',
        content: '<p>Experience the best of local dining during Restaurant Week!</p><ul><li>Special prix fixe menus at participating restaurants</li><li>Chef demonstrations and tastings</li><li>Food truck festival on Saturday</li><li>Cooking classes for kids and adults</li></ul>',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000),
        location: 'Various Locations',
        city: 'New York City',
        state: 'NY',
        category: 'Food & Dining',
        communityId: communityMap.get('spectra-brooklyn-heights') || null,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'Tech Talks: Smart Home Security',
        slug: 'tech-talks-smart-home-security',
        description: 'Learn about the latest smart home security technology and how to protect your home and family. Free demos and expert Q&A.',
        content: '<p>Stay safe with the latest in smart home security!</p><ul><li>Smart camera demos</li><li>DIY vs professional monitoring</li><li>Privacy and cybersecurity tips</li><li>Smart home integration workshop</li><li>Exclusive discounts on security packages</li></ul>',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: 'LA Tech Hub',
        city: 'Los Angeles',
        state: 'CA',
        category: 'Technology',
        communityId: communityMap.get('spectra-hollywood-hills') || null,
        isPublished: true,
        isFeatured: false,
      },
      {
        title: 'Chicago Summer Music Festival',
        slug: 'chicago-summer-music-festival',
        description: 'A celebration of local talent featuring live bands, food vendors, and family activities in beautiful Lincoln Park.',
        content: '<p>Enjoy a day of great music and community at the Chicago Summer Music Festival!</p><ul><li>Live performances from 10 local bands</li><li>Food trucks and craft vendors</li><li>Kids zone with games and activities</li><li>Artisan market</li></ul>',
        date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        location: 'Lincoln Park Great Lawn',
        city: 'Chicago',
        state: 'IL',
        category: 'Community',
        communityId: communityMap.get('spectra-lincoln-park') || null,
        isPublished: true,
        isFeatured: false,
      },
      {
        title: 'Dallas Small Business Expo',
        slug: 'dallas-small-business-expo',
        description: 'Connect with local entrepreneurs, discover new services, and support small businesses in the Dallas-Fort Worth area.',
        content: '<p>Support local entrepreneurship at the Dallas Small Business Expo!</p><ul><li>50+ local business exhibitors</li><li>Networking sessions</li><li>Startup pitch competition</li><li>Workshops on business growth</li></ul>',
        date: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        location: 'Dallas Convention Center',
        city: 'Dallas',
        state: 'TX',
        category: 'Business',
        communityId: communityMap.get('spectra-uptown-village') || null,
        isPublished: true,
        isFeatured: false,
      },
    ]

    let eventsCreated = 0
    for (const event of eventData) {
      const existing = await db.event.findUnique({ where: { slug: event.slug } })
      if (!existing) {
        await db.event.create({ data: event })
        eventsCreated++
      }
    }
    results.events = eventsCreated

    // ===========================
    // Seed News
    // ===========================
    const newsData = [
      {
        title: 'Spectra Holdings Group Expands Community Platform to Ten States',
        slug: 'spectra-holdings-group-expands-community-platform',
        excerpt: 'Our community directory now connects residents with local businesses across Texas, Florida, California, New York, Georgia, Illinois, and more.',
        content: '<p>Spectra Holdings Group is proud to announce the expansion of its community platform to ten major states. This growth means more residents can discover trusted local businesses, services, and community events in their area.</p><p>The platform now serves communities in Texas, Florida, California, New York, Georgia, Illinois, North Carolina, Ohio, Pennsylvania, and Michigan, with plans to expand further in the coming months.</p><p>"Our mission has always been to strengthen the connection between residents and local businesses," said the platform director. "This expansion allows us to make an even greater impact in communities across the country."</p>',
        category: 'Platform News',
        isPublished: true,
        isFeatured: true,
        authorId: adminUser?.id,
      },
      {
        title: 'New Verification Process Ensures Business Quality',
        slug: 'new-verification-process-ensures-business-quality',
        excerpt: "We've implemented a rigorous verification process to ensure all listed businesses meet our quality standards.",
        content: '<p>To maintain the highest quality standards on our platform, we\'ve introduced an enhanced verification process for all business listings.</p><p>Every business listed on the Spectra Holdings Group Community Platform now undergoes a thorough review, including:</p><ul><li>License and certification verification</li><li>Insurance confirmation</li><li>Background checks for key personnel</li><li>Customer review monitoring</li></ul><p>This ensures that when residents find a business through our platform, they can trust they\'re getting a quality service provider.</p>',
        category: 'Platform News',
        isPublished: true,
        isFeatured: true,
        authorId: adminUser?.id,
      },
      {
        title: 'Houston Community Rallies Behind Local Businesses',
        slug: 'houston-community-rallies-behind-local-businesses',
        excerpt: 'Houston residents are showing strong support for local businesses as the city continues its economic recovery.',
        content: '<p>Houston\'s local business community is seeing a significant uptick in support from residents, marking a positive trend in the city\'s economic recovery.</p><p>Data from the Spectra Holdings Group platform shows a 45% increase in local business searches compared to last year, with plumbing, HVAC, and home improvement services leading the way.</p><p>"It\'s inspiring to see Houstonians supporting their neighbors," said one local business owner. "The community platform has been a game-changer for connecting us with new customers."</p>',
        category: 'Community',
        isPublished: true,
        isFeatured: false,
        authorId: adminUser?.id,
      },
      {
        title: 'Miami Launches Green Business Initiative',
        slug: 'miami-launches-green-business-initiative',
        excerpt: "Miami's new initiative encourages eco-friendly business practices with incentives and recognition programs.",
        content: '<p>The city of Miami has launched a new Green Business Initiative aimed at encouraging local businesses to adopt sustainable practices.</p><p>Businesses that participate can receive tax incentives, marketing support, and a special "Green Certified" badge on platforms like ours.</p><p>The initiative covers areas including:</p><ul><li>Energy efficiency improvements</li><li>Waste reduction programs</li><li>Sustainable sourcing</li><li>Water conservation measures</li></ul><p>Several businesses on our platform have already signed up for the program.</p>',
        category: 'Community',
        isPublished: true,
        isFeatured: false,
        authorId: adminUser?.id,
      },
      {
        title: '5 Tips for Choosing the Right Local Service Provider',
        slug: '5-tips-for-choosing-right-local-service-provider',
        excerpt: 'Expert advice on how to evaluate and select the best local service providers for your needs.',
        content: '<p>Finding the right local service provider can be overwhelming. Here are five tips to help you make the best choice:</p><ol><li><strong>Check Reviews and Ratings:</strong> Look at what other community members say about their experiences.</li><li><strong>Verify Credentials:</strong> Make sure the business is properly licensed and insured for the services they offer.</li><li><strong>Get Multiple Quotes:</strong> Don\'t settle for the first estimate. Compare prices and services from at least three providers.</li><li><strong>Ask About Experience:</strong> How long have they been in business? Do they specialize in what you need?</li><li><strong>Trust Your Gut:</strong> Professionalism, communication, and responsiveness matter as much as price.</li></ol><p>Use the Spectra Holdings Group platform to find verified, reviewed businesses in your area!</p>',
        category: 'Tips & Guides',
        isPublished: true,
        isFeatured: false,
        authorId: adminUser?.id,
      },
      {
        title: 'Spectra Communities Launch Neighborhood Watch Programs',
        slug: 'spectra-communities-launch-neighborhood-watch-programs',
        excerpt: 'New safety initiatives across Spectra communities bring residents together to keep neighborhoods secure and connected.',
        content: '<p>Spectra Holdings Group is rolling out Neighborhood Watch programs across its communities in ten states. The initiative aims to foster community engagement while improving safety.</p><p>Key features of the program include:</p><ul><li>Regular community meetups and safety workshops</li><li>Dedicated communication channels for residents</li><li>Partnerships with local law enforcement</li><li>Emergency preparedness training</li></ul><p>"Safe communities are strong communities," said the program director. "When neighbors look out for each other, everyone benefits."</p>',
        category: 'Community',
        isPublished: true,
        isFeatured: true,
        authorId: adminUser?.id,
      },
    ]

    let newsCreated = 0
    for (const news of newsData) {
      const existing = await db.news.findUnique({ where: { slug: news.slug } })
      if (!existing) {
        await db.news.create({ data: news })
        newsCreated++
      }
    }
    results.news = newsCreated

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: results,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
