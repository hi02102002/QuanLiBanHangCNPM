/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/always-return */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Breadcrumb, Button, DatePicker, Form, Input, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormik } from 'formik';
import moment from 'moment';
import React from 'react';
import Layout from 'renderer/components/Layout';
import { updateUser } from 'renderer/features/auth';
import { authSelector } from 'renderer/features/auth/selector';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import * as Yup from 'yup';

const SettingAccount = () => {
  const [formAntd] = useForm();
  const { user: currentUser } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const form = useFormik({
    initialValues: {
      name: currentUser?.fullName || '',
      numberphone: currentUser?.sdt || '',
      date: currentUser?.birthday || null,
      address: currentUser?.address || '',
    },
    onSubmit: async (values, actions) => {
      dispatch(
        updateUser({
          accessToken: currentUser?.accessToken as string,
          user: {
            address: values.address,
            birthday: new Date(values.date as string).toISOString(),
            fullName: values.name,
            sdt: values.numberphone,
          },
          userId: currentUser?.id as string,
        })
      );
    },

    validationSchema: Yup.object().shape({
      name: Yup.string().required('Tên không được để trống'),
      numberphone: Yup.string()
        .required('Số điện thoại không được để trống')
        .matches(
          /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g,
          'Số điện thoại không hợp lệ'
        ),
      date: Yup.date().nullable().required('Ngày sinh không được để trống'),
      address: Yup.string().required('Địa chỉ không được để trống'),
    }),
  });

  return (
    <Layout>
      <div className="p-4 ">
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-3">
            <Typography.Title className="!m-0" level={3}>
              Thiết lập tài khoản
            </Typography.Title>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Thiết lập tài khoản</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <Form
              className="flex flex-col gap-y-4 "
              layout="vertical"
              form={formAntd}
              initialValues={{
                name: form.values.name,
                address: form.values.address,
                date: moment(form.values.date),
                numberphone: form.values.numberphone,
              }}
            >
              <Form.Item
                className="flex flex-col  gap-y-1 m-0"
                label="Tên"
                name="name"
                help={
                  form.errors.name && form.touched.name ? (
                    <div className="text-red-500">{form.errors.name}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.name && form.touched.name ? 'error' : ''
                }
              >
                <Input
                  placeholder="Tên"
                  name="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Form.Item>
              <Form.Item
                className="flex flex-col gap-y-1 m-0"
                label="Số điện thoại"
                name="numberphone"
                help={
                  form.errors.numberphone && form.touched.numberphone ? (
                    <div className="text-red-500">
                      {form.errors.numberphone}
                    </div>
                  ) : null
                }
                validateStatus={
                  form.errors.numberphone && form.touched.numberphone
                    ? 'error'
                    : ''
                }
              >
                <Input
                  placeholder="Số điện thoại"
                  value={form.values.numberphone}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Form.Item>
              <Form.Item
                className="flex flex-col gap-y-1 m-0"
                label="Ngày sinh"
                name="date"
                help={
                  form.errors.date && form.touched.date ? (
                    <div className="text-red-500">{form.errors.date}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.date && form.touched.date ? 'error' : ''
                }
              >
                <DatePicker
                  placeholder="Ngày sinh"
                  className="w-full"
                  name="date"
                  onChange={(value) => {
                    if (value) {
                      form.setFieldValue('date', moment(value).toDate());
                    } else {
                      form.setFieldValue('date', null);
                    }
                  }}
                  onBlur={form.handleBlur}
                  value={moment(form.values.date)}
                />
              </Form.Item>
              <Form.Item
                className="flex flex-col gap-y-1 m-0"
                label="Địa chỉ"
                name="address"
                help={
                  form.errors.address && form.touched.address ? (
                    <div className="text-red-500">{form.errors.address}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.address && form.touched.address ? 'error' : ''
                }
              >
                <Input
                  placeholder="Địa chỉ"
                  onChange={form.handleChange}
                  name="address"
                  onBlur={form.handleBlur}
                  value={form.values.address}
                />
              </Form.Item>
              <div className="flex w-full justify-end gap-x-4">
                <Button
                  onClick={() => {
                    formAntd.resetFields();
                    form.resetForm();
                  }}
                >
                  Huỷ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    form.handleSubmit();
                  }}
                  disabled={!(form.isValid && form.dirty)}
                >
                  Lưu
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingAccount;
