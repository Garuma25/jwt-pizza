import { sleep, check, fail } from 'k6';
import http from 'k6/http';
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';

export const options = {
  cloud: {
    distribution: {
      'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
};

export function scenario_1() {
  let response;
  const vars = {};

  // LOGIN
  response = http.put(
    'https://pizza-service.byucs329garuma25.click/api/auth',
    JSON.stringify({ email: 'a@jwt.com', password: 'admin' }),
    {
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: 'https://pizza.byucs329garuma25.click',
      },
    }
  );

  if (!check(response, { 'login status is 200': (r) => r.status === 200 })) {
    console.log('Login failed:', response.body);
    fail('Login failed');
  }

  vars.token = jsonpath.query(response.json(), '$.token')[0];

  sleep(3.4);

  // MENU
  http.get('https://pizza-service.byucs329garuma25.click/api/order/menu', {
    headers: {
      accept: '*/*',
      authorization: `Bearer ${vars.token}`,
      'content-type': 'application/json',
      origin: 'https://pizza.byucs329garuma25.click',
    },
  });

  // FRANCHISE
  http.get('https://pizza-service.byucs329garuma25.click/api/franchise', {
    headers: {
      accept: '*/*',
      authorization: `Bearer ${vars.token}`,
      'content-type': 'application/json',
      origin: 'https://pizza.byucs329garuma25.click',
    },
  });

  sleep(8);

  // PURCHASE
  response = http.post(
    'https://pizza-service.byucs329garuma25.click/api/order',
    JSON.stringify({
      items: [{ menuId: 1, description: 'Veggie', price: 0.0038 }],
      storeId: '1',
      franchiseId: 1,
    }),
    {
      headers: {
        accept: '*/*',
        authorization: `Bearer ${vars.token}`,
        'content-type': 'application/json',
        origin: 'https://pizza.byucs329garuma25.click',
      },
    }
  );

  if (!check(response, { 'purchase status is 200': (r) => r.status === 200 })) {
    console.log('Purchase failed:', response.body);
    fail('Purchase failed');
  }

  // Extract pizza JWT from the purchase response
  const pizzaJwt = jsonpath.query(response.json(), '$.jwt')[0];

  sleep(4);

  // VERIFY
  http.post(
    'https://pizza-factory.cs329.click/api/order/verify',
    JSON.stringify({ jwt: pizzaJwt }),
    {
      headers: {
        accept: '*/*',
        authorization: `Bearer ${vars.token}`,
        'content-type': 'application/json',
        origin: 'https://pizza.byucs329garuma25.click',
      },
    }
  );
}
