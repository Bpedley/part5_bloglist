import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";

test("<BlogForm /> calls the event handler it received as props with the right details when a new blog is created", () => {
  const mockHandler = jest.fn();

  const component = render(<BlogForm createBlog={mockHandler} />);

  const title = component.container.querySelector("input[name='title']");
  const author = component.container.querySelector("input[name='author']");
  const url = component.container.querySelector("input[name='url']");
  const form = component.container.querySelector("form");

  fireEvent.change(title, { target: { value: "Test title" } });
  fireEvent.change(author, { target: { value: "Test User" } });
  fireEvent.change(url, { target: { value: "www.ya.ru" } });
  fireEvent.submit(form);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]["title"]).toBe("Test title");
  expect(mockHandler.mock.calls[0][0]["author"]).toBe("Test User");
  expect(mockHandler.mock.calls[0][0]["url"]).toBe("www.ya.ru");
});
