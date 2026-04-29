# Architecture Guide — K-Journal API

> **Audience:** `@fullstack-engineer` subagent
> **Purpose:** Definitive coding standard. Every line of code you write MUST follow this guide.
> **Last updated:** April 2026

---

## 0. How to Use This Document

This guide is your **contract**. When in doubt, follow this document over any existing code in the repo. Existing code that contradicts this guide is **technical debt** — do not replicate it.

**Reading order for new modules:**

1. Section 1 — Tech Stack (what you can/cannot use)
2. Section 2 — Layering Rules (where code goes)
3. Section 3 — Module Structure (file layout)
4. Section 4 — Repository Pattern (data access)
5. Section 5 — Service Pattern (business logic)
6. Section 6 — Controller Pattern (HTTP layer)
7. Section 7 — DTO Pattern (validation)
8. Section 8 — Entity Pattern (response shaping)
9. Section 9 — Error Handling
10. Section 10 — Type Rules
11. Section 11 — Anti-Patterns (what NEVER to do)

---

## 1. Tech Stack — Locked

Do not introduce new libraries without an ADR. Do not use alternative libraries for concerns already covered.

| Concern          | Library           | Import Path                         |
| ---------------- | ----------------- | ----------------------------------- |
| Framework        | NestJS 11.x       | `@nestjs/common`, `@nestjs/core`    |
| HTTP Engine      | Fastify 5.x       | `fastify` (do not import `express`) |
| ORM              | Prisma 7.x        | `@prisma/client`                    |
| Validation       | class-validator   | `class-validator`                   |
| Serialization    | class-transformer | `class-transformer`                 |
| Auth             | Passport + JWT    | `@nestjs/passport`, `@nestjs/jwt`   |
| Password Hashing | argon2            | `argon2`                            |
| API Docs         | Swagger           | `@nestjs/swagger`                   |
| Rate Limiting    | Throttler         | `@nestjs/throttler`                 |
| Testing          | Jest              | `jest`                              |
| UUID             | uuid              | `uuid`                              |

**Forbidden:**

- `express` — we use Fastify exclusively
- `lodash` — use native JS methods
- `moment` — use `Date` or `dayjs` if absolutely needed
- `axios` in modules — use `@nestjs/axios` `HttpService` only, and only for external API calls
- `any` type — see Section 10
- `eslint-disable` — fix the lint error, do not suppress it
- `@ts-ignore` / `@ts-expect-error` — fix the type error
- `as` type assertion — only allowed for Prisma payload types (see Section 10.3)

---

## 2. Layering Rules — Strict Boundaries

```
┌─────────────────────────────────────────────────────┐
│  Controller  →  HTTP only. No business logic.       │
│               No Prisma imports. No direct DB calls.│
│               Converts Result<T> to HTTP response.  │
├─────────────────────────────────────────────────────┤
│  Service     →  Business logic. Validation.         │
│               Returns Result<T> type.               │
│               Uses Result.success() / Result.error()│
│               No Prisma imports (except types).     │
├─────────────────────────────────────────────────────┤
│  Repository  →  Data access only. Extends           │
│               BaseRepository. Uses getClient().     │
│               No business logic.                    │
└─────────────────────────────────────────────────────┘
```

### What Goes Where

| Operation             | Layer                    | Example                                        |
| --------------------- | ------------------------ | ---------------------------------------------- |
| Parse HTTP request    | Controller               | `@Body() dto: CreateDto`                       |
| Validate input        | DTO (class-validator)    | `@IsEmail() email: string`                     |
| Check business rules  | Service                  | `if (!content) return this.notFound(...)`      |
| Hash password         | Service                  | `this.hashingService.hash(dto.password)`       |
| Check roles           | Controller (guard)       | `@UseGuards(RolesGuard) @Roles(Role.ADMIN)`    |
| Query database        | Repository               | `this.getClient().content.findUnique(...)`     |
| Return result         | Service                  | `return this.success(entity)`                  |
| Transform to response | Entity                   | `new ContentEntity(content)`                   |
| Convert error to HTTP | Controller               | `this.throwIfError(result)`                    |

### Hard Rules

