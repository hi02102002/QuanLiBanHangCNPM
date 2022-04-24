/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Button,
  InputNumber,
  message,
  Modal,
  Result,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { GrFormClose } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { QuanLiBanHangApi } from 'renderer/apis/QuanLiBanHangApi';
import Search from 'renderer/components/Search';
import { logout } from 'renderer/features/auth';
import { authSelector } from 'renderer/features/auth/selector';
// import Search from 'renderer/components/Search';
import {
  addCart,
  cartSelector,
  removeAllCart,
  removeCartItem,
} from 'renderer/features/Cart';
import {
  categorySelector,
  editProduct,
  getAllCategory,
  getAllProducts,
  productsSelector,
} from 'renderer/features/goods';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { IBill, IProducts } from 'renderer/shared/types';
import Action from './components/Action';

const Payment = () => {
  const { categorys, loading: loadingCate } = useAppSelector(categorySelector);
  const { products, loading: LoadingPro } = useAppSelector(productsSelector);
  const [dataSearch, setDataSearch] = useState<IProducts[]>([]);
  const { carts } = useAppSelector(cartSelector);
  const dispatch = useAppDispatch();
  const [moneyUser, setMoneyUser] = useState<number>(0);
  const [inputMoney, setInputMoney] = useState<number>(0);
  const { user } = useAppSelector(authSelector);
  const [modal, setModal] = useState<boolean>(false);
  const [inforPrint, setInforPrint] = useState<IBill | null>();
  const [isPayment, setIsPagement] = useState<boolean>(false);
  const navigate = useNavigate();

  const totalPrice = carts.reduce(
    (prev, current) => prev + current.amount * current.price,
    0
  );

  console.log(inforPrint);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Tên',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Loại sản phẩm',
        dataIndex: 'categoryid',
        key: 'categoryid',
        render: (_, record: IProducts) => {
          const categoryExist = categorys.find(
            (category) => category.id === record.categoryId
          );

          return categoryExist?.name as string;
        },
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '100px',
      },
      {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        render: (_, record: IProducts) => {
          const handleAdd = (quantity: number) => {
            if (record.quantity === 0) {
              message.error('Hết sản phẩm');
              return;
            }
            dispatch(
              addCart({
                productName: record.productName,
                price: record.price,
                id: record.id,
                amount: quantity,
                categoryId: record.categoryId,
              })
            );
            dispatch(
              editProduct({
                accessToken: user?.accessToken as string,
                d: {
                  categoryId: record.categoryId,
                  price: record.price,
                  productName: record.productName,
                  quantity: record.quantity - quantity,
                },
                id: record.id,
              })
            );
          };

          return <Action maxValue={+record.quantity} onAdd={handleAdd} />;
        },
      },
    ],
    [categorys, dispatch, user?.accessToken]
  );

  useEffect(() => {
    setDataSearch([...products]);
  }, [products]);

  useEffect(() => {
    document.title = 'Thanh toán';
  }, []);

  useEffect(() => {
    dispatch(
      getAllProducts({
        accessToken: user?.accessToken as string,
        limit: 100,
        offset: 0,
      })
    );
    dispatch(
      getAllCategory({
        offset: 0,
        limit: 100,
        accessToken: user?.accessToken as string,
      })
    );
  }, [dispatch, user?.accessToken]);

  return (
    <div className="p-4 min-h-screen flex w-full flex-col">
      <div className="  flex items-center justify-center font-bold text-4xl text-blue-500 py-3">
        Thanh toán
      </div>
      <div className="flex h-full w-full gap-x-4  ">
        <div className="w-full max-w-[270px] h-full flex flex-shrink-0 ">
          <div className="flex flex-col gap-y-5">
            <Typography.Title className="m-0 !mb-0 text-center" level={4}>
              Thông tin hóa đơn:
            </Typography.Title>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <Typography.Title className="m-0 !mb-0 w-28" level={5}>
                  Nhân viên:
                </Typography.Title>
                <span>{user?.fullName}</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Typography.Title className="m-0 !mb-0 w-28" level={5}>
                  Trạng thái:
                </Typography.Title>
                <span>{isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Typography.Title className="m-0 !mb-0 w-28" level={5}>
                  Tổng:
                </Typography.Title>
                <span>{totalPrice} VND</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Typography.Title className="m-0 !mb-0 w-28" level={5}>
                  Tiền khách đưa:
                </Typography.Title>
                <span>{moneyUser} VND</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Typography.Title className="m-0 !mb-0 w-28" level={5}>
                  Tiền thối:
                </Typography.Title>
                <span
                  className={`${
                    moneyUser - totalPrice < 0
                      ? 'text-red-500'
                      : moneyUser === 0
                      ? ''
                      : moneyUser - totalPrice > 0
                      ? 'text-green-500'
                      : ''
                  }`}
                >
                  {moneyUser - totalPrice} VND
                </span>
              </div>
            </div>
            <Typography.Title className="m-0 !mb-0 text-center" level={4}>
              Thao tác:
            </Typography.Title>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-end">
                <InputNumber
                  className="w-full"
                  placeholder="Số tiền"
                  min={0}
                  max={999999999}
                  step={1000}
                  value={inputMoney}
                  onChange={(value) => {
                    setInputMoney(value);
                  }}
                />
                <Button
                  onClick={() => {
                    setMoneyUser(inputMoney);
                    setInputMoney(0);
                  }}
                >
                  Nhập
                </Button>
              </div>
              <div className="flex items-center flex-wrap gap-4 justify-center">
                <Button
                  onClick={async () => {
                    const { data } = await QuanLiBanHangApi.createBill(
                      user?.accessToken as string,
                      {
                        balance: moneyUser - totalPrice,
                        totalMoney: totalPrice,
                        customerMoney: moneyUser,
                        products: carts,
                      }
                    );
                    setInforPrint(data.data as IBill);
                    setModal(true);
                    setIsPagement(true);
                  }}
                  disabled={moneyUser - totalPrice < 0 || carts.length === 0}
                >
                  Thanh toán
                </Button>
                <Button
                  onClick={() => {
                    setInputMoney(0);
                    setMoneyUser(0);
                    dispatch(removeAllCart());
                    setIsPagement(false);
                  }}
                >
                  Hóa đơn mới
                </Button>
                <Button
                  onClick={() => {
                    dispatch(logout());
                    navigate('/login', {
                      replace: true,
                    });
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-1 ">
          <div className="flex flex-col gap-y-5">
            <Typography.Title className="m-0 !mb-0 text-center" level={4}>
              Sản phẩm
            </Typography.Title>
            <Search
              placeholder="Tìm kiếm theo tên sản phẩm"
              onSearch={(value) => {
                setDataSearch(() => {
                  if (value.trim().length > 0) {
                    return [...products].filter((data) =>
                      data.productName
                        .toLowerCase()
                        .includes(value.trim().toLowerCase())
                    );
                  }
                  return products;
                });
              }}
              onReset={() => {
                setDataSearch([...products]);
              }}
            />
            <Table
              columns={columns}
              dataSource={dataSearch}
              pagination={false}
              scroll={{
                y: 500,
                scrollToFirstRowOnChange: true,
              }}
              loading={loadingCate && LoadingPro}
              className="w-full"
            />
          </div>
        </div>
        <div className="w-full max-w-[270px] h-full flex flex-shrink-0">
          <div className="flex flex-col gap-y-5">
            <Typography.Title className="m-0 !mb-0 text-center" level={4}>
              Danh sách sản phẩm đã chọn:
            </Typography.Title>
            <div>
              <ul className="flex flex-col gap-y-3">
                {carts.map((cart) => (
                  <li key={cart.id}>
                    <div
                      className="flex items-center justify-between
                    py-5 px-2 bg-slate-400 text-white rounded-lg relative"
                    >
                      <div>
                        <h4 className="font-medium text-white">
                          {cart.productName}
                        </h4>
                        <div>
                          {cart.amount} x {cart.price} VND
                        </div>
                      </div>
                      <div>{cart.amount * cart.price} VND</div>
                      <div
                        onClick={() => {
                          const productExsit = products.find(
                            (product) =>
                              carts.find((_cart) => cart.id === _cart.id)
                                ?.id === product.id
                          );
                          dispatch(removeCartItem({ id: cart.id }));
                          dispatch(
                            editProduct({
                              accessToken: user?.accessToken as string,
                              d: {
                                categoryId: cart.categoryId,
                                price: cart.price,
                                productName: cart.productName,
                                quantity:
                                  cart.amount +
                                  (productExsit?.quantity as number),
                              },
                              id: productExsit?.id as number,
                            })
                          );
                        }}
                        className="absolute top-1 right-1 cursor-pointer text-white"
                      >
                        <GrFormClose className="w-6 h-6   " />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={modal}
        okText="In Hóa đơn"
        onOk={() => {
          setModal(false);
          setInputMoney(0);
          setMoneyUser(0);
          dispatch(removeAllCart());
          setIsPagement(false);
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <Result status="success" title="Thanh toán thành công." />
      </Modal>
    </div>
  );
};

export default Payment;
