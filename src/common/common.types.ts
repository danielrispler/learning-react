export const USER_TYPES = {
	none: 0,
	client: 1,
	admin: 2
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

type UserId = string;

export interface User {
	username: string;
	type: UserType;
}

export interface Item {
	_id: number;
	name: string; 
	price: number;
	imageName: number; 
	stockAmount: number; 
};

export interface Cart {
	_id: number;
	userId: UserId;
	itemsAmount: number;
	itemId: number;
}

export interface RecieptItem {
	userId: UserId;
	recieptId: number;
	itemId: number;
	inCart: number;
}

export interface RecieptSession {
	userId: UserId;
	recieptId: number;
	totalPrice: number;
	date: Date;
}