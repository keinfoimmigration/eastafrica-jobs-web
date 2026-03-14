const COUNTRIES = [
    { 
        name: 'Germany', 
        code: 'de', 
        baseSalary: 3650,
        allowedSectors: ['Information Technology', 'Engineering & Technical', 'Elderly Care', 'Manufacturing'],
        agreement: 'EAC-DE Bilateral Pact (2024)'
    },
    { 
        name: 'USA', 
        code: 'us', 
        baseSalary: 1850,
        allowedSectors: ['Agriculture', 'Truck Driving', 'Plumbing', 'Construction'],
        agreement: 'H-2A/B EAC Special Allocation'
    },
    { 
        name: 'UK', 
        code: 'gb', 
        baseSalary: 3950,
        allowedSectors: ['Information Technology', 'Financial Services', 'Healthcare & Caregiving', 'Education & Training'],
        agreement: 'UK-EAC Healthcare Bridge'
    },
    { 
        name: 'Australia', 
        code: 'au', 
        baseSalary: 2300,
        allowedSectors: ['Construction', 'Plumbing', 'Gardening', 'Agriculture'],
        agreement: 'Pacific-EAC Labor Exchange'
    },
    { 
        name: 'Canada', 
        code: 'ca', 
        baseSalary: 2150,
        allowedSectors: ['Truck Driving', 'Agriculture', 'Sewer Maintenance', 'Construction'],
        agreement: 'TFWP EAC Specialized Stream'
    },
    { 
        name: 'Qatar', 
        code: 'qa', 
        baseSalary: 1450,
        allowedSectors: ['Construction', 'Security', 'Housekeeping', 'Janitorial Services'],
        agreement: 'EAC-Qatar Manpower Agreement'
    },
    { 
        name: 'UAE (Dubai)', 
        code: 'ae', 
        baseSalary: 1550,
        allowedSectors: ['Security', 'Housekeeping', 'Fumigation Services', 'Waste Management'],
        agreement: 'MOHRE EAC Verified Program'
    },
    { 
        name: 'Saudi Arabia', 
        code: 'sa', 
        baseSalary: 1350,
        allowedSectors: ['Janitorial Services', 'Security', 'Construction', 'Truck Driving'],
        agreement: 'Musaned EAC Verified Path'
    },
    { 
        name: 'Poland', 
        code: 'pl', 
        baseSalary: 1480,
        allowedSectors: ['Agriculture', 'Waste Management', 'Construction', 'Housekeeping'],
        agreement: 'EU-EAC Community Labor Pact'
    }
];

