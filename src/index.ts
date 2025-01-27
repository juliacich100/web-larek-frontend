import './scss/styles.scss';
import { Model, ServerOrder } from './components/base/model';
import { Presenter } from "./components/Presenter";
import { Card } from "./components/Card";
import { Preview } from './components/Preview';
import { Page } from "./components/Page";
import { Popup } from './components/Popup';
import { ContactsForm } from './components/ContactsForm';
import {SuccessForm} from './components/SuccessForm';
import { ServerApi } from './components/ServerApi';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { PaymentForm } from './components/PaymentForm';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { TPresenterParams } from './types';
import {ensureElement} from "./utils/utils"

const fullCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const page = ensureElement<HTMLElement>(".page");
const modal = ensureElement<HTMLElement>('.modal');

const presenterParams: TPresenterParams = {
    server: new ServerApi(new Api(API_URL)),
    model: new Model(new ServerOrder()),
    viewPageContainer: new Page(page),
    viewItemConstructor: Card,
    preview: new Preview(fullCardTemplate),
    popup: new Popup(modal),
    basket: new Basket(basketTemplate, orderTemplate, BasketItem),
    paymentForm: new PaymentForm(paymentTemplate),
    contactsForm: new ContactsForm(contactsTemplate),
    successPopup: new SuccessForm(successTemplate),
    imageUrl: CDN_URL
}

const presenter = new Presenter(presenterParams);
presenter.renderView();



