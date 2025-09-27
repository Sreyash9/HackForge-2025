export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  disposalMethod: string;
  instructions: string[];
  tips: string[];
  environmentalImpact: string;
  recyclable: boolean;
  hazardous: boolean;
}

export interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface SearchFilters {
  category?: string;
  recyclable?: boolean;
  hazardous?: boolean;
}