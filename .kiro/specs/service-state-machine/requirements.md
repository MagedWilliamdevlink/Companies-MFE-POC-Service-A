# Requirements Document

## Introduction

This document specifies the requirements for implementing a React component `ServiceWithStateMachine.tsx` that uses XState to manage a multi-step service application process within a Single-SPA microfrontend architecture. The component will handle state management, data persistence, URL synchronization, and integration with existing UI parcels.

## Glossary

- **State_Machine**: XState-based finite state machine managing the service application workflow
- **Service_Component**: The main React component ServiceWithStateMachine.tsx
- **Request_Storage**: The existing requestStorage.ts utility for localStorage operations
- **Single_SPA_Parcel**: Reusable UI components from the shared-ui.ts module
- **Step_State**: One of the 6 defined states in the service workflow
- **Request_ID**: Unique identifier in format REQ-{timestamp}-{random}
- **Form_Data**: User input data collected across all steps
- **URL_State**: Query parameters managed by nuqs library

## Requirements

### Requirement 1: State Machine Configuration

**User Story:** As a developer, I want to implement XState integration, so that the service workflow follows a predictable state machine pattern.

#### Acceptance Criteria

1. THE State_Machine SHALL implement exactly 6 states: Step1_1, Step1_2, Step2_1, Step2_2, External:Payment, Step3_1, Step3_2
2. THE State_Machine SHALL handle events: Pay, Next, Submit, Previous, Payment_Failed, Payment_Succeeded
3. WHEN a state transition is triggered, THE State_Machine SHALL validate guards before allowing the transition
4. WHEN form validation fails, THE State_Machine SHALL prevent state transitions and maintain current state
5. THE State_Machine SHALL enforce business logic through guard functions

### Requirement 2: Data Persistence Management

**User Story:** As a user, I want my progress to be saved automatically, so that I can resume the service application if I navigate away or refresh the page.

#### Acceptance Criteria

1. WHEN the component mounts, THE Service_Component SHALL generate a unique Request_ID in format REQ-{timestamp}-{random}
2. WHEN a state transition occurs, THE Service_Component SHALL immediately persist the current step and form data to localStorage using Request_Storage
3. WHEN the component initializes, THE Service_Component SHALL load the previous state and form data from localStorage if available
4. WHEN form data is updated, THE Service_Component SHALL persist the changes to localStorage immediately
5. THE Request_Storage SHALL maintain data integrity across browser sessions

### Requirement 3: URL State Synchronization

**User Story:** As a user, I want the URL to reflect my current step, so that I can bookmark or share my progress while maintaining security.

#### Acceptance Criteria

1. THE Service_Component SHALL use nuqs library to bind the current step to query parameters
2. WHEN a legitimate state transition occurs, THE Service_Component SHALL update the URL query parameters
3. WHEN URL parameters conflict with localStorage state, THE Service_Component SHALL prioritize localStorage state for security
4. WHEN a user attempts to access an unauthorized step via URL manipulation, THE Service_Component SHALL redirect to the appropriate step based on localStorage state
5. THE URL_State SHALL remain synchronized with legitimate state machine transitions

### Requirement 4: Single-SPA Integration

**User Story:** As a developer, I want to integrate with existing Single-SPA parcels, so that the component maintains consistency with the overall application architecture.

#### Acceptance Criteria

1. THE Service_Component SHALL use ServicePageLayoutParcel from shared-ui.ts for consistent page layout
2. THE Service_Component SHALL integrate VerticalStepperParcel to display progress across all steps
3. THE Service_Component SHALL use NavigationButtonsParcel for step navigation controls
4. WHEN parcels are loaded, THE Service_Component SHALL handle loading states and errors gracefully
5. THE Service_Component SHALL pass appropriate props to each parcel according to their interfaces

### Requirement 5: Form Handling and Validation

**User Story:** As a user, I want to complete forms at each step with proper validation, so that I can provide accurate information and receive immediate feedback.

#### Acceptance Criteria

1. WHEN in Step1_1, THE Service_Component SHALL display a basic form with validation before allowing submission
2. WHEN in Step1_2, THE Service_Component SHALL display a review waiting state with submitted data
3. WHEN in Step2_1, THE Service_Component SHALL display a bill summary with calculated totals
4. WHEN in Step2_2, THE Service_Component SHALL display payment success confirmation
5. WHEN in External:Payment, THE Service_Component SHALL handle external payment processing integration
6. WHEN in Step3_1, THE Service_Component SHALL display a shipping address form with address validation
7. WHEN in Step3_2, THE Service_Component SHALL display service completion status
8. WHEN form validation fails, THE Service_Component SHALL display clear error messages and prevent progression

### Requirement 6: Business Logic Implementation

**User Story:** As a business stakeholder, I want the service workflow to enforce proper business rules, so that users complete the process correctly and all requirements are met.

#### Acceptance Criteria

1. WHEN form data is incomplete or invalid, THE State_Machine SHALL prevent transitions to subsequent steps
2. WHEN review approval is required, THE Service_Component SHALL enforce the approval workflow before proceeding
3. WHEN payment processing is initiated, THE Service_Component SHALL handle both success and failure scenarios
4. WHEN address validation is performed, THE Service_Component SHALL verify address completeness and format
5. THE Service_Component SHALL implement proper error handling and recovery mechanisms for all business logic failures

### Requirement 7: Type safety Integration note

**User Story:** As a developer, I want NO types, this is a POC therefore i do not want any type-safe anything, so i dont run out of qouta.

#### Acceptance Criteria

Simply No typesafe anything, no Typescript, or any similar tools

### Requirement 8: Error Handling and Recovery

**User Story:** As a user, I want the application to handle errors gracefully, so that I can recover from issues and complete the service application.

#### Acceptance Criteria

1. WHEN localStorage operations fail, THE Service_Component SHALL handle the error gracefully and provide fallback behavior
2. WHEN parcel loading fails, THE Service_Component SHALL display appropriate error messages and retry options
3. WHEN state machine transitions fail, THE Service_Component SHALL maintain current state and log the error
4. WHEN network requests fail, THE Service_Component SHALL provide retry mechanisms and user feedback
5. THE Service_Component SHALL implement comprehensive error boundaries to prevent application crashes