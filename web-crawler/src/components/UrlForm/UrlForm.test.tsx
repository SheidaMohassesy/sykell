import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UrlForm from "./UrlForm";

describe("UrlForm", () => {
  it("renders input and button", () => {
    render(<UrlForm onSubmit={jest.fn()} />);
    expect(
      screen.getByPlaceholderText(/enter a website url/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /analyze/i })
    ).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed url when form is submitted", () => {
    const handleSubmit = jest.fn();
    render(<UrlForm onSubmit={handleSubmit} />);
    const input = screen.getByPlaceholderText(/enter a website url/i);
    fireEvent.change(input, { target: { value: "  https://example.com  " } });
    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));
    expect(handleSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("does not call onSubmit if input is empty", () => {
    const handleSubmit = jest.fn();
    render(<UrlForm onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
