export class InvalidCredentialsError extends Error {
  public code: number;

  constructor() {
    super('E-mail or password is incorrect.');
    this.name = 'InvalidCredentialsError';
    this.code = 401;
  }
}
