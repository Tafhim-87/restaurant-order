import React from 'react';
import Button from '../ui/Button';

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => onSelectCategory(null)}
        variant={!selectedCategory ? 'primary' : 'outline'}
        size="sm"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory(category)}
          variant={selectedCategory === category ? 'primary' : 'outline'}
          size="sm"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;