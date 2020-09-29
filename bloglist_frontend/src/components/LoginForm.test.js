import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginForm from "./LoginForm";

test("<LoginForm /> updates parent state and calls onSubmit", () => {
  const login = jest.fn();

  const component = render(<LoginForm login={login} />);

  const username = component.container.querySelector("input[name='username']");
  const password = component.container.querySelector("input[name='password']");
  const form = component.container.querySelector("form");

  fireEvent.change(username, { target: { value: "root" } });
  fireEvent.change(password, { target: { value: "testpass" } });
  fireEvent.submit(form);

  expect(login.mock.calls).toHaveLength(1);
  expect(login.mock.calls[0][0]["username"]).toBe("root");
  expect(login.mock.calls[0][0]["password"]).toBe("testpass");
});
