import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TripModal from "./TripModal";

vi.mock("../../actions", () => ({
  createTrip: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const onClose = vi.fn();

const location = {
  lat: 10,
  lng: 5,
};

describe("TripModal component", () => {
  test("renders copy and close dialog", () => {
    render(<TripModal location={location} isOpen={true} onClose={onClose} />);

    expect(screen.getByRole("heading", { level: 3, name: "Zaplanuj wyjazd" })).toBeInTheDocument();
    expect(screen.getByText(/Współrzędne startu/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zamknij dialog" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zaplanuj" })).toBeInTheDocument();

    screen.getByRole("button", { name: "Zamknij dialog" }).click();
    expect(onClose).toHaveBeenCalled();
  });
});
