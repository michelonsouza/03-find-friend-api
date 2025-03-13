import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { AuthenticateUseCase } from '@/use-cases/authenticate-use-case';

export function makeAuthenticateUseCase(): AuthenticateUseCase {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const authenticateUseCase = new AuthenticateUseCase(organizationsRepository);

  return authenticateUseCase;
}
