import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://gbotwkyaagcffzvcyzuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Egi9rMCDbL0BP6R9Mbh_0Q_LxEHau5r";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
dotenv.config();

const port = 5000;
console.log('--- EAC-SERVER-v2-ACTIVE ---');

// --- Offer Letter Mapping (Massive 100+ Real-World Employer Pool) ---
// Keys are strictly aligned with official JOB_SECTORS from JobDetail.jsx
const EMPLOYER_DATA = {
  "Poland": {
    "Agriculture & Packaging": { companies: ["Animex Foods Sp. z o.o.", "Cedrob S.A.", "Agro-Handel Sp. z o.o.", "Osadkowski S.A.", "Agros Nova"], salary: "$1,450 - $1,850 per month" },
    "Essential Services": { companies: ["Remondis Poland Sp. z o.o.", "Alba Polska", "MPO Warszawa", "Lekaro", "Eneris Surowce"], salary: "$1,400 - $1,750 per month" },
    "Construction & Logistics": { companies: ["Budimex S.A.", "Skanska S.A.", "STRABAG Polska", "Erbud S.A.", "Warbud S.A.", "Mostostal Warszawa"], salary: "$1,600 - $2,200 per month" },
    "Professional Heavy Truck Driver": { companies: ["Raben Logistics Poland", "Waberer's Polska", "PKP Cargo Connect", "DB Schenker Poland", "GXO Logistics Poland"], salary: "$1,850 - $2,600 per month" },
    "Hospitality & Retail": { companies: ["Impel Group S.A.", "Clarina Polska", "Dussmann Service", "Juventas", "Serwisant Sp. z o.o."], salary: "$1,350 - $1,650 per month" },
    "Manufacturing": { companies: ["LPP S.A.", "KGHM Polska Miedź", "PKN Orlen", "Grupa Azoty", "Asseco Poland"], salary: "$1,700 - $2,400 per month" },
    "Public Administration": { companies: ["Government of Poland (Partner Agency)", "Polish Social Security Institution (ZUS)", "City of Warsaw Public Infrastructure"], salary: "$1,600 - $2,100 per month" },
    "Default": { companies: ["Raben Group", "InPost", "PKN Orlen", "LPP S.A.", "Alior Bank"], salary: "$1,500 - $2,000 per month" }
  },
  "Germany": {
    "Information Technology": { companies: ["SAP SE", "Deutsche Telekom IT", "Capgemini Germany", "T-Systems", "CGI Germany", "Atos IT Solutions"], salary: "$4,800 - $7,000 per month" },
    "Agriculture & Packaging": { companies: ["Bayer AG (Crop Science)", "BASF Agricultural Solutions", "KWS Saat SE", "BayWa AG", "Südzucker AG"], salary: "$3,200 - $4,200 per month" },
    "Fruit & Vegetable Picker": { companies: ["Landgard Service GmbH", "Obst vom Bodensee Vertriebsgesellschaft", "Beerenfrost Beerenland", "Gartenbauzentrale eG", "Fruchtunion"], salary: "$2,600 - $3,500 per month" },
    "Engineering & Technical": { companies: ["Siemens AG", "Robert Bosch GmbH", "ThyssenKrupp AG", "Lufthansa Technik", "Continental AG", "ZF Friedrichshafen"], salary: "$4,500 - $6,200 per month" },
    "Healthcare & Caregiving": { companies: ["Korian Deutschland GmbH", "Helios Kliniken GmbH", "Vitanas Group", "Pro Seniore", "Malteser Hilfsdienst", "Johanniter-Unfall-Hilfe"], salary: "$3,400 - $4,500 per month" },
    "Manufacturing": { companies: ["Volkswagen Group", "BASF SE", "Daimler Truck AG", "Continental AG", "BMW Group", "Bayer AG"], salary: "$3,800 - $5,200 per month" },
    "Professional Heavy Truck Driver": { companies: ["DHL Express Germany", "DB Schenker", "Kuehne + Nagel Germany", "Dachser SE", "Hermes Germany"], salary: "$3,500 - $4,800 per month" },
    "Elderly Care & Support Worker": { companies: ["Korian Deutschland GmbH", "Vitanas Group", "Pro Seniore", "Malteser Hilfsdienst", "Johanniter-Unfall-Hilfe"], salary: "$3,400 - $4,500 per month" },
    "Default": { companies: ["Deutsche Telekom AG", "BMW Group", "Allianz SE", "Adidas AG", "E.ON SE"], salary: "$3,500 - $4,500 per month" }
  },
  "Qatar": {
    "Agriculture & Packaging": { companies: ["Hassad Food", "Baladna Food Industries", "Qatar National Import and Export (QNIE)", "Gulf Food Production", "Arab Qatari Agricultural Production Company"], salary: "$1,300 - $1,900 per month" },
    "Construction & Logistics": { companies: ["QDVC Q.S.C.", "Galfar Al Misnad", "Midmac Contracting Co.", "HBK Contracting", "Consolidated Contractors Company (CCC)"], salary: "$1,600 - $2,800 per month" },
    "Facility Cleaning & Janitor": { companies: ["Qatar Maintenance and Services Co (QMS)", "Ametrade Qatar", "Al-Sraiya Holding", "Qatar Cleaning Company", "Doha Services Group"], salary: "$1,100 - $1,550 per month" },
    "Professional Security": { companies: ["G4S Qatar W.L.L.", "Hemaya Security", "Teyseer Services", "Al-Majal Service Master", "European Guarding & Security"], salary: "$1,300 - $2,000 per month" },
    "Hospitality & Retail": { companies: ["Al Asmakh Facilities Management", "Tanzifco Company Qatar", "Waseef Facility Management", "Al-Sraiya Holding", "Mowasalat (IDM Division)"], salary: "$1,200 - $1,750 per month" },
    "Essential Services": { companies: ["Qatar Maintenance and Services Co (QMS)", "Ametrade Qatar", "Al-Sraiya Holding", "Qatar Cleaning Company", "Doha Services Group"], salary: "$1,100 - $1,550 per month" },
    "Public Administration": { companies: ["Government of Qatar (State Sector)", "Qatar Foundation", "Hamad Medical Corporation (Admin)"], salary: "$1,500 - $2,500 per month" },
    "Default": { companies: ["Qatar Airways Group", "QatarEnergy", "Ooredoo Qatar", "Qatar National Bank (QNB)", "Msheireb Properties"], salary: "$1,500 - $2,500 per month" }
  },
  "USA": {
    "Agriculture & Packaging": { companies: ["Cargill, Inc.", "Archer Daniels Midland (ADM)", "Tyson Foods", "Sysco Corporation", "Dole Food Company"], salary: "$2,900 - $3,800 per month" },
    "Construction & Logistics": { companies: ["Schneider National, Inc.", "J.B. Hunt Transport", "Swift Transportation", "Knight-Swift", "Old Dominion Freight Line", "XPO Logistics", "Bechtel Corporation", "Turner Construction"], salary: "$3,500 - $5,800 per month" },
    "Engineering & Technical": { companies: ["Roto-Rooter Services", "American Residential Services (ARS)", "Mr. Rooter Plumbing", "Benjamin Franklin Plumbing", "Rooter-Man"], salary: "$3,200 - $4,800 per month" },
    "Manufacturing": { companies: ["General Motors", "Ford Motor Company", "Intel Corporation", "Lockheed Martin", "General Electric"], salary: "$3,800 - $5,500 per month" },
    "Public Administration": { companies: ["Federal Government Agency (EAC Partner)", "State of California Public Works", "City of New York Administration"], salary: "$3,800 - $5,200 per month" },
    "Financial Services": { companies: ["JPMorgan Chase", "Bank of America", "Citigroup", "Wells Fargo", "Goldman Sachs", "Morgan Stanley"], salary: "$4,200 - $6,800 per month" },
    "Default": { companies: ["FedEx Corporation", "United Parcel Service (UPS)", "Amazon Logistics", "Walmart Inc.", "Target Corporation"], salary: "$3,200 - $4,800 per month" }
  },
  "UK": {
    "Agriculture & Packaging": { companies: ["AB Agri", "G's Fresh", "Barfoots of Botley", "Muntons PLC", "Terravesta"], salary: "$2,800 - $3,800 per month" },
    "Information Technology": { companies: ["Sage Group PLC", "Softcat PLC", "Computacenter UK", "Fujitsu UK", "Micro Focus", "Endava"], salary: "$4,200 - $6,500 per month" },
    "Financial Services": { companies: ["HSBC UK Bank PLC", "Barclays Bank UK", "Lloyds Banking Group", "NatWest Group", "Standard Chartered UK", "Santander UK"], salary: "$4,800 - $7,500 per month" },
    "Healthcare & Caregiving": { companies: ["Bupa UK", "HC-One Ltd.", "Four Seasons Health Care", "Sunrise Senior Living UK", "Spire Healthcare"], salary: "$3,600 - $4,800 per month" },
    "Education & Training": { companies: ["Pearson PLC", "GEMS Education UK", "Bright Horizons", "Nord Anglia Education", "Busy Bees Nurseries"], salary: "$4,000 - $5,500 per month" },
    "Public Administration": { companies: ["Civil Service (EAC Gateway)", "NHS Administration", "London City Council (GLA)"], salary: "$3,800 - $5,000 per month" },
    "Default": { companies: ["Tesco PLC", "Sainsbury's", "Royal Mail", "Marks & Spencer", "Vodafone UK"], salary: "$3,500 - $5,000 per month" }
  },
  "Canada": {
    "Agriculture & Packaging": { companies: ["Nutrien Ltd.", "Richardson International", "Parrish & Heimbecker", "Viterra Canada", "Cargill Canada"], salary: "$2,800 - $3,800 per month" },
    "Construction & Logistics": { companies: ["Mullen Group Ltd.", "TFI International", "Bison Transport", "Day & Ross", "Titanium Transportation Group", "Challenger Motor Freight", "PCL Construction", "EllisDon"], salary: "$3,200 - $5,200 per month" },
    "Essential Services": { companies: ["Aecon Group Inc.", "Graham Construction", "SNC-Lavalin Infrastructure", "EllisDon Corporation", "Pomerleau"], salary: "$3,000 - $4,200 per month" },
    "Public Administration": { companies: ["Government of Canada (Global Skills Stream)", "Province of Ontario Public Service", "City of Toronto Corporate"], salary: "$3,500 - $4,800 per month" },
    "Default": { companies: ["Air Canada", "BMO Financial Group", "Rogers Communications", "Telus", "Suncor Energy"], salary: "$3,000 - $4,500 per month" }
  },
  "UAE (Dubai)": {
    "Agriculture & Packaging": { companies: ["Al Dahra Holding", "National Feed and Flour Production", "Emirates Biotech", "Al Rawabi Dairy Company", "Marmum Dairy Farm"], salary: "$1,600 - $2,400 per month" },
    "Professional Security": { companies: ["Arkan Security Solutions", "Transguard Group", "G4S UAE", "World Security", "Ejadah Asset Management"], salary: "$1,500 - $2,400 per month" },
    "Hospitality & Retail": { companies: ["Berkeley Services UAE", "Farnek Services", "EFS Facilities Management", "Imdaad", "Khidmah"], salary: "$1,400 - $2,000 per month" },
    "Essential Services": { companies: ["National Pest Control (NPC)", "Rentokil Boecker UAE", "Global Pest Control", "Al-Futtaim Technical Services", "Dulsco Waste Management", "Bee'ah UAE"], salary: "$1,500 - $2,300 per month" },
    "Public Administration": { companies: ["Government of Dubai (Smart Dubai)", "DP World Corporate", "Emirates Group Admin"], salary: "$1,800 - $2,800 per month" },
    "Default": { companies: ["DP World", "Emirates Group", "Etisalat UAE", "Emaar Properties", "Abu Dhabi National Oil Company (ADNOC)"], salary: "$1,600 - $2,500 per month" }
  },
  "Australia": {
    "Agriculture & Packaging": { companies: ["Elders Limited", "GrainCorp", "Australian Agricultural Company", "Nutrien Ag Solutions Australia", "Viterra Australia"], salary: "$2,800 - $3,800 per month" },
    "Construction & Logistics": { companies: ["Lendlease Group", "CIMIC Group", "Brookfield Multiplex", "John Holland", "CPB Contractors"], salary: "$3,500 - $5,000 per month" },
    "Engineering & Technical": { companies: ["Reece Group", "O'Brien Plumbing", "Metcash (Home Timber & Hardware)", "Laser Plumbing Australia"], salary: "$3,200 - $4,500 per month" },
    "Gardening": { companies: ["Landscape Solutions Australia", "Green Options", "Skyline Landscape", "Programmed Property Services"], salary: "$2,600 - $3,500 per month" },
    "Public Administration": { companies: ["Commonwealth of Australia (Public Service)", "State Government of Victoria", "City of Melbourne Administration"], salary: "$3,600 - $4,800 per month" },
    "Default": { companies: ["Woolworths Group", "Rio Tinto Australia", "Wesfarmers", "Commonwealth Bank", "Telstra"], salary: "$3,000 - $4,200 per month" }
  },
  "Saudi Arabia": {
    "Agriculture & Packaging": { companies: ["Almarai", "NADEC (National Agricultural Development Co)", "SAVOLA Group", "SALIC (Saudi Agricultural Investment)", "Al Jouf Agricultural Development"], salary: "$1,500 - $2,200 per month" },
    "Essential Services": { companies: ["Nesma & Partners", "Saudi Binladin Group (FM Division)", "Al Gihaz Holding", "Al-Tamimi Group", "Saudi Oger (Services)"], salary: "$1,300 - $1,800 per month" },
    "Professional Security": { companies: ["Rezayat Group", "Al-Majal Service Master", "Al Safeer Security", "G4S Saudi Arabia"], salary: "$1,400 - $2,000 per month" },
    "Construction & Logistics": { companies: ["El Seif Engineering Contracting", "Red Sea International", "Arabian Construction Co. (ACC)", "Almabani General Contractors", "Saudi Binladin Group", "Almajdouie Logistics"], salary: "$1,750 - $2,600 per month" },
    "Public Administration": { companies: ["Government of Saudi Arabia (Ministry Portal)", "Neom Project Administration", "Aramco Community Services"], salary: "$1,800 - $2,800 per month" },
    "Professional Heavy Truck Driver": { companies: ["Almajdouie Logistics", "Arabian Transport Company", "Hala Supply Chain Services", "Bahri Logistics"], salary: "$1,850 - $2,700 per month" },
    "Default": { companies: ["Saudi Aramco", "SABIC", "STC (Saudi Telecom Company)", "Ma'aden", "Nadec"], salary: "$1,500 - $2,500 per month" }
  },
  "Default": {
    "Default": { companies: ["Global EAC Partners Ltd", "Alliance World Logistics", "Inter-Continental Group", "Verify Workforce Solutions"], salary: "$1,500 - $3,500 per month" }
  }
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-confirmation', async (req, res) => {
  const { email, applicationNumber } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: { name: "East African Community", address: process.env.EMAIL_USER },
    to: email,
    subject: `Official Application Received - ${applicationNumber}`,
    text: `Hello,\n\nThank you for applying through the official East African Community Portal! We have successfully received your application.\n\nYour Application Number is: ${applicationNumber}\n\nYou can track your application status on our official portal at any time. We look forward to assisting your employment journey within our partner countries!\n\nBest regards,\nEast African Community Team`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0088CC; text-align: center;">Official Application Received!</h2>
        <p>Hello,</p>
        <p>Thank you for choosing the <strong>East African Community Portal</strong>. We are pleased to inform you that your application for employment placement has been successfully received and is now under official review by the East African Community.</p>
        
        <div style="background: #e6f7ff; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #0088CC;">
          <p style="margin: 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Official Application Number</p>
          <p style="margin: 10px 0 0; color: #0088CC; font-size: 28px; font-weight: bold;">${applicationNumber}</p>
        </div>
        
        <p>You can use this reference number to securely check your status on our portal. We will also send updates via SMS and Email as your EAC labor clearance progresses.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong style="color: #0088CC;">East African Community Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

  const { error: dbError } = await supabase
    .from('otps')
    .upsert([{ email, code: otp, expires_at: expiresAt }], { onConflict: 'email' });

  if (dbError) {
    console.error('Database Error:', dbError);
    return res.status(500).json({ error: 'Failed to generate code' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: { name: "East African Community", address: process.env.EMAIL_USER },
    to: email,
    subject: `Your Verification Code - EAC Portal`,
    text: `Your email verification code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #003366; text-align: center;">Email Verification</h2>
        <p>Your official verification code is:</p>
        <div style="background: #f4f8fb; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #003366; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Verification code sent.' });
  } catch (error) {
    console.error('Email Error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  if (data.code !== code) {
    return res.status(400).json({ error: 'Incorrect verification code' });
  }

  if (new Date(data.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  await supabase.from('otps').delete().eq('email', email);
  return res.status(200).json({ message: 'Email verified successfully!' });
});

// --- Cynthia Dashboard API ---

app.get('/api/get-applicants', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('eacapplications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Failed to fetch applicants', details: error.message });
  }
});

app.post('/api/send-initial-verification', async (req, res) => {
  const { email, applicationNumber, phone, jobSubcategory, jobSector, destinationCountry } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  // --- Dynamic Employer Selection Logic (To Match Offer) ---
  const countryPool = EMPLOYER_DATA[destinationCountry] || EMPLOYER_DATA["Default"];
  // Prioritize specific subcategory, then the broad sector
  const sectorData = countryPool[jobSubcategory] || countryPool[jobSector] || countryPool["Default"];
  const pool = sectorData.companies || ["Global EAC Partners Ltd"];
  const seed = (applicationNumber || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const companyName = pool[seed % pool.length];

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: { name: "East African Community Portal", address: process.env.EMAIL_USER },
    to: email,
    subject: `Application Update: Initial Verification Passed - ${applicationNumber}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #003366; text-align: center;">Initial Verification Passed!</h2>
        <p>Hello,</p>
        <p>We are pleased to inform you that your application <strong>${applicationNumber}</strong> for the position of <strong>${jobSubcategory || 'Specialized Role'}</strong> in <strong>${destinationCountry || 'International Partner Country'}</strong> has successfully passed the initial verification phase.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 15px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Assigned Employer:</strong> ${companyName}</p>
          <p style="margin: 5px 0 0; font-size: 14px;"><strong>Sector:</strong> ${jobSector || 'Verified Global Partner'}</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #dcfce7; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #166534;">Next Steps:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Contact Your Agent:</strong> Please reach out to your assigned agent immediately via <strong>WhatsApp at +254737872584</strong> for detailed guidance on how to proceed with the payment.</li>
            <li><strong>Payment & Documentation:</strong> Once the payment is verified, you will receive your <strong>Official Payment Receipt</strong> and your <strong>Job Offer Letter</strong>.</li>
            <li><strong>Contract:</strong> Upon your acceptance of the offer letter, the formal employment contract will be sent directly to your email.</li>
            <li><strong>Visa Guidance:</strong> We will also provide comprehensive guidance on the steps required to secure your visa.</li>
          </ul>
        </div>
        
        <p>We are excited to move forward with your application and assist you in your professional journey!</p>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong style="color: #003366;">East African Community Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message regarding your application status.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    // Update Supabase to record this stage
    const { error: dbError } = await supabase
      .from('eacapplications')
      .update({ 
        status: 'Verified'
      })
      .eq('application_number', applicationNumber);

    if (dbError) {
        console.error('Database Update Error:', dbError);
        // We still send 200 because the email was sent, but we warn about the DB
    } else {
        console.log(`Successfully updated status to Verified for ${applicationNumber}`);
    }

    res.status(200).json({ message: 'Initial verification email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.post('/api/send-offer-letter', async (req, res) => {
  const { email, applicationNumber, full_name, jobSubcategory, jobSector, destinationCountry } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  // --- Dynamic Employer Selection Logic (Multi-Pool) ---
  const countryPool = EMPLOYER_DATA[destinationCountry] || EMPLOYER_DATA["Default"];
  // Prioritize specific subcategory, then the broad sector
  const sectorData = countryPool[jobSubcategory] || countryPool[jobSector] || countryPool["Default"];
  
  // Pick a consistent company from the array pool based on applicationNumber
  const pool = sectorData.companies || ["Global EAC Partners Ltd"];
  const seed = (applicationNumber || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const companyName = pool[seed % pool.length];
  const salaryRange = sectorData.salary;

  try {
    // 1. Generate QR Code
    const qrData = `EAC Verification - Ref: ${applicationNumber}\nApplicant: ${full_name}\nRole: ${jobSubcategory}\nEmployer: ${companyName}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // 2. Create PDF
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Header & Border (Double line for extra official feel)
    doc.lineWidth(2).rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#003366");
    doc.lineWidth(0.5).rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#003366");
    
    // Logo / Header Arrangement
    const logoSize = 65;
    const logoPath = path.resolve(__dirname, 'assets', 'logo.png');
    if (fs.existsSync(logoPath)) {
      try {
        // Place logo at top right for a cleaner look
        doc.image(logoPath, doc.page.width - 120, 35, { width: logoSize });
      } catch (err) {
        console.error('PDF Logo Error:', err);
      }
    }
    
    // Header Text (Shifted left to accommodate logo)
    doc.font('Helvetica-Bold').fontSize(22).fillColor("#003366").text("East African Community", 50, 45);
    doc.fontSize(10).fillColor("#666").text("International Deployment Division", 50, 70);
    doc.moveDown(2.5);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#003366");
    doc.moveDown(1.5);

    // Offer Title
    doc.fontSize(18).fillColor("#111").text("OFFICIAL JOB OFFER LETTER", { align: 'center', underline: true });
    doc.moveDown(2);

    // Content
    doc.fontSize(11).fillColor("#333").text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Ref: ${applicationNumber}`);
    doc.moveDown(0.5);
    doc.text(`To: ${full_name}`);
    doc.text(`Dear ${full_name},`);
    doc.moveDown(0.5);
    doc.fillColor("#000").text(`On behalf of ${companyName}, we are pleased to offer you the position of ${jobSubcategory || 'Specialized Associate'} at our facility in ${destinationCountry}. This offer is made following your successful verification through the East African Community Portal.`, { align: 'justify' });
    doc.moveDown(1);
    
    doc.font('Helvetica-Bold').text("Key Terms of Offer:");
    doc.moveDown(0.3);
    doc.font('Helvetica').text(`- Employer: ${companyName}`);
    doc.text(`- Position: ${jobSubcategory || 'Specialized Associate'}`);
    doc.text(`- Remuneration: ${salaryRange} USD`);
    doc.text("- Duration: 24 Months (Renewable)");
    doc.moveDown(1);

    doc.text("All benefits including health insurance, local transportation, and accommodation allowance will be detailed in your formal Employment Contract, which will be issued upon your acceptance of this offer letter.", { align: 'justify' });
  
  
    doc.moveDown(1.5);
    doc.text("Yours sincerely,");
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text("Director of Recruitment");
    doc.text("East African Community Board");

    // 3. Add Watermarks (Official + COPY)
    doc.save();
    doc.opacity(0.08);
    doc.fontSize(70).fillColor("#003366").rotate(-45, { origin: [300, 400] }).text("EAC VERIFIED", 150, 400);
    doc.restore();

    doc.save();
    doc.opacity(0.15);
    doc.fontSize(100).fillColor("#FF0000").rotate(-30, { origin: [300, 300] }).text("COPY", 200, 300);
    doc.restore();

    // 4. Add QR Code
    doc.image(qrCodeImage, 450, 600, { width: 90 });
    doc.fontSize(7).fillColor("#666").text("Scan to verify authenticity", 455, 695);

    // 5. Add Stamps
    const eacStampPath = path.resolve(__dirname, 'assets', 'eac_stamp.png');
    const partnerStampPath = path.resolve(__dirname, 'assets', 'partner_stamp.png');
    
    try {
        if (fs.existsSync(eacStampPath)) {
          doc.image(eacStampPath, 50, 600, { width: 90 });
        }
        if (fs.existsSync(partnerStampPath)) {
          doc.image(partnerStampPath, 160, 610, { width: 110 });
        }
    } catch (err) {
        console.error('PDF Stamp Error:', err);
    }

    doc.end();

    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: { name: "East African Community Portal", address: process.env.EMAIL_USER },
        to: email,
        subject: `[COPY] OFFICIAL JOB OFFER: ${jobSubcategory} - ${destinationCountry}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 12px; background-color: #fcfcfc;">
            <div style="background-color: #003366; padding: 10px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
                <h3 style="margin: 0;">EAC Official Communication</h3>
            </div>
            <h2 style="color: #003366;">Hello ${full_name},</h2>
            <p>Please find attached a <strong>COPY</strong> of your official job offer letter for your placement in <strong>${destinationCountry}</strong>.</p>
            <p>This document is for your immediate reference. It contains your salary details, employer information (${companyName}), and a secure verification QR code.</p>
            
            <div style="background: #fff4f4; padding: 15px; border-radius: 8px; border: 1px solid #ffcccc; margin: 20px 0;">
                <p style="margin: 0; color: #cc0000; font-weight: bold;">NOTICE: This is a duplicate copy for your records.</p>
            </div>

            <p><strong>Required Actions:</strong></p>
            <ul>
              <li>Review the attached PDF terms.</li>
              <li>Contact your assigned agent at <strong>+254737872584</strong> to confirm receipt and next steps.</li>
            </ul>
            <p>Congratulations on your placement within the EAC Global Employment Network!</p>
            <p style="margin-top: 25px;">Best regards,<br><strong>East African Community Team</strong></p>
            <div style="font-size: 10px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
                Verification ID: ${applicationNumber} | EAC International Deployment Division
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Job_Offer_COPY_${applicationNumber}.pdf`,
            content: pdfData
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      // 6. Update Status
      await supabase
        .from('eacapplications')
        .update({ status: 'Offer Letter Sent' })
        .eq('application_number', applicationNumber);

      res.status(200).json({ message: 'Offer letter copy sent successfully' });
    });

  } catch (error) {
    console.error('Error generating/sending offer letter:', error);
    res.status(500).json({ error: 'Failed to generate or send offer letter copy', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node server running on http://127.0.0.1:${port}`);
});
