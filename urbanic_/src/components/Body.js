import React, { useState, useEffect } from "react";
import filterIcon from "../assets/filter-logo.png";
import { BsChevronDown } from "react-icons/bs";
import Products from "./Products";
import { fetchProducts } from "../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
export default function Body({productsRef}) {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filterActive, setFilterActive] = useState(false);
  const [sortActive, setSortActive] = useState(false);
  const [price, setPrice] = useState(1);

  // Fetch products on initial render
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update filtered products whenever filters or products change
  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colorChoices.includes(selectedColor)
      );
    }

    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange;
      filtered = filtered.filter(
        (product) =>
          product.price >= parseFloat(minPrice) &&
          product.price <= parseFloat(maxPrice)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedColor, selectedPriceRange]);

  const toggleFilter = () => {
    setFilterActive((prevState) => !prevState);
  };

  const toggleSortMenu = () => {
    setSortActive((prevState) => !prevState);
  };

  const handleCategorySelect = (event) => {
    if (event.target.tagName === "LI") {
      const category = event.target.getAttribute("data-value");
      setSelectedCategory(category);
    }
  };

  const handlePriceRangeChange = (event) => {
    setPrice(event.target.value);
    setSelectedPriceRange([1, parseInt(price, 10)]);
  };

  const sortByPriceAscending = () => {
    const sorted = [...filteredProducts].sort((a, b) => a.price - b.price);
    setFilteredProducts(sorted);
  };

  const sortByPriceDescending = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
    setFilteredProducts(sorted);
  };

  const handleSortSelection = (sortType) => {
    if (sortType === "lowToHigh") {
      sortByPriceAscending();
    } else if (sortType === "highToLow") {
      sortByPriceDescending();
    }
  };

  return (
    <div ref={productsRef}>
      <div className="main-frame">
        <div className="main-frame-head">
          <div className="filter1">
            <img
              onClick={toggleFilter}
              style={{ height: "15px", width: "20px", marginRight: "5px" }}
              src={filterIcon}
              alt="Filter Icon"
            />
            <div className="font">SHOW FILTERS</div>
          </div>
          <div className="filter1">
            <div className="font">SORT BY</div>
            <div>
              <div
                className="gray down-arrow"
                id="selected"
                onClick={toggleSortMenu}
              >
                Recommended
              </div>
              {sortActive && (
                <div className="dropdown-recommended">
                  <p
                    className="sort"
                    onClick={() => handleSortSelection("lowToHigh")}
                  >
                    Price: Low to High
                  </p>
                  <p
                    className="sort"
                    onClick={() => handleSortSelection("highToLow")}
                  >
                    Price: High to Low
                  </p>
                </div>
              )}
            </div>
            <BsChevronDown />
          </div>
        </div>
        <div className="body">
          <br />
          <div
            className={filterActive ? "active-filter left-box" : "left-box"}
          >
            <details className="my-4" id="categoryDropdown">
              <summary className="pt-4 pb-2 font-semibold">Category</summary>
              <ul id="itemList">
                <li
                  className="active"
                  onClick={handleCategorySelect}
                  data-value="Dress"
                >
                  Dress
                </li>
                <li
                  className="active"
                  onClick={handleCategorySelect}
                  data-value="Top"
                >
                  Top
                </li>
                <li
                  className="active"
                  onClick={handleCategorySelect}
                  data-value="Tshirt"
                >
                  Tshirt
                </li>
                <li
                  className="active"
                  onClick={handleCategorySelect}
                  data-value="Trouser"
                >
                  Trouser
                </li>
                <li
                  className="active"
                  onClick={handleCategorySelect}
                  data-value="Skirt"
                >
                  Skirt
                </li>
              </ul>
            </details>
            <hr />
            <details className="my-4">
      <summary className="pt-4 pb-2 font-semibold cursor-pointer">
        Price
      </summary>
      <div className="mt-4 flex flex-col items-center w-full">
        {/* Slider Container */}
        <div className="relative w-11/12 max-w-md">
          {/* Range Input */}
          <input
            type="range"
            min="1"
            max="10000"
            value={price}
            onChange={handlePriceRangeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />

          {/* Floating Label (positioned above the thumb) */}
          <div
            className="absolute top-0 -translate-y-6 bg-black text-white text-xs font-semibold py-1 px-2 rounded pointer-events-none"
            style={{
              left: `calc(${((price - 1) / 9999) * 100}% - 1rem)`,
            }}
          >
            ₹{price}
          </div>
        </div>

        {/* Display Range */}
        <p className="mt-4 text-sm text-gray-700">
          Range: (₹1 – ₹{price})
        </p>
      </div>

      {/* Custom CSS for the slider thumb */}
      <style jsx>{`
        /* Remove default appearance on WebKit browsers */
        input[type="range"] {
          -webkit-appearance: none;
        }
        input[type="range"]:focus {
          outline: none;
        }
        /* Chrome/Edge/Safari thumb */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          background: #000; /* black thumb */
          border: 2px solid #fff; /* white border */
          cursor: pointer;
          margin-top: -0.4rem; /* center thumb on track */
        }
        /* Firefox thumb */
        input[type="range"]::-moz-range-thumb {
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          background: #000;
          border: 2px solid #fff;
          cursor: pointer;
        }
      `}</style>
    </details>
            <hr />
            <details className="my-4">
              <summary className="pt-4 pb-2 font-semibold">Color</summary>
              <div style={{ marginLeft: "-8px" }}>
                <div
                className="ml-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(30px, 1fr))",
                  gap: "4px",
                  marginTop: "10px",
                }}
                >
                  {[
                    "Maroon",
                    "Green",
                    "Blue",
                    "Pink",
                    "Yellow",
                    "Brown",
                    "Black",
                    "Grey",
                    "Beige",
                    "SkyBlue",
                    "Purple",
                  ].map((color) => (
                    <div
                      key={color}
                      className="color hover:cursor-pointer"
                      style={{
                        backgroundColor: color,
                        height: "30px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      data-value={color}
                      onClick={(e) =>
                        setSelectedColor(e.target.getAttribute("data-value"))
                      }
                    ></div>
                  ))}
                </div>
              </div>
            </details>
            <hr />
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="right-box">
              <Products data={filteredProducts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
