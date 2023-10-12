import React, { FC } from 'react'
import {
  Box,
  Column,
  Columns,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'

interface Props {
  text: string
}
const FinanceIntro: FC<React.PropsWithChildren<Props>> = ({ text }) => {
  return (
    <GridContainer>
      <Columns space={[2, 2, 3, 3]} collapseBelow="md">
        <Column width="9/12">
          <Text variant="default" paddingBottom={4}>
            {text}
          </Text>
        </Column>
      </Columns>
    </GridContainer>
  )
}

export default FinanceIntro