// lib/electionData.ts
// Static election knowledge base — timelines, FAQs, voting steps, documents

export const ELECTION_TIMELINE = [
  { id: 1, date: 'Oct 2025', title: 'Voter Roll Revision', description: 'Annual voter roll revision begins. Check and update your details.', status: 'completed', icon: '📋', color: 'bg-green-500' },
  { id: 2, date: 'Nov 2025', title: 'New Registration Deadline', description: 'Last date to submit Form 6 for new voter registration.', status: 'completed', icon: '📝', color: 'bg-green-500' },
  { id: 3, date: 'Dec 2025', title: 'Final Voter List Published', description: 'Final electoral rolls published. Verify your name at voterportal.eci.gov.in', status: 'completed', icon: '📢', color: 'bg-green-500' },
  { id: 4, date: 'Jan 2026', title: 'Election Schedule Announced', description: 'Election Commission announces official election dates and model code of conduct.', status: 'current', icon: '📅', color: 'bg-blue-500' },
  { id: 5, date: 'Feb 2026', title: 'Nomination Filing', description: 'Candidates file nominations. Last date for withdrawal.', status: 'upcoming', icon: '🏛️', color: 'bg-gray-300' },
  { id: 6, date: 'Mar 2026', title: 'Election Day', description: 'Polling day. Vote at your designated polling booth. Bring your Voter ID.', status: 'upcoming', icon: '🗳️', color: 'bg-gray-300' },
  { id: 7, date: 'Mar 2026', title: 'Vote Counting', description: 'Votes counted under strict security. Results announced the same day.', status: 'upcoming', icon: '🔢', color: 'bg-gray-300' },
  { id: 8, date: 'Apr 2026', title: 'Results & Government Formation', description: 'Official results certified. New government formation begins.', status: 'upcoming', icon: '🏆', color: 'bg-gray-300' },
];

export const VOTING_STEPS = [
  { step: 1, title: 'Register to Vote', description: 'Fill Form 6 online at voterportal.eci.gov.in or visit your local BLO.', details: ['Visit voterportal.eci.gov.in', 'Click "New Registration" → Fill Form 6', 'Upload documents: Photo, Age proof, Address proof', 'Submit and note your reference number', 'Track status online within 30 days'], icon: '📝', color: 'from-blue-500 to-blue-600', time: '10-15 mins', links: [{text: 'Voter Portal', url: 'https://voterportal.eci.gov.in'}, {text: 'Form 6 Guide', url: '/faq'}] },
  { step: 2, title: 'Verify Your Voter ID', description: 'Ensure your Voter ID (EPIC) details are correct and up to date.', details: ['Check name spelling and address on EPIC card', 'Verify constituency details at electoralsearch.eci.gov.in', 'Update errors using Form 8', 'Download e-EPIC (digital voter ID) from NVSP portal', 'Keep original EPIC safe for election day'], icon: '✅', color: 'from-purple-500 to-purple-600', time: '5 mins', links: [{text: 'Electoral Search', url: 'https://electoralsearch.eci.gov.in'}] },
  { step: 3, title: 'Find Your Polling Booth', description: 'Locate your designated polling station using your voter ID or address.', details: ['Visit electoralsearch.eci.gov.in', 'Enter your Voter ID number or name/address', 'Note your booth number and address', 'Plan your route in advance', 'Check booth timing (usually 7 AM – 6 PM)'], icon: '📍', color: 'from-green-500 to-green-600', time: '2 mins', links: [{text: 'Booth Finder', url: '/booth-finder'}] },
  { step: 4, title: 'Cast Your Vote', description: 'Visit your polling booth on election day and exercise your franchise.', details: ['Arrive early to avoid queues', 'Carry your Voter ID (or accepted alternative ID)', 'Show ID to polling officer and get inked finger', 'Enter voting compartment — select candidate on EVM', 'Press VVPAT slot confirmation, exit quietly'], icon: '🗳️', color: 'from-orange-500 to-orange-600', time: '15-30 mins', links: [{text: 'Valid Documents', url: '/documents'}] },
];

