import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const SUPABASE_URL = "https://gbotwkyaagcffzvcyzuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Egi9rMCDbL0BP6R9Mbh_0Q_LxEHau5r";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EMPLOYER_DATA = {
  "Poland": {
    "Agriculture & Packaging": { companies: ["Animex Foods Sp. z o.o.", "Cedrob S.A.", "Agro-Handel Sp. z o.o."], salary: "$1,450 - $1,850 per month" },
    "Essential Services": { companies: ["Remondis Poland Sp. z o.o.", "Alba Polska", "MPO Warszawa"], salary: "$1,400 - $1,750 per month" },
    "Construction & Logistics": { companies: ["Budimex S.A.", "Skanska S.A.", "STRABAG Polska"], salary: "$1,600 - $2,200 per month" },
    "Professional Heavy Truck Driver": { companies: ["Raben Logistics Poland", "Waberer's Polska"], salary: "$1,850 - $2,600 per month" },
    "Hospitality & Retail": { companies: ["Impel Group S.A.", "Clarina Polska", "Dussmann Service"], salary: "$1,350 - $1,650 per month" },
    "Manufacturing": { companies: ["LPP S.A.", "KGHM Polska Miedź", "PKN Orlen"], salary: "$1,700 - $2,400 per month" },
    "Default": { companies: ["Raben Group", "InPost", "PKN Orlen"], salary: "$1,500 - $2,000 per month" }
  },
  "Germany": {
    "Information Technology": { companies: ["SAP SE", "Deutsche Telekom IT", "Capgemini Germany"], salary: "$4,800 - $7,000 per month" },
    "Engineering & Technical": { companies: ["Siemens AG", "Robert Bosch GmbH", "ThyssenKrupp AG"], salary: "$4,500 - $6,200 per month" },
    "Healthcare & Caregiving": { companies: ["Korian Deutschland GmbH", "Helios Kliniken GmbH"], salary: "$3,400 - $4,500 per month" },
    "Manufacturing": { companies: ["Volkswagen Group", "BASF SE", "BMW Group"], salary: "$3,800 - $5,200 per month" },
    "Default": { companies: ["Deutsche Telekom AG", "BMW Group", "Allianz SE"], salary: "$3,500 - $4,500 per month" }
  },
  "Qatar": {
    "Agriculture & Packaging": { companies: ["Hassad Food", "Baladna Food Industries"], salary: "$1,300 - $1,900 per month" },
    "Construction & Logistics": { companies: ["QDVC Q.S.C.", "Galfar Al Misnad", "Midmac Contracting Co."], salary: "$1,600 - $2,800 per month" },
    "Facility Cleaning & Janitor": { companies: ["Qatar Maintenance and Services Co (QMS)", "Al-Sraiya Holding"], salary: "$1,100 - $1,550 per month" },
    "Professional Security": { companies: ["G4S Qatar W.L.L.", "Hemaya Security"], salary: "$1,300 - $2,000 per month" },
    "Default": { companies: ["Qatar Airways Group", "QatarEnergy", "Ooredoo Qatar"], salary: "$1,500 - $2,500 per month" }
  },
  "Default": {
    "Default": { companies: ["Global EAC Partners Ltd", "International Placement Corp"], salary: "$2,000 - $3,500 per month" }
  }
};

function getAssetPath(filename) {
  const cwdPath = path.resolve(process.cwd(), 'assets', filename);
  if (fs.existsSync(cwdPath)) return cwdPath;
  const parentPath = path.resolve(process.cwd(), '..', 'assets', filename);
  if (fs.existsSync(parentPath)) return parentPath;
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, applicationNumber, full_name, jobSubcategory, jobSector, destinationCountry } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  const countryPool = EMPLOYER_DATA[destinationCountry] || EMPLOYER_DATA["Default"];
  const sectorData = countryPool[jobSubcategory] || countryPool[jobSector] || countryPool["Default"] || { companies: ["Global EAC Partners Ltd"], salary: "$1,800 - $2,500 per month" };
  const pool = sectorData.companies || ["Global EAC Partners Ltd"];
  const seed = (applicationNumber || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const companyName = pool[seed % pool.length];
  const salaryRange = sectorData.salary;

  try {
    const qrData = `EAC Verification - Ref: ${applicationNumber}\nApplicant: ${full_name}\nRole: ${jobSubcategory}\nEmployer: ${companyName}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // Double line border
    doc.lineWidth(2).rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#003366");
    doc.lineWidth(0.5).rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#003366");

    // Logo
    const logoPath = getAssetPath('logo.png');
    if (logoPath) {
      try {
        doc.image(logoPath, doc.page.width - 120, 35, { width: 65 });
      } catch (err) {
        console.error('PDF Logo Error:', err);
      }
    }

    doc.font('Helvetica-Bold').fontSize(22).fillColor("#003366").text("East African Community", 50, 45);
    doc.fontSize(10).fillColor("#666").text("International Deployment Division", 50, 70);
    doc.moveDown(2.5);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#003366");
    doc.moveDown(1.5);

    doc.fontSize(18).fillColor("#111").text("OFFICIAL JOB OFFER LETTER", { align: 'center', underline: true });
    doc.moveDown(2);

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
    doc.text(`- Remuneration: ${salaryRange}`);
    doc.text("- Duration: 24 Months (Renewable)");
    doc.moveDown(1);

    doc.text("All benefits including health insurance, local transportation, and accommodation allowance will be detailed in your formal Employment Contract, which will be issued upon your acceptance of this offer letter.", { align: 'justify' });

    doc.moveDown(1.5);
    doc.text("Yours sincerely,");
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text("Director of Recruitment");
    doc.text("East African Community Board");

    // Watermarks
    doc.save();
    doc.opacity(0.08);
    doc.fontSize(70).fillColor("#003366").rotate(-45, { origin: [300, 400] }).text("EAC VERIFIED", 150, 400);
    doc.restore();

    doc.save();
    doc.opacity(0.15);
    doc.fontSize(100).fillColor("#FF0000").rotate(-30, { origin: [300, 300] }).text("COPY", 200, 300);
    doc.restore();

    // QR Code
    doc.image(qrCodeImage, 450, 600, { width: 90 });
    doc.fontSize(7).fillColor("#666").text("Scan to verify authenticity", 455, 695);

    // Stamps
    const eacStampPath = getAssetPath('eac_stamp.png');
    const partnerStampPath = getAssetPath('partner_stamp.png');
    try {
      if (eacStampPath) doc.image(eacStampPath, 50, 600, { width: 90 });
      if (partnerStampPath) doc.image(partnerStampPath, 160, 610, { width: 110 });
    } catch (err) {
      console.error('PDF Stamp Error:', err);
    }

    doc.end();

    const pdfData = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
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

    await supabase
      .from('eacapplications')
      .update({ status: 'Offer Letter Sent' })
      .eq('application_number', applicationNumber);

    return res.status(200).json({ message: 'Offer letter copy sent successfully' });
  } catch (error) {
    console.error('Error generating/sending offer letter:', error);
    return res.status(500).json({ error: 'Failed to generate or send offer letter copy', details: error.message });
  }
}
