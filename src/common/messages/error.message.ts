export const ErrorMessage = {
  USER: {
    USER_EMAIL_ALREADY_EXIST: 'User with this email already exists',
    USER_USERNAME_ALREADY_EXIST: 'User with this username already exists',
    USER_NOT_FOUND: 'User not found',
    USER_INVALID_PASSWORD: 'Invalid password',
  },
  AUTH: {
    INVALID_TOKEN: 'Invalid token',
  },
  PRISMA: {
    UNIQUE_CONSTRAINT_VIOLATION: 'The value already exists',
    FOREIGN_KEY_CONSTRAINT_VIOLATION: 'A foreign key constraint violation occurred',
    UNEXPECTED_ERROR: 'An unexpected error occurred - todo: add more details',
  },
};
