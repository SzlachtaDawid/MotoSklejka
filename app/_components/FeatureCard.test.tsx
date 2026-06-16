import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import FeatureCard from "./FeatureCard";

test("renders title and description", () => {
  render(<FeatureCard title="Mapa tras" description="Opis funkcji mapy." />);

  expect(screen.getByRole("heading", { level: 2, name: "Mapa tras" })).toBeInTheDocument();
  expect(screen.getByText("Opis funkcji mapy.")).toBeInTheDocument();
});

test("renders action link when provided", () => {
  render(
    <FeatureCard
      title="Mapa tras"
      description="Opis funkcji mapy."
      actionLabel="Otwórz mapę"
      actionHref="/map"
    />,
  );

  const link = screen.getByRole("link", { name: "Otwórz mapę" });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/map");
});

test("does not render action link when not provided", () => {
  render(<FeatureCard title="O projekcie" description="Opis projektu." />);

  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
