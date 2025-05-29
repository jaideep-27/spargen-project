import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../slices/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/shop/ProductFilter';
import Alert from '../components/ui/Alert';
import '../styles/shop.css';

const ShopPage = () => {
  const dispatch = useDispatch();
  const { products, loading: productSliceLoading, error } = useSelector((state) => state.product);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    searchTerm: '',
    category: [],
    priceRange: [0, 10000],
    metal: [],
    gemstone: []
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      let result = [...products];
      
      // Apply search term filter
      if (activeFilters.searchTerm) {
        const searchTermLower = activeFilters.searchTerm.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchTermLower) ||
          (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
          product.category.toLowerCase().includes(searchTermLower) ||
          (product.metal && product.metal.toLowerCase().includes(searchTermLower)) ||
          (product.gemstones && product.gemstones.some(gem => gem.toLowerCase().includes(searchTermLower)))
        );
      }
      
      // Apply category filter
      if (activeFilters.category.length > 0) {
        result = result.filter(product => 
          activeFilters.category.includes(product.category)
        );
      }
      
      // Apply price range filter
      result = result.filter(product => 
        product.price >= activeFilters.priceRange[0] && 
        product.price <= activeFilters.priceRange[1]
      );
      
      // Apply metal filter
      if (activeFilters.metal.length > 0) {
        result = result.filter(product => 
          activeFilters.metal.includes(product.metal)
        );
      }
      
      // Apply gemstone filter
      if (activeFilters.gemstone.length > 0) {
        result = result.filter(product => 
          activeFilters.gemstone.some(gem => product.gemstones.includes(gem))
        );
      }
      
      setFilteredProducts(result);
    } else {
      setFilteredProducts([]);
    }
  }, [products, activeFilters]);

  const handleFilterApply = (newFilters) => {
    setActiveFilters(newFilters);
  };

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-layout">
          <div className="filter-sidebar">
            <ProductFilter 
              activeFilters={activeFilters}
              onFilterApply={handleFilterApply}
              minPrice={0} 
              maxPrice={10000}
            />
          </div>
          <div className="product-listing">
            {error && <Alert type="error" message={error} />}
            {!error && (
              <ProductGrid 
                products={filteredProducts} 
                loading={productSliceLoading}
                error={null}
                title="All Products" 
              />
            )}
            {(!productSliceLoading && !error && filteredProducts.length === 0 && products && products.length > 0) &&
              <div className="product-grid-empty"><p>No products found matching your criteria.</p></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 