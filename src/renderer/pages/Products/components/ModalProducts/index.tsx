/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form, Input, message, Modal, Select, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { authSelector } from 'renderer/features/auth/selector';
import {
  addProduct,
  categorySelector,
  editProduct,
  productsSelector,
} from 'renderer/features/goods';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { IProducts } from 'renderer/shared/types';
import * as Yup from 'yup';
import './ModalProducts.css';

interface Props {
  handleCancel: () => void;
  isModalVisible: boolean;
  title: string;
  data?: IProducts | null;
  textOk: string;
  textCancel: string;
  type: 'add' | 'edit';
}

const ModalProducts: React.FC<Props> = ({
  handleCancel,
  isModalVisible,
  title,
  data,
  textCancel,
  textOk,
  type,
}) => {
  const [formAntd] = useForm();
  const { categorys } = useAppSelector(categorySelector);
  const { products } = useAppSelector(productsSelector);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useFormik({
    initialValues: {
      name: data?.productName || '',
      price: data?.price || '',
      code: data?.categoryId || '',
      quantity: data?.quantity || '',
    },
    onSubmit: async ({ name, price, code, quantity }, { resetForm }) => {
      if (type === 'add') {
        console.log(code);
        const action = await dispatch(
          addProduct({
            accessToken: user?.accessToken as string,
            d: {
              categoryId: +code,
              price: +price,
              productName: name,
              quantity: +quantity,
            },
          })
        );
        if (addProduct.pending.match(action)) {
          setLoading(true);
        }
        if (addProduct.fulfilled.match(action)) {
          setLoading(false);
          message.success('Thêm sản phẩm thành công');
          resetForm();
          handleCancel();
        }
        if (addProduct.rejected.match(action)) {
          setLoading(false);
          message.error('Thêm sản phẩm thất bại');
        }
      }
      if (type === 'edit') {
        const action = await dispatch(
          editProduct({
            id: data?.id as string,
            d: {
              productName: name,
              price: Number(price),
              categoryId: +code,
              quantity: Number(quantity),
            },
            accessToken: user?.accessToken as string,
          })
        );

        if (editProduct.pending.match(action)) {
          setLoading(true);
        }
        if (editProduct.fulfilled.match(action)) {
          setLoading(false);
          message.success('Chỉnh sửa sản phẩm thành công');
          resetForm();
          formAntd.resetFields();
          handleCancel();
        }
        if (editProduct.rejected.match(action)) {
          setLoading(false);
          message.error('Chỉnh sửa sản phẩm thất bại');
        }
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên không được để trống'),
      code: Yup.string().required('Mã không được để trống'),
      price: Yup.string()
        .required('Giá không được để trống')
        .matches(/^[0-9]*$/, 'Giá phải dương và không chứa kí tự chữ cái'),
      quantity: Yup.string()
        .required('Số lượng không được để trống')
        .matches(/^[0-9]*$/, 'Số lượng phải dương và không chứa kí tự chữ cái'),
    }),
  });

  return (
    <Modal
      visible={isModalVisible}
      onOk={() => {
        form.handleSubmit();
      }}
      onCancel={() => {
        handleCancel();
        form.resetForm();
        formAntd.resetFields();
      }}
      className="staff-modal"
      okText={textOk}
      cancelText={textCancel}
      okButtonProps={{ disabled: !(form.isValid && form.dirty), loading }}
    >
      <Typography.Title level={3}> {title}</Typography.Title>
      <Form
        className="flex flex-col gap-y-4"
        layout="vertical"
        form={formAntd}
        initialValues={{
          name: data?.productName || '',
          price: data?.price || '',
          code: data?.categoryId || '',
          quantity: data?.quantity || '',
        }}
      >
        <div className="w-full flex flex-col gap-y-2">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            help={
              form.errors.name && form.touched.name ? (
                <div className="text-red-500">{form.errors.name}</div>
              ) : null
            }
            validateStatus={
              form.errors.name && form.touched.name ? 'error' : ''
            }
            className="m-0"
          >
            <Input
              name="name"
              placeholder="Tên sản phẩm"
              value={form.values.price}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Form.Item>
        </div>
        <div className="w-full flex flex-col gap-y-2">
          <Form.Item
            label="Giá"
            name="price"
            help={
              form.errors.price && form.touched.price ? (
                <div className="text-red-500">{form.errors.price}</div>
              ) : null
            }
            validateStatus={
              form.errors.price && form.touched.price ? 'error' : ''
            }
            className="m-0"
          >
            <Input
              name="price"
              placeholder="Giá"
              value={form.values.price}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Form.Item>
        </div>
        <div className="w-full flex flex-col gap-y-2">
          <Form.Item
            label="Mã loại sản phẩm"
            name="code"
            help={
              form.errors.code && form.touched.code ? (
                <div className="text-red-500">{form.errors.code}</div>
              ) : null
            }
            validateStatus={
              form.errors.code && form.touched.code ? 'error' : ''
            }
            className="m-0"
          >
            <Select
              placeholder="Mã loại sản phẩm"
              value={form.values.code}
              onChange={(value) => {
                form.setFieldValue('code', value);
              }}
              onBlur={form.handleBlur}
            >
              {categorys.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="w-full flex flex-col gap-y-2">
          <Form.Item
            label="Số lượng"
            name="quantity"
            help={
              form.errors.quantity && form.touched.quantity ? (
                <div className="text-red-500">{form.errors.quantity}</div>
              ) : null
            }
            validateStatus={
              form.errors.quantity && form.touched.quantity ? 'error' : ''
            }
            className="m-0"
          >
            <Input
              name="quantity"
              placeholder="Số lượng"
              value={form.values.quantity}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

ModalProducts.defaultProps = {
  data: null,
};

export default ModalProducts;
