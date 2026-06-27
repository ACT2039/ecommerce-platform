import request from 'supertest';
import { createServer } from '../../app';

describe('Health Routes', () => {
  const app = createServer();

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route-123');
    expect(res.status).toBe(404);
  });

  // A basic test to see if standard Express configuration handles CORS correctly
  it('should return proper CORS headers', async () => {
    const res = await request(app).options('/api/products').set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });
});
