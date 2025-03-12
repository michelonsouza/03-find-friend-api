import { randomUUID } from 'node:crypto';

import type {
  Organization,
  FindManyNearbyParams,
  OrganizationsRepository,
  OrganizationCreateInput,
} from '@/repositories/organizations-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryOrganizationsRepository
  // eslint-disable-next-line prettier/prettier
  implements OrganizationsRepository {
  #organizations: Organization[] = [];

  findById(id: string): Promise<Organization | null> {
    const organization =
      this.#organizations.find(organization => organization.id === id) ?? null;

    return Promise.resolve(organization);
  }

  findByCity(city: string): Promise<Organization[]> {
    const organizations = this.#organizations.filter(organization =>
      organization.city.toLowerCase().includes(city.toLowerCase()),
    );

    return Promise.resolve(organizations);
  }

  findByEmail(email: string): Promise<Organization | null> {
    const organization =
      this.#organizations.find(organization => organization.email === email) ??
      null;

    return Promise.resolve(organization);
  }

  create(data: OrganizationCreateInput): Promise<Organization> {
    const newOrganization = {
      ...data,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    };

    this.#organizations.push(newOrganization);

    return Promise.resolve(newOrganization);
  }

  findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Organization[]> {
    const organizations = this.#organizations.filter(org => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: org.latitude,
          longitude: org.longitude,
        },
      );

      return distance <= 10;
    });

    return Promise.resolve(organizations);
  }
}
