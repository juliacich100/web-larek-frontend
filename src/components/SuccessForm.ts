import { IPresenter } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface ISuccessForm {
    render(): HTMLDivElement;
    setTotal(total: number): void;
    setPresenter(presenter: IPresenter): void;
}

export class SuccessForm {
    protected successElement: HTMLDivElement;
    protected orderDescription: HTMLParagraphElement;
    protected closeButton: HTMLButtonElement;
    protected presenter: IPresenter;

    constructor(successFormTemplate: HTMLTemplateElement) {
        this.successElement = cloneTemplate<HTMLDivElement>(successFormTemplate);

        this.orderDescription = this.successElement.querySelector('.order-success__description');
        this.closeButton = this.successElement.querySelector('.order-success__close');

        this.closeButton.addEventListener('click', this.handleClick.bind(this));
    }

    setPresenter(presenter: IPresenter) {
        this.presenter = presenter;
    }

    render() {
        return this.successElement;
    }

    setTotal(total: number) {
        this.orderDescription.textContent = `Списано ${total} синапсов`;
    }

    protected handleClick() {
        this.presenter.closeSuccessPopup();
    }
}