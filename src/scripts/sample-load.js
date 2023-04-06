import http from 'k6/http';
import { check, group, sleep } from "k6";

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 115,
      timeUnit: '1s',
      duration: '180m',
      preAllocatedVUs: 20,
      maxVUs: 5000,
    },
  },
  // stages: [
  //   // Ramp-up from 1 to 5 virtual users (VUs) in 5s
  //   { duration: "60s", target: 100 },

  //   // Stay at rest on 5 VUs for 10s
  //   { duration: "60s", target: 100 },

  //   // Ramp-down from 5 to 0 VUs for 5s
  //   { duration: "10s", target: 0 }
  // ]
};

const creds = [
  { email: "example1@gmail.com", password: "123456" },
  { email: "example2@gmail.com", password: "123456" },
  { email: "example3@gmail.com", password: "123456" },
  { email: "example4@gmail.com", password: "123456" },
  { email: "example5@gmail.com", password: "123456" },
  { email: "example6@gmail.com", password: "123456" },
]

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 302 }));

export default function () {

  group('login', function () {
    let res = http.get("https://<domain>/login");
    check(res, {
      "Login page opened": (r) => r.status === 200
    });
  });

  group('login-attempt', function () {
    const cookieJarLoginRequest = http.cookieJar();

    let credIndex = Math.floor(Math.random() * creds.length);

    const paramsLoginRequest = {
      "_method": "POST",
      "data[User][email]": creds[credIndex].email,
      "data[User][password]": creds[credIndex].password
    };


    let res = http.post('https://<domain>/login', paramsLoginRequest);
    check(res, {
      'Login incorrect': (r) => r.status === 200 && r.body.indexOf('Incorrect username/password') !== -1,
      'Login correct': (r) => r.status === 200 && r.body.indexOf('Incorrect username/password') === -1,
    });

  });

  sleep(.300);
};
