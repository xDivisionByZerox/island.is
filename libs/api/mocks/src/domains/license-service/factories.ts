import { factory, faker, title } from '@island.is/shared/mocking'
import {
  GenericLicense,
  GenericLicenseFetch,
  GenericLicenseType,
  GenericUserLicense,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseMetadata,
  GenericLicenseDataField,
  Payload,
} from '../../types'
import {
  mockAdrLicense,
  mockDriversLicense,
  mockFirearmLicense,
  mockMachineLicense,
} from './mocks'
import { mockDisabilityLicense } from './mocks/disabilityMock'
import { maybeExpired } from './mocks/utils'

const genericLicenseFetch = factory<GenericLicenseFetch>({
  status: 'Fetched' as GenericUserLicenseFetchStatus,
  updated: faker.date.recent().toISOString(),
})

export const genericLicense = factory<GenericLicense>({
  pkpass: () => faker.datatype.boolean(),
  pkpassStatus: faker.helpers.arrayElement([
    'Available',
    'NotAvailable',
    'Unknown',
  ]),
  pkpassVerify: () => faker.datatype.boolean(),
  provider: () => ({
    id: faker.helpers.arrayElement([
      'AdministrationOfOccupationalSafetyAndHealth',
      'EnvironmentAgency',
      'NationalPoliceCommissioner',
      'SocialInsuranceAdministration',
    ]),
  }),
  status: 'HasLicense',
  timeout: 100000,
  type: 'DriversLicense',
})

export const metadata = factory<GenericUserLicenseMetadata>({
  expired: () => faker.datatype.boolean(),
  licenseNumber: () => faker.number.int().toString(),
  title: () => title(),
})

export const genericLicenseDataField = factory<GenericLicenseDataField>({
  description: faker.lorem.words(),
  hideFromServicePortal: faker.datatype.boolean(),
  label: faker.lorem.word(),
  name: faker.person.fullName(),
  type: faker.helpers.arrayElement(['Category', 'Group', 'Table', 'Value']),
  value: faker.word.sample(),
})

export const payload = () => {
  const traitArgs = {
    number: faker.number.int().toString(),
    name: title(),
    expires: maybeExpired(),
  }
  return factory<Payload>({
    $traits: {
      AdrLicense: {
        data: mockAdrLicense(traitArgs),
      },
      MachineLicense: {
        data: mockMachineLicense(traitArgs),
      },
      FirearmLicense: {
        data: mockFirearmLicense(traitArgs),
      },
      DriversLicense: {
        data: mockDriversLicense(traitArgs),
      },
      DisabilityLicense: {
        data: mockDisabilityLicense(traitArgs),
      },
    },
    data: [],
    metadata: () =>
      metadata({
        licenseNumber: traitArgs.number,
        title: traitArgs.number,
        expired: new Date() > new Date(traitArgs.expires),
      }),
  })
}

export const genericUserLicenses = (types?: Array<string>) => {
  const licenseTypes = types ?? ['DriversLicense']
  const licenses = licenseTypes.map((type) => genericUserLicense(type)())
  return licenses
}

export const genericUserLicense = (type: string) => {
  return factory<GenericUserLicense>({
    fetch: () => genericLicenseFetch(),
    license: () => genericLicense({ type: type as GenericLicenseType }),
    nationalId: '0000000001',
    payload: () => payload()(type),
  })
}
