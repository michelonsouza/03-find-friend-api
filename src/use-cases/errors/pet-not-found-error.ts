export class PetNotFountError extends Error {
  public code: number;

  constructor() {
    super('Pet not found.');
    this.name = 'PetNotFountError';
    this.code = 404;
  }
}