1. **Controller MUST NOT** import `PrismaService`, `PrismaClient`, or any `@prisma/client` types.
2. **Controller MUST NOT** contain business logic. It delegates to Service.
3. **Service MUST NOT** import `PrismaService` directly. It uses Repository.
4. **Service MAY** import `@prisma/client` types only for Prisma payload types.
5. **Repository MUST NOT** contain business logic. It is a thin data-access layer.
6. **Service returns `Result<T>`** — use `Result.success(data)` or `Result.error(code, message)`.
7. **Controller calls `throwIfError(result)`** to convert `Result` to HTTP exceptions.

---

## 3. Module Structure — One Pattern Only

Every domain module follows this exact structure. No variations.

```
src/modules/[domain]/
├── dto/
│   ├── create-[domain].dto.ts      # POST body validation
│   ├── update-[domain].dto.ts      # PATCH body validation
│   ├── query-[domain].dto.ts       # GET query params (pagination, filter)
│   └── index.ts                    # Barrel export
├── entities/
│   ├── [domain].entity.ts          # Response shape (class-transformer)
│   └── index.ts                    # Barrel export
├── [domain].controller.ts          # HTTP routes
├── [domain].service.ts             # Business logic
├── [domain].repository.ts          # Data access (extends BaseRepository)
├── [domain].module.ts              # NestJS module definition
└── index.ts                        # Public API exports
```

### Current Domains

| Module            | Description                    |
| ----------------- | ------------------------------ |
| `auth`            | Authentication & authorization |
| `user`            | User management                |
| `profile`         | User profiles                  |
| `content`         | Content catalog (dramas/movies)|
| `journal`         | Journal entries                |
| `content-request` | Content request submissions    |
| `admin`           | Admin functionality            |

### Rules

- **One module = one domain.** If a module has sub-controllers, split it into separate modules.
- **`dto/` folder** — contains only DTO classes. No logic. No entity types.
- **`entities/` folder** — contains only response entity classes. No validation decorators.
- **`index.ts`** — barrel exports for public API. Other modules import from here, never from internal files.
- **No `repositories/` folder with multiple files.** One module = one repository file.

### Import Rules

```typescript
// ✅ CORRECT — import from module's public API
import { ContentService, CreateContentDto, ContentEntity } from '../content';

// ❌ WRONG — importing internal files directly
import { ContentService } from '../content/content.service';
import { CreateContentDto } from '../content/dto/create-content.dto';
```

Exception: Within the same module, direct imports are fine:

```typescript
// ✅ OK — within the same module
import { CreateContentDto } from './dto/create-content.dto';
```

---

## 4. Repository Pattern — BaseRepository Only

**Every repository MUST extend `BaseRepository`.** This is non-negotiable.

### Template

```typescript
import { Injectable, Inject, Optional } from '@nestjs/common';
import { Prisma, Content } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BaseRepository,
  PRISMA_TRANSACTION,
} from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

// Prisma include/select constants — define once, reuse
export const CONTENT_INCLUDE = {
  _count: {
    select: {
      journalEntries: true,
    },
  },
} as const;

@Injectable()
export class ContentRepository extends BaseRepository<
  Content,
  Prisma.ContentCreateInput,
  Prisma.ContentUpdateInput,
  Prisma.ContentWhereUniqueInput,
  Prisma.ContentWhereInput,
  Prisma.ContentDelegate
> {
  constructor(
    prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
  }

  protected getModel(): Prisma.ContentDelegate {
    return this.prismaService.content;
  }

  async findBySlug(slug: string): Promise<Content | null> {
    return this.withRetry(
      () =>
        this.getClient().findUnique({
          where: { slug },
          include: CONTENT_INCLUDE,
        }),
      'findBySlug',
    );
  }

  async findPaginatedContent(options: {
    page?: number;
    limit?: number;
    type?: ContentType;
    genres?: string[];
    sort?: 'title' | 'year' | 'rating';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponseDto<Content>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(Math.max(1, options.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.withRetry(
        () =>
          this.getClient().findMany({
            where,
            include: CONTENT_INCLUDE,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
        'findPaginatedContent.items',
      ),
      this.withRetry(
        () => this.getClient().count({ where }),
        'findPaginatedContent.count',
      ),
    ]);

    return new PaginatedResponseDto<Content>(items, total, page, limit);
  }
}
```

### Hard Rules

