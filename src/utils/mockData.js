export const users = [
  { id: 'u0', name: 'System Admin', role: 'admin', email: 'admin@prismo.com' },
  { id: 'u1', name: 'CEO User', role: 'ceo', email: 'ceo@prismo.com' },
  { id: 'u2', name: 'Project Manager 1', role: 'pm', email: 'pm@prismo.com' },
  { id: 'u3', name: 'Site Engineer A', role: 'site_engineer', email: 'engineer@prismo.com' },
  { id: 'u4', name: 'Client Corp', role: 'client', email: 'client@company.com' },
];

export const initialProjects = [
  {
    id: 'p1',
    name: 'Colombo Commercial Complex',
    client: 'Client Corp',
    location: 'Colombo 03',
    startDate: '2026-09-01',
    endDate: '2027-12-31',
    description: 'A multi-story commercial complex in the heart of Colombo.',
    status: 'In Progress',
    progress: 15,
    milestones: [
      { id: 'm1', title: 'Foundation Completed', date: '2026-11-01', completed: false },
      { id: 'm2', title: 'Structure Completed', date: '2027-05-01', completed: false },
    ]
  },
  {
    id: 'p2',
    name: 'Kandy Residential Villas',
    client: 'Skyline Developers',
    location: 'Kandy',
    startDate: '2026-07-15',
    endDate: '2027-08-30',
    description: 'Luxury residential villas with smart home features.',
    status: 'Planning',
    progress: 5,
    milestones: [
      { id: 'm3', title: 'Design Approval', date: '2026-08-15', completed: true },
      { id: 'm4', title: 'Site Clearance', date: '2026-09-10', completed: false },
    ]
  }
];

export const initialTasks = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Site Survey and Marking',
    description: 'Complete the initial topographical survey and mark boundaries.',
    assignedTo: 'u3', // Site Engineer A
    priority: 'High',
    dueDate: '2026-09-05',
    status: 'In Progress',
    evidence: null,
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Excavation for Foundation',
    description: 'Start excavation for the main structural foundation.',
    assignedTo: 'u3',
    priority: 'High',
    dueDate: '2026-09-20',
    status: 'To Do',
    evidence: null,
  }
];

export const initialLogs = [
  {
    id: 'l1',
    projectId: 'p1',
    date: '2026-08-27',
    weather: 'Sunny',
    manpower: 12,
    workDone: 'Cleared the initial debris and set up the site office.',
    percentageCompleted: 2,
    photos: [{ url: 'https://images.unsplash.com/photo-1541888081622-6323c21c7e92?q=80&w=2070&auto=format&fit=crop', caption: 'Initial site clearance' }],
    issues: 'Minor delay in equipment arrival.',
    submittedBy: 'u3'
  }
];

export const initialClientApprovals = [
  {
    id: 'a1',
    projectId: 'p1',
    title: 'Foundation Design Approval',
    description: 'Please review and approve the finalized foundation designs.',
    documentUrl: '#',
    status: 'Pending', // Pending, Approved, Rejected
    feedback: '',
    dateRequested: '2026-08-25'
  }
];

export const initialConsultations = [
  {
    id: 'c1',
    clientName: 'Eco Resort Holdings',
    email: 'contact@ecoresort.com',
    phone: '+94 77 123 4567',
    service: 'Construction Management',
    description: 'Looking to build a 20-cabin eco resort in Ella. We have the designs, need full construction management.',
    status: 'New Inquiry', // New Inquiry, Proposal Sent, Accepted, Converted
    dateSubmitted: '2026-08-28',
    proposalUrl: null
  }
];
