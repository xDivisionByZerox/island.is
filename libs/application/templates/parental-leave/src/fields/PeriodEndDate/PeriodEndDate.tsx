import React, { FC, useEffect } from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types'

import {
  NO_ANSWER,
  extractRepeaterIndexFromField,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
  MaybeWithApplicationAndField,
} from '@island.is/application/types'
import {
  DateFormField,
  CheckboxFormField,
} from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, StartDateOptions } from '../../constants'

type FieldPeriodEndDateProps = {
  field: {
    props: {
      minDate?: MaybeWithApplicationAndField<Date>
      excludeDates?: MaybeWithApplicationAndField<Date[]>
    }
  }
}

export const PeriodEndDate: FC<
  React.PropsWithChildren<
    FieldBaseProps & CustomField & FieldPeriodEndDateProps
  >
> = ({ field, application, errors }) => {
  const { formatMessage } = useLocale()
  const { title, props } = field
  const currentIndex = extractRepeaterIndexFromField(field)
  const fieldId = `periods[${currentIndex}].endDate`
  const lengthFieldId = `periods[${currentIndex}].endDateAdjustLength`
  const currentFirstPeriodStart = getValueViaPath(
    application.answers,
    `periods[${currentIndex}].firstPeriodStart`,
  ) as StartDateOptions
  const error = getErrorViaPath(errors as FieldErrors<FieldValues>, fieldId)

  useEffect(() => {
    if (currentIndex < 0) {
      console.error(
        new Error(
          'Cannot render PeriodEndDate component with a currentIndex of -1',
        ),
      )
    }
  }, [currentIndex])

  if (currentIndex < 0) {
    return null
  }

  return (
    <>
      <Box>
        <FieldDescription
          description={formatMessage(
            parentalLeaveFormMessages.endDate.description,
          )}
        />
      </Box>
      <DateFormField
        application={application}
        error={error}
        field={{
          type: FieldTypes.DATE,
          component: FieldComponents.DATE,
          title,
          id: fieldId,
          minDate: props.minDate,
          excludeDates: props.excludeDates,
          children: undefined,
          placeholder: parentalLeaveFormMessages.endDate.placeholder,
          backgroundColor: 'blue',
          defaultValue: NO_ANSWER,
        }}
      />
      {currentFirstPeriodStart === StartDateOptions.ACTUAL_DATE_OF_BIRTH && (
        <CheckboxFormField
          application={application}
          field={{
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            title: '',
            id: lengthFieldId,
            children: undefined,
            backgroundColor: 'blue',
            width: 'full',
            large: true,
            defaultValue: [YES],
            options: [
              {
                value: YES,
                label: parentalLeaveFormMessages.endDate.adjustPeriodLength,
              },
            ],
          }}
        />
      )}
    </>
  )
}