1. **Always use `this.getClient()`** — never `this.prismaService` directly in methods.
2. **Always use `this.withRetry()`** — wrap every Prisma call.
3. **Define include/select constants** — as `const` at module scope, not inline.
4. **Return Prisma types** — `Content`, `ContentPrismaPayload`, not entity types.
5. **Constructor pattern** — always `prismaService: PrismaService` + `@Optional() @Inject(PRISMA_TRANSACTION) transactionClient?: unknown`.
6. **Implement `getModel()`** — return the Prisma delegate for this model.

### What Repository Does NOT Do

- Does NOT throw HTTP exceptions — that's Controller via `throwIfError()`.
- Does NOT transform data to entities — that's Service.
- Does NOT check permissions — that's Controller (guards).
- Does NOT hash passwords — that's Service.

---

## 5. Service Pattern — Result<T> Type

Services return `Result<T>` type, not raw entities. This provides consistent error handling without exceptions.

### Result Type Definition

```typescript
export type Result<T> = SuccessResult<T> | ErrorResult;

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

### Template

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService, Result } from '../../common/services/base.service';
import { ContentRepository } from './content.repository';
import { ContentEntity, toContentEntity, ContentPrismaPayload } from './entities';
import { QueryContentDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';

@Injectable()
export class ContentService extends BaseService {
  constructor(private readonly contentRepository: ContentRepository) {
    super();
  }

  async findBySlug(slug: string, userId?: string): Promise<Result<ContentEntity>> {
    let content;
    if (userId) {
      content = await this.contentRepository.findBySlugWithUserEntry(slug, userId);
    } else {
      content = await this.contentRepository.findBySlug(slug);
    }

    if (!content) {
      return this.notFound('Content not found', ErrorCode.USER_NOT_FOUND);
    }

    const payload = content as unknown as ContentPrismaPayload;
    const entity = toContentEntity(content);
    entity.avgRating = 0; // Calculate if needed
    entity.loggedCount = payload._count?.journalEntries || 0;

    return this.success(entity);
  }

  async browse(query: QueryContentDto): Promise<Result<PaginatedResponseDto<ContentEntity>>> {
    const result = await this.contentRepository.findPaginatedContent({
      page: query.page,
      limit: query.limit,
      type: query.type,
    });

    const entities = result.items.map((item) => {
      const entity = toContentEntity(item);
      return entity;
    });

    return this.success(
      new PaginatedResponseDto<ContentEntity>(
        entities,
        result.meta.total,
        result.meta.page,
        result.meta.limit,
      ),
    );
  }
}
```

### BaseService Helper Methods

```typescript
// Success
return this.success(data);

// Error
return this.error(ErrorCode.VALIDATION_FAILED, 'Invalid input');
return this.notFound('Content not found', ErrorCode.USER_NOT_FOUND);
return this.conflict(ErrorCode.EMAIL_ALREADY_EXISTS, 'Email already exists');
return this.unauthorized('Invalid credentials');
return this.forbidden('Access denied');
return this.validationError('Invalid input', { field: 'email' });
```

### Hard Rules

1. **Extend `BaseService`** — provides `success()`, `error()`, `notFound()`, etc.
2. **Always return `Result<T>`** — never throw exceptions from service.
3. **Use `ErrorCode` enum** — never use string literals for error codes.
4. **Constructor injection only** — no `@Inject()` decorators on service dependencies.
5. **Transform to Entity** — convert Prisma types to Entity before returning.
6. **No Prisma imports** — except for Prisma payload types.

---

## 6. Controller Pattern — HTTP Thin Layer

Controllers are thin: they delegate to service and convert `Result<T>` to HTTP responses.

### Template

```typescript
import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentEntity } from './entities';
import { QueryContentDto } from './dto';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Content')
@Controller('content')
export class ContentController extends BaseService {
  constructor(private readonly contentService: ContentService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Browse content catalog' })
  @ApiResponse({ status: 200, description: 'Paginated list of content' })
  async browse(@Query() query: QueryContentDto): Promise<PaginatedResponseDto<ContentEntity>> {
    const result = await this.contentService.browse(query);
    this.throwIfError(result);
    return (result as SuccessResult<PaginatedResponseDto<ContentEntity>>).data;
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get content detail' })
  @ApiResponse({ status: 200, type: ContentEntity })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getDetail(
    @Param('slug') slug: string,
    @Req() req: RequestWithUser,
  ): Promise<ContentEntity> {
    const userId = req.user?.userId;
    const result = await this.contentService.findBySlug(slug, userId);
    this.throwIfError(result);
    return (result as SuccessResult<ContentEntity>).data;
  }

  @Post('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin only endpoint' })
  async adminOnly(): Promise<{ message: string }> {
    return { message: 'Admin access granted' };
  }
}
```

