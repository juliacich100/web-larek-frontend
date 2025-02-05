import { cloneTemplate, ensureElement } from "../../utils/utils"

export interface IContactsForm {
    render(): HTMLFormElement;
    resetForm(): void;
    setInputError(errorText: string): void;
    setSubmitState(isValid: boolean): void
}

export class ContactsForm implements IContactsForm {
    protected formElement: HTMLFormElement;
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected formErrors: HTMLSpanElement;
    protected submitButton: HTMLButtonElement;

    constructor(contactsTemplate: HTMLTemplateElement, private onInputChange: (email: string, phone: string) => void,
    private onSubmit: () => void) {
        this.formElement = cloneTemplate<HTMLFormElement>(contactsTemplate);

        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.formElement);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.formElement);
        this.formErrors = ensureElement<HTMLSpanElement>('.form__errors', this.formElement);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.formElement);

        this.emailInput.addEventListener('input', this.handleInputs.bind(this));
        this.phoneInput.addEventListener('input', this.handleInputs.bind(this));
        this.submitButton.addEventListener('click', this.handleSubmitButton.bind(this));
    }

    render(): HTMLFormElement {
        return this.formElement;
    }

    resetForm(): void {
        this.formElement.reset();
        this.setSubmitState(false);
    }

    protected handleInputs(event: Event): void {
        const email = this.emailInput.value;
        const phone = this.phoneInput.value;
        this.onInputChange(email, phone);
    }

    protected handleSubmitButton(event: MouseEvent): void {
        event.preventDefault();
        this.onSubmit();
    }

    setInputError(errorText: string | null): void {
        if(errorText) {
            this.formErrors.textContent = errorText;
        } else { this.formErrors.textContent = '' }
    }

    setSubmitState(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }
}