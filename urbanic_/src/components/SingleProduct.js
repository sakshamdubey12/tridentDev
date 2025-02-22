import React from 'react';
import { Link } from 'react-router-dom';

export default function SingleProduct({ colorChoices, id, name, image, price }) {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-white h-full hover:text-red-600">
      <Link to={`/product/${id}`} className="flex-grow">
        <div className="flex justify-center items-center h-full">
          <img src={image} alt={name} className="object-cover h-full w-full" />
        </div>
      </Link>
      <div className="p-4">
        <div className="text-lg font-semibold truncate">{name}</div>
        <div className="text-gray-600 mt-1">₹{price}</div>
      </div>
    </div>
  );
}
