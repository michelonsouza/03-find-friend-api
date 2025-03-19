import { Organization as PrismaOrganization } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  Organization,
  FindManyNearbyParams,
  OrganizationsRepository,
  OrganizationCreateInput,
} from '@/repositories/organizations-repository';

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findById(id: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    return organization
      ? {
          ...organization,
          latitude: organization.latitude.toNumber(),
          longitude: organization.longitude.toNumber(),
          created_at: organization.created_at.toISOString(),
          /* v8 ignore next 3 */
        }
      : null;
  }

  /* v8 ignore next 13 */
  async findByCity(city: string): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({
      where: { city },
    });

    return organizations.map(organization => ({
      ...organization,
      latitude: organization.latitude.toNumber(),
      longitude: organization.longitude.toNumber(),
      created_at: organization.created_at.toISOString(),
    }));
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: { email },
    });

    return organization
      ? {
          ...organization,
          latitude: organization.latitude.toNumber(),
          longitude: organization.longitude.toNumber(),
          created_at: organization.created_at.toISOString(),
        }
      : null;
  }

  async create(data: OrganizationCreateInput): Promise<Organization> {
    const organization = await prisma.organization.create({
      data,
    });

    return {
      ...organization,
      latitude: organization.latitude.toNumber(),
      longitude: organization.longitude.toNumber(),
      created_at: organization.created_at.toISOString(),
    };
  }

  async findManyNearby({
    latitude,
    longitude,
    maxDistance = 10,
  }: FindManyNearbyParams): Promise<Organization[]> {
    const organizations = await prisma.$queryRaw<PrismaOrganization[]>`
    SELECT * FROM organizations
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${maxDistance}
  `;

    return organizations.map(organization => ({
      ...organization,
      latitude: organization.latitude.toNumber(),
      longitude: organization.longitude.toNumber(),
      created_at: organization.created_at.toISOString(),
    }));
  }
}
