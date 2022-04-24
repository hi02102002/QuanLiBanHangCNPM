import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Staff from '../Staff';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/staff', {
      replace: true,
    });
  }, [navigate]);

  return <Staff />;
};

export default Home;
