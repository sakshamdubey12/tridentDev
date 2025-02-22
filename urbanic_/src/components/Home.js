import React from 'react'
import Header from './Header'
import Marquee from './Marquee'
import Body from './Body'
import Hero from './Hero'
import { useRef } from "react";


function Home() {
    // Create a ref for the products section
    const productsRef = useRef(null);

    // Scroll to the products section
    const scrollToProducts = () => {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <div>
       {/* <Marquee /> */}
       
       <Hero scrollToProducts={scrollToProducts} />
       <Body productsRef={productsRef} />
    </div>
  )
}

export default Home;

