import { hash } from 'bcryptjs';

import type {
  Organization,
  OrganizationsRepository,
} from '@/repositories/organizations-repository';

import { OrganizationAlreadyExistsError } from './errors/organization-already-exists';

export interface CreateOrganizationUseCaseParams {
  name: string;
  password: string;
  email: string;
  whatsapp: string;
  authorName: string;
  street: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface CreateOrganizationUseCaseResponse {
  data: Organization;
}

export class CreateOrganizationUseCase {
  #organizationsRepository: OrganizationsRepository;

  constructor(organizationsRepository: OrganizationsRepository) {
    this.#organizationsRepository = organizationsRepository;
  }

  async execute({
    password,
    email,
    authorName: author_name,
    ...data
  }: CreateOrganizationUseCaseParams): Promise<CreateOrganizationUseCaseResponse> {
    const organizationWithSameEmail =
      await this.#organizationsRepository.findByEmail(email);

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError();
    }

    const password_hash = await hash(password, 8);

    const organization = await this.#organizationsRepository.create({
      ...data,
      author_name,
      email,
      password_hash,
    });

    return { data: organization };
  }
}
