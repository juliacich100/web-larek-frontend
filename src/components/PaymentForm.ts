import { IPresenter } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface IPaymentForm {
    render(): HTMLFormElement;
	clearForm(): void;
    setPresenter(presenter: IPresenter): void;
}

export class PaymentForm implements IPaymentForm {
    protected formElement: HTMLFormElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected inputField: HTMLInputElement;
    protected formErrors: HTMLSpanElement;
    protected submitButton: HTMLButtonElement;
    protected presenter: IPresenter;

    constructor(paymentTemplate: HTMLTemplateElement) {
        this.formElement = cloneTemplate<HTMLFormElement>(paymentTemplate);

        this.cardButton = this.formElement.querySelector('[name="card"]');
        this.cashButton = this.formElement.querySelector('[name="cash"]');
        this.inputField = this.formElement.querySelector('[name="address"]');
        this.formErrors = this.formElement.querySelector('.form__errors');
        this.submitButton = this.formElement.querySelector('.order__button');

        this.formElement.addEventListener('click', this.handlePayment.bind(this));
        this.inputField.addEventListener('input', this.handleInput.bind(this));
        this.submitButton.addEventListener('click', this.handleNextButton.bind(this));     
    }

    setPresenter(presenter: IPresenter) {
        this.presenter = presenter;
    }

    render() {
        return this.formElement;
    }

    clearForm() {
        this.formElement.reset();
        const paymentButtons = [this.cardButton, this.cashButton];
        paymentButtons.forEach(button => button.classList.remove('button_alt-active'));
        this.hideInputError();
        this.setSubmitState(false);
    }

    protected handlePayment(evt: MouseEvent) {
        if(evt.target === this.cardButton) {
            this.togglePaymentMethod(this.cardButton, this.cashButton);
        } else if (evt.target === this.cashButton) {
            this.togglePaymentMethod(this.cashButton, this.cardButton);
        }
       this.handleInput();
    }

    protected togglePaymentMethod(targetButton: HTMLButtonElement, otherButton: HTMLButtonElement) {
        targetButton.classList.toggle('button_alt-active');
        otherButton.classList.remove('button_alt-active');
    }

    protected getPaymentMethod(): string | null {
        if (this.cardButton.classList.contains('button_alt-active')) {
            return this.cardButton.textContent;
        } else if (this.cashButton.classList.contains('button_alt-active')) {
            return this.cashButton.textContent;
        }
        return null;
    }

    protected isInputFilled(): boolean {
        return this.inputField.value.length > 0;
    }

    protected savePaymentAndAdress() {
        this.presenter.setPaymentMethod(this.getPaymentMethod());
        this.presenter.setAddressToForm(this.inputField.value);
    }

    protected isFormValid(): boolean {
       return this.isInputFilled() && this.getPaymentMethod() && !this.presenter.getAddressError();
    }

    protected handleInput() {
        this.savePaymentAndAdress();
        const formState = this.isFormValid();
        if(formState) {
            this.hideInputError();}
        else {
            this.showInputError();
            }
        this.setSubmitState(formState);
    }

    protected handleNextButton(event: MouseEvent) {
        event.preventDefault();   
        if (this.presenter) {
            this.presenter.openContactsForm();
        }
    }

    protected showInputError() {
        this.formErrors.textContent = this.presenter.getAddressError();
    }

    protected hideInputError() {
        this.formErrors.textContent = '';
    }

    protected setSubmitState(isValid: boolean) {
		if(isValid) {
             this.submitButton.disabled = isValid;
        }
		this.submitButton.disabled = !isValid;
	}
}