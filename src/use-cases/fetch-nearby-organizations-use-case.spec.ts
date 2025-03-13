import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';

import { FetchNearbyOrganizationsUseCase } from './fetch-nearby-organizations-use-case';

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: FetchNearbyOrganizationsUseCase;

describe('FetchNearbyOrganizationsUseCase', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new FetchNearbyOrganizationsUseCase(organizationsRepository);
  });

  it('should be able to find organizations by location', async () => {
    const { organizationInput } = await makeCreateOrganizationInput();
    const evenLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
    const oddLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    const orgsInput = Array<typeof organizationInput>(
      faker.number.int({ min: 1, max: 10 }),
    )
      .fill(organizationInput)
      .map((org, index) => {
        const { authorName: author_name, password, ...data } = org;

        return {
          ...data,
          author_name: `${author_name} ${index}`,
          email: faker.internet.email(),
          password_hash: password,
          ...(index % 2 === 0 ? evenLocation : oddLocation),
        };
      });

    const organizations = await Promise.all(
      orgsInput.map(org => organizationsRepository.create(org)),
    );

    const [firstOrg] = organizations;

    const response = await sut.execute({
      userLatitude: firstOrg.latitude,
      userLongitude: firstOrg.longitude,
    });
    const lengthComparison = Math.ceil(organizations.length / 2);

    expect(response.data).toEqual(
      expect.arrayContaining([expect.objectContaining(firstOrg)]),
    );
    expect(response.data).toHaveLength(lengthComparison);
  });
});
