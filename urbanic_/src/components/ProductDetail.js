import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from './Header';
import { checkPincodeAvailability } from '../redux/paymentSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../redux/cartSlice';

export default function ProductDetail({id}) {
  // const products_ = useSelector((state) => state.products); 
  const dispatch = useDispatch();
 const { products, isLoading } = useSelector((state) => state.products);
  const { productId } = useParams();
  const [size, setSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const pincodeAvailability = useSelector((state) => state.payment.pincodeAvailability);
  const pincodeStatus = useSelector((state) => state.payment.pincodeStatus);
  const pincodeError = useSelector((state) => state.payment.pincodeError);

  const [pincode, setPincode] = useState("");
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState("");

  // const checkAvailability = async () => {
  //   if (pincode.length !== 6 || isNaN(pincode)) {
  //     toast.info('Please enter a valid 6-digit PIN code.', {
  //       position: 'top-right',
  //       autoClose: 3000, 
  //     });
  //     return;
  //   }
  //   try {
  //     setError("");
  //     setAvailability(null);

  //     const response = await fetch(`http://localhost:5000/api/check-pincode/${pincode}`);
  //     const data = await response.json();
  //     if (response.ok) {
  //       setAvailability(data);

  //     } else {
  //       setError("Something went wrong");
  //     }
  //   } catch (err) {
  //     setError("Error checking PIN code.");
  //   }
  // };
  const checkAvailability = (pincode) => {
    dispatch(checkPincodeAvailability(pincode));
  };
  const product = products.find((item) => item._id === productId);
  const handleAddtoBag = ()=>{
    if (size && selectedColor){
      dispatch(addToCart({product,size,selectedColor}))

      toast.success('Added to Bag', {
        position: 'top-right',
        autoClose: 3000, // Auto-close the popup after 3 seconds
      });
    }

    else{
      toast.info('Select size and Color!', {
        position: 'top-right',
        autoClose: 3000, // Auto-close the popup after 3 seconds
      });
    }
    
  }

  const getSelectedSize = ()=>{
    const sizeSelect = document.getElementById("sizeSelect");
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    setSize(selectedOption.value)
  }

  const selectColor = (payload)=>{
    setSelectedColor(payload); 
    
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div className='detail-body' style={{"marginTop":"100px"}}>
      <img style={{'height':"800px"}} src={product.imageUrl} alt={product.name} />
      <div className='detail'>
        <h1 style={{"fontSize":"60px"}}>{product.name}</h1>
        <p style={{"fontSize":"25px", "color":"gray"}}><b style={{"fontSize":"40px", "color":"black"}}>MRP ₹{product.price} </b> Incluive of all taxes</p>
        <div className='' style={{"fontSize":"25px"}}>COLOR: <b style={{"color":"gray"}}>Beige</b>  </div>
        <div className='detail-ele colors-choice'>
            {
              product.colorChoices.map(color =>{
                return(
                  <div 
                    onClick={()=>selectColor(color)} 
                    key={color}  
                    style={{"backgroundColor":`${color}`}} 
                    className={`color ${selectedColor === color ? 'active-color' : ''}`}>
                  </div>
                )
              })
            }
        </div>

        <select onChange={()=>getSelectedSize()} id="sizeSelect" className='button-1' >
            <option style={{"display":"none"}} value="">SELECT SIZE</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
        </select>
        
          <div onClick={() => handleAddtoBag()} className='button-2 '>ADD TO BAG</div>
         
        
        
        <div className='' style={{"fontSize":"18px", "marginTop":"70px"}}>DELIVERY INFO </div>
        <div style={{"width":"90%"}} className='detail-body pin info'>
            <input placeholder='Enter a pincode to check' className='info-1 w-[100%] text-start' value={pincode}
        onChange={(e) => setPincode(e.target.value)} />
                {/* Enter a pincode to check */}
            {/* </input> */}
            <button onClick={()=>checkAvailability(pincode)} type="button" className='info-2'>
                Check
            </button>
            
        </div>
        {pincodeAvailability !== null && (
        <div className="mt-4">
          {pincodeAvailability.available ? (
            <p className="text-green-500">Delivery is available! 🚚</p>
          ) : (
            <p className="text-red-500">Delivery is not available for this PIN code.</p>
          )}
        </div>
      )}
        <details className='py-4'>
            <summary className='detail-ele font-medium'>SERVICE & POLICY</summary>
                <div>
                    Cash on delivery available in most areas
                    Free shipping on this product! (saving ₹99)
                    10 days easy returns with free pick up
                </div>
                <div className='detail-ele text-sm cursor-pointer text-red-600'>View more about Service & Policy</div>
                <div className='text-sm font-semibold'>*Contact Customer Service if you need any help</div>
        </details>
        <hr />
        <details className='py-4'>
            <summary className='detail-ele font-medium'>ABOUT THIS PRODUCT</summary>
                <div>
                    {product.description}
                </div>
                {/* <div className='detail-ele'>View more about Service&Policy</div>
                <div>Contact Customer Service if you need any help</div> */}
        </details>
        <hr />
        <details className='py-4'>
            <summary className='detail-ele font-medium'>PRODUCT MEASUREMENTS</summary>
                <div>
                    Cash on delivery available in most areas
                    Free shipping on this product! (saving ₹99)
                    10 days easy returns with free pick up
                </div>
                <div className='detail-ele'>View more about Service&Policy</div>
                <div>Contact Customer Service if you need any help</div>
        </details>
        
      </div>
    </div>
  )
}
