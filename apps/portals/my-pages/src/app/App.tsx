import { AuthProvider } from '@island.is/auth/react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/portals/my-pages/graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { ServicePortalPaths } from '@island.is/portals/my-pages/core'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { ApplicationErrorBoundary, PortalRouter } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import { createRoutes } from '../lib/routes'
import { environment } from '../environments'
import * as styles from './App.css'

export const App = () => (
  <div className={styles.page}>
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <AuthProvider basePath={ServicePortalPaths.Base}>
          <ApplicationErrorBoundary>
            <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
              <PortalRouter
                modules={modules}
                createRoutes={createRoutes}
                portalMeta={{
                  basePath: ServicePortalPaths.Base,
                  portalType: 'my-pages',
                  portalTitle: 'Mínar síður - Ísland.is',
                }}
              />
            </FeatureFlagProvider>
          </ApplicationErrorBoundary>
        </AuthProvider>
      </LocaleProvider>
    </ApolloProvider>
  </div>
)
