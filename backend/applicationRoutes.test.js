import test from 'node:test';
import assert from 'node:assert/strict';
import router from './routes/applicationRoutes.js';

function getRouteHandler(pathname) {
  const route = router.stack.find((item) => item.route && item.route.path === pathname);
  assert.ok(route, `missing route for ${pathname}`);
  const layer = route.route.stack.at(-1);
  return layer.handle.name;
}

test('application me route uses the details handler', () => {
  assert.equal(getRouteHandler('/me'), 'getMyApplication');
});

test('application submission route uses the apply handler', () => {
  assert.equal(getRouteHandler('/'), 'applyToJob');
});

test('application summary route exists separately', () => {
  assert.equal(getRouteHandler('/summary'), 'getApplicationSummary');
});
