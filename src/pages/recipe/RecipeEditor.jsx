import React, { useEffect, useState } from "react";
import { recipeAPI } from "../../api/recipe/recipeApi";
import { useNavigate, useParams } from "react-router-dom";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   Sortable Block
========================= */
function SortableBlock({ id, children, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="recipe-editor__block">
      <div className="recipe-editor__drag-handle" {...attributes} {...listeners}>
        ☰
      </div>

      <div className="recipe-editor__block-content">{children}</div>

      <button
        className="recipe-editor__delete"
        onClick={onDelete}
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

/* =========================
   MAIN
========================= */
export default function RecipeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* 기본 */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /* 메타 */
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const [difficulty, setDifficulty] = useState("중");
  const [cookingTime, setCookingTime] = useState("10분");
  const [servings, setServings] = useState("1인분");

  /* 재료 */
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");

  /* 블록 */
  const [blocks, setBlocks] = useState([]);

  /* =========================
     카테고리
  ========================= */
  useEffect(() => {
    recipeAPI.getCategories().then((res) => {
      setCategories([
        { categoryId: null, categoryName: "전체" },
        ...(res.data || [])
      ]);
    });
  }, []);

  /* =========================
     수정 로딩 (핵심 수정)
  ========================= */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await recipeAPI.detail(id);
        const data = res.data;

        console.log(data);

        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategoryId(data.categoryId);

        setDifficulty(data.difficulty || "중");
        setCookingTime(data.cookingTime || "10분");
        setServings(data.servings || "1인분");

        setIngredients(
          (data.ingredientList || []).map(i => i.name || i)
        );

        setBlocks(
          (data.blockList || []).map(b => ({
            id: b.blockId || crypto.randomUUID(),
            blockType: b.blockType,
            content: b.content
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  /* =========================
     블록 추가
  ========================= */
  const addTextBlock = () => {
    setBlocks(prev => [
      ...prev,
      { id: crypto.randomUUID(), blockType: "TEXT", content: "" }
    ]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBlocks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        blockType: "IMAGE",
        file,
        content: URL.createObjectURL(file)
      }
    ]);
  };

  const handleTextChange = (id, value) => {
    setBlocks(prev =>
      prev.map(b =>
        b.id === id ? { ...b, content: value } : b
      )
    );
  };

  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  /* =========================
     재료
  ========================= */
  const addIngredient = (e) => {
    if (e.key === "Enter" && ingredientInput.trim()) {
      setIngredients(prev => [...prev, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  /* =========================
     드래그
  ========================= */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBlocks(items => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* =========================
     저장
  ========================= */
  const saveRecipe = async () => {
    try {
      const processedBlocks = await Promise.all(
        blocks.map(async (b, i) => {
          if (b.blockType === "IMAGE" && b.file) {
            const res = await recipeAPI.uploadImage(b.file);
            return {
              blockType: "IMAGE",
              content: res.data,
              sortOrder: i + 1
            };
          }

          return {
            blockType: b.blockType,
            content: b.content,
            sortOrder: i + 1
          };
        })
      );

      const payload = {
        title,
        description,
        categoryId,
        difficulty,
        cookingTime,
        servings,
        ingredientList: ingredients.map(i => ({
          name: i
        })),
        blockList: processedBlocks
      };

      if (id) {
        await recipeAPI.update(id, payload);
        alert("수정 완료");
      } else {
        await recipeAPI.create(payload);
        alert("등록 완료");
      }

      navigate("/recipe");
    } catch (err) {
      console.error(err);
      alert("실패");
    }
  };

  /* =========================
     UI (건드리지 않음 유지)
========================= */
  return (
    <div className="recipe-editor">

      <h2 className="recipe-editor__title">
        {id ? "레시피 수정" : "레시피 작성"}
      </h2>

      <input
        className="recipe-editor__input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />

      <textarea
        className="recipe-editor__textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명"
      />

      <div className="recipe-editor__category">
        {categories.map((c) => (
          <button
            key={c.categoryId ?? "all"}
            className={`recipe-editor__category-btn ${
              categoryId === c.categoryId
                ? "recipe-editor__category-btn--active"
                : ""
            }`}
            onClick={() => setCategoryId(c.categoryId)}
          >
            {c.categoryName}
          </button>
        ))}
      </div>

      <div className="recipe-editor__options">
        {["1인분","2인분","3인분","4인분 이상"].map(s => (
          <button
            key={s}
            className={`recipe-editor__btn ${servings === s ? "recipe-editor__btn--active":""}`}
            onClick={() => setServings(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="recipe-editor__options">
        {["하","중","상"].map(d => (
          <button
            key={d}
            className={`recipe-editor__btn ${difficulty === d ? "recipe-editor__btn--active":""}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="recipe-editor__options">
        {["10분","30분","1시간","1시간 이상"].map(t => (
          <button
            key={t}
            className={`recipe-editor__btn ${cookingTime === t ? "recipe-editor__btn--active":""}`}
            onClick={() => setCookingTime(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <input
        className="recipe-editor__input"
        value={ingredientInput}
        onChange={(e) => setIngredientInput(e.target.value)}
        onKeyDown={addIngredient}
        placeholder="재료 입력 후 Enter"
      />

      <div className="recipe-editor__tags">
        {ingredients.map((i, idx) => (
          <span key={idx} className="recipe-editor__tag">
            {i}
            <button
              onClick={() =>
                setIngredients(prev => prev.filter((_, x) => x !== idx))
              }
            >
              ×
            </button>
          </span>
        ))}
      </div>

     {/* 블록 버튼 */}
      <div className="recipe-editor__options">
        <button className="recipe-editor__btn" onClick={addTextBlock}>
          + 텍스트
        </button>

        <label className="recipe-editor__btn">
          이미지
          <input type="file" hidden onChange={handleImageUpload} />
        </label>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="recipe-editor__blocks">
            {blocks.map(b => (
              <SortableBlock key={b.id} id={b.id} onDelete={() => deleteBlock(b.id)}>
                {b.blockType === "TEXT" ? (
                  <textarea
                    value={b.content}
                    onChange={(e) => handleTextChange(b.id, e.target.value)}
                  />
                ) : (
                  <img src={b.content} alt="" />
                )}
              </SortableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={saveRecipe}>
        {id ? "수정" : "등록"}
      </button>

    </div>
  );
}