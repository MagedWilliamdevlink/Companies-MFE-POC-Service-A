# Implementation Plan: Service State Machine Component

## Overview

This implementation plan breaks down the ServiceWithStateMachine component into discrete coding tasks that build incrementally. Each task focuses on a specific aspect of the component while ensuring integration with the overall architecture. The plan emphasizes early validation through testing and maintains compatibility with the Single-SPA microfrontend architecture.

## Current State Analysis

- XState is NOT installed and needs to be added
- ServiceWithStateMachine.jsx exists but is empty
- requestStorage.ts utility already exists with good functionality (generateRequestId already implemented)
- shared-ui.ts has parcel loaders ready for use
- nuqs is already installed
- Instructions document provides basic XState machine structure

## Tasks

- [ ] 1. Install XState V5 dependency
  - Add XState V5 to package.json dependencies
  - _Requirements: 1.1_

- [x] 2. Request ID generation utility (Already implemented)
  - generateRequestId() function exists in requestStorage.ts with correct format REQ-{timestamp}-{random}
  - _Requirements: 2.1_

- [ ] 3. Create XState machine configuration
  - [ ] 3.1 Create state machine definition file in src/stateMachine/
    - Define states: Step1_1, Step1_2, Step2_1, Step2_2, External:Payment, Step3_1, Step3_2
    - Implement events: Pay, Next, Submit, Previous, Payment_Failed, Payment_Succeeded
    - Use the structure from Docs/instructions.md as starting point
    - _Requirements: 1.1, 1.2_

  - [ ] 3.2 Implement guard functions for state transition validation
    - Create formValid, reviewApproved, billValid, and addressValid guards
    - Replace placeholder guards from instructions with actual business logic
    - _Requirements: 1.3, 1.4, 1.5, 6.1_

  - [ ]* 3.3 Write property test for state transition validation
    - **Property 1: State Transition Validation**
    - **Validates: Requirements 1.3, 1.4, 6.1**

- [ ] 4. Enhance data persistence integration
  - [ ] 4.1 Extend requestStorage.ts for state machine integration
    - Add functions to save/load current state machine step
    - Integrate with existing RequestData interface
    - Handle state machine context persistence
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ]* 4.2 Write property test for data persistence consistency
    - **Property 3: Data Persistence Consistency**
    - **Validates: Requirements 2.2, 2.4**

- [ ] 5. Implement URL state management with nuqs
  - [ ] 5.1 Set up nuqs integration for query parameter binding
    - Bind current step to URL query parameters
    - Implement URL state synchronization with state machine
    - _Requirements: 3.1, 3.2_

  - [ ] 5.2 Implement security prioritization logic
    - Prioritize localStorage state over URL parameters
    - Handle unauthorized access attempts through URL manipulation
    - _Requirements: 3.3, 3.4_

- [ ] 6. Create main ServiceWithStateMachine component structure
  - [ ] 6.1 Create basic component with XState integration
    - Initialize component in ServiceWithStateMachine.jsx
    - Set up XState machine actor and state management
    - Implement component lifecycle and state synchronization
    - _Requirements: 1.1, 1.2_

  - [ ] 6.2 Integrate data persistence and URL management
    - Connect requestStorage functions with state machine
    - Implement nuqs URL synchronization
    - Handle component initialization from stored data
    - _Requirements: 2.2, 2.3, 3.1, 3.2_

- [ ] 7. Implement Single-SPA parcel integration
  - [ ] 7.1 Integrate ServicePageLayoutParcel for consistent layout
    - Import and configure ServicePageLayoutParcel from shared-ui.ts
    - Pass appropriate props for title, current step, and total steps
    - _Requirements: 4.1_

  - [ ] 7.2 Integrate VerticalStepperParcel for progress display
    - Configure stepper with step definitions and current progress
    - Handle step completion states and visual indicators
    - _Requirements: 4.2_

  - [ ] 7.3 Integrate NavigationButtonsParcel for step controls
    - Configure navigation buttons with appropriate handlers
    - Handle button state (enabled/disabled) based on current step
    - _Requirements: 4.3_

  - [ ]* 7.4 Write property test for parcel props validation
    - **Property 6: Parcel Props Validation**
    - **Validates: Requirements 4.4, 4.5**

- [ ] 8. Implement step-specific form handling
  - [ ] 8.1 Implement Step1_1 basic form with validation
    - Create form for basic info collection (name, email, phone, service type)
    - Implement form validation before allowing submission
    - _Requirements: 5.1_

  - [ ] 8.2 Implement Step1_2 review waiting state
    - Display submitted data in review format
    - Show waiting state UI while review is pending
    - _Requirements: 5.2_

  - [ ] 8.3 Implement Step2_1 bill summary display
    - Calculate and display bill totals (subtotal, tax, total)
    - Show itemized bill breakdown
    - _Requirements: 5.3_

  - [ ] 8.4 Implement Step2_2 payment success confirmation
    - Display payment success message and transaction details
    - Provide confirmation of payment completion
    - _Requirements: 5.4_

  - [ ] 8.5 Implement External:Payment processing integration
    - Handle external payment service integration
    - Manage payment success and failure scenarios
    - _Requirements: 5.5, 6.3_

  - [ ] 8.6 Implement Step3_1 shipping address form
    - Create address form with validation (street, city, state, zip, country)
    - Implement address format validation
    - _Requirements: 5.6_

  - [ ] 8.7 Implement Step3_2 service completion display
    - Show final completion status and summary
    - Display next steps or completion confirmation
    - _Requirements: 5.7_

- [ ] 9. Implement comprehensive error handling
  - [ ] 9.1 Add error boundaries for component crash prevention
    - Implement React error boundaries to catch and handle component errors
    - Display fallback UI when errors occur
    - _Requirements: 8.5_

  - [ ] 9.2 Implement error handling for all failure scenarios
    - Handle localStorage failures, parcel loading failures, and network errors
    - Provide retry mechanisms and user feedback for recoverable errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Final integration and testing
  - [ ] 10.1 Wire together all components and utilities
    - Connect state machine, data persistence, URL management, and UI parcels
    - Ensure proper data flow and event handling between all layers
    - _Requirements: All requirements_

  - [ ] 10.2 Final system validation
    - Test complete workflow from Step1_1 through Step3_2
    - Verify all requirements are met
    - Ensure all tests pass

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Request ID generation is already implemented in requestStorage.ts
- The existing requestStorage.ts provides a solid foundation for data persistence
- Instructions document provides XState machine structure to build upon