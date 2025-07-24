// Dummy data for Wrongful Death form demonstration
export const wrongfulDeathDummyData = {
  // Contact Information
  firstName: "Robert",
  lastName: "Thompson",
  address1: "1234 Oak Street",
  address2: "Apt 205",
  city: "Springfield",
  state: "Illinois",
  zipCode: "62701",

  // Demographics
  gender: "male",
  maritalStatus: "married",
  dateOfBirth: "1975-03-15",
  dateOfDeath: "2024-01-10",
  ethnicity: "white",

  // Medical
  healthIssues: "Robert was in good health prior to the accident. He had mild hypertension controlled with medication and occasional back pain from a previous work injury in 2019. He maintained regular exercise and had no significant medical limitations that affected his work or daily activities.",
  workMissed: "Robert missed approximately 3 weeks of work in 2023 due to a minor back strain, which was successfully treated with physical therapy. Otherwise, he had excellent attendance and rarely took sick days throughout his career.",

  // Education & Employment
  educationLevel: "Bachelor's Degree in Mechanical Engineering",
  skillsLicenses: "Professional Engineer (PE) License, Project Management Professional (PMP) Certification, CAD Software Proficiency (AutoCAD, SolidWorks)",
  employmentStatus: "full-time",
  jobTitle: "Senior Mechanical Engineer",
  employerName: "Springfield Manufacturing Corp",
  startDate: "2005-06-01",
  salary: "$85,000",
  workDuties: "Robert designed and supervised the manufacturing of industrial equipment, managed engineering projects from conception to completion, mentored junior engineers, and collaborated with cross-functional teams to optimize production processes and ensure quality standards.",
  advancements: "2005-2008: Junior Engineer ($45,000); 2008-2012: Engineer II ($55,000); 2012-2017: Senior Engineer ($70,000); 2017-2024: Senior Mechanical Engineer ($85,000). Received annual merit increases of 3-5% and project completion bonuses.",
  overtime: "Robert regularly worked 5-10 hours of overtime per week, particularly during project deadlines. Overtime was compensated at time-and-a-half rate, averaging an additional $8,000-12,000 annually in overtime pay.",
  workSteady: "Yes, Robert maintained steady employment with excellent performance reviews and was considered for promotion to Engineering Manager.",

  // Benefits
  lifeInsurance: "$200,000 company-paid life insurance policy",
  individualHealth: "Premium health insurance plan, company paid 80% of premiums",
  familyHealth: "Family coverage for spouse and two children, company paid 70% of premiums",
  retirementPlan: "401(k) with 6% company match, currently valued at $185,000",
  investmentPlan: "Employee Stock Purchase Plan with 15% discount",
  bonus: "Annual performance bonus ranging from $3,000-7,000 based on company and individual performance",
  stockOptions: "Stock options granted annually, currently valued at approximately $25,000",
  otherBenefits: "3 weeks paid vacation, sick leave, professional development allowance of $2,000/year",

  retirementAge: "65",
  careerTrajectory: "Robert was being considered for promotion to Engineering Manager with an expected salary increase to $100,000-110,000. He planned to continue advancing to Director level by age 55, with potential earnings of $130,000-150,000. He was actively pursuing additional certifications to enhance his qualifications.",
  jobExpenses: "Professional licensing fees ($500/year), continuing education courses ($1,500/year), professional association memberships ($300/year)",

  // Household Services (0-5 scale)
  dependentCare: "4",
  petCare: "2",
  indoorHousework: "3",
  mealPrep: "4",
  homeMaintenance: "5",
  vehicleMaintenance: "5",
  errands: "3",

  // Other
  additionalInfo: "Robert was the primary breadwinner for his family and actively contributed to household management and childcare. He coached his daughter's soccer team and was involved in community activities. His death has created significant financial hardship for his surviving spouse and children, requiring his wife to potentially return to work after being a stay-at-home parent for 8 years. The family will also need to hire help for home maintenance and repairs that Robert previously performed.",

  // Litigation
  settlementDate: "2025-03-15",
  trialDate: "2025-09-10",
  trialLocation: "Sangamon County Courthouse, Springfield, IL",
  opposingCounselFirm: "Miller & Associates Defense Attorneys",
  opposingEconomist: "Dr. Sarah Johnson, Economic Analysis Group LLC",

  // Dynamic Data Arrays
  householdDependents: [
    {
      id: "1",
      fullName: "Maria Thompson",
      dateOfBirth: "1978-07-22",
      relationship: "Spouse"
    },
    {
      id: "2", 
      fullName: "Emma Thompson",
      dateOfBirth: "2010-09-14",
      relationship: "Daughter"
    },
    {
      id: "3",
      fullName: "Michael Thompson", 
      dateOfBirth: "2013-02-08",
      relationship: "Son"
    }
  ],

  otherDependents: [
    {
      id: "1",
      fullName: "Eleanor Thompson",
      dateOfBirth: "1948-12-03", 
      relationship: "Mother (receiving monthly financial support)"
    }
  ],

  employmentYears: [
    {
      id: "1",
      year: "2019",
      income: "$82,500",
      percentEmployed: "100%"
    },
    {
      id: "2", 
      year: "2020",
      income: "$83,200",
      percentEmployed: "100%"
    },
    {
      id: "3",
      year: "2021", 
      income: "$84,100",
      percentEmployed: "100%"
    },
    {
      id: "4",
      year: "2022",
      income: "$84,800", 
      percentEmployed: "100%"
    },
    {
      id: "5",
      year: "2023",
      income: "$85,000",
      percentEmployed: "97%" 
    }
  ]
}