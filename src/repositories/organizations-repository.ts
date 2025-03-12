export interface Organization {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  author_name: string;
  password_hash: string;
  created_at?: Date | string;

  street: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export type OrganizationCreateInput = Omit<Organization, 'id' | 'created_at'>;

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
  maxDistance?: number;
}

export interface OrganizationsRepository {
  findById(id: string): Promise<Organization | null>;
  findByCity(city: string): Promise<Organization[]>;
  findByEmail(email: string): Promise<Organization | null>;
  create(data: OrganizationCreateInput): Promise<Organization>;
  findManyNearby(params: FindManyNearbyParams): Promise<Organization[]>;
}
