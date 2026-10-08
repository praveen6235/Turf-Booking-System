# Turf Booking System — Cloud-Native Microservices Platform

[![CI/CD Pipeline](https://github.com/praveen6235/Turf-Booking-System/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/praveen6235/Turf-Booking-System/actions/workflows/ci-cd.yml)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue.svg)](#architecture)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS-326CE5.svg)](./deploy/k8s)
[![Terraform](https://img.shields.io/badge/Terraform-1.5+-7B42BC.svg)](./infra/terraform)
[![Prometheus](https://img.shields.io/badge/Observability-Prometheus%2FGrafana-E6522C.svg)](./deploy/observability)

Production-ready, cloud-native microservices platform for sports turf reservations, slot booking, payment processing, image uploads, and reviews.

---

## Architecture Diagram

```mermaid
flowchart TB
    subgraph External["External Clients"]
        ClientUI["React Frontend (Nginx Container)\nPort 80"]
    end

    subgraph Edge["Edge / Routing Layer"]
        Ingress["Kubernetes Ingress / Nginx\nturfbooking.local"]
        Gateway["api-gateway (Port 5000)\nEdge JWT Auth Verification"]
    end

    subgraph Microservices["Microservices Layer (ClusterIP Only)"]
        AuthService["auth-service (Port 5001)\nAuth / Google OAuth / JWT"]
        UserService["user-service (Port 5002)\nUser Profiles & Admin"]
        TurfService["turf-service (Port 5003)\nTurfs / Search / Reviews"]
        BookingService["booking-service (Port 5004)\nSlot Booking / Razorpay"]
        MediaService["media-service (Port 5005)\nCloudinary Image Upload"]
        NotifService["notification-service (Port 5006)\nEmail / SMS Alerts"]
    end

    subgraph Storage["Isolated Database Layer"]
        AuthDB[(turf_auth MongoDB)]
        UserDB[(turf_user MongoDB)]
        TurfDB[(turf_turf MongoDB)]
        BookingDB[(turf_booking MongoDB)]
        Cloudinary["Cloudinary API"]
    end

    ClientUI --> Ingress
    Ingress --> Gateway
    Gateway -->|/api/v1/auth| AuthService
    Gateway -->|/api/v1/users| UserService
    Gateway -->|/api/v1/turfs| TurfService
    Gateway -->|/api/v1/reviews| TurfService
    Gateway -->|/api/v1/bookings| BookingService
    Gateway -->|/api/v1/media| MediaService

    BookingService -.->|REST / HTTP| TurfService

    AuthService --> AuthDB
    UserService --> UserDB
    TurfService --> TurfDB
    BookingService --> BookingDB
    MediaService --> Cloudinary
```

---

## Microservices Breakdown

| Microservice | Directory | Database Scope | Exposed Metrics & Business Metrics | Autoscaling Trigger (HPA) |
| :--- | :--- | :--- | :--- | :--- |
| **`api-gateway`** | `/services/api-gateway` | Stateless | `http_requests_total`, latency | CPU (75%) + Request Rate |
| **`auth-service`** | `/services/auth-service` | `turf_auth` MongoDB | `http_requests_total`, auth counters | CPU (70%) + Memory (80%) |
| **`user-service`** | `/services/user-service` | `turf_user` MongoDB | `http_requests_total`, profile lookups | CPU (70%) |
| **`turf-service`** | `/services/turf-service` | `turf_turf` MongoDB | `turf_search_requests_total` | CPU (70%) + `turf_search_requests_per_second` (>40 req/s) |
| **`booking-service`** | `/services/booking-service` | `turf_booking` MongoDB | `active_booking_requests_in_flight` | CPU (70%) + `http_requests_per_second` (>50 req/s) |
| **`media-service`** | `/services/media-service` | Stateless / Cloudinary | `http_requests_total`, upload duration | CPU (80%) + KEDA Scale-to-Zero Option |
| **`notification-service`** | `/services/notification-service` | Stateless | `http_requests_total`, email count | CPU (70%) |
| **`client`** | `/client` | Nginx Static | Frontend traffic | Replicas (2) |

---

## Shared Workspace Package

- **`packages/common`** (`@turf-booking/common`): Factored out shared utilities (JWT verification helper, custom `AppError`, `catchAsync` wrapper, global `errorHandler` middleware, and Prometheus metrics setup).

---

## Quick Start (Local Development)

Bring up all 8 microservices, React client, and local MongoDB container with a single command:

```bash
docker compose up --build
```

Access endpoints:
- **Client App**: `http://localhost:80`
- **API Gateway**: `http://localhost:5000`
- **Prometheus Metrics**: `http://localhost:5000/metrics` (or directly per service on ports 5001-5006)
- **Health Checks**: `http://localhost:5000/health`

---

## Infrastructure & Kubernetes Deployment

### Provision Infrastructure with Terraform
```bash
cd infra/terraform/environments/dev
terraform init
terraform apply -auto-approve
```

### Deploy to Kubernetes with Helm
```bash
helm install turf-booking deploy/helm -f deploy/helm/values-dev.yaml
```

### Apply Observability Stack
```bash
kubectl apply -f deploy/observability/service-monitors.yaml
kubectl apply -f deploy/observability/grafana-dashboards.yaml
helm install prometheus-adapter prometheus-community/prometheus-adapter -f deploy/observability/prometheus-adapter-values.yaml
```