import { httpRequest, httpResponse, Controller, EmailValidator } from "../protocols"
import { InvalidParamError, MissingParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;
    
    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }
    
    handle(httpRequest: httpRequest): httpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            
            for(const field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }
            
            const isValid = this.emailValidator.isValid(httpRequest.body.email);
            if(!isValid) {
                return badRequest(new InvalidParamError('email'));
            }
        } catch (error) {
            return serverError();
        }
    }
}