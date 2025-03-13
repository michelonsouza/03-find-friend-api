import { prisma } from '@/lib/prisma';
import type {
  Pet,
  FindAllParams,
  PetsRepository,
  PetCreateInput,
} from '@/repositories/pets-repository';

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    return pet;
  }

  async create(data: PetCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    });

    return pet;
  }

  async findAll({
    city,
    age,
    energy_level,
    environment,
    size,
  }: FindAllParams): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        age,
        energy_level,
        environment,
        size,
        organization: {
          city: {
            contains: city,
            mode: 'insensitive',
          },
        },
      },
    });

    return pets;
  }
}
