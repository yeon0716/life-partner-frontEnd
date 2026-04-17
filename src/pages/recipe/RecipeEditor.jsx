import React, { useEffect, useState } from "react";
import { recipeAPI } from "../../api/recipe/recipeApi";
import { useNavigate } from "react-router-dom";

export default function RecipeEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState(null);

  // 텍스트 추가
  const addTextBlock = () => {
    setBlocks(prev => [
      ...prev,
      {
        blockType: "TEXT",
        content: "",
        sortOrder: prev.length + 1
      }
    ]);
  };

   useEffect(() => {
      fetchCategories()
    }, [])
  
    const fetchCategories = async () => {
      try {
        const res = await recipeAPI.getCategories()
  
        setCategories([
          { categoryId: null, categoryName: '전체' },
          ...(res.data || []),
        ])
      } catch (err) {
        console.error(err)
      }
    }

  // 이미지 추가
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBlocks(prev => [
      ...prev,
      {
        blockType: "IMAGE",
        file,
        content: URL.createObjectURL(file),
        sortOrder: prev.length + 1
      }
    ]);
  };

  // 텍스트 변경
  const handleTextChange = (index, value) => {
    const updated = [...blocks];
    updated[index].content = value;
    setBlocks(updated);
  };
  

  // 등록
  const createRecipe = async () => {
    try {
      // 1. 이미지 업로드 처리
      const processedBlocks = await Promise.all(
        blocks.map(async (block) => {
          if (block.blockType === "IMAGE" && block.file) {
            const res = await recipeAPI.uploadImage(block.file);

            return {
              blockType: "IMAGE",
              content: res.data,
              sortOrder: block.sortOrder
            };
          }

          return {
            blockType: block.blockType,
            content: block.content,
            sortOrder: block.sortOrder
          };
        })
      );

      // 2. JWT 기반 요청 (memberId 제거)
      const payload = {
        title,
        categoryId, 
        blockList: processedBlocks
      };

      if (!categoryId) {
        alert("카테고리 선택하세요");
        return;
      }

      // 3. 등록
      await recipeAPI.create(payload);

      alert("레시피 등록 완료!");
      navigate("/recipe");

    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  return (
  <div className="recipe-editor-container">
    <h2 className="recipe-editor-title">레시피 작성</h2>

    {/* 제목 */}
    <input
      type="text"
      placeholder="제목을 입력하세요"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="recipe-editor-input"
    />

    {/* 카테고리 */}
    <div className="recipe-editor-category">
      {categories.map((cat) => (
        <button
          key={cat.categoryId ?? "all"}
          className={`recipe-editor-category-btn ${
            categoryId === cat.categoryId ? "active" : ""
          }`}
          onClick={() => setCategoryId(cat.categoryId)}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>

    {/* 버튼 영역 */}
    <div className="recipe-editor-actions">
      <button onClick={addTextBlock} className="btn">
        + 텍스트 추가
      </button>

      <label className="btn file-btn">
        이미지 추가
        <input type="file" onChange={handleImageUpload} hidden />
      </label>
    </div>

    {/* 블록 영역 */}
    <div className="recipe-editor-blocks">
      {blocks.map((block, index) => (
        <div key={index} className="recipe-editor-block">
          {block.blockType === "TEXT" ? (
            <textarea
              value={block.content}
              onChange={(e) => handleTextChange(index, e.target.value)}
              className="recipe-editor-textarea"
            />
          ) : (
            <img
              src={block.content}
              alt="preview"
              className="recipe-editor-image"
            />
          )}
        </div>
      ))}
    </div>

    {/* 등록 버튼 */}
    <button onClick={createRecipe} className="recipe-editor-submit">
      등록
    </button>
  </div>
);
}