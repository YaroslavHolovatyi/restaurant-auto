import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import type { RootState } from "../../store/store";
import "./MenuPage.css";
import Cart from "../../components/Cart/Cart";
import CheckOrderButton from "../../components/CheckOrderButton/CheckOrderButton";
import { useTranslation } from "react-i18next";

interface Dish {
  _id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  image_url: string;
  weight: string | null;
  is_new: boolean;
  available: boolean;
}

interface Category {
  id: string;
  name: string;
  dishes: Dish[];
}

const categoryIds = [
  "burgers",
  "extras",
  "salads",
  "fries",
  "sauces",
  "drinks",
];

const MenuPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.profile?.role;
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const state = location.state as { initialCategory?: string } | null;
    return state?.initialCategory || "burgers";
  });
  const [dishes, setDishes] = useState<Dish[]>([]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/dishes")
      .then((res) => res.json())
      .then(setDishes);
  }, []);

  // Process dishes data into categories
  const processedCategories: Category[] = categoryIds.map((id) => ({
    id,
    name: t(`categories.${id}`),
    dishes: [],
  }));

  dishes.forEach((dish: Dish) => {
    const category = processedCategories.find(
      (cat) => cat.id === dish.category
    );
    if (category) {
      category.dishes.push(dish);
    }
  });

  useEffect(() => {
    if (!initialScrollDone.current && location.state?.initialCategory) {
      const categoryId = location.state.initialCategory;
      handleCategoryClick(categoryId);
      initialScrollDone.current = true;
    }
  }, [location.state]);

  useEffect(() => {
    // Re-render categories on language change
  }, [i18n.language]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToOrder = (dish: Dish) => {
    dispatch(
      addItem({
        id: dish._id,
        name: dish.name,
        price: dish.price,
        currency: dish.currency,
        image_url: dish.image_url,
        quantity: 1,
      })
    );
  };

  return (
    <div className="menu-page">
      {/* Categories Navigation */}
      <div className="categories-scroll" ref={categoriesScrollRef}>
        {processedCategories.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            className={`category-tab ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="menu-content" ref={contentRef}>
        {processedCategories.map((category) => (
          <div
            key={category.id}
            ref={(el: HTMLDivElement | null) => {
              categoryRefs.current[category.id] = el;
            }}
            className="category-section"
          >
            <div className="category-header">
              <h2>{category.name}</h2>
            </div>
            <div className="dishes-container">
              {category.dishes.map((dish) => (
                <div key={dish._id} className="dish-card">
                  <div className="dish-info">
                    <div className="dish-header">
                      <h3 className="dish-name">{dish.name}</h3>
                      {dish.is_new && (
                        <span className="new-badge">{t("menu.new")}</span>
                      )}
                    </div>
                    <p className="dish-price">
                      {dish.price} {dish.currency}
                    </p>
                    <p className="dish-description">{dish.description}</p>
                    {dish.weight && (
                      <p className="nutrition-info">{dish.weight}</p>
                    )}
                    {userRole === "waiter" && (
                      <button
                        className="add-to-order-button"
                        onClick={() => handleAddToOrder(dish)}
                      >
                        {t("menu.addToOrder")}
                      </button>
                    )}
                  </div>
                  <div className="dish-image-container">
                    {dish.image_url && (
                      <img
                        src={`http://localhost:5000${dish.image_url}`}
                        alt={dish.name}
                        className="dish-image"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CheckOrderButton />
      <Cart />
    </div>
  );
};

export default MenuPage;
