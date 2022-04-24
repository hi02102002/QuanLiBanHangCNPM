import { Button, InputNumber, Space } from 'antd';
import React, { useState } from 'react';

interface Props {
  maxValue: number;
  onAdd: (value: number) => void;
}

const Action: React.FC<Props> = ({ maxValue, onAdd }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div>
      <Space size="middle">
        <InputNumber
          min={1}
          max={maxValue}
          value={quantity}
          placeholder="Số lượng"
          onChange={(value) => {
            setQuantity(value);
          }}
        />
        <Button
          onClick={() => {
            onAdd(quantity);
          }}
        >
          Thêm
        </Button>
      </Space>
    </div>
  );
};

export default Action;
