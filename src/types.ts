export type PropertyCategory = 'residential' | 'commercial' | 'apartment' | 'villa' | 'plot';
export type PropertyType = 'buy' | 'rent';

export interface Agent {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
}

export interface Property {
  id: string;
  name: string;
  category: PropertyCategory;
  type: PropertyType;
  price: number; // raw value for sorting/filtering
  priceFormatted: string; // e.g. "₹85 Lakhs" or "₹1.25 Cr"
  location: string; // Locality (e.g. "Gomti Nagar")
  address: string; // Full address
  area: string; // e.g., "1,800 sq.ft."
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  featured: boolean;
  status: 'Ready to Move' | 'Under Construction' | 'Newly Launched' | 'Resale' | 'For Rent';
  description: string;
  amenities: string[];
  reraApproved: boolean;
  reraNumber?: string;
  agent: Agent;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  image: string;
  date: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyName?: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  experience: string;
}
