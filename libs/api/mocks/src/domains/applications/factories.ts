import { factory, faker } from '@island.is/shared/mocking'
import {
  ApplicationStatus,
  DataProviderResult,
} from '@island.is/application/types'

import { Application } from '../../types'

export const application = factory<Application>({
  id: () => faker.string.uuid(),
  created: () => faker.date.past().toISOString(),
  modified: () => faker.date.past().toISOString(),
  applicant: () => faker.string.alphanumeric(10),
  assignees: [],
  applicantActors: [],
  state: 'draft',
  typeId: 'ExampleForm',
  answers: [],
  externalData: {},
  status: ApplicationStatus.IN_PROGRESS,
})

export const externalData = factory<DataProviderResult>({
  status: 'success',
  data: undefined,
  statusCode: undefined,
  date: () => new Date(),
  reason: undefined,
  $traits: {
    failure: {
      status: 'failure',
      reason: 'Mock error',
    },
    UserProfileProvider: {
      data: () => ({
        email: faker.internet.email(),
        emailVerified: true,
        mobilePhoneNumber: faker.helpers.fromRegExp('[0-9]{3}-[0-9]{4}'),
        mobilePhoneNumberVerified: true,
      }),
    },
    PregnancyStatus: {
      data: () => ({
        hasActivePregnancy: true,
        pregnancyDueDate: faker.date.soon(),
      }),
    },
    ParentalLeaves: {
      data: {},
    },
  },
})
