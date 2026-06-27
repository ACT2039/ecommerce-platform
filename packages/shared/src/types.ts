export type ID = string;

export interface User {
  id: ID;
  email: string;
  name?: string;
}

export interface Product {
  id: ID;
  title: string;
  description?: string;
  priceCents: number;
}
