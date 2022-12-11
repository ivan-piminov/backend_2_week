import { validationResult } from 'express-validator';

export const customValidationResult = validationResult.withDefaults({
  formatter: (error) => ({
    message: error.msg,
    field: error.param,
  }),
});
