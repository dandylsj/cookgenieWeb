import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Fan, Pencil, Snowflake, Sun, Trash2 } from 'lucide-react';
import { useFridge } from '../context/FridgeContext';
import * as fridgeApi from '../api/fridge';
import ExpiryBadge from '../components/ExpiryBadge';
import CategoryIcon from '../components/CategoryIcon';
import FridgeItemModal from '../components/FridgeItemModal';
import IngredientStatsView from '../components/IngredientStatsView';
import IngredientStatsSkeleton from '../components/IngredientStatsSkeleton';
import FridgeItemRowSkeleton from '../components/FridgeItemRowSkeleton';
import { STORAGE_LOCATION_LABEL, getDday } from '../utils/expiry';
import { nutritionFacts, nutritionSourceLabel } from '../utils/nutrition';
import EmptyFridgeState from '../components/EmptyFridgeState';
import Button from '../components/Button';
import NutritionFactsLine from '../components/NutritionFactsLine';
import '../styles/tabs.css';
import '../components/NutritionTag.css';
import './FridgeItemsPage.css';

const STORAGE_LOCATION_ICON = {
  REFRIGERATED: Fan,
  FROZEN: Snowflake,
  ROOM_TEMP: Sun,
};

const SORT_OPTIONS = [
  { value: 'expiry', label: '기한순' },
  { value: 'created', label: '등록순' },
  { value: 'updated', label: '수정순' },
];

const PRIMARY_VIEWS = [
  { value: 'list', label: '재료 목록' },
  { value: 'stats', label: '재료 현황' },
];