export const FAQS = [
  { id: 'faq-1', category: 'Eligibility', question: 'Who is eligible to vote in India?', answer: 'Any Indian citizen who is 18 years or older and is ordinarily resident of their constituency is eligible to vote. NRIs can also register under special provisions.', tags: ['eligibility', 'age', 'citizenship'] },
  { id: 'faq-2', category: 'Registration', question: 'How do I register as a voter?', answer: 'Visit voterportal.eci.gov.in, click on "New Voter Registration" and fill Form 6. Alternatively, visit your local Electoral Registration Officer (ERO) or Booth Level Officer (BLO).', tags: ['registration', 'form 6', 'online'] },
  { id: 'faq-3', category: 'Documents', question: 'What documents do I need to register?', answer: 'You need: (1) Proof of Age – Birth certificate, 10th mark sheet, or Aadhaar; (2) Proof of Address – Aadhaar, Utility bill, or Bank passbook; (3) Recent passport-size photograph.', tags: ['documents', 'aadhaar', 'age proof'] },
  { id: 'faq-4', category: 'Voting', question: 'What should I carry to the polling booth?', answer: 'Carry your EPIC (Voter ID card). If unavailable, you can use 12 alternative documents including Aadhaar, PAN card, Passport, Driving license, or Bank passbook with photograph.', tags: ['polling booth', 'voter id', 'epic'] },
  { id: 'faq-5', category: 'Registration', question: 'What is the deadline for voter registration?', answer: 'There are 4 qualifying dates in a year: January 1, April 1, July 1, and October 1. Registration applications must be submitted before the revision schedule announced by ECI.', tags: ['deadline', 'registration', 'qualifying date'] },
  { id: 'faq-6', category: 'Voting', question: 'Can I vote if my name is not on the electoral roll?', answer: "No, you cannot vote if your name is not in the electoral roll of that constituency. Please check at electoralsearch.eci.gov.in and contact the ERO if there's an error.", tags: ['electoral roll', 'voter list', 'not registered'] },
  { id: 'faq-7', category: 'Booth', question: 'How do I find my polling booth?', answer: 'Visit electoralsearch.eci.gov.in and search by your name/EPIC number, or use the Voter Helpline app. Your polling station details are printed on your EPIC card and voter slip.', tags: ['polling booth', 'find booth', 'voter helpline'] },
  { id: 'faq-8', category: 'Process', question: 'What is EVM and how does it work?', answer: 'Electronic Voting Machine (EVM) is a standalone, tamper-proof device used to record votes electronically. Press the blue button next to your candidate. A VVPAT slip shows your vote for 7 seconds for verification.', tags: ['evm', 'electronic voting', 'vvpat'] },
  { id: 'faq-9', category: 'NRI/Overseas', question: 'Can NRIs vote in Indian elections?', answer: "Non-Resident Indians (NRIs) can register as overseas voters under Section 20A of the Representation of the People Act using Form 6A. They must be present at their constituency's polling booth to vote.", tags: ['nri', 'overseas voter', 'abroad'] },
  { id: 'faq-10', category: 'Process', question: 'What is Model Code of Conduct?', answer: 'The Model Code of Conduct (MCC) is a set of guidelines issued by ECI for political parties and candidates during elections. It aims to ensure free and fair elections and comes into effect from the date of election announcement.', tags: ['mcc', 'code of conduct', 'guidelines'] },
  { id: 'faq-11', category: 'Accessibility', question: 'Are polling booths accessible for persons with disabilities (PwD)?', answer: 'Yes, ECI ensures ramps, wheelchairs, and volunteers at polling booths. Visually impaired voters are provided braille signage on EVMs and can take a companion. PwD voters can also opt for home voting.', tags: ['pwd', 'accessibility', 'wheelchair', 'home voting'] },
  { id: 'faq-12', category: 'Process', question: 'What is NOTA?', answer: 'None of The Above (NOTA) is an option on the EVM that allows voters to officially register a vote of rejection for all candidates contesting in the election.', tags: ['nota', 'evm', 'rejection'] },
  { id: 'faq-13', category: 'Registration', question: 'How can I change my address on my Voter ID?', answer: 'You can change your address by filling out Form 8 on voterportal.eci.gov.in and uploading a valid proof of the new address.', tags: ['address change', 'form 8', 'update'] },
  { id: 'faq-14', category: 'Registration', question: 'What is the Voter Helpline App?', answer: 'The Voter Helpline App is the official mobile application by ECI. It allows you to search your name in the electoral roll, submit forms, download e-EPIC, and lodge complaints.', tags: ['app', 'helpline', 'mobile'] },
  { id: 'faq-15', category: 'Eligibility', question: 'Can a homeless person register to vote?', answer: 'Yes. The Booth Level Officer (BLO) will visit the address (which can be a pavement/bridge/etc.) given by the homeless person for verification. If found residing there, they can be registered.', tags: ['homeless', 'eligibility', 'registration'] },
  { id: 'faq-16', category: 'Process', question: 'What happens if the EVM malfunctions?', answer: 'If an EVM or VVPAT malfunctions, it is immediately replaced by the Sector Officer from the reserve stock. Voting then continues. The votes already cast in the defective machine remain safe.', tags: ['evm', 'malfunction', 'vvpat'] },
  { id: 'faq-17', category: 'NRI/Overseas', question: 'Can an NRI vote online or by postal ballot?', answer: 'Currently, NRIs cannot vote online or via postal ballot. They must be physically present at their designated polling booth in India on the day of voting.', tags: ['nri', 'online voting', 'postal ballot'] },
  { id: 'faq-18', category: 'Booth', question: 'What is a VVPAT?', answer: 'Voter Verifiable Paper Audit Trail (VVPAT) is an independent system attached to the EVM that allows voters to verify that their vote was cast correctly. It prints a paper slip that is visible for 7 seconds.', tags: ['vvpat', 'verification', 'evm'] },
  { id: 'faq-19', category: 'Accessibility', question: 'Can senior citizens vote from home?', answer: 'Yes, voters aged 85+ and Persons with Disabilities (40% benchmark) can opt for the home voting facility using postal ballots by filling Form 12D within 5 days of election notification.', tags: ['senior citizen', 'home voting', 'form 12d'] },
  { id: 'faq-20', category: 'Documents', question: 'Is e-EPIC valid for voting?', answer: 'Yes, the digital e-EPIC is equally valid for voting as the physical card. You can download it from the Voter Helpline App or voterportal.eci.gov.in.', tags: ['e-epic', 'digital', 'validity'] },
  { id: 'faq-21', category: 'Process', question: 'What is the timing for voting on election day?', answer: 'Generally, polling hours are from 7:00 AM to 6:00 PM. However, it may vary in some specific constituencies or due to security reasons. Check your voter slip for exact timings.', tags: ['timing', 'hours', 'polling day'] },
  { id: 'faq-22', category: 'Registration', question: 'How can I delete a deceased family member from the voter list?', answer: 'You can submit Form 7 online at voterportal.eci.gov.in or physically to the BLO/ERO, along with the death certificate, to delete the name of a deceased voter.', tags: ['deletion', 'deceased', 'form 7'] },
  { id: 'faq-23', category: 'Voting', question: 'Can I wear political party symbols to the polling booth?', answer: 'No. Wearing or carrying any badges, symbols, or clothing showing political affiliation within 100 meters of the polling station is strictly prohibited under the Model Code of Conduct.', tags: ['clothing', 'symbols', 'mcc'] },
  { id: 'faq-24', category: 'Registration', question: 'What should I do if my name is misspelled on the Voter ID?', answer: 'You can apply for correction of particulars by submitting Form 8 online at voterportal.eci.gov.in along with a document showing the correct spelling.', tags: ['correction', 'spelling', 'form 8'] },
  { id: 'faq-25', category: 'Eligibility', question: 'Can prison inmates or undertrials vote?', answer: 'Under Section 62(5) of the Representation of the People Act, 1951, individuals confined in a prison (whether under sentence or undertrial) or in lawful custody of the police are generally not entitled to vote, with exceptions for preventive detention.', tags: ['prison', 'undertrial', 'voting rights'] },
];

