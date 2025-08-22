import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "@/app/home/page";

jest.mock("@/components/Header", () => () => <div />);
jest.mock("@/components/Footer", () => () => <div />);

// Mock Protected to bypass routing
jest.mock("@/components/Protected", () => ({ children }: any) => <>{children}</>);

jest.mock("@/context/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: true }) }));

// Mock next/navigation useSearchParams to control ?q
let currentQ = "";
jest.mock("next/navigation", () => {
  return {
    useSearchParams: () => ({
      get: (key: string) => (key === "q" ? currentQ : null),
      toString: () => (currentQ ? `q=${currentQ}` : ""),
    }),
  } as any;
});

describe("HomePage filters", () => {
  it("filters by search query", () => {
    currentQ = "iphone 11";
    render(<HomePage />);
    const cards = screen.getAllByText(/Apple iPhone/i);
    expect(cards.some((el) => /11/.test(el.textContent || ""))).toBe(true);
  });

  it("sorts by price ascending and descending", () => {
    render(<HomePage />);

    const select = screen.getByLabelText(/ordenação/i);

    // ascending
    fireEvent.change(select, { target: { value: "price_asc" } });
    const pricesAsc = screen
      .getAllByText(/^\$/)
      .map((el) => Number((el.textContent || "").replace("$", "")));
    const sortedAsc = [...pricesAsc].sort((a, b) => a - b);
    expect(pricesAsc).toEqual(sortedAsc);

    // descending
    fireEvent.change(select, { target: { value: "price_desc" } });
    const pricesDesc = screen
      .getAllByText(/^\$/)
      .map((el) => Number((el.textContent || "").replace("$", "")));
    const sortedDesc = [...pricesDesc].sort((a, b) => b - a);
    expect(pricesDesc).toEqual(sortedDesc);
  });

  it("sorts by name A→Z and Z→A", () => {
    render(<HomePage />);

    const select = screen.getByLabelText(/ordenação/i);

    fireEvent.change(select, { target: { value: "name_asc" } });
    const namesAsc = screen
      .getAllByRole("heading", { level: 3 })
      .map((el) => el.textContent || "");
    const sortedAsc = [...namesAsc].sort((a, b) => a.localeCompare(b));
    expect(namesAsc).toEqual(sortedAsc);

    fireEvent.change(select, { target: { value: "name_desc" } });
    const namesDesc = screen
      .getAllByRole("heading", { level: 3 })
      .map((el) => el.textContent || "");
    const sortedDesc = [...namesDesc].sort((a, b) => b.localeCompare(a));
    expect(namesDesc).toEqual(sortedDesc);
  });
});
