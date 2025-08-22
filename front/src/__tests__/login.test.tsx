import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  };
});

jest.mock("@/context/AuthContext", () => {
  const actual = jest.requireActual("@/context/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: false,
      login: async (u: string, p: string) =>
        u === "standard_user" && p === "password"
          ? ({ ok: true } as const)
          : ({ ok: false, error: "Credenciais inválidas" } as const),
    }),
  };
});

describe("LoginPage", () => {
  it("shows error on wrong credentials", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "nope" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Credenciais inválidas/i
      );
    });
  });

  it("redirects to /home on success", async () => {
    const replace = jest.fn();
    (jest.requireMock("next/navigation") as any).useRouter = () => ({ replace });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "standard_user" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/home");
    });
  });
});