### Authorization — RolesGuard

Use `RolesGuard` for role-based authorization:

```typescript
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
async adminEndpoint() { ... }
```

### Hard Rules

1. **No business logic** — controller delegates everything to service.
2. **Always call `this.throwIfError(result)`** — converts `Result` to HTTP exceptions.
3. **Extend `BaseService`** — provides `throwIfError()` method.
4. **Swagger decorators on every endpoint** — `@ApiOperation`, `@ApiResponse` for all status codes.
5. **Route ordering** — specific routes (`search`, `featured`) BEFORE parameterized routes (`:slug`, `:id`).
6. **Return type annotations** — explicit `Promise<Entity>` or `Promise<void>`.
7. **Use `OptionalJwtAuthGuard`** for endpoints that work with or without auth.
8. **Use `JwtAuthGuard`** for authenticated-only endpoints.
9. **Use `RolesGuard` + `@Roles()`** for role-restricted endpoints.

---

## 7. DTO Pattern — Validation Only

### Create DTO

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { IsUsername } from '../../common/decorators/is-username.decorator';
import { IsPassword } from '../../common/decorators/is-password.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'johndoe' })
  @IsUsername()
  username: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsPassword()
  password: string;
}
```

### Update DTO

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {}
```

### Query DTO (Pagination)

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContentType } from '../../common/enums/content-type.enum';

export enum SortBy {
  TITLE = 'title',
  YEAR = 'year',
  RATING = 'rating',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryContentDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ContentType })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.TITLE })
  @IsOptional()
  @IsEnum(SortBy)
  sort: SortBy = SortBy.TITLE;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.ASC;
}
```

### Hard Rules

1. **One DTO per file.** File name matches class name in kebab-case.
2. **Every field has `@ApiProperty` or `@ApiPropertyOptional`.**
3. **Every field has validation decorators.** No unvalidated fields.
4. **Use `PartialType(CreateDto)` for Update.** Do not redefine fields.
5. **Use `@Type(() => Number)`** on numeric query params — they arrive as strings.
6. **Default values on query DTOs** — `page = 1`, `limit = 20`.
7. **Enums for sort fields** — never accept arbitrary sort column names.
8. **No business logic in DTOs.** No methods. No computed properties.
9. **No `any` type.** Every field has explicit type.
10. **Use custom decorators** — `@IsUsername()`, `@IsPassword()`, `@IsRating()`, `@IsOptionalUrl()`.

### Barrel Export (`dto/index.ts`)

```typescript
export { CreateContentDto } from './create-content.dto';
export { UpdateContentDto } from './update-content.dto';
export { QueryContentDto, SortBy, SortOrder } from './query-content.dto';
```

---

## 8. Entity Pattern — Response Shaping

### Template

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ContentType } from '../../common/enums/content-type.enum';

// Prisma payload type — derived from include/select
export type ContentPrismaPayload = Prisma.ContentGetPayload<{
  include: {
    _count: {
      select: {
        journalEntries: true;
      };
    };
    journalEntries?: {
      where: { userId: string };
      take: 1;
    };
  };
}>;

@Exclude()
export class ContentEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Crash Landing on You' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'crash-landing-on-you' })
  @Expose()
  slug!: string;

  @ApiProperty({ enum: ContentType, example: ContentType.DRAMA })
  @Expose()
  type!: ContentType;

  @ApiProperty({ example: 2019 })
  @Expose()
  year!: number;

  @ApiPropertyOptional({ example: 'A paragliding mishap...' })
  @Expose()
  synopsis?: string | null;

  @ApiProperty({ example: ['Romance', 'Comedy', 'Drama'] })
  @Expose()
  genres!: string[];

  @ApiProperty({ example: 4.5 })
  @Expose()
  avgRating: number = 0;

  @ApiProperty({ example: 1250 })
  @Expose()
  loggedCount: number = 0;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<ContentEntity>) {
    Object.assign(this, partial);

    // Ensure genres is an array if it comes as a string or null from DB
    if (typeof this.genres === 'string') {
      try {
        const parsed: unknown = JSON.parse(this.genres);
        this.genres = Array.isArray(parsed) ? (parsed as string[]) : [];
      } catch {
        this.genres = [];
      }
    } else if (!this.genres) {
      this.genres = [];
    }
  }
}

// Factory function for creating entity from Prisma result
export function toContentEntity(content: Prisma.ContentGetPayload<object>): ContentEntity {
  return new ContentEntity(content);
}
```

