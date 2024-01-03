import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import getConfig from 'next/config'

import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  LinkV2,
  Stack,
  Tabs,
  TabType,
  Text,
} from '@island.is/island-ui/core'
import { Requirement } from '@island.is/university-gateway'
import { IconTitleCard } from '@island.is/web/components'
import {
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayQuery,
  GetUniversityGatewayQueryVariables,
  GetUniversityGatewayUniversitiesQuery,
  UniversityGatewayProgramCourse,
  UniversityGatewayProgramDetails,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_PROGRAM,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { TranslationDefaults } from './TranslationDefaults'
import * as styles from './UniversitySearch.css'

const { publicRuntimeConfig = {} } = getConfig() ?? {}
interface UniversityDetailsProps {
  data: UniversityGatewayProgramDetails
  namespace: Record<string, string>
  locale: string
  universities: Array<UniversityGatewayUniversity>
}

const UniversityDetails: Screen<UniversityDetailsProps> = ({
  data,
  namespace,
  locale,
  universities,
}) => {
  const n = useNamespace(namespace)

  const [sortedCourses, setSortedCourses] = useState<
    Array<UniversityGatewayProgramCourse>
  >([])
  const { linkResolver } = useLinkResolver()
  const [isOpen, setIsOpen] = useState<Array<boolean>>([
    false,
    false,
    false,
    false,
  ])

  const toggleIsOpen = (index: number) => {
    const newIsOpen = isOpen.map((x, i) => {
      if (i === index) {
        return !isOpen[index]
      } else return x
    })

    setIsOpen(newIsOpen)
  }

  useEffect(() => {
    setSortedCourses(
      data.courses.sort((x, y) =>
        (x.semesterSeason + x.semesterYear).localeCompare(
          y.semesterSeason + y.semesterYear,
        ),
      ),
    )
  }, [data, sortedCourses])

  function mapArrayToDictionary(array: Array<unknown>, mapByKey: string) {
    const dictionary: { [key: string]: Array<UniversityGatewayProgramCourse> } =
      {}

    array.forEach((arrayItem: any) => {
      const keyValue = arrayItem[mapByKey]

      if (keyValue === undefined) {
        return
      }
      if (dictionary[keyValue] === undefined) {
        // If the key doesn't exist in the dictionary, create a new array
        dictionary[keyValue] = [arrayItem]
      } else {
        // If the key already exists, push the value to the existing array
        dictionary[keyValue].push(arrayItem)
      }
    })

    return dictionary
  }

  const createTabContent = () => {
    if (sortedCourses.length === 0) {
      return
    }
    const tabList: Array<TabType> = []
    const mappedDictionary = mapArrayToDictionary(
      sortedCourses,
      'semesterYearNumber',
    )
    let index = 0
    for (const key in mappedDictionary) {
      const value = mappedDictionary[key]
      const mappedBySemester = mapArrayToDictionary(value, 'semesterSeason')

      const contentItems: Array<React.ReactElement> = []
      for (const x in mappedBySemester) {
        contentItems.push(
          <Box className={[styles.courseTypeIcon, styles.capitalizeText]}>
            <Text variant="h4" color="blue400" paddingBottom={2} paddingTop={2}>
              {n(x, TranslationDefaults[x])}
            </Text>
            {mappedBySemester[x].map((item) => {
              return (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                >
                  <Text variant="h4" as="p" paddingBottom={1} paddingTop={1}>
                    {locale === 'en' ? item.nameEn : item.nameIs}
                  </Text>
                  <Box className={styles.courseTypeIcon}>
                    <Text
                      fontWeight="semiBold"
                      color={
                        item.requirement === Requirement.MANDATORY
                          ? 'red600'
                          : item.requirement === Requirement.FREE_ELECTIVE
                          ? 'blue600'
                          : 'purple600'
                      }
                    >
                      {item.requirement === Requirement.MANDATORY
                        ? 'S'
                        : item.requirement === Requirement.FREE_ELECTIVE
                        ? 'V'
                        : 'B'}
                    </Text>
                  </Box>
                </Box>
              )
            })}
          </Box>,
        )
      }

      tabList.push({
        id: index.toString(),
        label: `${parseInt(key) + 1}. ${n('year', 'ár')}`,
        content: contentItems,
      })
      index++
    }

    return tabList
  }

  return (
    <SidebarLayout
      sidebarContent={
        <Stack space={3}>
          <LinkV2 href={linkResolver('universitysearch').href} skipTab>
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              truncate
            >
              {n('goBack', 'Til baka í yfirlit')}
            </Button>
          </LinkV2>
          <IconTitleCard
            heading={
              universities.filter((x) => x.id === data.universityId)[0]
                .contentfulTitle || ''
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            href="/"
            imgSrc={
              universities.filter((x) => x.id === data.universityId)[0]
                .contentfulLogoUrl || ''
            }
            alt="University infomation"
          />
        </Stack>
      }
    >
      <Stack space={3}>
        <Hidden above="sm">
          <LinkV2 href={linkResolver('universitysearch').href} skipTab>
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              truncate
            >
              {n('goBack', 'Til baka í yfirlit')}
            </Button>
          </LinkV2>
        </Hidden>
        <Text variant="h1" as="h1">
          {locale === 'en' ? data.nameEn : data.nameIs}
        </Text>

        <Box marginTop={2}>
          {data.credits && data.credits > 0 ? (
            <Text variant="default">{`${data.degreeAbbreviation} - ${data.credits} einingar`}</Text>
          ) : (
            <Text variant="default">{`${data.degreeAbbreviation}`}</Text>
          )}
          <Text marginTop={3} marginBottom={3} variant="default">
            {locale === 'en'
              ? ReactHtmlParser(data.descriptionEn ? data.descriptionEn : '')
              : ReactHtmlParser(data.descriptionIs ? data.descriptionIs : '')}
          </Text>
          {data.externalUrlIs && (
            <LinkV2
              underlineVisibility="always"
              color="blue400"
              as="h5"
              href={
                locale === 'en'
                  ? data.externalUrlEn
                    ? data.externalUrlEn
                    : data.externalUrlIs
                  : data.externalUrlIs
              }
            >
              <Box display="flex" flexDirection="row">
                {`${n('seeMoreWeb', 'Sjá meira á vef skóla')}`}
                <Box marginLeft={1}>
                  <Icon icon="open" type="outline" />
                </Box>
              </Box>
            </LinkV2>
          )}
        </Box>
        <Box marginTop={7}>
          <GridContainer>
            <GridRow rowGap={1}>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'school'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">
                    {n(data.degreeType, TranslationDefaults[data.degreeType])}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'calendar'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n('begins', 'Hefst')} ${n(
                    data.startingSemesterSeason,
                    TranslationDefaults[data.startingSemesterSeason],
                  )} ${data.startingSemesterYear}`}</Text>
                </Box>
              </GridColumn>

              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'time'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n(
                    'educationLength',
                    'Námstími',
                  )}: ${data.durationInYears} ${
                    locale === 'en'
                      ? data.durationInYears === 1
                        ? 'year'
                        : 'years'
                      : 'ár'
                  }`}</Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'wallet'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">
                    {`${n('yearlyCost', 'Árlegur kostnaður')}: ${
                      data.costPerYear &&
                      data.costPerYear.toLocaleString('de-DE')
                    } kr.`}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'calendar'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${n(
                    'applicationPeriod',
                    'Umsóknartímabil',
                  )}: ${format(
                    new Date(data.applicationStartDate),
                    'd. MMMM yyyy',
                    { locale: is },
                  )} - ${format(
                    new Date(data.applicationEndDate),
                    'd. MMMM yyyy',
                    { locale: is },
                  )}`}</Text>
                </Box>
              </GridColumn>

              <GridColumn span="1/2">
                <Box display="flex" flexDirection="row">
                  <Box marginRight={1}>
                    <Icon icon={'person'} type="outline" color="blue400" />
                  </Box>
                  <Text variant="medium">{`${data.modeOfDelivery.map(
                    (delivery, index) => {
                      if (index !== 0) {
                        return `, ${n(delivery, TranslationDefaults[delivery])}`
                      } else {
                        return n(delivery, TranslationDefaults[delivery])
                      }
                    },
                  )}`}</Text>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
        <Box>
          <Accordion
            singleExpand={false}
            dividerOnTop={false}
            dividerOnBottom={false}
          >
            <AccordionItem
              id="application-rules"
              label={n('admissionRequirements', 'Inntökuskilyrði')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[0]}
              onToggle={() => toggleIsOpen(0)}
            >
              <Text as="p">
                {locale === 'en'
                  ? ReactHtmlParser(
                      data.admissionRequirementsEn
                        ? data.admissionRequirementsEn
                        : '',
                    )
                  : ReactHtmlParser(
                      data.admissionRequirementsIs
                        ? data.admissionRequirementsIs
                        : '',
                    )}
              </Text>
            </AccordionItem>
            <AccordionItem
              id="education-requirements"
              label={n('educationRequirements', 'Námskröfur')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[1]}
              onToggle={() => toggleIsOpen(1)}
            >
              <Text as="p">
                {locale === 'en'
                  ? ReactHtmlParser(
                      data.studyRequirementsEn ? data.studyRequirementsEn : '',
                    )
                  : ReactHtmlParser(
                      data.studyRequirementsIs ? data.studyRequirementsIs : '',
                    )}
              </Text>
            </AccordionItem>
            <AccordionItem
              id="education-orginization"
              label={n('educationOrganization', 'Skipulag náms')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[2]}
              onToggle={() => toggleIsOpen(2)}
            >
              <Tabs
                tabs={createTabContent() || []}
                label="PRUFA"
                onlyRenderSelectedTab
                contentBackground="white"
              />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flexStart"
                alignItems="center"
                paddingTop={2}
              >
                <Box display="flex" paddingRight={1} alignItems="center">
                  <Box
                    marginRight={1}
                    className={[
                      styles.courseTypeIcon,
                      styles.capitalizeText,
                      'small',
                      'red',
                    ]}
                  >
                    <Text
                      fontWeight="semiBold"
                      color="red600"
                      variant="eyebrow"
                    >
                      S
                    </Text>
                  </Box>
                  <Box className={styles.capitalizeText}>
                    <Text variant="eyebrow">
                      {n(Requirement.MANDATORY, 'Skylda')}
                    </Text>
                  </Box>
                </Box>

                <Box display="flex" paddingRight={1} alignItems="center">
                  <Box
                    marginRight={1}
                    className={[styles.courseTypeIcon, styles.capitalizeText]}
                  >
                    <Text
                      fontWeight="semiBold"
                      color="purple600"
                      variant="eyebrow"
                    >
                      B
                    </Text>
                  </Box>
                  <Box className={styles.capitalizeText}>
                    <Text variant="eyebrow">
                      {n(Requirement.FREE_ELECTIVE, 'Bundið val')}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" paddingRight={1} alignItems="center">
                  <Box
                    marginRight={1}
                    className={[styles.courseTypeIcon, styles.capitalizeText]}
                  >
                    <Text
                      fontWeight="semiBold"
                      color="blue600"
                      variant="eyebrow"
                    >
                      V
                    </Text>
                  </Box>
                  <Box className={styles.capitalizeText}>
                    <Text variant="eyebrow">
                      {n(Requirement.RESTRICTED_ELECTIVE, 'Valfag')}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </AccordionItem>
            <AccordionItem
              id="annual-cost"
              label={n('yearlyCost', 'Árlegt gjald')}
              labelUse="p"
              labelVariant="h3"
              iconVariant="default"
              expanded={isOpen[3]}
              onToggle={() => toggleIsOpen(3)}
            >
              <Text as="p">
                {locale === 'en'
                  ? data.costInformationEn
                  : data.costInformationIs}
              </Text>
            </AccordionItem>
          </Accordion>
        </Box>
      </Stack>
    </SidebarLayout>
  )
}

UniversityDetails.getProps = async ({ query, apolloClient, locale }) => {
  if (!query?.id) {
    throw new CustomNextError(404, 'Education item was not found')
  }

  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'universityGateway',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  let showPagesFeatureFlag = false

  if (publicRuntimeConfig?.environment === 'prod') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesProdFeatureFlag)
  } else if (publicRuntimeConfig?.environment === 'staging') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesStagingFeatureFlag)
  } else {
    showPagesFeatureFlag = Boolean(namespace?.showPagesDevFeatureFlag)
  }

  if (!showPagesFeatureFlag) {
    throw new CustomNextError(404, 'Page not found')
  }

  const newResponse = await apolloClient.query<
    GetUniversityGatewayQuery,
    GetUniversityGatewayQueryVariables
  >({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const universities =
    await apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    })

  const data = newResponse.data.universityGatewayProgram

  return {
    data,
    namespace,
    locale,
    universities: universities.data.universityGatewayUniversities,
  }
}

export default withMainLayout(UniversityDetails, { showFooter: false })