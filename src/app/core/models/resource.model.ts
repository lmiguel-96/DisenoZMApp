export interface Resource {
  name: string;
  resourceID?: string;
  categories: any;
  description: string;
  currentStock: number;
  min: number;
  price: number;
  max: number;
  unit: string;
}

export interface ResourceCategory {
  resourceCategoryID?: string;
  img: string;
  name: string;
  description: string;
}
