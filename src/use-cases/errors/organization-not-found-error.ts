export class OrganizationNotFountError extends Error {
  public code: number;

  constructor() {
    super('Organization not found.');
    this.name = 'OrganizationNotFountError';
    this.code = 401;
  }
}
