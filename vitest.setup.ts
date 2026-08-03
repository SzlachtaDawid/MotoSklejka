import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

HTMLDialogElement.prototype.showModal = vi.fn(function showModal(this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = vi.fn(function close(this: HTMLDialogElement) {
  this.removeAttribute("open");
});

afterEach(() => {
  cleanup();
});
