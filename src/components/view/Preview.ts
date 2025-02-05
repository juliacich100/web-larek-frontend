import { IProduct } from "../../types";
import { BaseItem, IBaseItem } from "./BaseItem";
import { ensureElement } from "../../utils/utils"

export interface IPreview<IProduct> extends IBaseItem<IProduct> {
    disableOrderbutton(): void;
    enableOrderButton(): void;
}

export class Preview extends BaseItem<IProduct> implements IPreview<IProduct> {
    protected id: string;
    protected image: HTMLImageElement;
    protected category: HTMLSpanElement;
    protected title: HTMLElement;
    protected text: HTMLParagraphElement;
    protected orderButton: HTMLButtonElement;
    protected price: HTMLSpanElement;

    constructor(previewTemplate: HTMLTemplateElement, onClick: (itemId: string) => void) {
        super(previewTemplate);

        this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
        this.category = ensureElement<HTMLSpanElement>('.card__category', this.element);
        this.title = ensureElement<HTMLElement>('.card__title', this.element);
        this.text = ensureElement<HTMLParagraphElement>('.card__text', this.element);
        this.orderButton = ensureElement<HTMLButtonElement>('.card__button', this.element);
        this.price = ensureElement<HTMLSpanElement>('.card__price', this.element);

        this.orderButton.addEventListener('click', () => onClick(this.id));
    }

    render(item: IProduct) {
        this.id = item.id;
        this.category.textContent = item.category;
        this.title.textContent = item.title;
        this.image.src = item.image;
        this.text.textContent = item.description;
        this.price.textContent = item.price ? `${item.price} синапсов` : 'Бесценно';
        return this.element;
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