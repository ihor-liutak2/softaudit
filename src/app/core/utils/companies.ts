import { Company } from "../general/general.types";

  
  export const COMPANY_SEEDS: Company[] = [
  
    // Aerospace
    {
      id: 'aerotech-solutions',
      name: 'AeroTech Solutions',
      description: 'Innovative aerospace technologies and services.',
      sector: 'aerospace',
      address: 'Lviv',
      employeesCount: 150,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'skysystems-gmbh',
      name: 'SkySystems GmbH',
      description: 'European satellite and aerospace software.',
      sector: 'aerospace',
      address: 'Ivano-Frankivsk',
      employeesCount: 80,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'orbital-dynamics',
      name: 'Orbital Dynamics',
      description: 'Space solutions provider and orbital analytics.',
      sector: 'aerospace',
      address: 'Uzhhorod',
      employeesCount: 50,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Energy
    {
      id: 'solarway-inc',
      name: 'SolarWay Inc.',
      description: 'Clean and renewable energy solutions.',
      sector: 'energy',
      address: 'Lviv',
      employeesCount: 120,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'greenpower-eu',
      name: 'GreenPower EU',
      description: 'European leader in green energy products.',
      sector: 'energy',
      address: 'Ivano-Frankivsk',
      employeesCount: 200,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'energonova',
      name: 'EnergoNova',
      description: 'Innovative smart grid and energy storage.',
      sector: 'energy',
      address: 'Chernivtsi',
      employeesCount: 90,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Financial
    {
      id: 'eurobank-technologies',
      name: 'EuroBank Technologies',
      description: 'Digital banking and financial solutions.',
      sector: 'financial',
      address: 'Lviv',
      employeesCount: 300,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'finsecure-solutions',
      name: 'FinSecure Solutions',
      description: 'Secure fintech and investment management.',
      sector: 'financial',
      address: 'Ivano-Frankivsk',
      employeesCount: 120,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'moneytrack-ltd',
      name: 'MoneyTrack Ltd.',
      description: 'Payment tracking and business insights.',
      sector: 'financial',
      address: 'Ternopil',
      employeesCount: 50,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // General
    {
      id: 'softideas-gmbh',
      name: 'SoftIdeas GmbH',
      description: 'Custom software solutions for businesses.',
      sector: 'general',
      address: 'Lutsk',
      employeesCount: 40,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'eurotech-group',
      name: 'EuroTech Group',
      description: 'Enterprise software development and consulting.',
      sector: 'general',
      address: 'Rivne',
      employeesCount: 70,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'it-solutions-eu',
      name: 'IT Solutions EU',
      description: 'IT consulting and software engineering.',
      sector: 'general',
      address: 'Lviv',
      employeesCount: 60,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Healthcare
    {
      id: 'medisoft-gmbh',
      name: 'MediSoft GmbH',
      description: 'Software for hospitals and clinics.',
      sector: 'healthcare',
      address: 'Ivano-Frankivsk',
      employeesCount: 85,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'healthtrack-eu',
      name: 'HealthTrack EU',
      description: 'Health monitoring and medical analytics.',
      sector: 'healthcare',
      address: 'Ternopil',
      employeesCount: 110,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'biomed-systems',
      name: 'BioMed Systems',
      description: 'Medical equipment and healthcare software.',
      sector: 'healthcare',
      address: 'Chernivtsi',
      employeesCount: 75,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Industrial Automation
    {
      id: 'autosys-gmbh',
      name: 'AutoSys GmbH',
      description: 'Automation and industrial robotics solutions.',
      sector: 'industrial-automation',
      address: 'Lviv',
      employeesCount: 140,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'procontrol-eu',
      name: 'ProControl EU',
      description: 'Process control and automation systems.',
      sector: 'industrial-automation',
      address: 'Ivano-Frankivsk',
      employeesCount: 100,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'smartmachines',
      name: 'SmartMachines',
      description: 'Smart manufacturing and Industry 4.0.',
      sector: 'industrial-automation',
      address: 'Uzhhorod',
      employeesCount: 50,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Public Administration
    {
      id: 'govsoft-eu',
      name: 'GovSoft EU',
      description: 'Public sector digital transformation solutions.',
      sector: 'public-administration',
      address: 'Lviv',
      employeesCount: 60,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'adminsuit-gmbh',
      name: 'AdminSuite GmbH',
      description: 'Government workflow and management software.',
      sector: 'public-administration',
      address: 'Ivano-Frankivsk',
      employeesCount: 90,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'civictech',
      name: 'CivicTech',
      description: 'Civic participation and digital public services.',
      sector: 'public-administration',
      address: 'Chernivtsi',
      employeesCount: 45,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
  
    // Telecommunications
    {
      id: 'teleconnect-eu',
      name: 'TeleConnect EU',
      description: 'Internet and telecommunication services.',
      sector: 'telecommunications',
      address: 'Lviv',
      employeesCount: 130,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'fiberlink-gmbh',
      name: 'FiberLink GmbH',
      description: 'Fiber optics and high-speed internet.',
      sector: 'telecommunications',
      address: 'Ivano-Frankivsk',
      employeesCount: 85,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    },
    {
      id: 'globalnet-solutions',
      name: 'GlobalNet Solutions',
      description: 'Global telecom and connectivity provider.',
      sector: 'telecommunications',
      address: 'Uzhhorod',
      employeesCount: 95,
      registeredAt: new Date().toISOString(),
      projectsCount: 0,
      active: true
    }
  ];
  