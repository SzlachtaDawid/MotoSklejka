import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import { signUp } from "../../actions";

vi.mock("../../actions", () => ({
  signUp: vi.fn(),
}));

const signUpMock = vi.mocked(signUp);

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Twoja nazwa"), { target: { value: "Jan Kowalski" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jan@example.com" } });
  fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "supersecret" } });
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("SignUpForm component", () => {
  test("renders name, email, password fields and submit button", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText("Twoja nazwa")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Załóż konto" })).toBeInTheDocument();
  });

  test("shows validation errors and does not call signUp when fields are empty", async () => {
    render(<SignUpForm />);

    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(await screen.findAllByText("Pole wymagane")).toHaveLength(3);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  test("shows a min-length error for a too short password", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText("Hasło"), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(await screen.findByText("Minimum 8 znaków")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  test("submits valid data", async () => {
    signUpMock.mockResolvedValueOnce(undefined);
    render(<SignUpForm />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith({
        name: "Jan Kowalski",
        email: "jan@example.com",
        password: "supersecret",
      }),
    );
    expect(screen.queryByText("Ten email jest już zajęty")).not.toBeInTheDocument();
  });

  test("shows an error under the email field when the email is already taken", async () => {
    signUpMock.mockResolvedValueOnce({ error: "Ten email jest już zajęty" });
    render(<SignUpForm />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(await screen.findByText("Ten email jest już zajęty")).toBeInTheDocument();
  });
});
