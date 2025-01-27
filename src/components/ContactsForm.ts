import { IPresenter } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface IContactsForm {
    render(): HTMLFormElement;
    clearForm(): void;
    setPresenter(presenter: IPresenter): void;
}

export class ContactsForm {
    protected formElement: HTMLFormElement;
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected formErrors: HTMLSpanElement;
    protected submitButton: HTMLButtonElement;
    protected presenter: IPresenter;

    constructor(contactsTemplate: HTMLTemplateElement) {
        this.formElement = cloneTemplate<HTMLFormElement>(contactsTemplate);

        this.emailInput = this.formElement.querySelector('[name="email"]');
        this.phoneInput = this.formElement.querySelector('[name="phone"]');
        this.formErrors = this.formElement.querySelector('.form__errors');
        this.submitButton = this.formElement.querySelector('.button');

        this.emailInput.addEventListener('input', this.handleInputs.bind(this));
        this.phoneInput.addEventListener('input', this.handleInputs.bind(this));
        this.submitButton.addEventListener('click', this.handleSubmitButton.bind(this));
    }

    setPresenter(presenter: IPresenter): void {
        this.presenter = presenter;
    }

    render(): HTMLFormElement {
        return this.formElement;
    }

    clearForm(): void {
        this.formElement.reset();
        this.submitButton.disabled = true;
    }

    protected isInputFilled(input: HTMLInputElement): boolean {
        return input.value.length > 0;
    }

    protected saveContacts(): void {
        this.presenter.setEmail(this.emailInput.value);
        this.presenter.setPhone(this.phoneInput.value);
    }

    protected isFormValid(): boolean {
        return this.isInputFilled(this.emailInput) && this.isInputFilled(this.phoneInput) && !this.presenter.getContactError();
    }

    protected handleInputs(): void {
        this.saveContacts();
        const formState = this.isFormValid();
        if(formState) {
            this.hideInputError();
        } else {
            this.showInputError();
        }
        this.setSubmitState(formState);
    }

    protected handleSubmitButton(event: MouseEvent): void {
        event.preventDefault();
        this.presenter.pay();
    }

    protected showInputError(): void {
        this.formErrors.textContent = this.presenter.getContactError();
    }

    protected hideInputError(): void {
        this.formErrors.textContent = '';
    }

    protected setSubmitState(isValid: boolean): void {
		if(isValid) {
             this.submitButton.disabled = isValid;
        }
		this.submitButton.disabled = !isValid;
	}
}