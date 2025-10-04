"use client";

import { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { User } from "@/lib/api";

const Background = styled.div<{ bgColor?: string }>`
  background: ${(props) => props.bgColor || "#dae2e6"};
  min-height: calc(100vh - 55px);
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Card = styled.div<{ bgColor?: string; textColor?: string }>`
  background: ${(props) => props.bgColor || "white"};
  color: ${(props) => props.textColor || "inherit"};
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Title = styled.h1<{ textColor?: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.textColor || "#111827"};
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ textColor?: string }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.textColor || "#374151"};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  color: #111827;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ColorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ColorInputGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ColorHexInput = styled(Input)`
  max-width: 120px;
`;

const PresetColors = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

const PresetColor = styled.button<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #e5e7eb;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #6366f1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ImageUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagePreviewImg = styled.img`
  height: 100%;
  width: auto;
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

const FileInputLabel = styled.label`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const NoteText = styled.p<{ textColor?: string }>`
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#6b7280"};
  margin: 0;
  opacity: 0.8;
`;

const OpacitySlider = styled.input`
  width: 100%;
  cursor: pointer;
`;

const OpacityLabel = styled.div<{ textColor?: string }>`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${(props) => props.textColor || "#6b7280"};
  margin-top: 4px;
  opacity: 0.8;
`;

type BlogSettingTemplateProps = {
  blogId: number;
  user: User;
};

type Blog = {
  id: number;
  title: string | null;
  description: string | null;
  theme: string | null;
  backgroundImage: string | null;
  backgroundImageKey: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type ThemeConfig = {
  backgroundColor?: string;
  textColor?: string;
  linkColor?: string;
  sectionBackgroundColor?: string;
  backgroundRepeat?: boolean;
};

const PRESET_COLORS = [
  "#ffffff", // 白
  "#000000", // 黒
  "#dae2e6", // 現在のデフォルト
  "#f3f4f6", // グレー
  // 赤系
  "#fee2e2", // 薄い赤
  "#fca5a5", // 赤
  "#ef4444", // 濃い赤
  "#991b1b", // ダークレッド
  // 黄色・オレンジ系
  "#fef3c7", // 薄い黄色
  "#fbbf24", // 黄色
  "#fb923c", // オレンジ
  "#ea580c", // 濃いオレンジ
  // 緑系
  "#d1fae5", // 薄い緑
  "#6ee7b7", // 緑
  "#10b981", // 濃い緑
  "#065f46", // ダークグリーン
  // 青系
  "#dbeafe", // 薄い青
  "#60a5fa", // 青
  "#2563eb", // 濃い青
  "#1e3a8a", // ダークブルー
];

const DEFAULT_THEME: ThemeConfig = {
  backgroundColor: "#dae2e6",
  textColor: "#374151",
  linkColor: "#3b82f6",
  sectionBackgroundColor: "#ffffff",
};

// 16進数カラーコードをRGBAに変換
const hexToRgba = (hex: string, alpha: number): string => {
  // #ffffffdd のような8桁の16進数の場合
  if (hex.length === 9) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // #ffffff のような6桁の16進数の場合
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// RGBAを16進数カラーコードに変換
const rgbaToHex = (rgba: string): { color: string; opacity: number } => {
  if (rgba.startsWith('#')) {
    // 既に16進数の場合
    if (rgba.length === 9) {
      const alpha = parseInt(rgba.slice(7, 9), 16) / 255;
      return { color: rgba.slice(0, 7), opacity: alpha };
    }
    return { color: rgba, opacity: 1 };
  }

  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    const a = match[4] ? parseFloat(match[4]) : 1;
    return { color: `#${r}${g}${b}`, opacity: a };
  }
  return { color: rgba, opacity: 1 };
};

