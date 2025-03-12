import type {
  Organization,
  OrganizationsRepository,
} from '@/repositories/organizations-repository';

interface FindNearbyOrganizationsUseCaseParams {
  userLatitude: number;
  userLongitude: number;
  maxDistance?: number;
}

interface FindNearbyOrganizationsUseCaseResponse {
  data: Organization[];
}

export class FindNearbyOrganizationsUseCase {
  #organizationsRepository: OrganizationsRepository;

  constructor(organizationsRepository: OrganizationsRepository) {
    this.#organizationsRepository = organizationsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
    maxDistance = 10,
  }: FindNearbyOrganizationsUseCaseParams): Promise<FindNearbyOrganizationsUseCaseResponse> {
    const organizations = await this.#organizationsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      maxDistance,
    });

    return { data: organizations };
  }
}
