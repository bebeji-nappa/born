import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import SignInTemplate from "@/components/features/SignIn";

describe("SignInTemplate", () => {
  test("renders correctly", () => {
    render(<SignInTemplate />);
    expect(screen.getByText("Sign in of GitHub")).toBeTruthy();
  });
});
