import { cloneTemplate, ensureElement } from "../../utils/utils"

export interface IPaymentForm {
    render(): HTMLFormElement;
	resetForm(): void;
    setInputError(errorText: string | null): void;
    setSubmitState(isValid: boolean): void;
}

export class PaymentForm implements IPaymentForm {
    protected formElement: HTMLFormElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected inputField: HTMLInputElement;
    protected formErrors: HTMLSpanElement;
    protected submitButton: HTMLButtonElement;

    constructor(paymentTemplate: HTMLTemplateElement, private onInputChange: (payment: string, address: string) => void, 
    private onSubmit: () => void) {
        this.formElement = cloneTemplate<HTMLFormElement>(paymentTemplate);

        this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.formElement);
        this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.formElement);
        this.inputField = ensureElement<HTMLInputElement>('[name="address"]', this.formElement);
        this.formErrors = ensureElement<HTMLSpanElement>('.form__errors', this.formElement);
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.formElement);

        this.formElement.addEventListener('click', this.handlePayment.bind(this));
        this.inputField.addEventListener('input', this.handleInputs.bind(this));
        this.submitButton.addEventListener('click', this.handleNextButton.bind(this));     
    }

    render() {
        return this.formElement;
    }

    resetForm() {
        this.formElement.reset();
        [this.cardButton, this.cashButton].forEach(button => button.classList.remove('button_alt-active'));
        this.setSubmitState(false);
    }

    protected handlePayment(evt: MouseEvent) {
        if(evt.target === this.cardButton) {
            this.togglePaymentMethod(this.cardButton, this.cashButton);
        } else if (evt.target === this.cashButton) {
            this.togglePaymentMethod(this.cashButton, this.cardButton);
        }
       this.handleInputs();
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

    protected handleInputs(): void {
        const payment = this.getPaymentMethod();
        const address = this.inputField.value;

        this.onInputChange(payment, address);
    }

    protected handleNextButton(event: MouseEvent) {
        event.preventDefault();   
        this.onSubmit();
    }

    setInputError(errorText: string | null): void {
        if(errorText) {
            this.formErrors.textContent = errorText;
        } else { this.formErrors.textContent = '' }
    }

    setSubmitState(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}
}