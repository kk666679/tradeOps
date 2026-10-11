import {
  BadRequestException,
  Controller,
  ForbiddenException,
  All,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { META_KEY } from './shared/schemas/meta';
import { createStreamableHttpHandler } from './shared/transport/streamable-http';
import { createTradeOpsMcpServer } from './servers/tradeops-core/src';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
  };
}

interface McpRequestBody {
  method?: string;
  params?: Record<string, unknown>;
}

const RESOURCE_URI = 'https://tradeops.local/api/mcp';

@Controller('mcp')
@UseGuards(AuthGuard('jwt'))
export class McpController {
  constructor(private readonly prisma: PrismaService) {}

  @All()
  async handle(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    const principal = req.user;
    if (!principal?.id || !principal.tenantId) {
      throw new UnauthorizedException('An authenticated tenant identity is required for MCP.');
    }

    this.bindTenant(req.body as McpRequestBody | undefined, principal);

    const handler = createStreamableHttpHandler(
      () => createTradeOpsMcpServer(this.prisma),
      {
      resourceUri: RESOURCE_URI,
      actorId: principal.id,
      tenantId: principal.tenantId,
      },
    );
    await handler(req, res);
  }

  private bindTenant(
    body: McpRequestBody | undefined,
    principal: NonNullable<AuthenticatedRequest['user']>,
  ): void {
    if (!body?.params) return;

    const params = body.params;
    const metadata = (params._meta ?? {}) as Record<string, unknown>;
    const requestedTenant = metadata[META_KEY.TENANT_ID];
    if (requestedTenant && requestedTenant !== principal.tenantId) {
      throw new ForbiddenException('MCP tenant metadata does not match the authenticated tenant.');
    }

    if (body.method === 'tools/call') {
      const args = params.arguments as Record<string, unknown> | undefined;
      if (args?.tenantId && args.tenantId !== principal.tenantId) {
        throw new ForbiddenException('MCP tool tenant does not match the authenticated tenant.');
      }
    }

    if (body.method === 'resources/read') {
      const uri = params.uri;
      if (typeof uri === 'string' && uri.startsWith('tradeops://yard/')) {
        let resourceTenant: string;
        try {
          resourceTenant = decodeURIComponent(uri.slice('tradeops://yard/'.length));
        } catch {
          throw new BadRequestException('MCP resource URI contains invalid encoding.');
        }
        if (resourceTenant !== principal.tenantId) {
          throw new ForbiddenException('MCP resource tenant does not match the authenticated tenant.');
        }
      }
    }

    params._meta = {
      ...metadata,
      [META_KEY.TENANT_ID]: principal.tenantId,
      [META_KEY.ACTOR_ID]: principal.id,
    };
  }
}
