import React from "react";
import { render, screen } from "@testing-library/react";
import UrlTable from "./UrlTable";

const mockData = {
  id: 1,
  page_title: "Test Page",
  html_version: "HTML5",
  internal_links: 5,
  external_links: 3,
  login_form_found: true,
  broken_links: 2,
  heading_count: {
    h1: 1,
    h2: 2,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  },
};

jest.mock("../../hooks/useIsMobile", () => jest.fn(() => false));

describe("UrlTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  it("renders 'No URL is given' when data is null", () => {
    render(<UrlTable data={null} />);
    expect(screen.getByText(/no url is given/i)).toBeInTheDocument();
  });

  it("renders table with correct data (desktop)", () => {
    render(<UrlTable data={mockData} />);
    expect(screen.getByText("Test Page")).toBeInTheDocument();
    expect(screen.getByText("HTML5")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("yes")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("H1: 1")).toBeInTheDocument();
    expect(screen.getByText("H2: 2")).toBeInTheDocument();
  });

  it("renders mobile table layout when isMobile is true", () => {
    const useIsMobile = require("../../hooks/useIsMobile");
    useIsMobile.mockReturnValue(true);
    render(<UrlTable data={mockData} />);
    expect(screen.getByText("Test Page")).toBeInTheDocument();
    expect(screen.getByText("HTML5")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("yes")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("H1: 1")).toBeInTheDocument();
    expect(screen.getByText("H2: 2")).toBeInTheDocument();
  });
});
