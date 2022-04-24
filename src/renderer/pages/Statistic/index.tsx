import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Modal,
  Table,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { QuanLiBanHangApi } from 'renderer/apis/QuanLiBanHangApi';
import Layout from 'renderer/components/Layout';
import { authSelector } from 'renderer/features/auth/selector';
import { useAppSelector } from 'renderer/hooks';
import { IBill } from 'renderer/shared/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistic = () => {
  const [bills, setBills] = useState<IBill[]>([]);
  const { user } = useAppSelector(authSelector);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataNumber, setDataNumber] = useState<number[]>([]);
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<IBill[]>([]);
  const [antnForm] = useForm();
  const [isModal, setIsModal] = useState<boolean>(false);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Nguời tạo',
        dataIndex: 'createdBy',
        key: 'createdBy',
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalMoney',
        key: 'totalMoney',
        render: (_, record) => {
          return `${record.totalMoney} VND`;
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (_, record) => {
          return moment(new Date(record.createdDate)).format('l');
        },
      },
    ],
    []
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Doanh thu từ ${moment(new Date(dateStart)).format(
          'LLL'
        )} - ${moment(new Date(dateEnd)).format('LLL')}`,
      },
    },
  };

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'doanh thu',
          data: dataNumber,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  }, [labels, dataNumber]);

  useEffect(() => {
    document.title = 'Thống kê doanh thu';
  }, []);

  useEffect(() => {
    if (user) {
      QuanLiBanHangApi.getAllBill(user.accessToken)
        .then((value) => {
          const dataBills = value.data as IBill[];
          const sorted = [...dataBills].sort(
            (a, b) =>
              a.createdBy?.localeCompare(b?.createdBy as string) as number
          );
          setBills(dataBills);
          setDateStart(sorted[0].createdDate as string);
          setDateEnd(sorted[sorted.length - 1].createdDate as string);
          setLabels(
            [...dataBills].map((_value) =>
              moment(new Date(_value.createdDate as string)).format('LLL')
            )
          );
          setDataNumber(dataBills.map((_bill) => _bill.totalMoney));
          setDataSearch(dataBills);
          return value.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  useEffect(() => {
    setLabels(
      [...dataSearch].map((_value) =>
        moment(new Date(_value.createdDate as string)).format('l')
      )
    );
    setDataNumber(dataSearch.map((_bill) => _bill.totalMoney));
  }, [dataSearch]);

  return (
    <Layout>
      <div className="p-4 flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-3">
          <div>
            <div className="flex flex-col gap-y-3">
              <Typography.Title className="!m-0" level={3}>
                Thống kê doanh thu
              </Typography.Title>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Thống kê doanh thu</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-x-4">
            <Form
              className="flex items-center gap-x-4"
              initialValues={{
                range_picker: [
                  moment(new Date(dateStart)),
                  moment(new Date(dateEnd)),
                ],
              }}
              form={antnForm}
            >
              <Form.Item className="m-0">
                <DatePicker.RangePicker
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  onChange={(values) => {
                    setDateStart(moment(values?.[0]).toDate().toISOString());
                    setDateEnd(moment(values?.[1]).toDate().toISOString());
                  }}
                  value={[
                    moment(new Date(dateStart)),
                    moment(new Date(dateEnd)),
                  ]}
                />
              </Form.Item>
              <Button
                onClick={() => {
                  setDataSearch(() => {
                    return [...bills].filter(
                      (_bill) =>
                        new Date(_bill.createdDate as string).getTime() >=
                          new Date(dateStart).getTime() &&
                        new Date(_bill.createdDate as string).getTime() <=
                          new Date(dateEnd).getTime()
                    );
                  });
                }}
              >
                Lọc
              </Button>
              <Button
                onClick={() => {
                  setDataSearch([...bills]);
                  const sorted = [...bills].sort(
                    (a, b) =>
                      a.createdBy?.localeCompare(
                        b?.createdBy as string
                      ) as number
                  );
                  setDateStart(sorted[0].createdDate as string);
                  setDateEnd(sorted[sorted.length - 1].createdDate as string);
                }}
              >
                Reset
              </Button>
            </Form>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  setIsModal(true);
                }}
              >
                Xem biểu đồ
              </Button>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          pagination={false}
          className="w-[100%]"
          dataSource={dataSearch}
          scroll={{
            y: 500,
            scrollToFirstRowOnChange: true,
          }}
        />
        <Modal
          visible={isModal}
          onCancel={() => {
            setIsModal(false);
          }}
          width={800}
        >
          <Line data={data} options={options} />
        </Modal>
      </div>
    </Layout>
  );
};

export default Statistic;