### Hard Rules

1. **`@Exclude()` on class** — whitelist fields with `@Expose()`.
2. **`@ApiProperty` on every exposed field** — for Swagger docs.
3. **`@Type(() => Date)`** on Date fields — class-transformer needs this.
4. **Constructor accepts partial** — `Object.assign(this, partial)`.
5. **Define `PrismaPayload` type** — derived from the same `include` used in repository.
6. **Nullable fields use `| null`** — not `| undefined`. Prisma returns `null` for missing relations.
7. **No validation decorators** — entities are output-only.
8. **No `any` type.**
9. **Use factory function** — `toContentEntity()` for consistent entity creation.

---

## 9. Error Handling — Result<T> Pattern

### Service Level — Return Result<T>

```typescript
// ✅ CORRECT — return Result with error
async findById(id: string): Promise<Result<ContentEntity>> {
  const content = await this.repository.findById({ id });
  if (!content) {
    return this.notFound('Content not found', ErrorCode.USER_NOT_FOUND);
  }
  return this.success(new ContentEntity(content));
}

// ✅ CORRECT — return Result with conflict error
async create(dto: CreateDto): Promise<Result<ContentEntity>> {
  const existing = await this.repository.findBySlug(dto.slug);
  if (existing) {
    return this.conflict(ErrorCode.ENTRY_ALREADY_EXISTS, 'Content with this slug already exists');
  }
  const content = await this.repository.create(dto);
  return this.success(new ContentEntity(content));
}
```

### Controller Level — Convert to HTTP Exception

```typescript
// ✅ CORRECT — use throwIfError
async getDetail(@Param('slug') slug: string): Promise<ContentEntity> {
  const result = await this.contentService.findBySlug(slug);
  this.throwIfError(result); // Converts ErrorResult to HTTP exception
  return (result as SuccessResult<ContentEntity>).data;
}
```

### Error Codes

Use codes from `src/common/enums/error-code.enum.ts`:

```typescript
export enum ErrorCode {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CURRENT_PASSWORD = 'INVALID_CURRENT_PASSWORD',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ENTRY_ALREADY_EXISTS = 'ENTRY_ALREADY_EXISTS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DUPLICATE_REQUEST = 'DUPLICATE_REQUEST',
}
```

### Error Code to HTTP Exception Mapping

The `throwIfError()` method in `BaseService` maps error codes to HTTP exceptions:

| Error Code                      | HTTP Exception            |
| ------------------------------- | ------------------------- |
| `USER_NOT_FOUND`                | `NotFoundException`       |
| `EMAIL_ALREADY_EXISTS`          | `ConflictException`       |
| `USERNAME_ALREADY_EXISTS`       | `ConflictException`       |
| `ENTRY_ALREADY_EXISTS`          | `ConflictException`       |
| `DUPLICATE_REQUEST`             | `ConflictException`       |
| `AUTH_INVALID_CREDENTIALS`      | `UnauthorizedException`   |
| `AUTH_TOKEN_EXPIRED`            | `UnauthorizedException`   |
| `AUTH_TOKEN_INVALID`            | `UnauthorizedException`   |
| `INVALID_TOKEN`                 | `UnauthorizedException`   |
| `TOKEN_EXPIRED`                 | `UnauthorizedException`   |
| `INVALID_PASSWORD`              | `UnauthorizedException`   |
| `INVALID_CURRENT_PASSWORD`      | `UnauthorizedException`   |
| `VALIDATION_FAILED`             | `BadRequestException`     |
| `RATE_LIMIT_EXCEEDED`           | `429 Too Many Requests`   |
| Default                         | `InternalServerErrorException` |

