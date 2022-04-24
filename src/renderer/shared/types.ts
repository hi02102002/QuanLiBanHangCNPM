export interface IUser {
  id: string | number;
  userName: string;
  password: string;
  fullName: string;
  sdt: number | string;
  birthday: string;
  address: string;
  roles: {
    id: string | number;
    name: Role;
  }[];
  createdDate: string;
}

export interface ICategory {
  id: string | number;
  name: string;
  code: string;
  createdDate: string;
}

export interface IProducts {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export interface IUserLogin {
  id: number | string;
  userName: string;
  accessToken: string;
  tokenType: string;
}

export interface IResList {
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface IResUser extends IResList {
  content: IUser[];
}

export interface IResProducts extends IResList {
  content: IProducts[];
}

export interface IResCategory {
  status: string;
  message: string;
  data: ICategory;
}

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  STAFF = 'ROLE_USER',
}

export interface IResAction {
  message: string;
  status: string;
}

export interface IResActionUser extends IResAction {
  data: IUser;
}

export interface IResActionProduct extends IResAction {
  data: IProducts;
}

export interface ICart {
  id: number;
  productName: string;
  categoryId: number;
  price: number;
  amount: number;
}

export interface IBill {
  customerMoney: number;
  totalMoney: number;
  balance: number;
  id?: number;
  createdDate?: string;
  createdBy?: string;
  products: ICart[];
}
