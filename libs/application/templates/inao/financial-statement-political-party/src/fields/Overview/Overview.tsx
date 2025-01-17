import { useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'

import {
  AlertBanner,
  Box,
  Checkbox,
  Divider,
  GridColumn,
  GridRow,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import BottomBar from '../../components/BottomBar'
import { FinancialStatementPoliticalParty } from '../../lib/dataSchema'
import { AboutOverview } from '../../components/AboutOverview'
import { GREATER } from '../../utils/constants'
import {
  sectionColumn,
  starterColumnStyle,
} from '../../components/css/overviewStyles.css'
import { CapitalNumberOverview } from '../../components/CapitalNumberOverview'
import { AssetDebtEquityOverview } from '../../components/AssetDebtEquityOverview'
import { FileValueLine } from '../../components/FileValueLine'

export const Overview = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    setError,
    setValue,
  } = useFormContext()

  const [approveOverview, setApproveOverview] = useState(false)

  const answers = application.answers as FinancialStatementPoliticalParty
  const fileName = answers.attachments?.file?.[0]?.name

  const [submitApplication, { error: submitError, loading }] =
    useSubmitApplication({
      application,
      refetch,
      event: DefaultEvents.SUBMIT,
    })

  const onBackButtonClick = () => {
    const incomeLimit = getValueViaPath<string>(answers, 'election.incomeLimit')

    if (incomeLimit === GREATER) {
      goToScreen?.('attachments.file')
    } else {
      goToScreen?.('election')
    }
  }

  const onSendButtonClick = () => {
    if (approveOverview) {
      submitApplication()
    } else {
      setError('applicationApprove', {
        type: 'error',
      })
    }
  }

  return (
    <Box marginBottom={2}>
      <Divider />
      <Box paddingY={3}>
        <AboutOverview answers={answers} />
      </Box>
      <Divider />
      <Box paddingY={3}>
        <Box className={starterColumnStyle}>
          <Text variant="h3" as="h3">
            {formatMessage(m.expensesIncome)}
          </Text>
        </Box>
        <GridRow direction="row">
          <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
            <Box paddingTop={3} paddingBottom={2}>
              <Text variant="h4" as="h4">
                {formatMessage(m.expenses)}
              </Text>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      <Divider />
      <Box paddingY={3}>
        <CapitalNumberOverview answers={answers} />
      </Box>
      <Divider />
      <Box paddingY={3}>
        <Box className={starterColumnStyle}>
          <Text variant="h3" as="h3">
            {formatMessage(m.propertiesAndDebts)}
          </Text>
        </Box>
        <AssetDebtEquityOverview answers={answers} />
      </Box>
      <Divider />

      <Box paddingY={3}>
        {fileName ? (
          <>
            <FileValueLine label={answers.attachments?.file?.[0]?.name} />
            <Divider />
          </>
        ) : null}
      </Box>

      <Box paddingY={3}>
        <Text variant="h3" as="h3">
          {formatMessage(m.overview)}
        </Text>
      </Box>
      <Box background="blue100">
        <Controller
          name="applicationApprove"
          defaultValue={approveOverview}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setApproveOverview(e.target.checked)
                  setValue('applicationApprove' as string, e.target.checked)
                }}
                checked={value}
                name="applicationApprove"
                id="applicationApprove"
                label={formatMessage(m.overviewCorrect)}
                large
              />
            )
          }}
        />
      </Box>
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      {submitError ? (
        <Box paddingY={3}>
          <AlertBanner
            title={formatMessage(m.submitErrorTitle)}
            description={formatMessage(m.submitErrorMessage)}
            variant="error"
            dismissable
          />
        </Box>
      ) : null}
      <BottomBar
        loading={loading}
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
      />
    </Box>
  )
}