---

## 10. Type Rules — No Redundancy, No Shortcuts

### 10.1 Forbidden Types

```typescript
// ❌ NEVER — any of these
const data: any = ...;
function process(input: any): any { ... }
const result = JSON.parse(str) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

```typescript
// ❌ NEVER — unknown without narrowing
function handle(error: unknown) {
  console.log(error.message); // error is unknown, this will fail
}
```

```typescript
// ❌ NEVER — Object (capital O)
const data: Object = ...;
```

### 10.2 Required Types

```typescript
// ✅ CORRECT — explicit return types on public methods
async create(dto: CreateContentDto): Promise<Result<ContentEntity>> { ... }
async findBySlug(slug: string): Promise<Result<ContentEntity>> { ... }
async delete(id: string): Promise<Result<void>> { ... }

// ✅ OK — inferred return on private helpers
private validateSlug(slug: string) { // return type inferred as void
  if (!slug.includes('-')) {
    return this.validationError('Invalid slug format');
  }
}
```

### 10.3 Prisma Type Derivation

```typescript
// ✅ CORRECT — derive payload type from Prisma
export type ContentPrismaPayload = Prisma.ContentGetPayload<{
  include: { _count: { select: { journalEntries: true } } };
}>;

// ✅ CORRECT — use Prisma namespace for input types
import { Prisma } from '@prisma/client';
const where: Prisma.ContentWhereInput = { ... };

// ✅ ALLOWED — 'as' assertion for Prisma payload narrowing
const content = await this.repository.findBySlug(slug);
const payload = content as unknown as ContentPrismaPayload;

// ❌ WRONG — 'as' for anything else
const data = JSON.parse(str) as Record<string, unknown>;
```

### 10.4 Enum Usage

```typescript
// ✅ CORRECT — TypeScript enum for API-facing values
export enum ContentType {
  DRAMA = 'DRAMA',
  MOVIE = 'MOVIE',
}

export enum WatchStatus {
  WATCHING = 'WATCHING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PLAN_TO_WATCH = 'PLAN_TO_WATCH',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// ✅ CORRECT — const object for internal constants
const CONTENT_INCLUDE = {
  _count: {
    select: {
      journalEntries: true,
    },
  },
} as const;
```

### 10.5 Interface vs Type

```typescript
// ✅ CORRECT — interface for data shapes
export interface CreateContentData {
  title: string;
  slug: string;
  type: ContentType;
}

// ✅ CORRECT — type for derived/utility types
export type ContentPrismaPayload = Prisma.ContentGetPayload<...>;

// ❌ WRONG — type alias for simple data shapes
type CreateContentData = {
  title: string;
  slug: string;
}; // Use interface instead
```

**Rule:** `interface` for data shapes you define. `type` for Prisma-derived types, unions, intersections, and mapped types.

---

## 11. Anti-Patterns — What NEVER to Do

### 11.1 No `any`, No Shortcuts

```typescript
// ❌ NEVER
// eslint-disable-next-line ...
// @ts-ignore
// @ts-expect-error
const x: any = ...
as any
as unknown
```

If a lint rule fires, fix the code. If a type error appears, fix the type. Suppression is not an option.

### 11.2 No Direct Prisma in Service

```typescript
// ❌ WRONG
@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDto) {
    return this.prisma.content.create({ data: dto });
  }
}

// ✅ CORRECT
@Injectable()
export class ContentService extends BaseService {
  constructor(private readonly repository: ContentRepository) {
    super();
  }

  async create(dto: CreateDto): Promise<Result<ContentEntity>> {
    const record = await this.repository.create(dto);
    return this.success(new ContentEntity(record));
  }
}
```

### 11.3 No Business Logic in Controller

```typescript
// ❌ WRONG
@Post()
async create(@Body() dto: CreateDto) {
  if (!dto.title) {
    throw new BadRequestException('Title is required');
  }
  return this.service.create(dto);
}

// ✅ CORRECT
@Post()
create(@Body() dto: CreateDto): Promise<ContentEntity> {
  const result = await this.service.create(dto);
  this.throwIfError(result);
  return (result as SuccessResult<ContentEntity>).data;
}
// Service handles validation via DTO decorators
```

### 11.4 No Inline Prisma Include/Select

```typescript
// ❌ WRONG — inline include in every method
async findBySlug(slug: string) {
  return this.getClient().findUnique({
    where: { slug },
    include: { _count: { select: { journalEntries: true } } },
  });
}

