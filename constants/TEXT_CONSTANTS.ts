export const TEXT = {
  app: {
    name: "ticktock",
    metaTitle: "ticktock — Timesheets",
    metaDescription:
      "ticktock — effortlessly track and monitor employee work hours from anywhere.",
  },

  units: {
    hours: "hrs",
  },

  common: {
    cancel: "Cancel",
    loadingAria: "Loading",
    closeAria: "Close",
  },

  /** Action-column labels in the timesheets table, keyed by status. */
  actions: {
    view: "View",
    update: "Update",
    create: "Create",
  },

  /** Status badge labels, keyed by status. */
  status: {
    completed: "COMPLETED",
    incomplete: "INCOMPLETE",
    missing: "MISSING",
  },

  nav: {
    timesheets: "Timesheets",
    accountFallback: "Account",
    signOut: "Sign out",
  },

  footer: {
    copyright: "© 2024 tentwenty. All rights reserved.",
  },

  login: {
    heading: "Welcome back",
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••••",
    rememberMe: "Remember me",
    submit: "Sign in",
    demoLabel: "Demo login —",
    demoEmail: "john@ticktock.dev",
    demoPassword: "password123",
    genericError: "Something went wrong. Please try again.",
    brandDescription:
      "Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.",
  },

  timesheets: {
    heading: "Your Timesheets",
    perPageSuffix: "per page",
    rowsPerPageAria: "Rows per page",
    loadError: "Failed to load timesheets.",
  },

  filters: {
    dateRangeAria: "Date range",
    statusAria: "Status",
    dateRangePlaceholder: "Date Range",
    statusPlaceholder: "Status",
    statusCompleted: "Completed",
    statusIncomplete: "Incomplete",
    statusMissing: "Missing",
  },

  table: {
    colWeek: "Week #",
    colDate: "Date",
    colStatus: "Status",
    colActions: "Actions",
    empty: "No timesheets match the selected filters.",
  },

  pagination: {
    previous: "Previous",
    next: "Next",
    aria: "Pagination",
    ellipsis: "…",
  },

  week: {
    heading: "This week's timesheet",
    loadError: "Failed to load this timesheet.",
    deleteConfirm: "Delete this entry? This cannot be undone.",
  },

  task: {
    addNewTask: "Add new task",
    edit: "Edit",
    delete: "Delete",
    actionsAria: "Task actions",
  },

  stepper: {
    decreaseAria: "Decrease hours",
    increaseAria: "Increase hours",
    valueAria: "Hours",
  },

  modal: {
    addTitle: "Add New Entry",
    editTitle: "Edit Entry",
    selectProject: "Select Project",
    projectPlaceholder: "Project Name",
    typeOfWork: "Type of Work",
    workTypePlaceholder: "Select work type",
    taskDescription: "Task description",
    descriptionPlaceholder: "Write text here ...",
    descriptionHint: "A note for extra info",
    hours: "Hours",
    addEntry: "Add entry",
    saveChanges: "Save changes",
    errProject: "Please select a project.",
    errWorkType: "Please select a type of work.",
    errDescription: "Please add a task description.",
    saveError: "Could not save entry.",
  },

  /** Server-side API messages (used by route handlers + the client fetcher). */
  api: {
    unauthorized: "Unauthorized.",
    invalidBody: "Invalid request body.",
    emailPasswordRequired: "Email and password are required.",
    invalidCredentials: "Invalid email or password.",
    timesheetNotFound: "Timesheet not found.",
    entryNotFound: "Entry not found.",
    couldNotAddEntry: "Could not add entry.",
    couldNotUpdateEntry: "Could not update entry.",
    bodyMustBeObject: "Request body must be an object.",
    dateRequired: "A valid date (YYYY-MM-DD) is required.",
    projectRequired: "A project is required.",
    workTypeRequired: "A type of work is required.",
    descriptionRequired: "A task description is required.",
    hoursRange: "Hours must be between 1 and 24.",
    requestFailed: (status: number) => `Request failed (${status})`,
  },
} as const;
