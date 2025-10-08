"use client";
import React, { FC, useState, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import { search } from "node-emoji";
import { Virtuoso } from "react-virtuoso";

const Container = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 360px;
  max-height: 400px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;

  &:focus {
    border-bottom-color: #000000;
  }
`;

const EmojiGridContainer = styled.div`
  flex: 1;
  max-height: 300px;
  padding: 8px 0;
`;

const EmojiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 0 12px;
`;

const EmojiButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  font-size: 24px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const EmptyMessage = styled.div`
  padding: 32px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

interface EmojiPickerProps {
  onEmojiSelect: (emojiName: string) => void;
  onClose: () => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const emojis = useMemo(() => {
    let results: Array<{ emoji: string; name: string }> = search("");

    if (searchQuery) {
      results = search(searchQuery);
    }

    return results; // No limit - virtualization handles all emojis
  }, [searchQuery, activeCategory]);

  // Group emojis into rows of 8
  const emojiRows = useMemo(() => {
    const rows: Array<Array<{ emoji: string; name: string }>> = [];
    for (let i = 0; i < emojis.length; i += 8) {
      rows.push(emojis.slice(i, i + 8));
    }
    return rows;
  }, [emojis]);

  const handleEmojiClick = useCallback(
    (emojiName: string) => {
      onEmojiSelect(emojiName);
      onClose();
    },
    [onEmojiSelect, onClose],
  );

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <SearchInput
        type="text"
        placeholder="絵文字を検索する"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />
      {emojiRows.length > 0 ? (
        <EmojiGridContainer>
          <Virtuoso
            style={{ height: "280px" }}
            totalCount={emojiRows.length}
            itemContent={(rowIndex) => {
              const row = emojiRows[rowIndex];
              return (
                <EmojiRow>
                  {row.map((emoji) => (
                    <EmojiButton
                      type="button"
                      key={emoji.name}
                      onClick={() => handleEmojiClick(emoji.name)}
                      title={`:${emoji.name}:`}
                    >
                      {emoji.emoji}
                    </EmojiButton>
                  ))}
                </EmojiRow>
              );
            }}
          />
        </EmojiGridContainer>
      ) : (
        <EmptyMessage>絵文字が見つかりませんでした</EmptyMessage>
      )}
    </Container>
  );
};

export default EmojiPicker;
