export const ErrorMessage = {
  USER: {
    USER_EMAIL_ALREADY_EXIST: 'User with this email already exists',
    USER_USERNAME_ALREADY_EXIST: 'User with this username already exists',
    USER_NOT_FOUND: 'User not found',
    USER_INVALID_PASSWORD: 'Invalid password',
  },
  PROJECT: {
    PROJECT_USER_ALREADY_EXIST: 'Project with this user already exists',
    PROJECT_NOT_FOUND: 'Project not found',
    PROJECT_INVITATION_USER_INVITED_SAME: 'You cannot invite yourself to a project',
  },
  AUTH: {
    INVALID_TOKEN: 'Invalid token',
    NO_TOKEN: 'Unauthorized, no token provided',
  },
  PRISMA: {
    UNIQUE_CONSTRAINT_VIOLATION: 'The value already exists',
    FOREIGN_KEY_CONSTRAINT_VIOLATION: 'A foreign key constraint violation occurred',
    UNEXPECTED_ERROR: 'An unexpected error occurred - todo: add more details',
  },
};
