import { IProduct, IProductsModel, IServerOrder, IOrderModel } from '../../types';

export class ProductsModel implements IProductsModel {
    private _items: IProduct[] = [];

    set items(data: IProduct[]) {
        this._items = data;
    }

    get items() {
        return this._items;
    }

    getProduct(id: string): IProduct | null {
        const item = this._items.find((item) => item.id === id);
        return item || null;
    }

    countTotal(orderItems: IProduct[]): number {
        const total = orderItems.reduce(
			(total, item) => total + Number(item.price),
			0
		);
        return total;
    }

    findPricelessProduct(orderItems: string[]): string | null { 
        const item = orderItems.find((id) => {
            const product = this.getProduct(id);
            return product?.price === null;
        });
        return item || null;
    }
}

export class OrderModel implements IOrderModel {
    order: IServerOrder;

    constructor(order: IServerOrder) {
        this.order = order;
    }

    getOrder(): IServerOrder {
        return this.order;
    }

    getOrderItems(): string[] {
        return this.order.items;
    }
    
    addItem(id: string) {
		this.order.items?.push(id);
	}

	getItem(id: string) {
		const item = this.order.items.find((itemId) => itemId === id);
		return item || null;
	}

	deleteItem(id: string) {
		const idToDelete = id;
		this.order.items = this.order.items?.filter((id) => id != idToDelete);
	}

    setPayment(value: string) {
		switch (value) {
			case 'Онлайн':
				this.order.payment = 'online';
				break;
			case 'При получении':
				this.order.payment = 'offline';
		}
	}

	setAddress(value: string) {
		this.order.address = value;
	}

	setEmail(value: string) {
		this.order.email = value;
	}

	setPhone(value: string) {
		this.order.phone = value;
	}

	setTotal(total: number) {
		this.order.total = total;
	}

    validateContacts(): string | null {
        if (!this.order.email) {
            return 'Необходимо указать email';
        }
        if (!this.order.phone) {
            return 'Необходимо указать телефон';
        }
        return null;
    }

    validateAddress(): string | null {
        if (!this.order.address) {
            return 'Необходимо указать адрес';
        }
        return null;
    }

    clearOrderFields() {
        this.order.address = '';
		this.order.email = '';
		this.order.phone = '';
        this.order.items.forEach(item => {this.deleteItem(item)});
    }
}

export class ServerOrder implements IServerOrder {
    payment: "online" | "offline";
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[] | null;

    constructor(payment: "online" | "offline" = "online", email: string = "", phone: string = "", address: string = "", total: number = 0, items: string[] | null = null) {
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.total = total;
        this.items = items || [];
    }
}