const BlogSettingTemplate: FC<BlogSettingTemplateProps> = ({
  blogId,
  user,
}) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [sectionBgOpacity, setSectionBgOpacity] = useState(1);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/${blogId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setBlog(data.blog);
        setTitle(data.blog.title || `${user.name}のブログ`);
        setDescription(data.blog.description || `${user.name}のブログです。`);

        if (data.blog.theme) {
          try {
            const parsedTheme = JSON.parse(data.blog.theme);
            setTheme(parsedTheme);

            // セクション背景色から不透明度を抽出
            if (parsedTheme.sectionBackgroundColor) {
              const { color, opacity } = rgbaToHex(parsedTheme.sectionBackgroundColor);
              setSectionBgOpacity(opacity);
            }
          } catch {
            setTheme(DEFAULT_THEME);
          }
        } else {
          setTheme(DEFAULT_THEME);
        }

        if (data.blog.backgroundImage) {
          setBackgroundImagePreview(data.blog.backgroundImage);
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, user.name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm("背景画像を削除しますか？")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/${blogId}/background-image`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        // セクション背景色の処理（背景画像がある場合のみ不透明度を含める）
        const sectionBgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
        const { color } = rgbaToHex(sectionBgColor!);

        setTheme({ ...theme, sectionBackgroundColor: color });
        setBackgroundImagePreview(null);
        setBackgroundImageFile(null);
        alert("背景画像を削除しました");
      } else {
        alert("削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("削除に失敗しました");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 背景画像のアップロード
      if (backgroundImageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", backgroundImageFile);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/${blogId}/background-image`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          alert("画像のアップロードに失敗しました");
          return;
        }
        setUploading(false);
      }

      // セクション背景色の処理（背景画像がある場合のみ不透明度を含める）
      const sectionBgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
      const { color } = rgbaToHex(sectionBgColor!);

      // 背景画像が設定されている場合は不透明度込み、ない場合は不透明度100%
      const hasBackgroundImage = backgroundImageFile || backgroundImagePreview;
      let finalSectionBackgroundColor: string;

      if (hasBackgroundImage) {
        const alphaHex = Math.round(sectionBgOpacity * 255).toString(16).padStart(2, '0');
        finalSectionBackgroundColor = `${color}${alphaHex}`;
      } else {
        // 背景画像がない場合は不透明度100%（ff）を設定
        finalSectionBackgroundColor = `${color}ff`;
      }

      const themeToSave = {
        ...theme,
        sectionBackgroundColor: finalSectionBackgroundColor,
      };

      // ブログ情報の更新
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/blogs/${blogId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title || null,
            description: description || null,
            theme: JSON.stringify(themeToSave),
          }),
        }
      );

      if (res.ok) {
        alert("保存しました");
        setBackgroundImageFile(null);
        setTheme(themeToSave);
      } else {
        alert("保存に失敗しました");
      }
    } catch (error) {
      console.error("Failed to save blog", error);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Background>
        <Container>
          <Card>読み込み中...</Card>
        </Container>
      </Background>
    );
  }

  if (!blog || blog.userId !== user.id) {
    return (
      <Background>
        <Container>
          <Card>ブログが見つかりません</Card>
        </Container>
      </Background>
    );
  }

  // セクション背景色を計算（未保存時のプレビュー用）
  const sectionBgColorPreview = (() => {
    const bgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
    if (!bgColor) return "white";

    // 8桁の16進数形式の場合
    if (bgColor.length === 9) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const a = parseInt(bgColor.slice(7, 9), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return bgColor;
  })();

  return (
    <Background bgColor={theme.backgroundColor} style={backgroundImagePreview ? { backgroundImage: `url(${backgroundImagePreview})`, backgroundRepeat: theme.backgroundRepeat ? 'repeat' : 'no-repeat', backgroundSize: theme.backgroundRepeat ? 'auto' : 'cover', backgroundPosition: 'center' } : {}}>
      <Container>
        <Card bgColor={sectionBgColorPreview} textColor={theme.textColor}>
          <Title textColor={theme.textColor}>ブログ設定</Title>
          <Form onSubmit={handleSave}>
            <FormGroup>
              <Label htmlFor="title" textColor={theme.textColor}>ブログタイトル</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ブログのタイトルを入力"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description" textColor={theme.textColor}>ブログ説明</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ブログの説明を入力"
              />
            </FormGroup>

            <FormGroup>
              <Label textColor={theme.textColor}>背景画像</Label>
              <ImageUploadSection>
                {backgroundImagePreview && (
                  <ImagePreview>
                    <ImagePreviewImg src={backgroundImagePreview} alt="Background preview" />
                    <DeleteImageButton type="button" onClick={handleDeleteImage}>
                      削除
                    </DeleteImageButton>
                  </ImagePreview>
                )}
                <FileInputLabel htmlFor="backgroundImage">
                  {backgroundImageFile ? "別の画像を選択" : backgroundImagePreview ? "画像を変更" : "画像をアップロード"}
                </FileInputLabel>
                <HiddenFileInput
                  id="backgroundImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {backgroundImagePreview && (
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      checked={theme.backgroundRepeat || false}
                      onChange={(e) =>
                        setTheme({ ...theme, backgroundRepeat: e.target.checked })
                      }
                    />
                    <span style={{ color: theme.textColor || "#374151" }}>背景画像を繰り返し表示する</span>
                  </CheckboxLabel>
                )}
              </ImageUploadSection>
            </FormGroup>

            <FormGroup>
              <Label textColor={theme.textColor}>背景色</Label>
              {backgroundImagePreview && (
                <NoteText textColor={theme.textColor}>※ 背景画像が設定されている場合、背景画像が優先されます</NoteText>
              )}
              <ColorSection>
                <ColorInputGroup>
                  <ColorInput
                    type="color"
                    value={theme.backgroundColor || DEFAULT_THEME.backgroundColor}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundColor: e.target.value })
                    }
                  />
                  <ColorHexInput
                    type="text"
                    value={theme.backgroundColor || DEFAULT_THEME.backgroundColor}
                    onChange={(e) =>
                      setTheme({ ...theme, backgroundColor: e.target.value })
                    }
                    placeholder="#dae2e6"
                  />
                </ColorInputGroup>
                <PresetColors>
                  {PRESET_COLORS.map((color) => (
                    <PresetColor
                      key={color}
                      color={color}
                      type="button"
                      onClick={() =>
                        setTheme({ ...theme, backgroundColor: color })
                      }
                      title={color}
                    />
                  ))}
                </PresetColors>
              </ColorSection>
            </FormGroup>

            <FormGroup>
              <Label textColor={theme.textColor}>テキストカラー</Label>
              <ColorInputGroup>
                <ColorInput
                  type="color"
                  value={theme.textColor || DEFAULT_THEME.textColor}
                  onChange={(e) =>
                    setTheme({ ...theme, textColor: e.target.value })
                  }
                />
                <ColorHexInput
                  type="text"
                  value={theme.textColor || DEFAULT_THEME.textColor}
                  onChange={(e) =>
                    setTheme({ ...theme, textColor: e.target.value })
                  }
                  placeholder="#374151"
                />
              </ColorInputGroup>
            </FormGroup>

            <FormGroup>
              <Label textColor={theme.textColor}>リンクカラー</Label>
              <ColorInputGroup>
                <ColorInput
                  type="color"
                  value={theme.linkColor || DEFAULT_THEME.linkColor}
                  onChange={(e) =>
                    setTheme({ ...theme, linkColor: e.target.value })
                  }
                />
                <ColorHexInput
                  type="text"
                  value={theme.linkColor || DEFAULT_THEME.linkColor}
                  onChange={(e) =>
                    setTheme({ ...theme, linkColor: e.target.value })
                  }
                  placeholder="#3b82f6"
                />
              </ColorInputGroup>
            </FormGroup>

            <FormGroup>
              <Label textColor={theme.textColor}>ページ内コンテンツの背景色</Label>
              <ColorInputGroup>
                <ColorInput
                  type="color"
                  value={(() => {
                    const bgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
                    const { color } = rgbaToHex(bgColor!);
                    return color;
                  })()}
                  onChange={(e) => {
                    const alphaHex = Math.round(sectionBgOpacity * 255).toString(16).padStart(2, '0');
                    const bgImage = backgroundImageFile || backgroundImagePreview;
                    setTheme({ ...theme, sectionBackgroundColor: `${e.target.value}${bgImage ? alphaHex : ''}` });
                  }}
                />
                <ColorHexInput
                  type="text"
                  value={(() => {
                    const bgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
                    const { color } = rgbaToHex(bgColor!);
                    const bgImage = backgroundImageFile || backgroundImagePreview;

                    if (bgImage) {
                      const alphaHex = Math.round(sectionBgOpacity * 255).toString(16).padStart(2, '0');
                      return `${color}${alphaHex}`;
                    }
                    return color;
                  })()}
                  onChange={(e) => {
                    setTheme({ ...theme, sectionBackgroundColor: e.target.value });
                    // 8桁の16進数から不透明度を抽出
                    if (e.target.value.length === 9) {
                      const alpha = parseInt(e.target.value.slice(7, 9), 16) / 255;
                      setSectionBgOpacity(alpha);
                    }
                  }}
                  placeholder="#ffffffff"
                />
              </ColorInputGroup>
              {backgroundImagePreview && (
                <div style={{ marginTop: "12px" }}>
                  <Label textColor={theme.textColor}>不透明度: {Math.round(sectionBgOpacity * 100)}%</Label>
                  <OpacitySlider
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.01"
                    value={sectionBgOpacity}
                    onChange={(e) => {
                      const newOpacity = parseFloat(e.target.value);
                      setSectionBgOpacity(newOpacity);
                      const bgColor = theme.sectionBackgroundColor || DEFAULT_THEME.sectionBackgroundColor;
                      const { color } = rgbaToHex(bgColor!);
                      const alphaHex = Math.round(newOpacity * 255).toString(16).padStart(2, '0');
                      setTheme({ ...theme, sectionBackgroundColor: `${color}${alphaHex}` });
                    }}
                  />
                  <OpacityLabel textColor={theme.textColor}>
                    <span>透明</span>
                    <span>不透明</span>
                  </OpacityLabel>
                </div>
              )}
              {!backgroundImagePreview && (
                <NoteText style={{ marginTop: "8px" }}>※ 不透明度の調整は背景画像が設定されている場合のみ可能です</NoteText>
              )}
            </FormGroup>

            <ButtonGroup>
              <SaveButton type="submit" disabled={saving || uploading}>
                {uploading ? "アップロード中..." : saving ? "保存中..." : "保存"}
              </SaveButton>
              <CancelButton
                type="button"
                onClick={() => window.history.back()}
              >
                キャンセル
              </CancelButton>
            </ButtonGroup>
          </Form>
        </Card>
      </Container>
    </Background>
  );
};

export default BlogSettingTemplate;
