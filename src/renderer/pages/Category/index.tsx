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
import { getAllCategory, removeCategory } from 'renderer/features/goods';
import { categorySelector } from 'renderer/features/goods/selector';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { ICategory } from 'renderer/shared/types';
import ModalCategory from './components/ModalCategory';

const Category = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState<boolean>(false);
  const [dataCategory, setDataCategory] = useState<any>(null);
  const { categorys, loading } = useAppSelector(categorySelector);
  const dispatch = useAppDispatch();
  const [dataSearch, setDataSearch] = useState<ICategory[]>([]);
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
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Mã',
        dataIndex: 'code',
        key: 'code',
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
                    setDataCategory(record);
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
                  onConfirm={async (e) => {
                    if (user) {
                      e?.stopPropagation();
                      const action = await dispatch(
                        removeCategory({
                          id: record.id,
                          accessToken: user.accessToken,
                        })
                      );
                      if (removeCategory.pending.match(action)) {
                        setLoadingRemove(true);
                      }

                      if (removeCategory.fulfilled.match(action)) {
                        message.success('Xóa thành công');
                        setLoadingRemove(false);
                      }
                      if (removeCategory.rejected.match(action)) {
                        message.error('Có lỗi khi xóa');
                        setLoadingRemove(false);
                      }
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
    [dispatch, user, loadingRemove]
  );

  useEffect(() => {
    document.title = 'Quản lí loại sản phẩm';
  }, []);

  useEffect(() => {
    setDataSearch([...categorys]);
  }, [categorys]);

  useEffect(() => {
    if (user) {
      dispatch(getAllCategory({ accessToken: user.accessToken }));
    }
  }, [dispatch, user]);

  return (
    <Layout>
      <div className="p-4 ">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-3">
              <Typography.Title className="!m-0" level={3}>
                Quản lí Loại sản phẩm
              </Typography.Title>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Quản lí loại sản phẩm</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <Button onClick={() => setIsModalVisible(true)}>
                Thêm loại sản phẩm
              </Button>
            </div>
          </div>
          <Search
            onSearch={(value) => {
              setDataSearch(() => {
                if (value.trim().length > 0) {
                  return [...categorys].filter((data) =>
                    data.name.toLowerCase().includes(value.trim().toLowerCase())
                  );
                }
                return categorys;
              });
            }}
            onReset={() => {
              setDataSearch([...categorys]);
            }}
            placeholder="Tìm kiếm theo tên"
          />
          <Table columns={columns} dataSource={dataSearch} loading={loading} />
        </div>
        {isModalVisible && (
          <ModalCategory
            isModalVisible
            handleCancel={() => setIsModalVisible(false)}
            title="Thêm loại sản phẩm"
            textCancel="Hủy"
            textOk="Thêm"
            type="add"
          />
        )}
        {isModalVisibleEdit && (
          <ModalCategory
            isModalVisible={isModalVisibleEdit}
            handleCancel={() => {
              setIsModalVisibleEdit(false);
              setDataCategory(null);
            }}
            title="Chỉnh sửa loại sản phẩm"
            textCancel="Hủy"
            textOk="Chỉnh sửa"
            type="edit"
            data={dataCategory}
          />
        )}
      </div>
    </Layout>
  );
};

export default Category;
