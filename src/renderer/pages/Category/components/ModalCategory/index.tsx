/* eslint-disable jsx-a11y/label-has-associated-control */
import { Input, message, Modal, Typography } from 'antd';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { authSelector } from 'renderer/features/auth/selector';
import { addCategory, editCategory } from 'renderer/features/goods';
import { categorySelector } from 'renderer/features/goods/selector';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { ICategory } from 'renderer/shared/types';
import * as Yup from 'yup';
import './ModalCategory.css';

interface Props {
  handleCancel: () => void;
  isModalVisible: boolean;
  title: string;
  data?: ICategory | null;
  textOk: string;
  textCancel: string;
  type: 'add' | 'edit';
}

const ModalCategory: React.FC<Props> = ({
  handleCancel,
  isModalVisible,
  title,
  data,
  textCancel,
  textOk,
  type,
}) => {
  const { categorys } = useAppSelector(categorySelector);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useFormik({
    initialValues: {
      name: data?.name || '',
      code: data?.code || '',
    },
    onSubmit: async ({ name, code }) => {
      try {
        const codeExist = categorys.find(
          (category) =>
            category.code === code || category.name.trim() === name.trim()
        );
        if (codeExist) {
          message.error('Tên hoặc mã đã tồn tại');
        } else {
          if (type === 'add') {
            const action = await dispatch(
              addCategory({
                code,
                name,
                accessToken: user?.accessToken as string,
              })
            );

            if (addCategory.pending.match(action)) {
              setLoading(true);
            }

            if (addCategory.fulfilled.match(action)) {
              setLoading(false);
              message.success('Thêm thành công');
              form.resetForm();
              handleCancel();
            }

            if (addCategory.rejected.match(action)) {
              setLoading(false);
              message.error('Thêm thất bại');
              form.resetForm();
              handleCancel();
            }
          }

          if (type === 'edit') {
            const action = await dispatch(
              editCategory({
                id: data?.id as string,
                d: {
                  name,
                  code,
                },
                accessToken: user?.accessToken as string,
              })
            );

            if (editCategory.pending.match(action)) {
              setLoading(true);
            }

            if (editCategory.fulfilled.match(action)) {
              setLoading(false);
              message.success('Chỉnh sửa thành công');
              form.resetForm();
              handleCancel();
            }

            if (editCategory.rejected.match(action)) {
              setLoading(false);
              message.error('Chỉnh sửa thất bại');
              form.resetForm();
              handleCancel();
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên không được để trống'),
      code: Yup.string().required('Mã không được để trống'),
    }),
  });

  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={() => {
        form.handleSubmit();
      }}
      className="staff-modal"
      okText={textOk}
      cancelText={textCancel}
      okButtonProps={{
        disabled: !(form.isValid && form.dirty),
        loading,
      }}
    >
      <Typography.Title level={3}> {title}</Typography.Title>
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex flex-col gap-y-2">
          <label htmlFor="">Tên</label>
          <Input
            placeholder="Tên"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            className={`${
              form.errors.name && form.touched.name
                ? '!border-red-500 !shadow-none'
                : ''
            }`}
          />
          {form.errors.name && form.touched.name ? (
            <div className="text-red-500">{form.errors.name}</div>
          ) : null}
        </div>
        <div className="w-full flex flex-col gap-y-2">
          <label htmlFor="">Mã</label>
          <Input
            placeholder="Mã"
            name="code"
            value={form.values.code}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            className={`${
              form.errors.code && form.touched.code
                ? '!border-red-500 !shadow-none'
                : ''
            }`}
          />
          {form.errors.code && form.touched.code ? (
            <div className="text-red-500">{form.errors.code}</div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

ModalCategory.defaultProps = {
  data: null,
};

export default ModalCategory;
