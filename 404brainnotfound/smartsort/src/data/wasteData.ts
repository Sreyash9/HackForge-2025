import { WasteCategory, WasteItem } from '../types/waste';

export const categories: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastic',
    icon: 'Recycle',
    color: '#3B82F6',
    description: 'Plastic bottles, containers, packaging'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Smartphone',
    color: '#8B5CF6',
    description: 'Phones, computers, batteries, cables'
  },
  {
    id: 'food',
    name: 'Food Waste',
    icon: 'Apple',
    color: '#22C55E',
    description: 'Organic waste, leftovers, perishables'
  },
  {
    id: 'paper',
    name: 'Paper',
    icon: 'FileText',
    color: '#F59E0B',
    description: 'Newspapers, magazines, cardboard, office paper'
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: 'Wine',
    color: '#06B6D4',
    description: 'Bottles, jars, containers'
  },
  {
    id: 'hazardous',
    name: 'Hazardous',
    icon: 'AlertTriangle',
    color: '#EF4444',
    description: 'Paint, chemicals, cleaning products'
  }
];

export const wasteItems: WasteItem[] = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Water Bottle',
    category: categories[0],
    disposalMethod: 'Recycling Bin',
    instructions: [
      'Empty and rinse the bottle',
      'Remove the cap and label if possible',
      'Place in recycling bin',
      'Check local recycling guidelines for cap disposal'
    ],
    tips: [
      'Crushing bottles saves space in recycling bins',
      'Some facilities accept caps if left on',
      'Look for the recycling number on the bottom'
    ],
    environmentalImpact: 'Recycling plastic bottles saves energy and reduces landfill waste. One recycled bottle can save enough energy to power a light bulb for 3 hours.',
    recyclable: true,
    hazardous: false
  },
  {
    id: 'smartphone',
    name: 'Old Smartphone',
    category: categories[1],
    disposalMethod: 'E-Waste Center',
    instructions: [
      'Back up and wipe all personal data',
      'Remove SIM card and memory cards',
      'Take to certified e-waste recycling facility',
      'Consider manufacturer take-back programs'
    ],
    tips: [
      'Many retailers offer trade-in programs',
      'Remove cases and accessories before recycling',
      'Check if device can be donated or refurbished'
    ],
    environmentalImpact: 'E-waste recycling recovers valuable metals like gold, silver, and rare earth elements, preventing toxic materials from entering landfills.',
    recyclable: true,
    hazardous: true
  },
  {
    id: 'food-scraps',
    name: 'Fruit & Vegetable Scraps',
    category: categories[2],
    disposalMethod: 'Compost Bin',
    instructions: [
      'Place in compost bin or green waste collection',
      'Mix with brown materials (leaves, paper)',
      'Avoid meat, dairy, and oily foods in home compost',
      'Turn compost regularly for best results'
    ],
    tips: [
      'Coffee grounds and eggshells are excellent for compost',
      'Freeze scraps to reduce odors before composting',
      'Consider vermicomposting for apartments'
    ],
    environmentalImpact: 'Composting reduces methane emissions from landfills and creates nutrient-rich soil amendment, completing the natural nutrient cycle.',
    recyclable: true,
    hazardous: false
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Box',
    category: categories[3],
    disposalMethod: 'Recycling Bin',
    instructions: [
      'Remove all tape, staples, and labels',
      'Flatten the box to save space',
      'Keep dry - wet cardboard goes to compost',
      'Place in recycling bin or take to collection center'
    ],
    tips: [
      'Pizza boxes with grease should go to compost, not recycling',
      'Wax-coated boxes are not recyclable',
      'Small pieces can be composted'
    ],
    environmentalImpact: 'Recycling cardboard saves trees and reduces energy consumption by 50% compared to making new cardboard from virgin materials.',
    recyclable: true,
    hazardous: false
  },
  {
    id: 'glass-jar',
    name: 'Glass Jar',
    category: categories[4],
    disposalMethod: 'Recycling Bin',
    instructions: [
      'Empty and rinse the jar',
      'Remove metal lids (recycle separately)',
      'Remove labels if easily removable',
      'Place in glass recycling bin'
    ],
    tips: [
      'Glass can be recycled indefinitely without quality loss',
      'Broken glass should be wrapped safely before disposal',
      'Different colored glass may need separate collection'
    ],
    environmentalImpact: 'Glass recycling reduces raw material consumption and energy use by 25-32%, and creates jobs in the recycling industry.',
    recyclable: true,
    hazardous: false
  },
  {
    id: 'paint-can',
    name: 'Paint Can',
    category: categories[5],
    disposalMethod: 'Hazardous Waste Facility',
    instructions: [
      'Take to household hazardous waste facility',
      'Do NOT put in regular trash or recycling',
      'Keep in original container with label',
      'Check local collection event dates'
    ],
    tips: [
      'Latex paint can sometimes be dried out and trashed',
      'Oil-based paints are always hazardous waste',
      'Consider paint exchanges for usable paint'
    ],
    environmentalImpact: 'Proper disposal prevents toxic chemicals from contaminating soil and groundwater, protecting ecosystems and human health.',
    recyclable: false,
    hazardous: true
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Can',
    category: categories[0],
    disposalMethod: 'Recycling Bin',
    instructions: [
      'Empty and rinse if needed',
      'Crushing is optional but saves space',
      'Place in recycling bin',
      'No need to remove labels'
    ],
    tips: [
      'Aluminum recycling has high economic value',
      'Recycled cans can become new cans in 60 days',
      'Check for local can return programs'
    ],
    environmentalImpact: 'Recycling aluminum uses 95% less energy than making new aluminum, and aluminum can be recycled infinitely.',
    recyclable: true,
    hazardous: false
  },
  {
    id: 'battery',
    name: 'Household Battery',
    category: categories[1],
    disposalMethod: 'Battery Collection Point',
    instructions: [
      'Take to battery collection point at stores',
      'Do NOT put in regular trash',
      'Tape terminals of lithium batteries',
      'Separate different battery types if required'
    ],
    tips: [
      'Many stores have battery collection bins',
      'Car batteries have core charge programs',
      'Rechargeable batteries have higher recycling value'
    ],
    environmentalImpact: 'Battery recycling prevents heavy metals like mercury and lead from entering the environment and recovers valuable materials.',
    recyclable: true,
    hazardous: true
  }
];