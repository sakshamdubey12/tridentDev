import React from 'react';
import SingleProduct from './SingleProduct';

export default function Products({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {data.map((item) => (
        <SingleProduct
          key={item._id} // Ensure each product has a unique key
          colorChoices={item.colorChoices}
          id={item._id}
          name={item.name}
          image={item.imageUrl}
          price={item.price}
        />
      ))}
    </div>
  );
}
