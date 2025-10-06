import React, { FC } from "react";
import styled from "@emotion/styled";
import { FiX } from "react-icons/fi";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.6;
`;

const CodeBlock = styled.pre`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;

  code {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    color: #374151;
  }
`;

const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ExampleColumn = styled.div``;

const ColumnTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Result = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  del {
    text-decoration: line-through;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  }

  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 12px;
    margin: 0;
    color: #6b7280;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 12px 0;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 24px;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

interface MarkdownHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarkdownHelpModal: FC<MarkdownHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Markdownの書き方</Title>
          <CloseButton onClick={onClose} aria-label="閉じる">
            <FiX />
          </CloseButton>
        </Header>
        <Content>
          <Section>
            <SectionTitle>見出し</SectionTitle>
            <Description>#の数で見出しレベルを指定できます（1〜6）</Description>
            <CodeBlock>
              <code>{`# 見出し1\n## 見出し2\n### 見出し3\n#### 見出し4\n##### 見出し5\n###### 見出し6`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>太字</SectionTitle>
            <Description>テキストを**で囲むと太字になります</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>**太字のテキスト**</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <strong>太字のテキスト</strong>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>斜体</SectionTitle>
            <Description>テキストを*で囲むと斜体になります</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>*斜体のテキスト*</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <em>斜体のテキスト</em>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>太字 + 斜体</SectionTitle>
            <Description>
              テキストを***で囲むと太字かつ斜体になります
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>***太字かつ斜体***</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <strong>
                    <em>太字かつ斜体</em>
                  </strong>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>打ち消し線</SectionTitle>
            <Description>
              テキストを~~で囲むと打ち消し線が引かれます
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>~~打ち消し線~~</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <del>打ち消し線</del>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>画像</SectionTitle>
            <Description>画像を挿入できます</Description>
            <CodeBlock>
              <code>![画像の説明](画像のURL)</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>リンク</SectionTitle>
            <Description>リンクを作成できます</Description>
            <CodeBlock>
              <code>[リンクテキスト](https://example.com)</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>リスト（箇条書き）</SectionTitle>
            <Description>
              -で始めることで箇条書きリストを作成できます
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`- 項目1\n- 項目2\n- 項目3`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <ul>
                    <li>項目1</li>
                    <li>項目2</li>
                    <li>項目3</li>
                  </ul>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>番号付きリスト</SectionTitle>
            <Description>
              数字と.で始めることで番号付きリストを作成できます
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`1. 項目1\n2. 項目2\n3. 項目3`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <ol>
                    <li>項目1</li>
                    <li>項目2</li>
                    <li>項目3</li>
                  </ol>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>チェックリスト</SectionTitle>
            <Description>タスクリストを作成できます</Description>
            <CodeBlock>
              <code>{`- [ ] 未完了タスク\n- [x] 完了タスク`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>引用</SectionTitle>
            <Description>
              &gt;で始めることで引用ブロックを作成できます
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>&gt; 引用テキスト</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <blockquote>引用テキスト</blockquote>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>水平線</SectionTitle>
            <Description>---で水平線を引けます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>---</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <hr />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>インラインコード</SectionTitle>
            <Description>
              バッククォート`で囲むとインラインコードになります
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`\`const x = 10;\``}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <code>const x = 10;</code>
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>コードブロック</SectionTitle>
            <Description>```で囲むとコードブロックを作成できます</Description>
            <CodeBlock>
              <code>{`\`\`\`javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n\`\`\``}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>テーブル</SectionTitle>
            <Description>|と-を使ってテーブルを作成できます</Description>
            <CodeBlock>
              <code>{`| ヘッダー1 | ヘッダー2 | ヘッダー3 |
| -------- | -------- | -------- |
| セル1    | セル2    | セル3    |
| セル4    | セル5    | セル6    |`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>数式ブロック（KaTeX）</SectionTitle>
            <Description>$$で囲むと数式を表示できます</Description>
            <CodeBlock>
              <code>{`$$
\\frac{a}{b}
$$`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>インライン数式</SectionTitle>
            <Description>$で囲むとインラインで数式を表示できます</Description>
            <CodeBlock>
              <code>{`これは $a=b+c$ です`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>カラーブロック</SectionTitle>
            <Description>===で囲むとカラーブロックを作成できます</Description>
            <CodeBlock>
              <code>{`===
デフォルトのカラーブロック
===

===info
情報ブロック
===

===success
成功ブロック
===

===warning
警告ブロック
===

===danger
危険ブロック
===`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>ドロップダウン</SectionTitle>
            <Description>:&gt;で囲むとドロップダウンを作成できます</Description>
            <CodeBlock>
              <code>{`:>概要
詳細な内容...
:>`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>動画</SectionTitle>
            <Description>HTML5動画タグを使って動画を埋め込めます</Description>
            <CodeBlock>
              <code>{`@[movie](./movie.mp4)`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>カスタムHTMLタグ</SectionTitle>
            <Description>::で囲むとカスタムHTMLタグを作成できます</Description>
            <CodeBlock>
              <code>{`::div
カスタムdivタグ
::

::article.className
クラス付きarticleタグ
::

::.className
クラス名のみ（spanタグ）
::`}</code>
            </CodeBlock>
          </Section>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default MarkdownHelpModal;
