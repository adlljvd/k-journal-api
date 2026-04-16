import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  health() {
    return { ok: true };
  }

  @Get("live")
  live() {
    return {
      ok: true,
      service: "k-journal-api",
      uptimeMs: Math.floor(process.uptime() * 1000),
      timestamp: new Date().toISOString(),
    };
  }

  @Get("ready")
  async ready() {
    const startedAt = Date.now();

    try {
      const dbStartedAt = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const dbLatencyMs = Date.now() - dbStartedAt;

      return {
        ok: true,
        service: "k-journal-api",
        db: { ok: true, latencyMs: dbLatencyMs },
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        ok: false,
        service: "k-journal-api",
        db: { ok: false },
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
