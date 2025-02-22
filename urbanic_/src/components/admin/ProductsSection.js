import React, { useState, useEffect } from "react";
import { FaSpinner, FaTrashAlt } from "react-icons/fa"; // Import spinner and delete icon
import { MdOutlineAdd } from "react-icons/md";
import { MdEdit } from "react-icons/md"; // Edit icon import
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchProducts,
  updateProduct,
  addProduct
} from "../../redux/productSlice";

const ProductsSection = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State to track selected category
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle the Add Product modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to handle the Edit Product modal
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the selected product for editing
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    colorChoices: [], // Initialize as an empty array
    discount: "",
    available: ""
  });

  const [searchQuery, setSearchQuery] = useState(""); // State to track search input for product ID

  useEffect(() => {
    if (!products.length) return; // Avoid filtering on an empty product list
  console.log(products)
  setLoading(false)
    const filteredProducts = products.filter((product) => {
      const productIdString = product._id.toString();
      const queryString = searchQuery.trim(); // Remove extra spaces from the search query
  
      return (
        (selectedCategory === "All" || product.category === selectedCategory) &&
        (productIdString.includes(queryString) || queryString === "")
      );
    });
  
    // Update fetchedProducts if products change
    setFetchedProducts(filteredProducts);
  }, [products, selectedCategory, searchQuery]); // Trigger when products, category, or search query change
   
  


  

  const handleAddProduct = () => {
    dispatch(addProduct({Productdata:newProduct}))
    .then(()=>{
      setIsModalOpen(false)
      dispatch(fetchProducts())
    })
    
  };

  const handleEditProduct = (id, data) => {
    dispatch(updateProduct({ id, Productdata: data }))
    .then(()=>{
      setIsEditModalOpen(false)
      dispatch(fetchProducts())
    });
  };

  

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct({ id: productId }))
      .then(() => {
        dispatch(fetchProducts()); // Fetch the updated list after deletion
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: URL.createObjectURL(file) });
  };

  const handleColorChange = (color, isChecked, setProductState) => {
    setProductState((prevProduct) => {
      const updatedColors = isChecked
        ? [...(prevProduct.colorChoices || []), color] // Ensure colorChoices is always an array
        : (prevProduct.colorChoices || []).filter((c) => c !== color); // Remove color
  
      return { ...prevProduct, colorChoices: updatedColors };
    });
  };
  
  
  const addCustomColor = (color) => {
    if (color && !newProduct.colorChoices.includes(color)) {
      setNewProduct({
        ...newProduct,
        colorChoices: [...newProduct.colorChoices, color]
      });
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="p-4 flex items-center justify-start gap-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500"
        >
          <MdOutlineAdd />
        </button>
      </div>

      <div className="p-4 flex items-center space-x-6">
        <button
          className={`text-sm font-medium ${
            selectedCategory === "All"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        <button
          className={`text-sm font-medium ${
            selectedCategory === "Tshirt"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedCategory("Tshirt")}
        >
          T-Shirts
        </button>
        <button
          className={`text-sm font-medium ${
            selectedCategory === "Skirt"
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedCategory("Skirt")}
        >
          Skirt
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Product ID"
          className="w-64 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* <div className="flex justify-center items-center w-full py-4 min-h-[200px]">
        {loading ? (
          <FaSpinner className="animate-spin text-gray-500" size={30} />
        ) : fetchedProducts.length === 0 ? (
          <div className="text-center w-full">
            <p className="text-lg text-gray-700">
              No products found for this category.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-4xl p-6">
            {fetchedProducts.map((product) => (
              <div
                key={product._id}
                className="border-b p-4 mb-4 bg-white shadow-lg rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Discount: {product.discount}</p>
                  <p className="text-gray-600">In Stock: {product.available}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <MdEdit
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditModalOpen(true);
                    }}
                    className="cursor-pointer text-black hover:text-gray-500"
                    size={20}
                  />
                  <FaTrashAlt
                    onClick={() => handleDeleteProduct(product._id)}
                    className="cursor-pointer text-black hover:text-gray-500"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

<div className="flex justify-center items-center w-full py-4 min-h-[200px]">
  {loading ? (
    <FaSpinner className="animate-spin text-gray-500" size={30} />
  ) : fetchedProducts.length === 0 ? (
    <div className="text-center w-full">
      <p className="text-lg text-gray-700">
        No products found for this category.
      </p>
    </div>
  ) : (
    <div className="w-full max-w-7xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {fetchedProducts.map((product) => (
        <div
          key={product._id}
          className="relative flex items-center border-b p-4 mb-4 bg-white shadow-lg rounded-md"
        >
          {/* Edit and Delete icons in the top-right corner */}
          <div className="absolute p-2 top-2 right-2 flex space-x-2">
            <MdEdit
              onClick={() => {
                setSelectedProduct(product);
                setIsEditModalOpen(true);
              }}
              className="cursor-pointer text-black hover:text-gray-500"
              size={16}
            />
            <FaTrashAlt
              onClick={() => handleDeleteProduct(product._id)}
              className="cursor-pointer text-black hover:text-gray-500"
              size={16}
            />
          </div>

          {/* Image on the left */}
          <div className="w-1/3">
            <img
              src={product.imageUrl || "default-image-url"} // Fallback image
              alt={product.name}
              className="w-full h-60 object-cover rounded-md"
            />
          </div>

          {/* Product info on the right */}
          <div className="w-2/3 pl-4 p-4 flex flex-col justify-between h-full">
  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
  <p className="text-gray-700 mb-2 flex-1 line-clamp-5">{product.description}</p>
  
  <div className="flex items-center mb-2">
    <p className="text-gray-600 text-lg font-semibold mr-2">${(product.price - (product.price * product.discount) / 100).toFixed(2)}</p>
    {product.discount > 0 && (
      <p className="text-red-500 line-through">${(product.price).toFixed(2)}</p>
    )}
  </div>

  <p className="text-gray-600">In Stock: {product.available}</p>
</div>
        </div>
      ))}
    </div>
  )}
</div>






      
      {/* Add Product Modal */}
 {/* Add Product Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
      <h3 className="text-xl font-semibold mb-4">Add New Product</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          {/* Product Name */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          {/* Category */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="Tshirt">Tshirt</option>
            <option value="Skirt">Skirt</option>
          </select>

          {/* Price */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />


          {/* Description */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter product description"
          />
        </div>

        {/* Right Column */}
        <div>
          
          {/* Discount */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Discount
          </label>
          <input
            type="number"
            value={newProduct.discount}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                discount: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          {/* In Stock */}
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            In Stock
          </label>
          <input
            type="number"
            value={newProduct.available}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                available: parseInt(e.target.value) || 0,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />

          {/* Color Choices (Multi-select Dropdown) */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Colors
            </label>
            <div className="grid grid-cols-8 gap-2 max-h-24 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Orange', 'Pink', 'Brown'].map((color) => (
                <div key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    value={color}
                    checked={newProduct.colorChoices.includes(color)}
                    onChange={(e) => handleColorChange(color, e.target.checked)}
                    className="hidden"
                  />
                  <div
                    onClick={() => handleColorChange(color, !newProduct.colorChoices.includes(color), setNewProduct)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md cursor-pointer border-2 ${newProduct.colorChoices.includes(color) ? 'border-black' : 'border-gray-300'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center mt-2">
            <input
              type="text"
              id="customColor"
              className="p-2 border border-gray-300 rounded-md mr-2"
              placeholder="eg #FFFFFF"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCustomColor(e.target.value);
                  e.target.value = ''; // Clear input after adding
                }
              }}
            />
            <button
              onClick={() => addCustomColor(document.getElementById("customColor").value)}
              className="px-4 py-2 bg-black text-white text-xs rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
        >
          Add Product
        </button>
      </div>
    </div>
  </div>
)}



      {/* Edit Product Modal */}
{/* Edit Product Modal */}
{isEditModalOpen && selectedProduct && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[80vh] flex flex-col">
      {/* Header */}
      <h3 className="text-xl font-semibold mb-4  text-center">Edit Product  </h3>
      <div className="flex justify-center gap-2 mb-4">
      <label className="block text-xs font-semibold text-gray-400 mb-1">
              Product Id -
            </label>
      <p className="text-xs text-gray-400 ">{selectedProduct._id}</p>
      </div>
      {/* Form - Scrollable Section */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="Tshirt">Tshirt</option>
              <option value="Skirt">Skirt</option>
            </select>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="number"
              value={selectedProduct.discount}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  discount: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Description */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter product description"
            />
          </div>

          {/* Right Column */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              In Stock
            </label>
            <input
              type="number"
              value={selectedProduct.available}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  available: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Image Urls
            </label>
            <textarea
              value={selectedProduct.imageUrl}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, imageUrl: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />

            {/* Color Choices - Multi-select */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Colors
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-24 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Orange', 'Pink', 'Brown'].map((color) => (
                <div key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    value={color}
                    checked={selectedProduct.colorChoices.includes(color)}
                    onChange={(e) => handleColorChange(color, e.target.checked)}
                    className="hidden"
                  />
                  <div
                    onClick={() => handleColorChange(color, !selectedProduct.colorChoices.includes(color), setSelectedProduct)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md cursor-pointer border-2 ${
                      selectedProduct.colorChoices.includes(color) ? 'border-black' : 'border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={()=>handleEditProduct(selectedProduct._id, selectedProduct)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default ProductsSection;
