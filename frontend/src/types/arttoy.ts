export interface ArtToy {
  _id: string;
  sku: string;
  name: string;
  description: string;
  arrivalDate: string;
  availableQuota: number;
  posterPicture: string;
  price?: number;
}

export interface Order {
  id: string;
  userId: string;
  artToyId: string;
  artToy?: ArtToy;
  orderAmount: number;
  createdAt: string;
  status?: "pending" | "confirmed" | "cancelled";
}
