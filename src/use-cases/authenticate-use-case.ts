import { compare } from 'bcryptjs';

import type {
  Organization,
  OrganizationsRepository,
} from '@/repositories/organizations-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseParams {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  data: Organization;
}

export class AuthenticateUseCase {
  #organizationRepository: OrganizationsRepository;

  constructor(organizationRepository: OrganizationsRepository) {
    this.#organizationRepository = organizationRepository;
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.#organizationRepository.findByEmail(email);

    if (!organization) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(
      password,
      organization.password_hash,
    );

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      data: organization,
    };
  }
}
