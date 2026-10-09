# ADR 0001: Deconstructing Monolith into Microservices Architecture

## Status
Accepted

## Context
The Turf Booking System was originally implemented as a single monolithic backend (Express.js, Mongoose, MongoDB) paired with a React frontend. While efficient for initial MVP development, the monolithic structure presented significant bottlenecks:
1. **Coupled Deployments**: Any change to booking logic or image handling required redeploying the entire backend.
2. **Unified Scaling Limit**: Heavy operations (such as media uploads or slot availability checks during peak hours) required scaling up the entire monolith, leading to inefficient resource utilization.
3. **Shared Database Scope**: All models (`User`, `Turf`, `Booking`, `Review`) shared a single MongoDB database connection, encouraging direct cross-entity queries and tight code coupling.

To address these limitations and support high availability, independent scaling, resilient deployments, and cloud-native observability, we are re-architecting the backend into a microservices architecture.

## Decision
We decompose the Turf Booking System backend into seven distinct, independently deployable services:

### 1. Service Boundaries & Data Ownership

| Service Name | Primary Responsibilities | Data Store / Scope | Ports (Local / Cluster) |
| :--- | :--- | :--- | :--- |
| `api-gateway` | Edge routing, CORS, reverse proxying, JWT signature verification at edge, rate limiting | Stateless | `5000` |
| `auth-service` | User registration, login, JWT token issuance, Google OAuth integration, password reset tokens | `turf_auth` MongoDB | `5001` |
| `user-service` | User profiles, role management, admin user administrative endpoints | `turf_user` MongoDB | `5002` |
| `turf-service` | Turf CRUD operations, search/filtering, geolocation tagging, reviews & rating aggregations | `turf_turf` MongoDB | `5003` |
| `booking-service` | Slot reservation, double-booking prevention, Razorpay payment order & verification, booking history | `turf_booking` MongoDB | `5004` |
| `media-service` | Image upload and deletion proxying to Cloudinary via Multer | Stateless / Storage SDK | `5005` |
| `notification-service` | Email notification service (welcome emails, booking confirmations) | Stateless / Queue Consumer | `5006` |

### 2. Microservice Isolation Rules
- **Separate Codebases**: Each service lives in its own directory (`/services/<service-name>`), with its own `package.json`, dependencies, build lifecycle, and configuration.
- **Separate Databases**: No service accesses another service's database directly. Database connections are isolated per service (e.g., `mongodb://.../turf_booking`).
- **Edge Authentication**: The `api-gateway` intercepts incoming client requests, verifies JWT signatures, and injects verified user identity headers (`X-User-Id`, `X-User-Role`, `X-User-Email`) into downstream cluster requests.
- **Shared Code Management**: Shared utilities (JWT verification helper, custom `AppError`, logger, standard HTTP response wrappers) are published and imported as a local workspace package (`@turf-booking/common`), avoiding copy-pasted code.

### 3. Inter-Service Communication Strategy
- **Phase 1-3 (Synchronous REST)**: Services communicate over internal cluster HTTP connections using Kubernetes service names (e.g. `http://turf-service:5003/api/v1/turfs/:id`). This keeps network tracing simple and debuggable.
- **Future Messaging Evolution**: High-volume, non-blocking asynchronous operations (such as notifying users upon confirmed booking, updating global search indices, or asynchronous audit logs) will transition to an event-driven architecture using a message broker (RabbitMQ or Apache Kafka).

## Consequences
### Positive
- **Independent Autoscaling**: `booking-service` can autoscale horizontally during peak slot reservation hours independently of `media-service` or `auth-service`.
- **Fault Isolation**: Outages in media uploading (e.g. Cloudinary rate limits) will not affect user authentication or turf browsing.
- **Independent CI/CD**: Deployments are scoped per microservice. Code changes in `turf-service` trigger builds and deployments strictly for its container image and Kubernetes deployment.

### Challenges & Mitigations
- **Distributed Data Integrity**: Cross-service references (e.g. `userId` in `Booking`) use string IDs rather than Mongoose DB references. Data completeness is validated via synchronous HTTP calls.
- **Network Overhead**: Inter-service network hops are minimized by placing services on an optimized internal Kubernetes ClusterIP network.