const JOB_TEMPLATES = {
    'Truck Driving': {
        title: 'Professional Heavy Truck Driver',
        desc: 'Operate heavy-duty transport vehicles for international logistics. Required: Valid driving permit and verification.',
        processing: '45-60 Days',
        contract: '24 Months (Renewable)',
        companies: ['Global Freight Lines', 'Continental Trucking', 'Trans-Euro Logistics', 'North American Roadways'],
        images: [
            'https://images.pexels.com/photos/2800121/pexels-photo-2800121.jpeg',
            'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
            'https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg',
            'https://images.pexels.com/photos/1556701/pexels-photo-1556701.jpeg'
        ]
    },
    'Security': {
        title: 'Professional Facility Watchman',
        desc: 'Ensure safety and security of commercial complexes and residential zones. Training and uniform provided.',
        processing: '30-45 Days',
        contract: '24 Months',
        companies: ['SecureGuard International', 'Global Security Solutions', 'Sentinel Safety Group', 'Shield Protection'],
        images: [
            'https://images.pexels.com/photos/7714856/pexels-photo-7714856.jpeg',
            'https://images.pexels.com/photos/5912443/pexels-photo-5912443.jpeg',
            'https://images.pexels.com/photos/6141386/pexels-photo-6141386.jpeg',
            'https://images.pexels.com/photos/6612281/pexels-photo-6612281.jpeg'
        ]
    },
    'Plumbing': {
        title: 'Certified Maintenance Plumber',
        desc: 'Installation and repair of water systems in large-scale housing projects. Part of the EAC skills transfer program.',
        processing: '50-70 Days',
        contract: '24 Months',
        companies: ['BuildCare Engineering', 'Urban Water Solutions', 'Prime Infrastructure Partners', 'Global Facility Tech'],
        images: [
            'https://images.pexels.com/photos/2311022/pexels-photo-2311022.jpeg',
            'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
            'https://images.pexels.com/photos/3466163/pexels-photo-3466163.jpeg',
            'https://images.pexels.com/photos/1250644/pexels-photo-1250644.jpeg'
        ]
    },
    'Gardening': {
        title: 'Landscape Gardener & Groundsman',
        desc: 'Maintenance of premium public parks and private estates. Includes organic plant care and design support.',
        processing: '35-50 Days',
        contract: '12-24 Months',
        companies: ['Eden Landscaping', 'Green Horizon Services', 'Global Estate Care', 'Terra Gardening Group'],
        images: [
            'https://images.pexels.com/photos/1301897/pexels-photo-1301897.jpeg',
            'https://images.pexels.com/photos/305566/pexels-photo-305566.jpeg',
            'https://images.pexels.com/photos/2255441/pexels-photo-2255441.jpeg',
            'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg'
        ]
    },
    'Agriculture': {
        title: 'Institutional Farm Associate',
        desc: 'Work in modern greenhouses and organic farms. Includes harvest management and equipment operation.',
        processing: '30-45 Days',
        contract: '9-24 Months',
        companies: ['Global Farm Co', 'Harvest Green International', 'TerraFirma Agriculture', 'AgriGrowth Solutions'],
        images: [
            'https://images.pexels.com/photos/3927018/pexels-photo-3927018.jpeg',
            'https://images.pexels.com/photos/1486976/pexels-photo-1486976.jpeg',
            'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg',
            'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg'
        ]
    },
    'Construction': {
        title: 'Infrastructure Construction Helper',
        desc: 'General support for large-scale development projects. High safety standards and training provided.',
        processing: '45-60 Days',
        contract: '24 Months (Renewable)',
        companies: ['Vinci Base Construction', 'Hochtief Projects', 'Bechtel Support', 'Skanska Field Services'],
        images: [
            'https://images.pexels.com/photos/1230157/pexels-photo-1230157.jpeg',
            'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
            'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg',
            'https://images.pexels.com/photos/159306/pexels-photo-159306.jpeg'
        ]
    },
    'Housekeeping': {
        title: 'Professional Housekeeper',
        desc: 'Full-service housekeeping in luxury residences or commercial hotels. Includes accommodation and health cover.',
        processing: '40-55 Days',
        contract: '24 Months',
        companies: ['Marriott Operations', 'Hilton Services', 'Hyatt Housekeeping', 'Accor Support'],
        images: [
            'https://images.pexels.com/photos/1105081/pexels-photo-1105081.jpeg',
            'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
            'https://images.pexels.com/photos/4031013/pexels-photo-4031013.jpeg',
            'https://images.pexels.com/photos/53464/hotel-room-room-hotel-luxury-53464.jpeg'
        ]
    },
    'Elderly Care': {
        title: 'Elderly Care & Support Worker',
        desc: 'Professional care for senior citizens in verified residential homes. Includes dedicated elderly keeper training.',
        processing: '55-80 Days',
        contract: '24-36 Months',
        companies: ['Sunrise Senior Living', 'Bupa Core Care', 'Home Instead', 'Sunrise Communities'],
        images: [
            'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg',
            'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg',
            'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg',
            'https://images.pexels.com/photos/2058130/pexels-photo-2058130.jpeg'
        ]
    },
    'Fumigation Services': {
        title: 'Facility Fumigation Assistant',
        desc: 'Assist in professional pest control and fumigation protocols in commercial warehouses.',
        processing: '35-50 Days',
        contract: '24 Months',
        companies: ['Rentokil Global', 'Orkin Specialized', 'Global Pest Ops', 'Sentinel Fumigation'],
        images: [
            'https://images.pexels.com/photos/3927018/pexels-photo-3927018.jpeg',
            'https://images.pexels.com/photos/8472394/pexels-photo-8472394.jpeg',
            'https://images.pexels.com/photos/8472391/pexels-photo-8472391.jpeg',
            'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'
        ]
    },
    'Sewer Maintenance': {
        title: 'Municipal Sewer Unblocker',
        desc: 'Utility support for maintenance and unblocking of civic sanitation systems. High safety gear provided.',
        processing: '45-65 Days',
        contract: '24 Months',
        companies: ['Urban Utility Ops', 'Civic Flow Partners', 'Global Water Maintenance', 'Metro Sanitation'],
        images: [
            'https://images.pexels.com/photos/2311022/pexels-photo-2311022.jpeg',
            'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
            'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg',
            'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg'
        ]
    },
    'Waste Management': {
        title: 'Garbage Collection Operative',
        desc: 'Professional waste collection and sorting for large-scale municipal projects. Full protective gear provided.',
        processing: '30-45 Days',
        contract: '24 Months',
        companies: ['Waste Management Int', 'Veolia Environmental', 'Biffa Operations', 'CleanCity Global'],
        images: [
            'https://images.pexels.com/photos/1556704/pexels-photo-1556704.jpeg',
            'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
            'https://images.pexels.com/photos/159358/pexels-photo-159358.jpeg',
            'https://images.pexels.com/photos/1101121/pexels-photo-1101121.jpeg'
        ]
    },
    'Janitorial Services': {
        title: 'Facility Cleaning & Janitor',
        desc: 'Essential sweeping and toilet washing in verified commercial complexes. Includes official boarding.',
        processing: '25-40 Days',
        contract: '12-24 Months',
        companies: ['ISS World Support', 'Compass Group Janitorial', 'Sodexo Logistics', 'ABM Industries'],
        images: [
            'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg',
            'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg',
            'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
            'https://images.pexels.com/photos/4031013/pexels-photo-4031013.jpeg'
        ]
    },
    'Information Technology': {
        title: 'Senior Software Engineer',
        desc: 'Develop modern software solutions for global enterprise clients. Remote & relocation options available.',
        processing: '20-30 Days',
        contract: 'Permanent',
        companies: ['TechWave Global', 'InnovaSystems EU', 'DataFlow Partners', 'CloudNet Solutions'],
        images: [
            'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1531496730074-83b638c0a7ac?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'Financial Services': {
        title: 'Financial Analyst & Auditor',
        desc: 'Provide financial auditing and risk management services for multinational corporations.',
        processing: '30-45 Days',
        contract: '24 Months',
        companies: ['Global Finance Group', 'PWC Alliance', 'Capital Assurance', 'Audit Partners Int.'],
        images: [
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800'
        ]
    },
    'Engineering & Technical': {
        title: 'Mechanical Design Engineer',
        desc: 'Lead mechanical design initiatives for large-scale infrastructure and manufacturing operations.',
        processing: '40-60 Days',
        contract: 'Permanent',
        companies: ['Siemens Operations', 'Global Build Corp', 'InfraTech Engineering', 'EuroMech Systems'],
        images: [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
        ]
    }
};

export const generateJobs = () => {
    let allJobs = [];
    COUNTRIES.forEach(country => {
        for (let i = 1; i <= 150; i++) {
            const sectorName = country.allowedSectors[i % country.allowedSectors.length];
            const template = JOB_TEMPLATES[sectorName];
            
            if (!template) continue;

            const salaryBoost = Math.floor(Math.random() * 300);
            const companyIndex = i % template.companies.length;
            const companyName = template.companies[companyIndex];
            const companyImage = template.images ? template.images[companyIndex] : 'https://images.pexels.com/photos/6612281/pexels-photo-6612281.jpeg';
            
            allJobs.push({
                id: `${country.code}-${i}`,
                title: template.title,
                company: companyName,
                location: country.name,
                flag: country.code,
                description: template.desc,
                salary: country.baseSalary + salaryBoost,
                type: sectorName,
                image: `${companyImage}?auto=compress&cs=tinysrgb&w=800&q=80`,
                refId: `EAC-LP-${country.code.toUpperCase()}-${String(i).padStart(3, '0')}`,
                processingTime: template.processing,
                contractDuration: template.contract,
                housing: 'EAC Verified Housing Included',
                agreement: country.agreement
            });
        }
    });

    return allJobs.sort(() => Math.random() - 0.5);
};