export default function FridgeItemsPage() {
  const { selectedFridge, loading: fridgeLoading } = useFridge();
  const [view, setView] = useState('list');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('expiry');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [modal, setModal] = useState(null); // { mode: 'create' } | { mode: 'edit', item }
  const [error, setError] = useState('');

  const fridgeId = selectedFridge?.id;
  // 냉장고를 빠르게 전환했을 때 이전 냉장고의 응답이 늦게 도착해서 지금 선택된 냉장고의 목록을
  // 덮어써버리는 걸 막기 위해, 응답이 왔을 때도 여전히 같은 냉장고인지 확인한다.
  const fridgeIdRef = useRef(fridgeId);
  useEffect(() => {
    fridgeIdRef.current = fridgeId;
  }, [fridgeId]);

  // silent: 추가/수정/삭제 후 갱신처럼 이미 목록이 떠 있는 상태에서는 로딩 문구로 목록을 갈아끼우지 않는다(깜빡임 방지).
  const loadItems = useCallback(
    async ({ silent = false } = {}) => {
      const requestedFridgeId = fridgeId;
      if (!requestedFridgeId) {
        setItems([]);
        return;
      }
      if (!silent) setLoading(true);
      setError('');
      try {
        const data = await fridgeApi.getFridgeItems(requestedFridgeId);
        if (fridgeIdRef.current !== requestedFridgeId) return;
        setItems(data);
      } catch (err) {
        if (fridgeIdRef.current === requestedFridgeId) setError(err.message);
      } finally {
        if (fridgeIdRef.current === requestedFridgeId) setLoading(false);
      }
    },
    [fridgeId],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const sortedItems = useMemo(() => {
    const copy = [...items];
    if (sort === 'expiry') {
      copy.sort((a, b) => {
        const da = getDday(a.expiryDate);
        const db = getDday(b.expiryDate);
        if (da === null) return 1;
        if (db === null) return -1;
        return da - db;
      });
    } else if (sort === 'created') {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'updated') {
      copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return copy;
  }, [items, sort]);

  const categories = useMemo(() => {
    const names = new Set();
    for (const item of items) {
      if (item.categoryName) names.add(item.categoryName);
    }
    return [...names].sort();
  }, [items]);

  // 냉장고를 전환해서 이전에 고른 카테고리가 더 이상 없으면(예: 다른 냉장고로 넘어옴) "전체"로 취급한다.
  const effectiveCategoryFilter = categories.includes(categoryFilter)
    ? categoryFilter
    : null;

  const visibleItems = useMemo(() => {
    if (!effectiveCategoryFilter) return sortedItems;
    return sortedItems.filter(
      (item) => item.categoryName === effectiveCategoryFilter,
    );
  }, [sortedItems, effectiveCategoryFilter]);

  async function handleCreate(payload) {
    await fridgeApi.createFridgeItem(fridgeId, payload);
    await loadItems({ silent: true });
  }

  async function handleUpdate(itemId, payload) {
    await fridgeApi.updateFridgeItem(fridgeId, itemId, payload);
    await loadItems({ silent: true });
  }

  async function handleDelete(item) {
    if (!window.confirm(`'${item.ingredientName}'을(를) 삭제할까요?`)) return;
    await fridgeApi.deleteFridgeItem(fridgeId, item.id);
    await loadItems({ silent: true });
  }

  if (!fridgeLoading && !selectedFridge) {
    return <EmptyFridgeState />;
  }

  return (
    <div className="fridge-items-page">
      <div className="fridge-items-header">
        <div>
          <h1>냉장고 재료</h1>
          <p>
            {selectedFridge
              ? `${selectedFridge.name} · 총 ${items.length}개`
              : ''}
          </p>
        </div>
        <div className="fridge-items-header-actions">
          <Button onClick={() => setModal({ mode: 'create' })}>
            + 재료 추가
          </Button>
        </div>
      </div>

      <div className="primary-tabs">
        {PRIMARY_VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            className={`primary-tab${view === v.value ? ' primary-tab--active' : ''}`}
            onClick={() => setView(v.value)}
          >
            {v.label}
          </button>
        ))}
        {view === 'list' && (
          <div className="fridge-items-sort">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`sort-chip${sort === opt.value ? ' sort-chip--active' : ''}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      {view === 'stats' ? (
        loading ? (
          <IngredientStatsSkeleton />
        ) : (
          <IngredientStatsView items={items} />
        )
      ) : (
        <>
          {categories.length > 0 && (
            <div className="fridge-items-toolbar fridge-items-category-filter">
              <button
                type="button"
                className={`sort-chip${effectiveCategoryFilter === null ? ' sort-chip--active' : ''}`}
                onClick={() => setCategoryFilter(null)}
              >
                전체
              </button>
              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`sort-chip${effectiveCategoryFilter === name ? ' sort-chip--active' : ''}`}
                  onClick={() => setCategoryFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <ul className="fridge-item-list">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <FridgeItemRowSkeleton />
                </li>
              ))}
            </ul>
          ) : visibleItems.length === 0 ? (
            <p className="fridge-items-empty">
              {effectiveCategoryFilter
                ? '이 카테고리에는 재료가 없어요.'
                : '아직 등록된 재료가 없어요. 재료를 추가해보세요.'}
            </p>
          ) : (
            <ul className="fridge-item-list">
              {visibleItems.map((item) => {
                const StorageIcon = STORAGE_LOCATION_ICON[item.storageLocation];
                const nutrition = nutritionFacts(item);
                const source = nutritionSourceLabel(
                  item.nutritionDataSource,
                  item.nutritionVerified,
                );
                return (
                  <li key={item.id} className="fridge-item-row">
                    <CategoryIcon categoryName={item.categoryName} />
                    <div className="fridge-item-main">
                      <div className="fridge-item-title">
                        <span className="fridge-item-name">
                          {item.ingredientName}
                        </span>
                        <span className="fridge-item-quantity">
                          {item.quantity}
                          {item.unit}
                        </span>
                        <span
                          className="fridge-item-storage"
                          data-storage={item.storageLocation}
                        >
                          {StorageIcon && (
                            <StorageIcon size={12} aria-hidden="true" />
                          )}
                          {STORAGE_LOCATION_LABEL[item.storageLocation]}
                        </span>
                      </div>

                      {nutrition && (
                        <NutritionFactsLine
                          basis={nutrition.basis}
                          facts={nutrition.facts}
                          source={source}
                        />
                      )}
                      {item.memo && (
                        <p className="fridge-item-memo">{item.memo}</p>
                      )}
                    </div>
                    <div className="fridge-item-side">
                      <ExpiryBadge expiryDate={item.expiryDate} />
                      {item.expiryDate && (
                        <p className="fridge-item-expiry-date">
                          {item.expiryDate.replaceAll('-', '.')}까지
                        </p>
                      )}
                      <div className="fridge-item-actions">
                        <Button
                          variant="warning"
                          size="sm"
                          aria-label="수정"
                          title="수정"
                          onClick={() => setModal({ mode: 'edit', item })}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          aria-label="삭제"
                          title="삭제"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {modal?.mode === 'create' && (
        <FridgeItemModal
          mode="create"
          fridgeId={fridgeId}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
          onRefresh={() => loadItems({ silent: true })}
        />
      )}
      {modal?.mode === 'edit' && (
        <FridgeItemModal
          mode="edit"
          initialItem={modal.item}
          onClose={() => setModal(null)}
          onSubmit={(payload) => handleUpdate(modal.item.id, payload)}
        />
      )}
    </div>
  );
}
