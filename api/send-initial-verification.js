import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const SUPABASE_URL = "https://gbotwkyaagcffzvcyzuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Egi9rMCDbL0BP6R9Mbh_0Q_LxEHau5r";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EMPLOYER_DATA = {
  "Poland": {
    "Agriculture & Packaging": { companies: ["Animex Foods Sp. z o.o.", "Cedrob S.A.", "Agro-Handel Sp. z o.o.", "Osadkowski S.A.", "Agros Nova"] },
    "Essential Services": { companies: ["Remondis Poland Sp. z o.o.", "Alba Polska", "MPO Warszawa", "Lekaro", "Eneris Surowce"] },
    "Construction & Logistics": { companies: ["Budimex S.A.", "Skanska S.A.", "STRABAG Polska", "Erbud S.A.", "Warbud S.A.", "Mostostal Warszawa"] },
    "Professional Heavy Truck Driver": { companies: ["Raben Logistics Poland", "Waberer's Polska", "PKP Cargo Connect", "DB Schenker Poland", "GXO Logistics Poland"] },
    "Hospitality & Retail": { companies: ["Impel Group S.A.", "Clarina Polska", "Dussmann Service", "Juventas", "Serwisant Sp. z o.o."] },
    "Manufacturing": { companies: ["LPP S.A.", "KGHM Polska Miedź", "PKN Orlen", "Grupa Azoty", "Asseco Poland"] },
    "Default": { companies: ["Raben Group", "InPost", "PKN Orlen", "LPP S.A.", "Alior Bank"] }
  },
  "Germany": {
    "Information Technology": { companies: ["SAP SE", "Deutsche Telekom IT", "Capgemini Germany", "T-Systems", "CGI Germany", "Atos IT Solutions"] },
    "Engineering & Technical": { companies: ["Siemens AG", "Robert Bosch GmbH", "ThyssenKrupp AG", "Lufthansa Technik", "Continental AG"] },
    "Healthcare & Caregiving": { companies: ["Korian Deutschland GmbH", "Helios Kliniken GmbH", "Vitanas Group", "Pro Seniore", "Malteser Hilfsdienst"] },
    "Manufacturing": { companies: ["Volkswagen Group", "BASF SE", "Daimler Truck AG", "Continental AG", "BMW Group", "Bayer AG"] },
    "Default": { companies: ["Deutsche Telekom AG", "BMW Group", "Allianz SE", "Adidas AG", "E.ON SE"] }
  },
  "Default": {
    "Default": { companies: ["Global EAC Partners Ltd", "International Deployment Corp", "EAC Workforce Alliances"] }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, applicationNumber, jobSubcategory, jobSector, destinationCountry } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  const countryPool = EMPLOYER_DATA[destinationCountry] || EMPLOYER_DATA["Default"];
  const sectorData = countryPool[jobSubcategory] || countryPool[jobSector] || countryPool["Default"] || { companies: ["Global EAC Partners Ltd"] };
  const pool = sectorData.companies || ["Global EAC Partners Ltd"];
  const seed = (applicationNumber || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const companyName = pool[seed % pool.length];

  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!emailUser || !emailPass) {
    return res.status(500).json({ error: 'Email service credentials not configured', details: 'EMAIL_USER or EMAIL_PASS missing' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: { name: "East African Community Portal", address: emailUser },
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
    
    await supabase
      .from('eacapplications')
      .update({ status: 'Verified' })
      .eq('application_number', applicationNumber);

    return res.status(200).json({ message: 'Initial verification email sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
