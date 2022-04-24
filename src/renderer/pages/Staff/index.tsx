/* eslint-disable import/no-unresolved */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
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
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import Layout from 'renderer/components/Layout';
import Search from 'renderer/components/Search';
import { authSelector } from 'renderer/features/auth/selector';
import {
  getAllUsers,
  removeStaff,
  staffSelector,
} from 'renderer/features/staff';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { IUser } from 'renderer/shared/types';
import ModalStaff from './components/ModalStaff';

const Staff = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState<boolean>(false);
  const [dataStaff, setDataStaff] = useState<IUser | null>(null);
  const [dataSearch, setDataSearch] = useState<IUser[]>([]);
  const { user } = useAppSelector(authSelector);
  const { staffs, loading } = useAppSelector(staffSelector);
  const dispatch = useAppDispatch();
  const [loadingRemove, setLoadingRemove] = useState<boolean>(false);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Tên',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: 'Ngày sinh',
        dataIndex: 'birthday',
        key: 'birthday',
        render: (text) => {
          return moment(new Date(text)).format('l');
        },
      },
      {
        title: 'SĐT',
        dataIndex: 'sdt',
        key: 'sdt',
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tên đăng nhập',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: 'Ngày vào',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text, record) => {
          return moment(new Date(text)).format('l');
        },
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
                    setDataStaff(record);
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
                    if (user) {
                      const action = await dispatch(
                        removeStaff({
                          accessToken: user.accessToken,
                          userId: record.id,
                        })
                      );

                      if (removeStaff.pending.match(action)) {
                        setLoadingRemove(true);
                      }

                      if (removeStaff.fulfilled.match(action)) {
                        message.success('Xóa thành công');
                        setLoadingRemove(false);
                      }
                      if (removeStaff.rejected.match(action)) {
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
    document.title = 'Quản lí nhân viên';
  }, []);

  useEffect(() => {
    setDataSearch([...staffs]);
  }, [staffs]);

  useEffect(() => {
    if (user) {
      dispatch(
        getAllUsers({ accessToken: user.accessToken, limit: 100, offset: 0 })
      );
    }
  }, [dispatch, user]);

  return (
    <Layout>
      <div className="p-4 ">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-3">
              <Typography.Title className="!m-0" level={3}>
                Quản lí nhân viên
              </Typography.Title>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Quản lí nhân viên</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <Button onClick={() => setIsModalVisible(true)}>
                Thêm nhân viên
              </Button>
            </div>
          </div>
          <Search
            onSearch={(value) => {
              setDataSearch(() => {
                if (value.trim().length > 0) {
                  return [...staffs].filter((data) =>
                    data.fullName.toLowerCase().includes(value)
                  );
                }
                return staffs;
              });
            }}
            onReset={() => {
              setDataSearch([...staffs]);
            }}
            placeholder="Tìm kiếm theo tên"
          />
          <Table columns={columns} dataSource={dataSearch} loading={loading} />
        </div>
        {isModalVisible && (
          <ModalStaff
            isModalVisible={isModalVisible}
            handleCancel={() => setIsModalVisible(false)}
            title="Thêm nhân viên"
            textCancel="Hủy"
            textOk="Thêm"
            type="add"
          />
        )}
        {isModalVisibleEdit && (
          <ModalStaff
            isModalVisible={isModalVisibleEdit}
            handleCancel={() => {
              setIsModalVisibleEdit(false);
              setDataStaff(null);
            }}
            title="Chỉnh sửa nhân viên"
            textCancel="Hủy"
            textOk="Chỉnh sửa"
            type="edit"
            data={dataStaff}
          />
        )}
      </div>
    </Layout>
  );
};

export default Staff;
