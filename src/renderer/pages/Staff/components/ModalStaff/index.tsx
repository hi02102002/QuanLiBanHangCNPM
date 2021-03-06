/* eslint-disable jsx-a11y/label-has-associated-control */
import { DatePicker, Form, Input, message, Modal, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import { authSelector } from 'renderer/features/auth/selector';
import { addStaff, staffSelector, updateStaff } from 'renderer/features/staff';
import { useAppDispatch, useAppSelector } from 'renderer/hooks';
import { IUser } from 'renderer/shared/types';
import * as Yup from 'yup';
import './ModalStaff.css';

interface Props {
  handleCancel: () => void;
  isModalVisible: boolean;
  title: string;
  data?: IUser | null;
  textOk: string;
  textCancel: string;
  type: 'add' | 'edit';
}

const ModalStaff: React.FC<Props> = ({
  handleCancel,
  isModalVisible,
  title,
  data,
  textCancel,
  textOk,
  type,
}) => {
  const [formAntd] = useForm();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const [loading, setLoading] = useState<boolean>(false);
  const { staffs } = useAppSelector(staffSelector);

  const form = useFormik({
    initialValues: {
      name: data?.fullName || '',
      birthday: data?.birthday || '',
      address: data?.address || '',
      username: data?.userName || '',
      password: '',
      confirmPassword: '',
      numberphone: data?.sdt || '',
    },
    onSubmit: async (
      { name, address, birthday, numberphone, password, username },
      { resetForm }
    ) => {
      if (user) {
        if (type === 'add') {
          const action = await dispatch(
            addStaff({
              accessToken: user.accessToken,
              user: {
                address,
                birthday: new Date(birthday).toISOString(),
                fullName: name,
                password,
                sdt: numberphone,
                userName: username,
                createdDate: new Date().toISOString(),
              },
            })
          );

          if (addStaff.pending.match(action)) {
            setLoading(true);
          }
          if (addStaff.fulfilled.match(action)) {
            setLoading(false);
            message.success('Th??m nh??n vi??n th??nh c??ng');
            resetForm();
            handleCancel();
          }
          if (addStaff.rejected.match(action)) {
            setLoading(false);
            message.error('Th??m nh??n vi??n kh??ng th??nh c??ng');
          }
        }
        if (type === 'edit') {
          console.log(Number(numberphone));
          const action = await dispatch(
            updateStaff({
              accessToken: user.accessToken,
              user: {
                fullName: name,
                address,
                birthday: new Date(birthday).toISOString(),
                sdt: numberphone,
                password:
                  password.toString().trim().length === 0 ? null : password,
                userName: username,
              },
              userId: data?.id as string,
            })
          );
          if (updateStaff.pending.match(action)) {
            setLoading(true);
          }
          if (updateStaff.fulfilled.match(action)) {
            setLoading(false);
            message.success('Ch???nh nh??n vi??n th??nh c??ng');
            resetForm();
            handleCancel();
          }
          if (updateStaff.rejected.match(action)) {
            setLoading(false);
            message.error('Ch???nh s???a nh??n vi??n kh??ng th??nh c??ng');
          }
        }
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('T??n kh??ng ???????c ????? tr???ng'),
      birthday: Yup.date().required('Ng??y sinh kh??ng ???????c ????? tr???ng').nullable(),
      address: Yup.string().required('?????a ch??? kh??ng ???????c ????? tr???ng'),
      username: Yup.string().required('T??n ????ng nh???p kh??ng ???????c ????? tr???ng'),
      password: Yup.string().min(8, 'M???t kh???u ??t nh???t ph???i 8 k?? t???').nullable(),
      numberphone: Yup.string()
        .required('S??? ??i???n tho???i kh??ng ???????c ????? tr???ng')
        .matches(
          /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g,
          'S??? ??i???n tho???i kh??ng h???p l???'
        ),
    }),
  });

  return (
    <Modal
      visible={isModalVisible}
      onOk={() => {
        form.handleSubmit();
        formAntd.resetFields();
      }}
      onCancel={handleCancel}
      className="staff-modal  "
      okText={textOk}
      cancelText={textCancel}
      okButtonProps={{ disabled: !(form.isValid && form.dirty), loading }}
    >
      <div className="flex flex-col gap-y-4">
        <Typography.Title className="!m-0" level={3}>
          {title}
        </Typography.Title>
        <Form
          className="flex flex-col gap-y-4"
          layout="vertical"
          form={formAntd}
          initialValues={
            data
              ? {
                  name: form.values.name,
                  birthday: moment(form.values.birthday),
                  address: form.values.address,
                  username: form.values.username,
                  password: form.values.password,
                  confirmPassword: '',
                  numberphone: form.values.numberphone,
                }
              : {
                  name: '',
                  birthday: null,
                  address: '',
                  username: '',
                  password: '',
                  confirmPassword: '',
                  numberphone: '',
                }
          }
        >
          <div className="flex flex-col gap-y-4">
            <Typography.Title level={4}> Th??ng tin chung</Typography.Title>
            <div className="flex gap-x-4">
              <Form.Item
                className="w-full flex flex-col gap-y-2 m-0"
                label="T??n"
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
                  placeholder="T??n"
                  name="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Form.Item>
              <Form.Item
                className="w-full flex flex-col gap-y-2 m-0"
                name="birthday"
                label="Ng??y sinh"
                help={
                  form.errors.birthday && form.touched.birthday ? (
                    <div className="text-red-500">{form.errors.birthday}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.birthday && form.touched.birthday ? 'error' : ''
                }
              >
                <DatePicker
                  name="birthday"
                  onChange={(value) => {
                    if (value) {
                      form.setFieldValue('birthday', moment(value).toDate());
                    } else {
                      form.setFieldValue('birthday', null);
                    }
                  }}
                  onBlur={form.handleBlur}
                  value={moment(form.values.birthday)}
                  className="w-full"
                />
              </Form.Item>
            </div>
            <Form.Item
              className="flex flex-col gap-y-1 m-0"
              label="S??? ??i???n tho???i"
              name="numberphone"
              help={
                form.errors.numberphone && form.touched.numberphone ? (
                  <div className="text-red-500">{form.errors.numberphone}</div>
                ) : null
              }
              validateStatus={
                form.errors.numberphone && form.touched.numberphone
                  ? 'error'
                  : ''
              }
            >
              <Input
                placeholder="S??? ??i???n tho???i"
                value={form.values.numberphone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </Form.Item>
            <Form.Item
              className="w-full flex flex-col gap-y-2 m-0"
              label="?????a ch???"
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
                placeholder="?????a ch???"
                name="address"
                value={form.values.address}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-y-4">
            <Typography.Title level={4}>T??i kho???n</Typography.Title>
            <div className="flex gap-x-4">
              <Form.Item
                className="w-full flex flex-col gap-y-2 m-0"
                label="T??n t??i kho???n"
                name="username"
                help={
                  form.errors.username && form.touched.username ? (
                    <div className="text-red-500">{form.errors.username}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.username && form.touched.username ? 'error' : ''
                }
              >
                <Input
                  placeholder="T??n t??i kho???n"
                  name="username"
                  value={form.values.username}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Form.Item>
              <Form.Item
                className="w-full flex flex-col gap-y-2 m-0"
                label="M???t kh???u"
                name="password"
                help={
                  form.errors.password && form.touched.password ? (
                    <div className="text-red-500">{form.errors.password}</div>
                  ) : null
                }
                validateStatus={
                  form.errors.password && form.touched.password ? 'error' : ''
                }
              >
                <Input
                  placeholder="M???t kh???u"
                  name="password"
                  value={form.values.password}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  type="password"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

ModalStaff.defaultProps = {
  data: null,
};

export default ModalStaff;
