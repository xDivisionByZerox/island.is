import { json, ref } from './dsl'
import { BffInfo, Context, PortalKeys } from './types/input-types'

import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../libs/auth/scopes/src/index'

export const getScopes = (key: PortalKeys) => {
  switch (key) {
    case 'minarsidur':
      return servicePortalScopes
    case 'stjornbord':
      return adminPortalScopes
    default:
      throw new Error('Invalid BFF client')
  }
}

export const bffConfig = ({ key, services, clientName, clientId }: BffInfo) => {
  const getBaseUrl = (ctx: Context) =>
    ctx.featureDeploymentName
      ? `${ctx.featureDeploymentName}-beta.${ctx.env.domain}`
      : ctx.env.type === 'prod'
      ? ctx.env.domain
      : `beta.${ctx.env.domain}`

  return {
    env: {
      IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
      IDENTITY_SERVER_CLIENT_ID: clientId,
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      BFF_NAME: {
        local: key,
        dev: key,
        staging: key,
        prod: key,
      },
      BFF_CLIENT_KEY_PATH: `/${key}`,
      BFF_PAR_SUPPORT_ENABLED: 'true',
      BFF_CLIENT_BASE_URL: {
        local: 'http://localhost:4200',
        dev: ref((ctx) => ctx.svc(`https://${getBaseUrl(ctx)}`)),
        staging: ref((ctx) => ctx.svc(`https://${getBaseUrl(ctx)}`)),
        prod: 'https://island.is',
      },
      BFF_ALLOWED_REDIRECT_URIS: {
        local: json([`http://localhost:4200/${key}`]),
        dev: ref((ctx) => json([`https://${getBaseUrl(ctx)}`])),
        staging: ref((ctx) => json([`https://${getBaseUrl(ctx)}`])),
        prod: json(['https://island.is']),
      },
      BFF_LOGOUT_REDIRECT_URI: {
        local: `http://localhost:4200/${key}`,
        dev: ref((ctx) => `https://${getBaseUrl(ctx)}`),
        staging: ref((ctx) => `https://${getBaseUrl(ctx)}`),
        prod: 'https://island.is',
      },
      BFF_CALLBACKS_BASE_PATH: {
        local: `http://localhost:3010/${key}/bff/callbacks`,
        dev: ref((c) => `https://${getBaseUrl(c)}/${key}/bff/callbacks`),
        staging: ref((c) => `https://${getBaseUrl(c)}/${key}/bff/callbacks`),
        prod: ref((c) => `https://${getBaseUrl(c)}/${key}/bff/callbacks`),
      },
      BFF_PROXY_API_ENDPOINT: {
        local: 'http://localhost:4444/api/graphql',
        dev: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
        staging: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
        prod: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
      },
      BFF_CACHE_USER_PROFILE_TTL_MS: (60 * 60 * 1000 - 5000).toString(),
      BFF_LOGIN_ATTEMPT_TTL_MS: (60 * 60 * 1000 * 24 * 7).toString(),
    },
    secrets: {
      BFF_TOKEN_SECRET_BASE64: `/k8s/services-bff/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/services-bff/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    },
  }
}
