import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import {
  AiOutlineLogout,
  AiOutlineTag,
  AiOutlineTeam,
  AiOutlineUser,
} from 'react-icons/ai';
import { BiCoinStack } from 'react-icons/bi';
import { BsBoxSeam, BsCashCoin } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from 'renderer/features/auth';
import { useAppDispatch } from 'renderer/hooks';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname);
      }
    }
  }, [location, current]);

  return (
    <div className="w-64 h-screen sidebar flex flex-col ">
      <div className=" border-r border-solid border-[#f0f0f0]; flex items-center justify-center font-bold text-4xl text-blue-500 py-3">
        ADMIN
      </div>
      <Menu className="w-64 flex-1" mode="inline" selectedKeys={[current]}>
        <Menu.Item key="/staff" className="flex items-center ">
          <Link to="/staff" className="flex items-center gap-x-[10px]">
            <AiOutlineTeam className="w-6 h-6 " />
            <span className="font-medium">Quản lí nhân viên</span>
          </Link>
        </Menu.Item>
        <Menu.SubMenu
          key="qlss"
          icon={<BsBoxSeam className="w-6 h-6 " />}
          title="Quản lí hàng hóa"
        >
          <Menu.Item key="/category" className="flex items-center ">
            <Link to="/category" className="flex items-center gap-x-[10px]">
              <AiOutlineTag className="w-6 h-6 " />
              <span className="font-medium">Quản lí loại sản phẩm</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/products" className="flex items-center ">
            <Link to="/products" className="flex items-center gap-x-[10px]">
              <BiCoinStack className="w-6 h-6 " />
              <span className="font-medium">Quản lí sản phẩm</span>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="/statistic" className="flex items-center ">
          <Link to="/statistic" className="flex items-center gap-x-[10px]">
            <BsCashCoin className="w-6 h-6 " />
            <span className="font-medium">Thống kê doanh thu</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/setting-account" className="flex items-center ">
          <Link
            to="/setting-account"
            className="flex items-center gap-x-[10px]"
          >
            <AiOutlineUser className="w-6 h-6 " />
            <span className="font-medium">Thiết lập tài khoản</span>
          </Link>
        </Menu.Item>
        <Menu.Item
          key="dx"
          className="flex items-center "
          icon={<AiOutlineLogout className="w-6 h-6 " />}
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
        >
          <span className="font-medium">Đăng xuất</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
