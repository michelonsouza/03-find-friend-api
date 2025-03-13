import type {
  Organization,
  OrganizationsRepository,
} from '@/repositories/organizations-repository';

interface FetchNearbyOrganizationsUseCaseParams {
  userLatitude: number;
  userLongitude: number;
  maxDistance?: number;
}

interface FetchNearbyOrganizationsUseCaseResponse {
  data: Organization[];
}

export class FetchNearbyOrganizationsUseCase {
  #organizationsRepository: OrganizationsRepository;

  constructor(organizationsRepository: OrganizationsRepository) {
    this.#organizationsRepository = organizationsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
    maxDistance = 10,
  }: FetchNearbyOrganizationsUseCaseParams): Promise<FetchNearbyOrganizationsUseCaseResponse> {
    const organizations = await this.#organizationsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      maxDistance,
    });

    return { data: organizations };
  }
}
