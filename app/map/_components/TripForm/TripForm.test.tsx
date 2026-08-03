import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TripForm from "./TripForm";
import { createTrip } from "../../actions";

vi.mock("../../actions", () => ({
  createTrip: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const createTripMock = vi.mocked(createTrip);

const location = { lat: 52.0693, lng: 19.4803 };

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Data i godzina startu"), { target: { value: "2026-08-10T10:00" } });
  fireEvent.change(screen.getByLabelText("Cel podróży"), { target: { value: "Bieszczady" } });
  fireEvent.change(screen.getByLabelText("Szacowany czas trwania (np. weekend, 3 dni)"), {
    target: { value: "weekend" },
  });
  fireEvent.change(screen.getByLabelText("Planowany dystans (km)"), { target: { value: "250" } });
  fireEvent.change(screen.getByLabelText("Liczebność grupy"), { target: { value: "5" } });
  fireEvent.click(screen.getByLabelText("Naked"));
  fireEvent.click(screen.getByLabelText("Sportowy"));
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("TripForm component", () => {
  test("renders all fields", () => {
    render(<TripForm location={location} onSuccess={vi.fn()} />);

    expect(screen.getByLabelText("Data i godzina startu")).toBeInTheDocument();
    expect(screen.getByLabelText("Cel podróży")).toBeInTheDocument();
    expect(screen.getByLabelText("Szacowany czas trwania (np. weekend, 3 dni)")).toBeInTheDocument();
    expect(screen.getByLabelText("Planowany dystans (km)")).toBeInTheDocument();
    expect(screen.getByLabelText("Powrót do punktu startu")).toBeInTheDocument();
    expect(screen.getByLabelText("Liczebność grupy")).toBeInTheDocument();
    expect(screen.getByLabelText("Naked")).toBeInTheDocument();
    expect(screen.getByLabelText("Sportowy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zaplanuj" })).toBeInTheDocument();
  });

  test("shows validation errors and does not submit when fields are empty", async () => {
    render(<TripForm location={location} onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Zaplanuj" }));

    expect(await screen.findAllByText("Pole wymagane")).not.toHaveLength(0);
    expect(screen.getByText("Wybierz przynajmniej jeden typ")).toBeInTheDocument();
    expect(screen.getByText("Wybierz przynajmniej jeden styl")).toBeInTheDocument();
    expect(createTripMock).not.toHaveBeenCalled();
  });

  test("submits valid data and calls onSuccess", async () => {
    createTripMock.mockResolvedValueOnce({ success: true });
    const onSuccess = vi.fn();
    render(<TripForm location={location} onSuccess={onSuccess} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Zaplanuj" }));

    await waitFor(() => expect(createTripMock).toHaveBeenCalledTimes(1));
    expect(createTripMock).toHaveBeenCalledWith(
      expect.objectContaining({
        startDateTime: "2026-08-10T10:00",
        destination: "Bieszczady",
        estimatedDuration: "weekend",
        estimatedDistanceKm: "250",
        groupSize: "5",
        motorcycleTypes: ["naked"],
        ridingStyle: ["sportowy"],
        location,
      }),
    );
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test("shows server error and does not call onSuccess", async () => {
    createTripMock.mockResolvedValueOnce({ error: "Możesz zaplanować maksymalnie 2 wyjazdy na ten dzień" });
    const onSuccess = vi.fn();
    render(<TripForm location={location} onSuccess={onSuccess} />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Zaplanuj" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Możesz zaplanować maksymalnie 2 wyjazdy na ten dzień");
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
