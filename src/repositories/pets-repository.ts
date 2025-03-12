export interface Pet {
  id: string;
  age: string;
  name: string;
  size: string;
  about: string;
  energy_level: string;
  environment: string;
  organization_id: string;
  created_at: Date | string;
}

export type PetCreateInput = Omit<Pet, 'id' | 'created_at'>;

export interface FindAllParams {
  city: string;
  age?: string;
  size?: string;
  energy_level?: string;
  environment?: string;
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>;
  create(data: PetCreateInput): Promise<Pet>;
  findAll(params: FindAllParams): Promise<Pet[]>;
}
