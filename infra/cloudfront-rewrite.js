// CloudFront Function (viewer-request) for the success-crm static export.
//
// Two jobs:
//   1. `trailingSlash: true` emits `path/index.html`; S3 as an origin does not
//      resolve directory URLs, so append index.html for URIs ending in "/".
//   2. Record detail routes are exported once under an `__id__` sentinel, so
//      /dashboard/leads/123/view/ must be served the `__id__` document.
//
// Only all-numeric segments are rewritten, which leaves static siblings such as
// /dashboard/leads/add-lead/ and /dashboard/skill/add/ untouched.

var SECTIONS = [
  'agreement',
  'education',
  'employees',
  'insurance',
  'leads',
  'skill',
  'tribunal-review',
  'university',
  'updates-and-announcements',
  'users',
  'visa',
];

function handler(event) {
  var request = event.request;
  var parts = request.uri.split('/'); // "/dashboard/leads/123/view/" -> ["","dashboard","leads","123","view",""]

  if (
    parts[1] === 'dashboard' &&
    SECTIONS.indexOf(parts[2]) !== -1 &&
    parts[3] &&
    /^[0-9]+$/.test(parts[3])
  ) {
    parts[3] = '__id__';
    request.uri = parts.join('/');
  }

  if (request.uri.endsWith('/')) {
    request.uri = request.uri + 'index.html';
  } else if (request.uri.indexOf('.') === -1) {
    request.uri = request.uri + '/index.html';
  }

  return request;
}
