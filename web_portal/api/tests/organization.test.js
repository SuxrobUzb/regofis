const request = require('supertest');
const app = require('../app');
const redisClient = require('../config/redisConfig');

describe('Organization API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.token;

    // Redis’ni tozalash
    await redisClient.flushAll();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should create an organization', async () => {
    const res = await request(app)
      .post('/api/organizations/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Org', styles: { color: '#fff' }, tariffId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Org');
  });

  it('should get organization from cache', async () => {
    const createRes = await request(app)
      .post('/api/organizations/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cached Org', styles: { color: '#000' }, tariffId: 1 });

    const orgId = createRes.body.id;

    // Birinchi marta DB’dan olinadi
    const firstRes = await request(app)
      .get(`/api/organizations/${orgId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(firstRes.statusCode).toBe(200);
    expect(firstRes.body.name).toBe('Cached Org');

    // Ikkinchi marta keshdan olinadi
    const secondRes = await request(app)
      .get(`/api/organizations/${orgId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(secondRes.statusCode).toBe(200);
    expect(secondRes.body.name).toBe('Cached Org');
  });

  it('should return 403 for unauthorized org access', async () => {
    const res = await request(app)
      .get('/api/organizations/999') // Boshqa orgId
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Bu tashkilotga ruxsat yo‘q');
  });
});