// import React from 'react'
// import { GoSearch } from 'react-icons/go'
// import { LiaShoppingBagSolid } from 'react-icons/lia'
// import { IoPersonOutline } from 'react-icons/io5'
// import { AiOutlineQuestionCircle, AiOutlineClose } from 'react-icons/ai'
// import { HiOutlineBars3 } from 'react-icons/hi2'
// import logo from '../assets/logo3.png'
// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import Profile from './Profile'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux';


// export default function Header() {
//   const navigate = useNavigate()
//   const cartItems = useSelector((state) => state.cart.items);
//   const [isMobileActive, setIsMobileActive] = useState(false);
//   const dispatch = useDispatch();
//   const { isLogin, loading, isAdmin } = useSelector((state) => state.auth);

//   const toggleNavBar = () => {
//     setIsMobileActive((prevState) => !prevState);
//   }


//   const changeIn = (color) => {
//     const drop1 = document.querySelector('.header');
//     const dropdown = document.querySelector('.dropdown')
//     drop1.style.background = color;
//     dropdown.style.background = color;
//   }

//   const changeOut = () => {
//     const drop1 = document.querySelector('.header');
//     drop1.style.background = 'white';
//   }

//   return (
    
//       isAdmin ? "admin" : (<div className={isMobileActive ? 'nav mob-active' : 'nav'}>
//         <div className='header-mobile'>
//           <div>
//             <AiOutlineClose onClick={() => toggleNavBar()} name='close-button' className='mob-nav-button-close' />
//             <HiOutlineBars3 onClick={() => toggleNavBar()} className='mob-nav-button-open' />
//             <Link to='/'> <img className='logo ' src={logo} alt="Urbanic" /></Link>
//           </div>
//           <div>
//             <Link to='/cart' className="relative">
//               <LiaShoppingBagSolid style={{ fontSize: "40px" }} />
//               <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.length}</span>
//             </Link>
//           </div>
//         </div>
//         <div className="header">
//           <div className='header-start'>
//             <Link to='/'> <img className='logo  ' src={logo} alt="Urbanic" /></Link>
//           </div>
//           <div className='header-mid header-font'>
//             {/* Dropdown menus here */}
//             <div className='header-mid  header-font' >
//             <div onMouseEnter={()=>changeIn('#BDC8BF')} onMouseLeave={changeOut} className='drop-1'>
//               <p className='active'>NEW IN</p>
//               <div className='dropdown'>
//                 <div className='content font-2'>
//                   <div>
//                     <p className='header-font'>VIEW ALL</p>
//                     <p>Dresses</p>
//                     <p>Denim</p>
//                     <p>Knitwear</p>
//                     <p>Co-ords & jumpsuits</p>
//                     <p>Tops & bodysuits</p>
//                   </div>
//                   <div >
//                     <p>T-shirts & sweatshirts</p>
//                     <p>Blouses & shirts</p>
//                     <p>Pants & skirts</p>
//                     <p>Outerwear</p>
//                     <p>Sports</p>
//                     <p>Swimwear</p>
//                   </div>
//                   <div>
//                     <p>Accessories</p> 
//                     <p>Jewelry</p>  
//                     <p>Bags</p>  
//                   </div>
                  
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#FAEBB1')} onMouseLeave={()=> changeOut()} className='drop-2'>
//               <p className='active'>CLOTHING</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                     <p>VIEW ALL</p>
//                     <p>NEW IN</p>
//                     <p>BEST SELLERS</p>
//                     <p>DRESSES</p>
//                     <p>CO-ORDS</p>
//                     <p>JUMPSUITS</p> 
//                   </div>
                
