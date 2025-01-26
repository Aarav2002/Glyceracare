export type WeightOption = '50gm' | '75gm' | '100gm';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  min_quantity: number;
  weights: {
    [key: string]: number;
  };
}