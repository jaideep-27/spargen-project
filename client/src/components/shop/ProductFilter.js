import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../slices/productSlice';
import { FaFilter, FaChevronDown, FaTimes } from 'react-icons/fa';
import '../../styles/ProductFilter.css';

const ProductFilter = ({ onFilterApply }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.product);
  
  const [category, setCategory] = useState(filters.category || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [metal, setMetal] = useState(filters.metal || '');
  const [gemstone, setGemstone] = useState(filters.gemstone || '');
  const [sort, setSort] = useState(filters.sort || 'newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'necklace', label: 'Necklaces' },
    { value: 'bracelet', label: 'Bracelets' },
    { value: 'earring', label: 'Earrings' },
    { value: 'ring', label: 'Rings' },
    { value: 'pendant', label: 'Pendants' },
    { value: 'anklet', label: 'Anklets' },
    { value: 'watch', label: 'Watches' },
    { value: 'set', label: 'Jewelry Sets' },
  ];
  
  const metalOptions = [
    { value: '', label: 'All Metals' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'rose gold', label: 'Rose Gold' },
    { value: 'white gold', label: 'White Gold' },
    { value: 'titanium', label: 'Titanium' },
    { value: 'stainless steel', label: 'Stainless Steel' },
  ];
  
  const gemstoneOptions = [
    { value: '', label: 'All Gemstones' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'sapphire', label: 'Sapphire' },
    { value: 'amethyst', label: 'Amethyst' },
    { value: 'pearl', label: 'Pearl' },
    { value: 'opal', label: 'Opal' },
    { value: 'topaz', label: 'Topaz' },
    { value: 'none', label: 'No Gemstone' },
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'best-rated', label: 'Best Rated' },
  ];
  
  useEffect(() => {
    setCategory(filters.category || '');
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
    setMetal(filters.metal || '');
    setGemstone(filters.gemstone || '');
    setSort(filters.sort || 'newest');
  }, [filters]);
  
  const handleApplyFilters = () => {
    const newFilters = {
      category,
      minPrice,
      maxPrice,
      metal,
      gemstone,
      sort,
    };
    
    dispatch(setFilters(newFilters));
    
    if (onFilterApply) {
      onFilterApply(newFilters);
    }
    
    setMobileFiltersOpen(false);
  };
  
  const handleClearFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMetal('');
    setGemstone('');
    setSort('newest');
    
    dispatch(clearFilters());
    
    if (onFilterApply) {
      onFilterApply({});
    }
  };
  
  const filterActive = category || minPrice || maxPrice || metal || gemstone || sort !== 'newest';
  
  return (
    <div className="product-filter">
      <div className="filter-mobile-header">
        <button 
          className="filter-toggle-btn neu-button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <FaFilter /> Filters <FaChevronDown />
        </button>
        
        <select 
          className="sort-select-mobile neu-input"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            dispatch(setFilters({ ...filters, sort: e.target.value }));
            if (onFilterApply) {
              onFilterApply({ ...filters, sort: e.target.value });
            }
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      <div className={`filter-container ${mobileFiltersOpen ? 'filter-mobile-open' : ''}`}>
        <div className="filter-header">
          <h3 className="filter-title">Filters</h3>
          
          {filterActive && (
            <button 
              className="clear-filters-btn"
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              <FaTimes /> Clear
            </button>
          )}
          
          <button 
            className="filter-close-btn"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="filter-section">
          <h4 className="filter-section-title">Category</h4>
          <select 
            className="filter-select neu-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-section">
          <h4 className="filter-section-title">Price Range</h4>
          <div className="price-range-inputs">
            <input
              type="number"
              className="price-input neu-input"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              className="price-input neu-input"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <h4 className="filter-section-title">Metal</h4>
          <select 
            className="filter-select neu-input"
            value={metal}
            onChange={(e) => setMetal(e.target.value)}
          >
            {metalOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-section">
          <h4 className="filter-section-title">Gemstone</h4>
          <select 
            className="filter-select neu-input"
            value={gemstone}
            onChange={(e) => setGemstone(e.target.value)}
          >
            {gemstoneOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-section desktop-only">
          <h4 className="filter-section-title">Sort By</h4>
          <select 
            className="filter-select neu-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-actions">
          <button 
            className="apply-filters-btn neu-button neu-button-primary"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter; 