import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFridge } from '../context/FridgeContext';
import * as fridgeApi from '../api/fridge';
import * as recipeApi from '../api/recipe';
import ExpiryBadge from '../components/ExpiryBadge';
import CategoryIcon from '../components/CategoryIcon';
import EmptyFridgeState from '../components/EmptyFridgeState';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { getDday } from '../utils/expiry';
import './HomePage.css';

const URGENT_WITHIN_DAYS = 7;

export default function HomePage() {
  const { user } = useAuth();
  const { selectedFridge, loading: fridgeLoading } = useFridge();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [openRecipeId, setOpenRecipeId] = useState(null);

  useEffect(() => {
    if (!selectedFridge) {
      setItems([]);
      return;
    }
    setLoading(true);
    fridgeApi
      .getFridgeItems(selectedFridge.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [selectedFridge]);

  useEffect(() => {
    if (!selectedFridge) {
      setRecipes([]);
      return;
    }
    setRecipesLoading(true);
    recipeApi
      .getRecommendations(selectedFridge.id, 4)
      .then(setRecipes)
      .finally(() => setRecipesLoading(false));
  }, [selectedFridge]);

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />;
  }

  const urgentItems = items
    .filter((item) => {
      const dday = getDday(item.expiryDate);
      return dday !== null && dday <= URGENT_WITHIN_DAYS;
    })
    .sort((a, b) => getDday(a.expiryDate) - getDday(b.expiryDate));

  return (
    <div className="home-page">
      <h1 className="home-greeting">
        {user?.nickname}님, 오늘도 알뜰하게 관리해봐요
      </h1>

      <div className="home-recipe-section">
        <div className="home-recipe-header">
          <h2>오늘은 이 메뉴 어떠세요?</h2>
          <Link to="/recipes" className="home-recipe-more">
            더보기
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {recipesLoading ? (
          <div className="home-recipe-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <p className="home-recipe-empty">
            냉장고 재료로 추천할 수 있는 레시피가 아직 없어요.
          </p>
        ) : (
          <div className="home-recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setOpenRecipeId(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Link to="/fridge" className="home-urgent-card">
        <p className="home-urgent-card-label">주의할 재료</p>
        <p className="home-urgent-card-count">
          {loading ? (
            <span className="skeleton-block skeleton-urgent-value" />
          ) : (
            <>
              {urgentItems.length}
              <span>개</span>
            </>
          )}
        </p>
        {urgentItems.length > 0 && (
          <ul className="home-urgent-chips">
            {urgentItems.slice(0, 4).map((item) => (
              <li key={item.id} className="home-urgent-chip">
                <CategoryIcon categoryName={item.categoryName} size={16} />
                {item.ingredientName}
                <ExpiryBadge expiryDate={item.expiryDate} />
              </li>
            ))}
          </ul>
        )}
      </Link>

      <div className="home-stats-row">
        <div className="home-stat-card">
          <p className="home-stat-label">전체 재료</p>
          <p className="home-stat-value">
            {loading ? (
              <span className="skeleton-block skeleton-stat-value" />
            ) : (
              `${items.length}개`
            )}
          </p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">냉장</p>
          <p className="home-stat-value">
            {loading ? (
              <span className="skeleton-block skeleton-stat-value" />
            ) : (
              `${items.filter((i) => i.storageLocation === 'REFRIGERATED').length}개`
            )}
          </p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">냉동</p>
          <p className="home-stat-value">
            {loading ? (
              <span className="skeleton-block skeleton-stat-value" />
            ) : (
              `${items.filter((i) => i.storageLocation === 'FROZEN').length}개`
            )}
          </p>
        </div>
        <div className="home-stat-card">
          <p className="home-stat-label">실온</p>
          <p className="home-stat-value">
            {loading ? (
              <span className="skeleton-block skeleton-stat-value" />
            ) : (
              `${items.filter((i) => i.storageLocation === 'ROOM_TEMP').length}개`
            )}
          </p>
        </div>
      </div>

      {openRecipeId && (
        <RecipeDetailModal
          recipeId={openRecipeId}
          fridgeId={selectedFridge?.id}
          onClose={() => setOpenRecipeId(null)}
        />
      )}
    </div>
  );
}
