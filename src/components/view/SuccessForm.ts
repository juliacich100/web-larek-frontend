import { cloneTemplate, ensureElement } from "../../utils/utils"

export interface ISuccessForm {
    render(total: number): HTMLDivElement;
}

export class SuccessForm {
    protected successElement: HTMLDivElement;
    protected orderDescription: HTMLParagraphElement;
    protected closeButton: HTMLButtonElement;

    constructor(successFormTemplate: HTMLTemplateElement, onClick: () => void) {
        this.successElement = cloneTemplate<HTMLDivElement>(successFormTemplate);

        this.orderDescription = ensureElement<HTMLParagraphElement>('.order-success__description', this.successElement);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.successElement);

        this.closeButton.addEventListener('click', () => onClick());
    }

    render(total: number) {
        this.orderDescription.textContent = `Списано ${total} синапсов`;
        return this.successElement;
    }
}