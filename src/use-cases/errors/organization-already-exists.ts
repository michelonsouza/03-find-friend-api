export class OrganizationAlreadyExistsError extends Error {
  public code: number;

  constructor() {
    super('Organization already exists.');
    this.name = 'OrganizationAlreadyExistsError';
    this.code = 409;
  }
}
