export type NewProperty = {
  title: string;
  description?: string;
  city?: string;
  country?: string;
  price_per_night: number;
  availability?: boolean;
  image_url?: string;
};

export type Property = NewProperty & {
  id?: string;
  property_code?: string;
  created_at?: string;
  updated_at?: string;
};
