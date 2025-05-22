import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../slices/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/shop/ProductFilter';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import '../styles/shop.css';

const ShopPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    priceRange: [0, 10000],
    metal: [],
    gemstone: []
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      let result = [...products];
      
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
    }
  }, [products, activeFilters]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="shop-container">
      <h1 className="shop-title">Our Collection</h1>
      
      <div className="shop-content">
        <aside className="shop-sidebar">
          <ProductFilter 
            filters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        
        <main className="shop-products">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products match your selected filters.</p>
              <button 
                className="btn-reset-filters"
                onClick={() => setActiveFilters({
                  category: [],
                  priceRange: [0, 10000],
                  metal: [],
                  gemstone: []
                })}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage; 