//                 <div>
//                 <p>TOPS</p>
//                 <p className='font-2'>T-shirts & sweatshirts</p>
//                 <p className='font-2'>Tops</p>
//                 <p className='font-2'>Blouses</p>
//                 <p className='font-2'>Bodysuits</p>
//                 </div>
//                 <div>
//                   <p>PANTS & SKIRTS</p>
//                   <p className='font-2'>Pants</p>
//                   <p className='font-2'>Shorts</p>
//                   <p className='font-2'>Skirts</p>
//                 </div>
//                 <div>
//                   <p>OUTERWEAR</p>
//                   <p className='font-2'>Coats</p>
//                   <p className='font-2'>Trench coats</p>
//                   <p className='font-2'>Jackets</p>
//                   <p className='font-2'>Blazers</p>
//                 </div>
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#E19AC0')} onMouseLeave={()=> changeOut()} className='drop-3'>
//               <p className='active'>DRESSES</p>
//               <div className='dropdown'>
//                 <div className='content font-2'>
//                   <div className='header-font'>
//                     <p>VIEW ALL</p>
//                     <p>NEW IN</p>
//                     <p>BEST SELLERS</p>
//                   </div>
//                   <div>
//                     <p className='header-font'>SHOP BY CATEGORY</p>
//                     <p>Slip dresses</p>
//                     <p>Bodycon dresses</p>
//                     <p>A-line dresses</p>
//                   </div>
//                   <div>
//                     <p className='header-font'>SHOP BY LENGTH</p>
//                     <p>Maxi dresses</p>
//                     <p>Midi dresses</p>
//                     <p>Short dresses</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#FFB2AC')} onMouseLeave={()=> changeOut()} className='drop-4'>
//               <p className='active'>KNITWEAR</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                     <p>VIEW ALL</p>
//                     <p>NEW IN</p>
//                     <p>BEST SELLERS</p>
//                     <br />
//                     <p>SHOP BY CATEGORY</p>
//                     <p className='font-2'>Tops</p>
//                     <p className='font-2'>Dresses</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#9CA9BE')} onMouseLeave={()=> changeOut()} className='drop-5'>
//               <p className='active'>DENIM</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                   <p>VIEW ALL</p>
//                   <p>NEW IN</p>
//                   <p>BEST SELLERS</p>
//                   <br />
//                   <p>JEANS</p>
//                   </div>
                
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#F6CC3C')} onMouseLeave={()=> changeOut()} className='drop-6'>
//               <p className='active'>LIFESTYLE</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                     <p>VIEW ALL</p>
//                     <p>NEW IN</p>
//                     <p>BEST SELLERS</p>
//                   </div>
//                   <div>
//                     <p> SPORTS</p>
//                     <p className='font-2'> Tops</p>
//                     <p className='font-2'> Bottoms</p>
//                     <p className='font-2'> Suits</p><br />
//                     <p> LOUNGEWEAR</p>
//                     <p> LINGERIE</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#FAEBB0')} onMouseLeave={()=> changeOut()} className='drop-7'>
//               <p className='active'>SWIMWEAR</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                     <p>VIEW ALL</p>
//                     <p>NEW IN</p>
//                     <p>BEST SELLERS</p>
//                     <p>SHOP BY CATEGORY</p>
//                     <p className='font-2'>Bikini sets</p>
//                     <p className='font-2'>Cover ups</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div onMouseEnter={()=>changeIn('#FFB2AC')} onMouseLeave={()=> changeOut()} className='drop-8'>
//               <p style={{"color":'red'}} className='active'>SPECIAL PRICES</p>
//               <div className='dropdown'>
//                 <div className='content'>
//                   <div>
//                     <p>VIEW ALL</p>
//                     <p>Dresses</p>
//                     <p>Tops</p>
//                     <p>Bottoms</p>
//                   </div>
//                   <div>
//                     <p >Special offers</p>
//                     <p className='font-2'>Up to 20% off</p>
//                     <p className='font-2'>Up to 30% off</p>
//                     <p className='font-2'>Up to 40% off</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <p className='active'>SOCIAL RESPO</p> */}
//           </div>
//             {/* ... */}
//           </div>
//           <div className="header-end">
//             <GoSearch className='icon' />
//             <Link to={isLogin ? '/profile' : '/account'} ><IoPersonOutline className='icon' /></Link>
//             <div className=''>
//               <Link to='/cart' className="relative">
//                 <LiaShoppingBagSolid className='icon' />
//                 <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.length}</span>
//               </Link>
//             </div>
//             <Link to="/previous-orders" ><AiOutlineQuestionCircle className='icon' /></Link>
//           </div>
//         </div>
//       </div>)
    
//   )
// }


import React, { useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { LiaShoppingBagSolid } from 'react-icons/lia';
import { IoPersonOutline } from 'react-icons/io5';
import { AiOutlineQuestionCircle, AiOutlineClose } from 'react-icons/ai';
import { HiOutlineBars3 } from 'react-icons/hi2';
import logo from '../assets/logo3.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const dispatch = useDispatch();
  const { isLogin, isAdmin } = useSelector((state) => state.auth);
 
  const toggleNavBar = () => {
    setIsMobileActive((prevState) => !prevState);
  };

  return (
    isAdmin ? "admin" : (
      <div className={isMobileActive ? 'nav mob-active' : 'nav'}>
        <div className='header-mobile'>
          <div>
            <AiOutlineClose onClick={toggleNavBar} className='mob-nav-button-close' />
            <HiOutlineBars3 onClick={toggleNavBar} className='mob-nav-button-open' />
            <Link to='/'> <img className='logo' src={logo} alt='Urbanic' /></Link>
          </div>
          <div>
            <Link to='/cart' className='relative'>
              <LiaShoppingBagSolid style={{ fontSize: '40px' }} />
              <span className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>{cartItems.length}</span>
            </Link>
          </div>
        </div>
        <div className='header'>
          <div className='header-start'>
            <Link to='/'> <img className='logo' src={logo} alt='Urbanic' /></Link>
          </div>
          <div className='header-mid header-font'>
            <Link to='/' className='header-link'>New Arrival</Link>
            <Link to='/apparel' className='header-link'>Apparel</Link>
            <Link to='/about-us' className='header-link'>About Us</Link>
            <Link to='/contact' className='header-link'>Contact</Link>
            <Link to='/policy' className='header-link'>Policy</Link>
          </div>
          <div className='header-end'>
            <GoSearch className='icon' />
            <Link to={isLogin ? '/profile' : '/account'}><IoPersonOutline className='icon' /></Link>
            <div>
              <Link to='/cart' className='relative'>
                <LiaShoppingBagSolid className='icon' />
                <span className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>{cartItems.length}</span>
              </Link>
            </div>
            <Link to='/previous-orders'><AiOutlineQuestionCircle className='icon' /></Link>
          </div>
        </div>
      </div>
    )
  );
}
