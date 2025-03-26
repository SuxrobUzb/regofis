const request = require('supertest');
const app = require('../app');
const redisClient = require('../config/redisConfig');
const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');

const pool = new Pool(dbConfig);

describe('Queue API', () => {
  let token;
  let orgId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.token;
    orgId = jwt.decode(token).orgId;

    // Redis’ni tozalash
    await redisClient.flushAll();

    // Test uchun ticket qo‘shish
    await pool.query('INSERT INTO tickets (number, status, org_id) VALUES ($1, $2, $3)', [1, 'waiting', orgId]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM tickets WHERE org_id = $1', [orgId]);
    await redisClient.quit();
    await pool.end();
  });

  it('should get queue from cache', async () => {
    // Birinchi marta DB’dan olinadi
    const firstRes = await request(app)
      .get('/api/queue')
      .set('Authorization', `Bearer ${token}`);
    expect(firstRes.statusCode).toBe(200);
    expect(firstRes.body.queue).toHaveLength(1);
    expect(firstRes.body.queue[0].number).toBe(1);

    // Ikkinchi marta keshdan olinadi
    const secondRes = await request(app)
      .get('/api/queue')
      .set('Authorization', `Bearer ${token}`);
    expect(secondRes.statusCode).toBe(200);
    expect(secondRes.body.queue).toHaveLength(1);
    expect(secondRes.body.queue[0].number).toBe(1);
  });

  it('should call next ticket and clear cache', async () => {
    const res = await request(app)
      .post('/api/queue/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ operatorId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.ticket.number).toBe(1);
    expect(res.body.ticket.status).toBe('called');

    // Kesh o‘chirilganligini tekshirish
    const cached = await redisClient.get(`queue:org:${orgId}`);
    expect(cached).toBeNull();
  });
});