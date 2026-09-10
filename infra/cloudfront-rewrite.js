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

// Prefixes holding real files rather than exported routes. The extension-less
// rewrite below must not touch them: the face-api weight shards are named
// `tiny_face_detector_model-shard1` (no extension), so without this they get
// rewritten to `.../shard1/index.html`, S3 404s, and CloudFront's error page
// is handed to the model loader as if it were weights. tfjs does not check the
// status code, so it parses the HTML and fails deep inside with a shape error
// ("tensor should have 1152 values but has 376") that says nothing about 404s.
var RAW_PREFIXES = ['/models/'];

function isRawAsset(uri) {
  for (var i = 0; i < RAW_PREFIXES.length; i += 1) {
    if (uri.indexOf(RAW_PREFIXES[i]) === 0) return true;
  }
  return false;
}

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
  } else if (request.uri.indexOf('.') === -1 && !isRawAsset(request.uri)) {
    request.uri = request.uri + '/index.html';
  }

  return request;
}
