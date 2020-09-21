import React from 'react'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { FlightLeg } from '@island.is/air-discount-scheme-web/graphql/schema'

import { KeyValues } from '../'
import { TSummary } from '../../types'
import * as styles from './Summary.treat'

interface PropTypes {
  flightLegs: FlightLeg[]
  airline: ValueOf<typeof Airlines>
}

function Summary({ flightLegs, airline: filteredAirline }: PropTypes) {
  const sum = (arr: FlightLeg[], key: string): number =>
    arr.reduce((acc, item) => acc + item[key], 0)

  const airlines = Object.values(Airlines).filter(
    (airline) =>
      airline !== Airlines.norlandair &&
      (!filteredAirline ||
        airline ===
          (filteredAirline === Airlines.norlandair
            ? Airlines.icelandair
            : filteredAirline)),
  )

  const getFlightLegs = (airline) => {
    if (filteredAirline === Airlines.norlandair) {
      return flightLegs.filter(
        (flightLeg) =>
          flightLeg.airline === airline &&
          flightLeg.cooperation === filteredAirline,
      )
    }

    return flightLegs.filter(
      (flightLeg) =>
        flightLeg.airline === airline || flightLeg.cooperation === airline,
    )
  }

  const getAirline = (airline) => {
    if (airline === Airlines.icelandair) {
      return 'Icelandair + Norlandair'
    }
    return airline
  }

  return (
    <Box marginBottom={6}>
      <Stack space={3}>
        <Typography variant="h1" as="h1">
          Yfirlit
        </Typography>
        <Typography variant="intro">
          Samantektin byggist á núverandi síu
        </Typography>
        <Stack space={6}>
          {airlines.map((airline) => {
            const legs = getFlightLegs(airline)
            const awaitingCredit = legs.filter(
              (leg) => leg.financialState === States.awaitingCredit,
            )
            const awaitingDebit = legs.filter(
              (leg) => leg.financialState === States.awaitingDebit,
            )
            const cancelled = legs.filter(
              (leg) => leg.financialState === States.cancelled,
            )

            const data: TSummary = {
              awaitingCredit: {
                count: awaitingCredit.length,
                discountPrice: sum(awaitingCredit, 'discountPrice'),
                originalPrice: sum(awaitingCredit, 'originalPrice'),
              },
              awaitingDebit: {
                count: awaitingDebit.length,
                discountPrice: sum(awaitingDebit, 'discountPrice'),
                originalPrice: sum(awaitingDebit, 'originalPrice'),
              },
              cancelled: {
                count: cancelled.length,
                discountPrice: sum(cancelled, 'discountPrice'),
                originalPrice: sum(cancelled, 'originalPrice'),
              },
            }

            return (
              <Stack space={2} key={airline}>
                <Typography variant="h3">
                  <span className={styles.capitalize}>
                    {getAirline(airline)}
                  </span>
                </Typography>
                <Stack space={1}>
                  <Box background="blue100" borderRadius="standard" padding={2}>
                    <KeyValues
                      title="Í gjaldfærslubið"
                      data={data.awaitingDebit}
                    />
                  </Box>
                  <Box padding={2}>
                    <KeyValues
                      title="Í endurgreiðslubið"
                      data={data.awaitingCredit}
                    />
                  </Box>
                  <Box background="red100" borderRadius="standard" padding={2}>
                    <KeyValues title="Afturkallaðir" data={data.cancelled} />
                  </Box>
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Summary