// ✅ CORRECT — constant at module scope
const CONTENT_INCLUDE = {
  _count: {
    select: {
      journalEntries: true,
    },
  },
} as const;

async findBySlug(slug: string) {
  return this.withRetry(
    () =>
      this.getClient().findUnique({
        where: { slug },
        include: CONTENT_INCLUDE,
      }),
    'findBySlug',
  );
}
```

### 11.5 No Duplicate Type Definitions

```typescript
// ❌ WRONG — same interface defined in multiple files
// file-a.ts
interface QueryOptions { page?: number; limit?: number; }
// file-b.ts
interface QueryOptions { page?: number; limit?: number; sort?: string; }

// ✅ CORRECT — single source of truth
// src/common/interfaces/query-options.interface.ts
export interface QueryOptions { ... }
// Other files import from there
```

### 11.6 No Barrel Import Breaks

```typescript
// ❌ WRONG — importing internal file from another module
import { ContentRepository } from '../content/content.repository';

// ✅ CORRECT — importing from public API
import { ContentRepository } from '../content';
```

### 11.7 No Magic Numbers or Strings

```typescript
// ❌ WRONG
if (status === 'WATCHING') { ... }
throw new Error('Content not found');

// ✅ CORRECT
if (status === WatchStatus.WATCHING) { ... }
return this.notFound('Content not found', ErrorCode.USER_NOT_FOUND);
```

---

## 12. Testing Patterns

### 12.1 Test Types

| Layer       | Target                  | Location                        | Runner |
| ----------- | ----------------------- | ------------------------------- | ------ |
| Unit        | Services, Guards, Pipes | `src/**/*.spec.ts` (co-located) | `jest` |
| E2E         | Controllers (full HTTP) | `test/**/*.e2e-spec.ts`         | `jest` |

### 12.2 Coverage Requirements

| Metric     | Target |
| ---------- | ------ |
| Branches   | 70%    |
| Functions  | 80%    |
| Lines      | 80%    |
| Statements | 80%    |

### 12.3 Unit Test — Service

```typescript
describe('ContentService', () => {
  let service: ContentService;
  let repository: jest.Mocked<ContentRepository>;

  beforeEach(() => {
    repository = {
      findBySlug: jest.fn(),
      findPaginatedContent: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ContentRepository>;

    service = new ContentService(repository);
  });

  describe('findBySlug', () => {
    it('should return success with entity when found', async () => {
      const mockContent = { id: '1', slug: 'test', title: 'Test' };
      repository.findBySlug.mockResolvedValue(mockContent as any);

      const result = await service.findBySlug('test');

      expect(result.success).toBe(true);
      expect((result as SuccessResult<ContentEntity>).data.slug).toBe('test');
    });

    it('should return error when not found', async () => {
      repository.findBySlug.mockResolvedValue(null);

      const result = await service.findBySlug('nonexistent');

      expect(result.success).toBe(false);
      expect((result as ErrorResult).error.code).toBe(ErrorCode.USER_NOT_FOUND);
    });
  });
});
```

**Rules:**

- Mock ALL dependencies with `jest.fn()` — no real implementations
- Use `jest.Mocked<Type>` for type-safe mocks
- Test happy path + all error paths
- Assert on `result.success` and `result.data` or `result.error`

### 12.4 Unit Test — Repository

```typescript
describe('ContentRepository', () => {
  let repository: ContentRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      content: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = new ContentRepository(prisma);
  });

  it('should find content by slug', async () => {
    const mockContent = { id: '1', slug: 'test' };
    prisma.content.findUnique.mockResolvedValue(mockContent as any);

    const result = await repository.findBySlug('test');

    expect(result).toEqual(mockContent);
    expect(prisma.content.findUnique).toHaveBeenCalledWith({
      where: { slug: 'test' },
      include: CONTENT_INCLUDE,
    });
  });
});
```

### 12.5 E2E Test

```typescript
describe('Content API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /content', () => {
    it('should return paginated content', async () => {
      const response = await request(app.getHttpServer())
        .get('/content')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('meta');
    });
  });

  describe('GET /content/:slug', () => {
    it('should return 404 for non-existent content', async () => {
      await request(app.getHttpServer())
        .get('/content/nonexistent-slug')
        .expect(404);
    });
  });
});
```

### 12.6 Test Scripts

| Script        | Description                       |
| ------------- | --------------------------------- |
| `test`        | Run unit tests                    |
| `test:watch`  | Run unit tests in watch mode      |
| `test:cov`    | Run unit tests with coverage      |
| `test:debug`  | Debug unit tests with inspector   |
| `test:e2e`    | Run E2E tests                     |

---

## 13. Enums and Constants

### Role Enum

```typescript
// src/common/enums/role.enum.ts
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

