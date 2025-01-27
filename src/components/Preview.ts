import { IPresenter } from "../types";
import { IProduct } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface IPreview {
    render(): HTMLElement;
    setData(item: IProduct): void;
    disableOrderbutton(): void;
    enableOrderButton(): void;
    setPresenter(presenter: IPresenter): void;
}

export class Preview {
    protected id: string;
    protected cardPreview: HTMLDivElement;
    protected image: HTMLImageElement;
    protected category: HTMLSpanElement
    protected title: HTMLElement;
    protected text: HTMLParagraphElement;
    protected orderButton: HTMLButtonElement;
    protected price: HTMLSpanElement;
    protected presenter: IPresenter;

    constructor(previewTemplate: HTMLTemplateElement) {
        this.cardPreview = cloneTemplate<HTMLDivElement>(previewTemplate);

        this.image = this.cardPreview.querySelector('.card__image');
        this.category = this.cardPreview.querySelector('.card__category');
        this.title = this.cardPreview.querySelector('.card__title');
        this.text = this.cardPreview.querySelector('.card__text');
        this.orderButton = this.cardPreview.querySelector('.card__button');
        this.price = this.cardPreview.querySelector('.card__price');

        this.orderButton.addEventListener('click', this.handleOrderButtonClick.bind(this));
    }

    setPresenter(presenter: IPresenter) {
        this.presenter = presenter;
    }

    render() {
        return this.cardPreview;
    }

    setData(item: IProduct) {
        this.id = item.id;
        this.category.textContent = item.category;
        this.title.textContent = item.title;
        this.image.src = item.image;
        this.text.textContent = item.description;
        this.price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
    }

    protected handleOrderButtonClick() {
            if(this.presenter.getItemFromOrder(this.id)) {
                this.disableOrderbutton();
            } else {
                this.presenter.addItemToBasket(this.id);
                this.disableOrderbutton();
            }
    }

    disableOrderbutton() {
        this.orderButton.disabled = true;
        this.orderButton.textContent = "Товар в корзине";
    }

    enableOrderButton() {
        this.orderButton.disabled = false;
        this.orderButton.textContent = "В корзину";
    }
}