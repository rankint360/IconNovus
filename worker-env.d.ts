/// <reference types="@cloudflare/workers-types" />
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_AUD?: string;
    ICONAVIX_ADMIN_EMAIL?: string;
  }
}
