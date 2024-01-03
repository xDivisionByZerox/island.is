import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, InputFileUpload, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseFileCategory,
  isDefenceUser,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFiles.strings'

const AppealFiles = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)

  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )
  const { sendNotification } = useCase()

  const appealCaseFilesType = isDefenceUser(user)
    ? CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE
    : CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE

  const caseFilesTypesToDisplay = isDefenceUser(user)
    ? [
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      ]
    : [
        CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
      ]

  const previousUrl = `${
    isDefenceUser(user)
      ? constants.DEFENDER_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(previousUrl)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box marginBottom={7}>
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          )}
          {(workingCase.prosecutorPostponedAppealDate ||
            workingCase.accusedPostponedAppealDate) && (
            <Text variant="h5" as="h5">
              {workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.APPEAL ||
              workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                ? formatMessage(strings.appealActorInCourt, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                  })
                : formatMessage(strings.appealActorAndDate, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                    date: formatDate(workingCase.appealedDate, 'PPPp'),
                  })}
            </Text>
          )}
        </Box>

        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.appealCaseFilesTitle)}
            marginBottom={1}
          />
          <Text marginBottom={3}>
            {formatMessage(strings.appealCaseFilesSubtitle)}
          </Text>
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) =>
                file.category &&
                caseFilesTypesToDisplay.includes(file.category),
            )}
            accept={'application/pdf'}
            header={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, appealCaseFilesType),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={async () => {
            sendNotification(
              workingCase.id,
              NotificationType.APPEAL_CASE_FILES_UPDATED,
            )

            setVisibleModal(true)
          }}
          nextButtonText={formatMessage(strings.nextButtonText)}
          nextButtonIcon={undefined}
        />
      </FormContentContainer>
      {visibleModal === true && (
        <Modal
          title={formatMessage(strings.appealCaseFilesUpdatedModalTitle)}
          text={formatMessage(strings.appealCaseFilesUpdatedModalText, {
            isDefenceUser: isDefenceUser(user),
          })}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => {
            router.push(previousUrl)
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealFiles