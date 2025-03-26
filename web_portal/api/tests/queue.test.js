const request = require('supertest');
const app = require('../app');

describe('Queue API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.token;
  });

  it('should issue a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets/issue')
      .set('Authorization', `Bearer ${token}`)
      .send({ timestamp: new Date().toISOString() });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ticketNumber');
  });

  it('should get queue', async () => {
    const res = await request(app)
      .get('/api/queue')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('queue');
    expect(res.body).toHaveProperty('current');
  });
});