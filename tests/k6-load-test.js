import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp-up to 50 VUs
    { duration: '2m',  target: 150 },  // Booking rush spike (150 VUs) to trigger HPA CPU > 60%
    { duration: '1m',  target: 0 },    // Ramp-down to 0 VUs (triggers HPA scale-down)
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.GATEWAY_URL || 'http://localhost:5000/api/v1';

export default function () {
  // 1. User browses turfs
  const turfsRes = http.get(`${BASE_URL}/turfs?limit=10`);
  check(turfsRes, {
    'GET /turfs status 200': (r) => r.status === 200,
  });

  // 2. User checks available slots for a specific turf
  const turfId = '664a1b2c3d4e5f6a7b8c9d0e';
  const slotsRes = http.get(`${BASE_URL}/bookings/turf-slots/${turfId}/2026-10-10`);
  check(slotsRes, {
    'GET /turf-slots status 200': (r) => r.status === 200,
  });

  // 3. User attempts booking request
  const payload = JSON.stringify({
    turfId: turfId,
    date: '2026-10-10',
    startTime: `${10 + (Math.floor(Math.random() * 8))}:00`,
    endTime: `${11 + (Math.floor(Math.random() * 8))}:00`,
    contactNumber: '9876543210'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock_token_for_load_test'
    },
  };

  const bookingRes = http.post(`${BASE_URL}/bookings/create-order`, payload, params);
  check(bookingRes, {
    'POST /create-order status 200/201/400/401': (r) => [200, 201, 400, 401].includes(r.status),
  });

  sleep(0.2);
}
