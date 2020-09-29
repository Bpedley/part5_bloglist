import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import SimpleBlog from "./SimpleBlog";

test("clicking the like button twice calls the event handler twice", () => {
  const blog = {
    title: "How to Build HTML Forms Right: Semantics",
    author: "Audstin",
    likes: 32
  };

  const mockHandler = jest.fn();

  const component = render(<SimpleBlog blog={blog} onClick={mockHandler} />);

  const button = component.container.querySelector(".addLike");

  fireEvent.click(button);
  fireEvent.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
