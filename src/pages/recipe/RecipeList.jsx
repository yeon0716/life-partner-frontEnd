import React, { useEffect, useState } from "react";
import { recipeAPI } from "../../api/recipe/recipeApi";

const RecipeList = () => {

  const [recipes, setRecipes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  // =========================
  // 🔥 리스트 조회
  // =========================
  const fetchRecipes = async (p = page, k = keyword) => {
    try {
      const res = await recipeAPI.list(p, size, k);

      console.log(res.data);

      // 👉 서버가 리스트만 주는 경우
      setRecipes(res.data.list || res.data);

      // 👉 서버가 totalPages 주는 경우 대비
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error("리스트 조회 실패", err);
    }
  };

  // page 변경 시 자동 조회
  useEffect(() => {
    fetchRecipes(page, keyword);
  }, [page]);

  // 검색
  const handleSearch = () => {
    setPage(1);
    fetchRecipes(1, keyword);
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* 검색 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="레시피 검색"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 리스트 */}
      <div style={{ display: "grid", gap: "15px" }}>

        {recipes.length === 0 ? (
          <p>데이터 없음</p>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.recipeId}
              style={{
                display: "flex",
                gap: "15px",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() =>
                window.location.href = `/recipe/${recipe.recipeId}`
              }
            >
              <img
                src={recipe.thumbnailUrl || "/images/default.png"}
                alt="thumbnail"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              <div>
                <h3>{recipe.title}</h3>
                <p>작성자: {recipe.memberId}</p>
                <p>
                  {recipe.createdAt &&
                    new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이징 */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          이전
        </button>

        <span style={{ margin: "0 10px" }}>
          {page} / {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) => (p < totalPages ? p + 1 : p))
          }
          disabled={page >= totalPages}
        >
          다음
        </button>
      </div>

    </div>
  );
};

export default RecipeList;