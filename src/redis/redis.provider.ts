// redis.provider.ts
import Redis from 'ioredis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: '127.0.0.1',
      port: 6379,
      tls: {
        // TLS 검증 비활성화
        checkServerIdentity: () => null,
      },
    });
  },
};
