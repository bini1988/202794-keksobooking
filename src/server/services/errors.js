
class ApplicationError extends Error {
  constructor() {
    super();
    this._errors = [];
    this.message = `Application Error`;
  }

  get errors() {
    return this._errors;
  }

  get hasErrors() {
    return this._errors.length > 0;
  }

  add(errorMessage) {
    const error = this.message;
    this._errors.push({error, errorMessage});
    return this;
  }
}

class ValidationError extends ApplicationError {
  constructor() {
    super();
    this.message = `Validation Error`;
  }

  add(fieldName, errorMessage) {
    const error = this.message;
    this._errors.push({error, fieldName, errorMessage});
    return this;
  }
}

class NotFoundError extends ApplicationError {
  constructor() {
    super();
    this.message = `Not Found`;
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError
};
