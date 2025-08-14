import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers?: Record<string, string | string[] | undefined>;
      routeOptions?: { config?: { isPublic?: boolean } };
    }>();

    const routeConfig = request.routeOptions?.config;

    if (!routeConfig) {
      throw new UnauthorizedException('Route config is not found');
    }

    if (routeConfig?.isPublic === true) {
      return true;
    }

    const providedApiKey = request.headers?.['x-api-key'];

    const expectedApiKey = this.configService.get<string>('xApiKey');

    if (!expectedApiKey) {
      throw new UnauthorizedException('API key is not configured');
    }

    if (!providedApiKey || providedApiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
