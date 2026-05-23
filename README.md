***

# 🧩 URL Shortener System — Full Specification

URL shortening is primarily used to improve usability and shareability of long URLs, especially in contexts with character limits. It also provides an abstraction layer that enables click tracking, analytics, and flexibility in updating destination URLs without changing the original link. Additionally, it improves user experience and supports marketing use cases like branded links.

***

# 1. 📌 Product Scope

## ✅ In Scope (MVP)

The system will provide core URL shortening functionality:

* Create a short URL from a long URL
* Redirect short URL to original URL
* Basic click tracking (total count)
* Optional custom alias
* Optional expiration time

***

## ❌ Out of Scope (Explicitly Excluded)

To prevent scope creep, the following are intentionally excluded:

* ❌ User authentication / accounts
* ❌ Advanced analytics (geo, device, referrer tracking)
* ❌ QR code generation
* ❌ Bulk URL creation
* ❌ CDN / geo-routing optimization
* ❌ Spam detection / abuse prevention
* ❌ A/B testing or traffic routing
* ❌ Custom domains
* ❌ Dashboard UI

> Any additions must go through a design review (RFC process).

***

# 2. ✅ Functional Requirements

***

## 2.1 Create Short URL

### Description

Convert a long URL into a unique short URL.

***

### Inputs

* `long_url` (required)
* `custom_alias` (optional)
* `expiry_time` (optional)

***

### Rules

* `long_url` must be a valid URL
* `custom_alias`:
  * Max length: 10 characters
  * Allowed characters: alphanumeric only
  * Must be unique
* If no alias is provided → system generates a short code

***

### Outputs

* `short_url`

***

### Acceptance Criteria

* ✅ Returns a unique short URL
* ✅ Invalid URL → validation error
* ✅ Alias conflict → error returned
* ✅ Response time < 200ms

***

## 2.2 Redirect Short URL

### Description

Redirect a short URL to its corresponding long URL.

***

### Requirements

* Use HTTP redirect (302 recommended for flexibility)
* Lookup short code → retrieve original URL
* Check expiration status

***

### Acceptance Criteria

* ✅ Redirects to correct URL
* ✅ Non-existent code → 404 error
* ✅ Expired URL → 410 Gone
* ✅ Response time < 100ms

***

## 2.3 Click Tracking

### Description

Track total number of times a short URL is accessed.

***

### Requirements

* Increment count on each redirect
* Provide API to retrieve count

***

### Acceptance Criteria

* ✅ Count increases on each access (eventually consistent allowed)
* ✅ Count is monotonic (never decreases)
* ✅ Query response < 100ms

***

## 2.4 Retrieve URL Metadata

### Description

Fetch information about a short URL.

***

### Returns

* `long_url`
* `created_at`
* `expiry_time`
* `click_count`

***

### Acceptance Criteria

* ✅ Returns correct metadata
* ✅ Non-existent URL → 404
* ✅ Response time < 200ms


***

## 2.5 Expiration Handling

### Description

Support expiration for short URLs.

***

### Requirements

* Expired links are inactive
* No automatic deletion (MVP simplification)

***

### Acceptance Criteria

* ✅ Expired links return 410
* ✅ Active links redirect normally

***

# 3. 🚀 Non-Functional Requirements

***

## 3.1 Performance

* Redirect latency:
  * Average: < 50ms
  * P95: < 100ms (critical path)

* Create latency:
  * < 200ms

***

## 3.2 Scalability

Assumed load:

* Write: \~1,000 requests/sec
* Read (redirect): \~10,000 requests/sec

***

System must:

* Support horizontal scaling of API servers
* Handle read-heavy traffic efficiently
* Allow caching layer for hot URLs

***

## 3.3 Availability

* Target SLA: 99.9%
* Redirect path must remain highly available

***

## 3.4 Data Consistency

* URL mapping must be strongly consistent
* Click count may use eventual consistency

***

## 3.5 Security

* Input validation for all URLs
* Protection against malformed input
* Basic rate limiting (to prevent abuse)

***

## 3.6 Maintainability

* Clear modular architecture:
  * API layer
  * Redirect service
  * Storage layer

* Structured logging

* Tracing for debugging

***

# 4. ✅ Definition of Done (DoD)

A feature is considered complete only if:

***

## ✅ Code Quality

* Unit test coverage ≥ 70%
* Code reviewed by at least one engineer
* No critical lint issues

***

## ✅ Functional Validation

* All acceptance criteria satisfied
* Edge cases covered:
  * Duplicate alias
  * Invalid URLs
  * Expired links

***

## ✅ API

* API documented (OpenAPI / Swagger)
* Request/response schemas defined

***

## ✅ Observability

* Logging implemented
* Error handling standardized

***

## ✅ Deployment

* Successfully deployed to staging
* QA sign-off completed

***

# 5. ✅ Global Acceptance Criteria

***

## Functional Correctness

* ✅ URL mapping is accurate
* ✅ No collisions or data overwrites
* ✅ Redirect behavior is correct

***

## Performance

* ✅ Meets defined latency requirements
* ✅ Stable under expected load

***

## Data Integrity

* ✅ No data loss
* ✅ Click count remains consistent (no rollback)

***

## User Experience

* ✅ Redirects are fast and seamless
* ✅ Errors are clear (404 vs 410)

***

## Stability

* ✅ No system crashes under normal usage
* ✅ Predictable error handling

***

# 6. 🚫 Scope Control (Anti Scope-Creep Rules)

***

## Rule 1: MVP Focus

This system is strictly a:

> **High-performance URL redirection service**

Not an analytics or marketing platform.

***

## Rule 2: No “Small Additions”

The following are explicitly disallowed:

* “Add analytics later”
* “Add QR code quickly”
* “Add user login for tracking”

***

## Rule 3: Strict Feature Classification

| Type                     | Allowed          |
| ------------------------ | ---------------- |
| Bug fixes                | ✅                |
| Performance improvements | ✅                |
| New features             | ❌ (requires RFC) |

***

## Rule 4: RFC Process for Changes

Any new feature must include:

* Problem statement
* Proposed solution
* Trade-offs
* Impact on system complexity

***

# 🧠 Interview-Level Design Considerations (Key Talking Points)

***

## Short Code Generation

Options:

* Hashing (collision risk)
* Counter-based (predictable)
* Base62 encoding (recommended)

***

## Caching Strategy

* Use cache (e.g., Redis) for hot URLs
* Cache miss → fallback to database

***

## Click Tracking Strategy

* Synchronous update (accurate but slow)
* Asynchronous update (faster, slightly delayed)

✅ Recommended: eventual consistency

***

## HTTP Redirect Choice

* 302 → flexible, safer for dynamic changes ✅
* 301 → cacheable but hard to update

***

# 🎯 Final Outcome

> Designed a URL shortener system that supports high-throughput redirects (\~10k RPS), uses Base62 encoding for short code generation, leverages caching to reduce read latency, and applies eventual consistency for click tracking to balance performance and accuracy. I also scoped the system carefully to avoid unnecessary complexity while ensuring scalability.

***

