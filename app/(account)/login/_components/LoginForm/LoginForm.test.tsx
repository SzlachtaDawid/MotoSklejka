import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { signIn } from "next-auth/react";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const signInMock = vi.mocked(signIn);

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jan@example.com" } });
  fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "supersecret" } });
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm component", () => {
  test("renders email, password fields and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zaloguj" })).toBeInTheDocument();
  });

  test("shows validation errors and does not call signIn when fields are empty", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(await screen.findAllByText("Pole wymagane")).toHaveLength(2);
    expect(signInMock).not.toHaveBeenCalled();
  });

  test("submits valid credentials", async () => {
    // @ts-expect-error - only the fields the component reads are relevant for this test
    signInMock.mockResolvedValueOnce({ error: undefined });
    render(<LoginForm />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Zaloguj" }));

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "jan@example.com",
        password: "supersecret",
        redirect: false,
      })
    );
    expect(screen.queryByText("Nieprawidłowy email lub hasło")).not.toBeInTheDocument();
  });

  test("shows an error under the password field when credentials are invalid", async () => {
    // @ts-expect-error - only the fields the component reads are relevant for this test
    signInMock.mockResolvedValueOnce({ error: "CredentialsSignin" });
    render(<LoginForm />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(await screen.findByText("Nieprawidłowy email lub hasło")).toBeInTheDocument();
  });
});
