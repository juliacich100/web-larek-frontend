import { IProduct } from "../../types";
import { BaseItem, IBaseItem } from "./BaseItem";
import { ensureElement } from "../../utils/utils"


export interface ICardConstructor {
    new (template: HTMLTemplateElement, onClick: (item: IProduct) => void): ICard<IProduct>;
}

interface ICard<IProduct> extends IBaseItem<IProduct> {}

export class Card extends BaseItem<IProduct> implements ICard<IProduct> {
    protected goodsType: HTMLElement;
    protected goodsName: HTMLElement;
    protected goodsImg: HTMLImageElement;
    protected goodsPrice: HTMLElement;

    constructor(template:HTMLTemplateElement, private onClick: (item: IProduct) => void) {
        super(template);
        
        this.goodsType = ensureElement<HTMLElement>(".card__category", this.element);
        this.goodsName =  ensureElement<HTMLElement>(".card__title", this.element);
        this.goodsImg = ensureElement<HTMLImageElement>(".card__image", this.element);
        this.goodsPrice = ensureElement<HTMLElement>(".card__price", this.element);
    }

    render(item: IProduct) {
        this.goodsType.textContent = item.category;
        this.goodsName.textContent = item.title;
        this.goodsImg.src = item.image;
        if(item.price === null) {
            this.goodsPrice.textContent = `Бесценно`;
        } else {
            this.goodsPrice.textContent = `${String(item.price)} синапсов`;
        }

        this.element.addEventListener('click', () => this.onClick(item));

        return this.element;
    }
}