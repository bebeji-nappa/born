import { describe, expect, test } from "@jest/globals";
import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import * as stories from "@/features/shared/stories/elements/BorderedButton.stories";

const { Primary } = composeStories(stories);

describe("BorderedButton", () => {
  test("renders correctly", () => {
    render(<Primary />);
    expect(screen.getByText("Button")).toBeTruthy();
  });
});
