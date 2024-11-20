import { BffUser } from '@island.is/shared/types'

/**
 * Creates a function that can generate a BFF URLs.
 *
 * @usage
 * const bffBaseUrl = createBffUrlGenerator('/myapplication')
 * const userUrl = bffBaseUrl('/user') // http://localhost:3010/myapplication/bff/user
 * const userUrlWithParams = bffBaseUrl('/user', { id: '123' }) // http://localhost:3010/myapplication/bff/user?id=123
 */
export const createBffUrlGenerator = (basePath: string) => {
  const sanitizedBasePath = sanitizePath(basePath)
  const baseUrl = `${window.location.origin}/${sanitizedBasePath}/bff`

  return (relativePath = '', params?: Record<string, string>) => {
    const url = `${baseUrl}${relativePath}`

    if (params) {
      const qs = createQueryStr(params)

      return `${url}${qs ? `?${qs}` : ''}`
    }

    return url
  }
}

/**
 * Trim any leading and trailing slashes
 */
const sanitizePath = (path: string) => path.replace(/^\/+|\/+$/g, '')

/**
 * Creates a query string from an object
 */
export const createQueryStr = (params: Record<string, string>) => {
  return new URLSearchParams(params).toString()
}

/**
 *  Checks if the user is a new user compared to the old user, by comparing the nationalId's
 */
export const isNewUser = (oldUser: BffUser, newUser: BffUser) => {
  return oldUser.profile.nationalId !== newUser.profile.nationalId
}
