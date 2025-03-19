import supertest from 'supertest';

import { app } from '@/app';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';

describe('E2E: Nearby Organizations', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby organizations', async () => {
    const { organizationInput: org1 } = await makeCreateOrganizationInput();
    const { organizationInput: org2 } = await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(org1);
    await supertest(app.server)
      .post('/organizations')
      .send({ ...org2, latitude: org1.latitude, longitude: org1.longitude });

    const response = await supertest(app.server)
      .get('/organizations/nearby')
      .query({
        latitude: org1.latitude,
        longitude: org1.longitude,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.data).toHaveLength(2);
  });
});