export const VALID_DOCUMENTS = [
  { id: 'aadhaar', name: 'Aadhaar Card', categories: ['identity', 'address', 'age'], icon: '🪪' },
  { id: 'pan', name: 'PAN Card', categories: ['identity'], icon: '💳' },
  { id: 'passport', name: 'Passport', categories: ['identity', 'address', 'age'], icon: '📘' },
  { id: 'driving-license', name: 'Driving License', categories: ['identity', 'address'], icon: '🚗' },
  { id: 'voter-id', name: 'Voter ID (EPIC)', categories: ['identity', 'address'], icon: '🗳️' },
  { id: 'birth-certificate', name: 'Birth Certificate', categories: ['age'], icon: '📜' },
  { id: 'bank-passbook', name: 'Bank Passbook', categories: ['identity', 'address'], icon: '🏦' },
  { id: 'utility-bill', name: 'Utility Bill (< 3 months)', categories: ['address'], icon: '📄' },
  { id: '10th-marksheet', name: '10th Mark Sheet', categories: ['age', 'identity'], icon: '📚' },
  { id: 'caste-certificate', name: 'Caste Certificate (SC/ST)', categories: ['identity'], icon: '📋' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export const POLLING_CENTERS = [
  { id: 'pc1', name: 'Government School No. 1, Sector 21', city: 'Delhi', pincode: '110001', lat: 28.6139, lng: 77.2090, boothNo: 'B-101' },
  { id: 'pc2', name: 'Municipal Corporation Hall', city: 'Delhi', pincode: '110002', lat: 28.6200, lng: 77.2150, boothNo: 'B-102' },
  { id: 'pc3', name: 'Community Centre, Lajpat Nagar', city: 'Delhi', pincode: '110024', lat: 28.5677, lng: 77.2365, boothNo: 'B-203' },
  { id: 'pc4', name: 'Public Library, Connaught Place', city: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167, boothNo: 'B-010' },
  { id: 'pc5', name: 'Senior Secondary School, Rohini', city: 'Delhi', pincode: '110085', lat: 28.7354, lng: 77.1151, boothNo: 'B-445' },
  { id: 'pc6', name: 'Corporation Primary School, Bandra', city: 'Mumbai', pincode: '400050', lat: 19.0544, lng: 72.8406, boothNo: 'B-301' },
  { id: 'pc7', name: 'Municipal School, Andheri East', city: 'Mumbai', pincode: '400069', lat: 19.1136, lng: 72.8697, boothNo: 'B-302' },
  { id: 'pc8', name: 'Govt. High School, Shivajinagar', city: 'Bengaluru', pincode: '560001', lat: 12.9716, lng: 77.5946, boothNo: 'B-201' },
  { id: 'pc9', name: 'Community Hall, Koramangala', city: 'Bengaluru', pincode: '560034', lat: 12.9352, lng: 77.6245, boothNo: 'B-202' },
  { id: 'pc10', name: 'Govt. School, Anna Nagar', city: 'Chennai', pincode: '600040', lat: 13.0827, lng: 80.2707, boothNo: 'B-151' },
  { id: 'pc11', name: 'St. Marys High School, Secunderabad', city: 'Hyderabad', pincode: '500003', lat: 17.4399, lng: 78.5000, boothNo: 'B-501' },
  { id: 'pc12', name: 'Govt Degree College, Khairatabad', city: 'Hyderabad', pincode: '500004', lat: 17.4111, lng: 78.4594, boothNo: 'B-502' },
  { id: 'pc13', name: 'Zilla Parishad High School, Gachibowli', city: 'Hyderabad', pincode: '500032', lat: 17.4401, lng: 78.3489, boothNo: 'B-503' },
  { id: 'pc14', name: 'Salt Lake School', city: 'Kolkata', pincode: '700064', lat: 22.5855, lng: 88.4116, boothNo: 'B-601' },
  { id: 'pc15', name: 'Ballygunge Govt High School', city: 'Kolkata', pincode: '700020', lat: 22.5280, lng: 88.3653, boothNo: 'B-602' },
  { id: 'pc16', name: 'Jadavpur Vidyapith', city: 'Kolkata', pincode: '700032', lat: 22.4989, lng: 88.3715, boothNo: 'B-603' },
  { id: 'pc17', name: 'Kendriya Vidyalaya, Pune Camp', city: 'Pune', pincode: '411001', lat: 18.5204, lng: 73.8567, boothNo: 'B-701' },
  { id: 'pc18', name: 'Modern High School, Shivajinagar', city: 'Pune', pincode: '411005', lat: 18.5314, lng: 73.8446, boothNo: 'B-702' },
  { id: 'pc19', name: 'Vidya Bhavan School, Kothrud', city: 'Pune', pincode: '411038', lat: 18.5074, lng: 73.8077, boothNo: 'B-703' },
  { id: 'pc20', name: 'H.L. College of Commerce, Navrangpura', city: 'Ahmedabad', pincode: '380009', lat: 23.0374, lng: 72.5458, boothNo: 'B-801' },
  { id: 'pc21', name: 'Diwan Ballubhai School, Kankaria', city: 'Ahmedabad', pincode: '380022', lat: 23.0076, lng: 72.6015, boothNo: 'B-802' },
  { id: 'pc22', name: 'St. Xaviers High School, Mirzapur', city: 'Ahmedabad', pincode: '380001', lat: 23.0310, lng: 72.5830, boothNo: 'B-803' },
  { id: 'pc23', name: 'Sanskriti School, Chanakyapuri', city: 'Delhi', pincode: '110021', lat: 28.5873, lng: 77.1729, boothNo: 'B-901' },
  { id: 'pc24', name: 'Bhavans College, Andheri West', city: 'Mumbai', pincode: '400058', lat: 19.1243, lng: 72.8368, boothNo: 'B-902' },
  { id: 'pc25', name: 'National Public School, Indiranagar', city: 'Bengaluru', pincode: '560008', lat: 12.9698, lng: 77.6409, boothNo: 'B-903' },
];
