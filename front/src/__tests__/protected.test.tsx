import React from "react";
import { render } from "@testing-library/react";
import Protected from "@/components/Protected";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("Protected", () => {
  it("renders children when authenticated", () => {
    jest.doMock("@/context/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: true }) }));
    // Re-require after mocking
    const { default: ProtectedAgain } = require("@/components/Protected");
    const { getByText } = render(
      <ProtectedAgain>
        <div>Conteúdo protegido</div>
      </ProtectedAgain>
    );
    expect(getByText(/Conteúdo protegido/)).toBeInTheDocument();
  });

  it("does not render children when not authenticated", () => {
    jest.doMock("@/context/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
    const { default: ProtectedAgain } = require("@/components/Protected");
    const { queryByText } = render(
      <ProtectedAgain>
        <div>Conteúdo protegido</div>
      </ProtectedAgain>
    );
    expect(queryByText(/Conteúdo protegido/)).not.toBeInTheDocument();
  });
});
