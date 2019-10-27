export interface Service {
  serviceID?: string;
  name: string;
  description: string;
  price: number;
  categories: any;
}

export interface ServiceCategory {
  serviceCategoryID?: string;
  img: string;
  name: string;
  description: string;
}
