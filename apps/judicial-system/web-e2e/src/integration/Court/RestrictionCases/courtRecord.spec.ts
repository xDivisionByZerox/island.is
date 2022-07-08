import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  CONFIRMATION_ROUTE,
  COURT_RECORD_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeRestrictionCase, makeProsecutor, intercept } from '../../../utils'

describe(`${COURT_RECORD_ROUTE}/:id`, () => {
  const caseData = makeRestrictionCase()
  const caseDataAddition: Case = {
    ...caseData,
    prosecutor: makeProsecutor(),
  }

  describe('Restriction cases', () => {
    describe('Cases with accepting decision', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        intercept({ ...caseDataAddition, decision: CaseDecision.ACCEPTING })
        cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
      })

      it('should autofill relevant fields', () => {
        cy.getByTestid('courtAttendees').contains(
          'Áki Ákærandi aðstoðarsaksóknari Donald Duck kærði',
        )
        cy.getByTestid('sessionBookings').should('not.match', ':empty')
        cy.getByTestid('endOfSessionBookings').should('not.match', ':empty')
      })
    })

    describe('Validation', () => {
      /**
       * The previous step has the conclusion, ruling and decision fields. Users
       * should not be able to continue of this step if any of them are empty.
       */
      const shouldNotAllowUsersToContinue = () =>
        it('should not allow users to continue', () => {
          cy.getByTestid('formFooter')
            .children()
            .getByTestid('infobox')
            .should('exist')
        })

      beforeEach(() => {
        cy.stubAPIResponses()
      })

      describe('Happy path', () => {
        beforeEach(() => {
          intercept({
            ...caseDataAddition,
            courtDate: '2021-12-16T10:50:04.033Z',
            decision: CaseDecision.ACCEPTING,
            ruling: 'lorem',
            conclusion: 'lorem',
          })
          cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        it('should validate the form', () => {
          cy.getByTestid('continueButton').should('be.disabled')
          cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
          cy.getByTestid('sessionBookings').type('lorem')
          cy.get('#prosecutor-appeal').check()
          cy.get('#accused-appeal').check()
          cy.getByTestid('courtEndTime').type('11:00')
          cy.getByTestid('continueButton').should('not.be.disabled')
          cy.getByTestid('continueButton').click()
          cy.url().should('include', `${CONFIRMATION_ROUTE}/test_id_stadfest`)
        })
      })

      describe('Conclusion is empty', () => {
        beforeEach(() => {
          intercept({
            ...caseDataAddition,
            decision: CaseDecision.ACCEPTING,
            ruling: 'lorem',
            conclusion: undefined,
          })
          cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        shouldNotAllowUsersToContinue()
      })

      describe('Ruling is empty', () => {
        beforeEach(() => {
          intercept({
            ...caseDataAddition,
            decision: CaseDecision.ACCEPTING,
            ruling: undefined,
            conclusion: 'lorem',
          })
          cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        shouldNotAllowUsersToContinue()
      })

      describe('Decision is empty', () => {
        beforeEach(() => {
          intercept({
            ...caseDataAddition,
            decision: undefined,
            ruling: 'lorem',
            conclusion: 'lorem',
          })
          cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        shouldNotAllowUsersToContinue()
      })
    })
  })

  describe('Travel ban cases', () => {
    describe('Cases with accepting decision', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        intercept({
          ...caseDataAddition,
          decision: CaseDecision.ACCEPTING,
          type: CaseType.TRAVEL_BAN,
          requestedOtherRestrictions: 'other restrictions',
        })
        cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)
      })

      it('should autofill relevant fields', () => {
        cy.getByTestid('sessionBookings').should('not.match', ':empty')
        cy.getByTestid('endOfSessionBookings').contains('other restrictions')
      })
    })
  })
})
