import React, { useState } from "react";
import { recipeAPI } from "../../api/recipe/recipeApi";

export default function RecipeEditor() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);

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
        blockList: processedBlocks
      };

      // 3. 등록
      await recipeAPI.create(payload);

      alert("레시피 등록 완료!");
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <h2>레시피 작성</h2>

      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <button onClick={addTextBlock}>+ 텍스트 추가</button>
      <input type="file" onChange={handleImageUpload} />

      <div style={{ marginTop: "20px" }}>
        {blocks.map((block, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            {block.blockType === "TEXT" ? (
              <textarea
                value={block.content}
                onChange={(e) => handleTextChange(index, e.target.value)}
                style={{ width: "100%", height: "80px" }}
              />
            ) : (
              <img src={block.content} alt="preview" style={{ width: "100%" }} />
            )}
          </div>
        ))}
      </div>

      <button onClick={createRecipe} style={{ marginTop: "20px" }}>
        등록
      </button>
    </div>
  );
}