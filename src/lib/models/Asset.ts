export interface Asset {
  name: string;
  owners: number;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
}