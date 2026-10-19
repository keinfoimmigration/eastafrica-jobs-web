
// Mocking the mapping from server.js for verification
const EMPLOYER_DATA = {
  "Poland": {
    "Agriculture": { company: "Animex Foods Sp. z o.o.", salary: "$1,450 - $1,850" },
    "Waste Management": { company: "Remondis Poland Sp. z o.o.", salary: "$1,400 - $1,750" },
    "Construction": { company: "Budimex S.A.", salary: "$1,600 - $2,200" },
    "Housekeeping": { company: "Impel Group", salary: "$1,350 - $1,650" },
    "Truck Driving": { company: "PKP Cargo S.A.", salary: "$1,800 - $2,500" },
    "Default": { company: "Polska Logistyka S.A.", salary: "$1,500 - $2,000" }
  },
  "Germany": {
    "Information Technology": { company: "SAP SE", salary: "$4,500 - $6,500" },
    "Engineering & Technical": { company: "Siemens AG", salary: "$4,200 - $5,800" },
    "Elderly Care": { company: "Helios Kliniken GmbH", salary: "$3,200 - $4,200" },
    "Manufacturing": { company: "BASF SE", salary: "$3,500 - $4,800" },
    "Logistics": { company: "DHL Express Germany", salary: "$3,000 - $3,800" },
    "Default": { company: "Berlin Technical Solutions GmbH", salary: "$3,500 - $4,500" }
  },
  // ... adding a few more for the test
  "Canada": {
    "Truck Driving": { company: "TFI International Inc.", salary: "$3,200 - $4,800" },
    "Agriculture": { company: "Nutrien Ltd.", salary: "$2,500 - $3,500" },
    "Default": { company: "Canada Maple Leaf Resources", salary: "$3,000 - $4,200" }
  }
};

function getTerms(country, job) {
    const countryPool = EMPLOYER_DATA[country] || { Default: { company: "Global EAC Partners Ltd", salary: "Competitive USD Rate" } };
    const employerEntry = countryPool[job] || countryPool["Default"];
    return {
        employer: employerEntry.company,
        salary: `${employerEntry.salary} USD`
    };
}

const testCases = [
    { country: "Poland", job: "Construction" },
    { country: "Germany", job: "Information Technology" },
    { country: "Canada", job: "Truck Driving" },
    { country: "Poland", job: "Unknown Job" }, // Should hit Polish Default
    { country: "Unknown Country", job: "Truck Driving" } // Should hit Global Default
];

console.log("--- Offer Letter Terms Verification ---");
testCases.forEach(tc => {
    const terms = getTerms(tc.country, tc.job);
    console.log(`Test Case: ${tc.country} | ${tc.job}`);
    console.log(`Employer: ${terms.employer}`);
    console.log(`Salary:   ${terms.salary}`);
    console.log("---------------------------------------");
});
