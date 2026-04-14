'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface MenuItem {
  day: string;
  menu: string;
  cost: number;
  nutrients: string[];
}

interface Restriction {
  name: string;
  allergies: string[];
  diet: 'normal' | 'vegetarian' | 'vegan';
}

const defaultMenu: MenuItem[] = [
  { day: '월요일', menu: '소불고기 정식', cost: 8500, nutrients: ['단백질', '철분', '비타민B'] },
  { day: '화요일', menu: '등푸른 생선 구이', cost: 9000, nutrients: ['오메가3', '단백질', '칼슘'] },
  { day: '수요일', menu: '해물 파스타', cost: 10000, nutrients: ['단백질', '비타민C', '요오드'] },
  { day: '목요일', menu: '닭가슴살 떼칼국수', cost: 7500, nutrients: ['단백질', '비타민A', '칼'] },
  { day: '금요일', menu: '제육볶음 덮밥', cost: 8000, nutrients: ['단백질', '철분', '비타민D'] },
];

const commonAllergies = ['새우', '생선', '계란', '우유', '견과류', '복숭아', '키위'];
const diets = ['일반식', '채식', '비건'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'menu' | 'restriction'>('menu');
  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>(defaultMenu);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [formData, setFormData] = useState({ name: '', allergies: [] as string[], diet: 'normal' as const });
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const handleAddRestriction = () => {
    if (formData.name.trim()) {
      const newRestriction: Restriction = {
        name: formData.name,
        allergies: selectedAllergies,
        diet: formData.diet === 'normal' ? 'normal' : formData.diet === 'vegetarian' ? 'vegetarian' : 'vegan',
      };
      setRestrictions([...restrictions, newRestriction]);
      setFormData({ name: '', allergies: [], diet: 'normal' });
      setSelectedAllergies([]);
    }
  };

  const handleRemoveRestriction = (index: number) => {
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  const handleAllergyToggle = (allergyName: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyName)
        ? prev.filter((a) => a !== allergyName)
        : [...prev, allergyName]
    );
  };

  const handleDietChange = (value: string) => {
    setFormData({ ...formData, diet: value as 'normal' | 'vegetarian' | 'vegan' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🍽️ 회사 저녁밥 추천봇</h1>
        <p>주간 메뉴 자동 계획 및 직원 식단 관리</p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'menu' ? styles.active : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          📅 주간 메뉴
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'restriction' ? styles.active : ''}`}
          onClick={() => setActiveTab('restriction')}
        >
          ⚠️ 식단 제약사항
        </button>
      </nav>

      <main className={styles.content}>
        {activeTab === 'menu' && (
          <section className={styles.section}>
            <h2>📋 주간 메뉴 계획</h2>
            <p className={styles.description}>월~금 저녁 메뉴가 영양 밸런스와 비용을 고려하여 자동 구성됩니다.</p>
            <div className={styles.menuGrid}>
              {weeklyMenu.map((item, index) => (
                <div key={index} className={styles.menuCard}>
                  <div className={styles.menuDay}>{item.day}</div>
                  <div className={styles.menuName}>{item.menu}</div>
                  <div className={styles.menuCost}>₩{item.cost.toLocaleString()}</div>
                  <div className={styles.nutrients}>
                    {item.nutrients.map((nutrient) => (
                      <span key={nutrient} className={styles.nutrientTag}>
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.summary}>
              <p>
                <strong>주간 총 비용:</strong> ₩
                {weeklyMenu.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
              </p>
            </div>
          </section>
        )}

        {activeTab === 'restriction' && (
          <section className={styles.section}>
            <h2>📋 직원 식단 제약사항 관리</h2>
            <p className={styles.description}>알레르기, 채식 여부 등 식단 제약사항을 관리하여 안전한 식사를 제공합니다.</p>

            <div className={styles.formSection}>
              <h3>새로운 직원 추가</h3>
              <div className={styles.formGroup}>
                <label htmlFor="name">직원명</label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>알레르기 항목</label>
                <div className={styles.checkboxGrid}>
                  {commonAllergies.map((allergyName) => (
                    <label key={allergyName} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedAllergies.includes(allergyName)}
                        onChange={() => handleAllergyToggle(allergyName)}
                      />
                      {allergyName}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="diet">식단 유형</label>
                <select
                  id="diet"
                  value={formData.diet}
                  onChange={(e) => handleDietChange(e.target.value)}
                  className={styles.select}
                >
                  <option value="normal">일반식</option>
                  <option value="vegetarian">채식</option>
                  <option value="vegan">비건</option>
                </select>
              </div>

              <button onClick={handleAddRestriction} className={styles.addButton}>
                추가하기
              </button>
            </div>

            <div className={styles.restrictionList}>
              <h3>등록된 직원 ({restrictions.length}명)</h3>
              {restrictions.length === 0 ? (
                <p className={styles.emptyMessage}>등록된 직원이 없습니다.</p>
              ) : (
                <ul>
                  {restrictions.map((restriction, index) => (
                    <li key={index} className={styles.restrictionItem}>
                      <div className={styles.restrictionHeader}>
                        <strong>{restriction.name}</strong>
                        <span className={styles.dietBadge}>
                          {restriction.diet === 'normal' && '일반식'}
                          {restriction.diet === 'vegetarian' && '채식'}
                          {restriction.diet === 'vegan' && '비건'}
                        </span>
                      </div>
                      {restriction.allergies.length > 0 && (
                        <div className={styles.allergies}>
                          <strong>알레르기:</strong> {restriction.allergies.join(', ')}
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveRestriction(index)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 회사 저녁밥 추천봇 | 구매 효율화 및 직원 건강 관리 시스템</p>
      </footer>
    </div>
  );
}
