import { describe, expect, test } from "@jest/globals";
import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import * as stories from "@/components/elements/BorderdButton/index.stories";

const { Primary } = composeStories(stories);

describe("BorderdButton", () => {
  test("renders correctly", () => {
    render(<Primary />);
    expect(screen.getByText("Button")).toBeTruthy();
  });
});
