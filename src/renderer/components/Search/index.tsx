import { Button, Input } from 'antd';
import React, { useState } from 'react';

interface Props {
  onSearch: (value: string) => void;
  onReset: () => void;
  placeholder: string;
}

const Search: React.FC<Props> = ({ onSearch, onReset, placeholder }) => {
  const [text, setText] = useState<string>('');

  return (
    <div className="flex items-center gap-x-4">
      <Input
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onSearch(e.target.value);
        }}
        value={text}
      />
      <Button
        onClick={() => {
          if (text.trim().length === 0) {
            return;
          }
          onSearch(text);
          setText('');
        }}
      >
        Tìm kiếm
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default Search;
