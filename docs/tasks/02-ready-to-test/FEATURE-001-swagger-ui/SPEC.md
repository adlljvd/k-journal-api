=== SPEC: Swagger UI Configuration ===

## Context
Project ini menggunakan NestJS dengan `@nestjs/swagger` dan `swagger-ui-express` yang sudah terinstall. Semua controller sudah memiliki Swagger decorators (@ApiTags, @ApiOperation, @ApiResponse, @ApiBearerAuth), namun Swagger UI belum dikonfigurasi di main.ts sehingga dokumentasi API tidak dapat diakses.

## Scope
- Konfigurasi Swagger module di main.ts
- Setup Swagger UI endpoint
- Konfigurasi authentication (Bearer JWT) di Swagger UI

## Out of Scope
- Penambahan atau perubahan Swagger decorators di controllers
- Perubahan struktur response atau DTOs
- API versioning changes

## Functional Requirements

### FR-001: Swagger Module Initialization
**Description**: Inisialisasi Swagger module saat aplikasi bootstrap
**Acceptance Criteria**:
- DocumentBuilder dikonfigurasi dengan title, description, dan version
- SwaggerModule setup dijalankan dengan path `/api/docs`
- JSON spec tersedia di `/api/docs-json`

### FR-002: JWT Authentication Support
**Description**: Konfigurasi Bearer Authentication di Swagger UI
**Acceptance Criteria**:
- addBearerAuth() ditambahkan ke DocumentBuilder
- Swagger UI menampilkan tombol "Authorize" untuk input JWT token
- Endpoint dengan @ApiBearerAuth() decorator menampilkan ikon gembok

### FR-003: Swagger UI Accessibility
**Description**: Swagger UI dapat diakses melalui browser
**Acceptance Criteria**:
- Swagger UI dapat diakses di `http://localhost:{PORT}/api/docs`
- Semua endpoint dari semua modules tampil di dokumentasi
- Endpoint di-group berdasarkan @ApiTags

## API Contract

### Swagger UI Endpoint
- **Method**: GET
- **Path**: `/api/docs`
- **Response**: HTML page (Swagger UI)

### Swagger JSON Spec
- **Method**: GET
- **Path**: `/api/docs-json`
- **Response**: OpenAPI 3.0 JSON specification

## Data Model
Tidak ada perubahan data model.

## Non-Functional Requirements

### NFR-001: Startup Performance
**Metric**: Swagger setup tidak menambah waktu startup > 100ms
**Rationale**: Konfigurasi Swagger hanya dilakukan sekali saat bootstrap

### NFR-002: Production Safety
**Metric**: Swagger UI dapat di-disable di environment production
**Rationale**: Dokumentasi API tidak boleh terekspos di production tanpa proteksi

## Quality Gates (Skeleton)

| Gate | Metric | Target |
|------|--------|--------|
| Coverage | Statements | 80% |
| Coverage | Branches | 80% |
| Manual | Swagger UI accessible | Pass |

## Assumptions
- Aplikasi berjalan di environment development/staging untuk mengakses Swagger UI
- Semua controller sudah menggunakan Swagger decorators dengan benar
- JWT authentication menggunakan schema "bearer"

## Risks
- Swagger UI terekspos di production: Security risk — Mitigation: Tambahkan environment variable untuk enable/disable Swagger UI
