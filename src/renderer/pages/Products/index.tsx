/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import Layout from 'renderer/components/Layout';
import Search from 'renderer/components/Search';
import { authSelector } from 'renderer/features/auth/selector';
import {
  categorySelector,
  getAllCategory,
  getAllProducts,
  productsSelector,
  removeProduct,
} from 'renderer/features/goods';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { IProducts } from 'renderer/shared/types';
import ModalProducts from './components/ModalProducts';

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState<boolean>(false);
  const [dataProducts, setDataProducts] = useState<IProducts | null>(null);
  const { products, loading } = useAppSelector(productsSelector);
  const { categorys } = useAppSelector(categorySelector);
  const dispatch = useAppDispatch();
  const [dataSearch, setDataSearch] = useState<IProducts[]>([]);
  const { user } = useAppSelector(authSelector);
  const [loadingRemove, setLoadingRemove] = useState<boolean>(false);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
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
        dataIndex: 'categoryId',
        key: 'categoryId',
        render: (_, record: IProducts) => {
          console.log(record, categorys);
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
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => {
          return (
            <div>
              <Space size="middle">
                <Button
                  className="bg-blue-400 text-white"
                  onClick={() => {
                    setDataProducts(record);
                    setIsModalVisibleEdit(true);
                  }}
                >
                  <AiOutlineEdit className="w-4 h-4" />
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn xóa không?"
                  okButtonProps={{
                    loading: loadingRemove,
                  }}
                  onConfirm={async () => {
                    const action = await dispatch(
                      removeProduct({
                        id: record.id,
                        accessToken: user?.accessToken as string,
                      })
                    );
                    if (removeProduct.pending.match(action)) {
                      setLoadingRemove(true);
                    }

                    if (removeProduct.fulfilled.match(action)) {
                      message.success('Xóa thành công');
                      setLoadingRemove(false);
                    }
                    if (removeProduct.rejected.match(action)) {
                      message.error('Có lỗi khi xóa');
                      setLoadingRemove(false);
                    }
                  }}
                  okText="Đồng ý"
                  cancelText="Không"
                >
                  <Button danger>
                    <BsTrash className="w-4 h-4" />
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          );
        },
      },
    ],
    [categorys, dispatch, user?.accessToken, loadingRemove]
  );

  useEffect(() => {
    document.title = 'Quản lí sản phẩm';
  }, []);

  useEffect(() => {
    setDataSearch([...products]);
  }, [products]);

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
    <Layout>
      <div className="p-4 ">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-3">
              <Typography.Title className="!m-0" level={3}>
                Quản lí sản phẩm
              </Typography.Title>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Quản lí sản phẩm</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <Button onClick={() => setIsModalVisible(true)}>
                Thêm sản phẩm
              </Button>
            </div>
          </div>
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
          <Table columns={columns} dataSource={dataSearch} loading={loading} />
        </div>
        {isModalVisible && (
          <ModalProducts
            isModalVisible={isModalVisible}
            handleCancel={() => setIsModalVisible(false)}
            title="Thêm Sản phẩm"
            textCancel="Hủy"
            textOk="Thêm"
            type="add"
          />
        )}
        {isModalVisibleEdit && (
          <ModalProducts
            isModalVisible={isModalVisibleEdit}
            handleCancel={() => {
              setIsModalVisibleEdit(false);
              setDataProducts(null);
            }}
            title="Chỉnh sửa Sản phẩm"
            textCancel="Hủy"
            textOk="Chỉnh sửa"
            type="edit"
            data={dataProducts}
          />
        )}
      </div>
    </Layout>
  );
};

export default Products;
