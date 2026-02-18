import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import SignIn from "@/features/signin/components/views/SignIn";

describe("SignIn", () => {
  test("renders correctly", () => {
    render(<SignIn />);
    expect(screen.getByText("Sign in of GitHub")).toBeTruthy();
  });
});
