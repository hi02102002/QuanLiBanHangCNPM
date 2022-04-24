/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Input, message, Typography } from 'antd';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuanLiBanHangApi } from 'renderer/apis/QuanLiBanHangApi';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const form = useFormik({
    initialValues: {
      username: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ username, newPassword, confirmPassword }) => {
      try {
        await QuanLiBanHangApi.forgotPassword(
          username,
          newPassword,
          confirmPassword
        );
        message.success('Đổi mật khẩu thành công');
        navigate('/login');
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Tên đăng nhập không được để trống'),
      newPassword: Yup.string()
        .required('Mật khẩu mới không được để trống')
        .min(8, 'Mật khẩu phải ít nhật 8 kí tự'),
      confirmPassword: Yup.string()
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp'),
    }),
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 gap-y-3">
      <div className="flex flex-col items-center justify-center gap-y-3  max-w-lg w-full">
        <Typography.Title>Thiết lập lại mật khẩu</Typography.Title>
        <form className="w-full flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1">
            <label className="font-medium" htmlFor="0">
              Tên tài khoản
            </label>
            <Input
              type="text"
              name="username"
              onChange={form.handleChange}
              value={form.values.username}
              placeholder="Tên tài khoản"
              onBlur={form.handleBlur}
            />
            {form.errors.username && form.touched.username ? (
              <div className="text-red-500">{form.errors.username}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="font-medium" htmlFor="0">
              Mật khẩu mới
            </label>
            <Input
              type="password"
              onChange={form.handleChange}
              name="newPassword"
              value={form.values.newPassword}
              placeholder="Mật khẩu mới"
              onBlur={form.handleBlur}
            />
            {form.errors.newPassword && form.touched.newPassword ? (
              <div className="text-red-500">{form.errors.newPassword}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="font-medium" htmlFor="0">
              Nhập lại mật khẩu
            </label>
            <Input
              type="password"
              name="confirmPassword"
              onChange={form.handleChange}
              value={form.values.confirmPassword}
              placeholder="Nhập lại mật khẩu"
              onBlur={form.handleBlur}
            />
            {form.errors.confirmPassword && form.touched.confirmPassword ? (
              <div className="text-red-500">{form.errors.confirmPassword}</div>
            ) : null}
          </div>
        </form>
        <div className=" flex items-center gap-x-3 justify-end w-full">
          <Button onClick={() => navigate(-1)}>Quay lại </Button>
          <Button
            className="bg-blue-500 text-white"
            onClick={() => {
              form.handleSubmit();
            }}
          >
            Đổi mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
