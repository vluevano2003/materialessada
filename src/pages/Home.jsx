import React from 'react';
import Carousel from '../components/Carousel';
import DestacadosSection from '../components/DestacadosSection';

import '../styles/home.css';

function Home() {
  return (
    <>
      <Carousel />
      <DestacadosSection />
    </>
  );
}

export default Home;