import React, { FC } from "react";
import styled from "@emotion/styled";
import { FiX } from "react-icons/fi";
import { Richmd } from "@richmd/react";
// @ts-ignore-next-line
import "@richmd/react/dist/richmd.css";

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
  padding: 0 12px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 40px;

  .richmd {
    font-size: 14px;
  }
`;

interface MarkdownHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarkdownHelpModal: FC<MarkdownHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tableText = `| 列1 | 列2 |
| ---- | ---- |
| A    | B    |
`;

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
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`# 見出し1\n## 見出し2\n### 見出し3`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`# 見出し1\n## 見出し2\n### 見出し3`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
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
                  <Richmd text="**太字のテキスト**" useSlideMode={false} />
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
                  <Richmd text="*斜体のテキスト*" useSlideMode={false} />
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
                  <Richmd text="***太字かつ斜体***" useSlideMode={false} />
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
                  <Richmd text="~~打ち消し線~~" useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>画像</SectionTitle>
            <Description>画像を挿入できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>![画像の説明](画像のURL)</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text="![Example](https://placehold.jp/3d4070/ffffff/80x80.png)"
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>リンク</SectionTitle>
            <Description>リンクを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>[リンクテキスト](https://example.com)</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text="[リンクテキスト](https://example.com)"
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>絵文字</SectionTitle>
            <Description>:emoji_name:の形式で絵文字を挿入できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`:tada: :smile: :rocket:`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd text=":tada: :smile: :rocket:" useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
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
                  <Richmd
                    text={`- 項目1\n- 項目2\n- 項目3`}
                    useSlideMode={false}
                  />
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
                  <Richmd
                    text={`1. 項目1\n2. 項目2\n3. 項目3`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>チェックリスト</SectionTitle>
            <Description>タスクリストを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`- [ ] 未完了タスク\n- [x] 完了タスク`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`- [ ] 未完了タスク\n- [x] 完了タスク`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
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
                  <Richmd text="> 引用テキスト" useSlideMode={false} />
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
                  <Richmd text="---" useSlideMode={false} />
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
                  <Richmd text="`const x = 10;`" useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>コードブロック</SectionTitle>
            <Description>```で囲むとコードブロックを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`\`\`\`javascript\nconst greeting = "Hello";\nconsole.log(greeting);\n\`\`\``}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`\`\`\`javascript\nconst greeting = "Hello";\nconsole.log(greeting);\n\`\`\``}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>テーブル</SectionTitle>
            <Description>|と-を使ってテーブルを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`| 列1 | 列2 |
| ---- | ---- |
| A    | B    |`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd text={tableText} useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>数式ブロック（KaTeX）</SectionTitle>
            <Description>$$で囲むと数式を表示できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`$$
\\frac{a}{b}
$$`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd text={`$$\n\\frac{a}{b}\n$$`} useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>インライン数式</SectionTitle>
            <Description>$で囲むとインラインで数式を表示できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`これは $a=b+c$ です`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd text="これは $a=b+c$ です" useSlideMode={false} />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>カラーブロック</SectionTitle>
            <Description>===で囲むとカラーブロックを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`===info
情報ブロック
===`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`===info\n情報ブロック\n===`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>ドロップダウン</SectionTitle>
            <Description>=&gt;で囲むとドロップダウンを作成できます</Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`=>概要
詳細な内容...
=>`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`=>概要\n詳細な内容...\n=>`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>

          <Section>
            <SectionTitle>動画</SectionTitle>
            <Description>@[movie]()で動画を埋め込めます</Description>
            <CodeBlock>
              <code>{`@[movie](./movie.mp4)`}</code>
            </CodeBlock>
          </Section>

          <Section>
            <SectionTitle>カスタムHTMLタグ</SectionTitle>
            <Description>
              &lt;&gt;で囲むとカスタムHTMLタグを作成できます
            </Description>
            <ExampleGrid>
              <ExampleColumn>
                <ColumnTitle>書き方</ColumnTitle>
                <CodeBlock>
                  <code>{`<>div
カスタムdivタグ
<>`}</code>
                </CodeBlock>
              </ExampleColumn>
              <ExampleColumn>
                <ColumnTitle>表示</ColumnTitle>
                <Result>
                  <Richmd
                    text={`<>div\nカスタムdivタグ\n<>`}
                    useSlideMode={false}
                  />
                </Result>
              </ExampleColumn>
            </ExampleGrid>
          </Section>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default MarkdownHelpModal;