### Content Type Enum

```typescript
// src/common/enums/content-type.enum.ts
export enum ContentType {
  DRAMA = 'DRAMA',
  MOVIE = 'MOVIE',
}
```

### Watch Status Enum

```typescript
// src/common/enums/watch-status.enum.ts
export enum WatchStatus {
  WATCHING = 'WATCHING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PLAN_TO_WATCH = 'PLAN_TO_WATCH',
}
```

### Request Status Enum

```typescript
// src/common/enums/request-status.enum.ts
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

---

## 14. Custom Decorators

### IsUsername

```typescript
// src/common/decorators/is-username.decorator.ts
export function IsUsername(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    MinLength(3),
    MaxLength(30),
    Matches(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  );
}
```

### IsPassword

```typescript
// src/common/decorators/is-password.decorator.ts
export function IsPassword(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    MinLength(8),
    MaxLength(128),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  );
}
```

### IsRating

```typescript
// src/common/decorators/is-rating.decorator.ts
export function IsRating(): PropertyDecorator {
  return applyDecorators(
    IsNumber(),
    Min(0),
    Max(5),
  );
}
```

---

## 15. Checklist — Before Submitting Code

Run through this checklist before considering a module complete:

- [ ] Repository extends `BaseRepository`
- [ ] Repository uses `this.getClient()` for all Prisma calls
- [ ] Repository uses `this.withRetry()` for all operations
- [ ] Repository has no business logic
- [ ] Repository implements `getModel()` abstract method
- [ ] Service extends `BaseService`
- [ ] Service returns `Result<T>` type
- [ ] Service uses `this.success()` and `this.error()` methods
- [ ] Service has no direct Prisma imports
- [ ] Controller extends `BaseService` (for `throwIfError`)
- [ ] Controller has no business logic
- [ ] Controller calls `this.throwIfError(result)` for all service calls
- [ ] Controller has Swagger decorators on all endpoints
- [ ] DTOs have validation decorators on all fields
- [ ] DTOs have `@ApiProperty` on all fields
- [ ] Entity uses `@Exclude()` + `@Expose()` pattern
- [ ] Entity has `@ApiProperty` on all exposed fields
- [ ] No `any` type anywhere
- [ ] No `eslint-disable` comments
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] No `as any` or `as unknown` (except Prisma payloads)
- [ ] Barrel exports in `dto/index.ts`, `entities/index.ts`, module `index.ts`
- [ ] Unit tests for service (mock repository)
- [ ] Unit tests for repository (mock Prisma)

---

## 16. Prisma Schema Models

The following models are defined in `prisma/schema.prisma`:

| Model            | Description                    |
| ---------------- | ------------------------------ |
| `User`           | User accounts                  |
| `UserProfile`    | User profile information       |
| `Content`        | Dramas and movies              |
| `Genre`          | Content genres                 |
| `JournalEntry`   | User's content watch journal   |
| `ContentRequest` | Content request submissions    |
| `RefreshToken`   | JWT refresh tokens             |

### Key Relationships

- `User` → `UserProfile` (1:1)
- `User` → `JournalEntry` (1:N)
- `User` → `ContentRequest` (1:N)
- `User` → `RefreshToken` (1:N)
- `Content` → `JournalEntry` (1:N)
- `Content` → `ContentRequest` (1:N)

### Unique Constraints

- `User.email` (case-insensitive via Citext)
- `User.username` (case-insensitive via Citext)
- `Content.slug`
- `JournalEntry(userId, contentId)` — one entry per user per content

---

_This document is the source of truth for code generation. When this guide conflicts with existing code, this guide wins._
