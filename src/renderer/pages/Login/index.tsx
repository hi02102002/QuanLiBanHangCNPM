import { Button, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from 'renderer/features/auth';
import { useAppDispatch } from 'renderer/hooks';
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(signIn({ userName: username, password }));
      setIsLoading(false);
      navigate('/', {
        replace: true,
      });
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = 'Đăng nhập';
  }, []);

  return (
    <div className="flex items-center justify-center h-screen flex-col px-4 gap-y-3">
      <Typography.Title>Đăng nhập</Typography.Title>
      <form
        className="w-full max-w-lg flex flex-col gap-y-3"
        onSubmit={handleSubmit}
      >
        <div className=" flex flex-col gap-y-1">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="font-medium">Tên đăng nhập</label>
          <Input
            value={username}
            placeholder="Tên đăng nhập..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="font-medium">Mật khẩu</label>
          <Input
            value={password}
            type="password"
            placeholder="Mật khẩu..."
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <Button
          loading={isLoading}
          htmlType="submit"
          className="flex items-center justify-center hover:bg-blue-500 hover:text-white self-center  "
        >
          Đăng nhập
        </Button>
      </form>
      <Link to="/forgot-password">Quên mật khẩu</Link>
    </div>
  );
};

export default Login;
