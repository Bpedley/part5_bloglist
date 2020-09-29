import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  let component;

  const blog = {
    title: "How to Build HTML Forms Right: Semantics",
    url: "https:w//stegosource.com/how-to-build-html-forms-right-semantics/",
    author: "Audstin",
    likes: 32,
    user: {
      name: "root"
    }
  };

  const user = {
    name: "root"
  };

  beforeEach(() => {
    component = render(<Blog blog={blog} user={user} />);
  });

  test("component displays title and author, but does not render its url and likes by default", () => {
    expect(component.container).toHaveTextContent("Audstin");
    expect(component.container).not.toHaveTextContent(32);
    expect(component.container).toHaveTextContent(
      "How to Build HTML Forms Right: Semantics"
    );
    expect(component.container).not.toHaveTextContent(
      "https://stegosource.com/how-to-build-html-forms-right-semantics/"
    );
  });

  test("url and number of likes are shown when the button has been clicked", () => {
    const button = component.container.querySelector(".showDetails");

    fireEvent.click(button);

    expect(button).toHaveTextContent("hide");
    expect(component.container).toHaveTextContent(32);
    expect(component.container).toHaveTextContent(
      "https://stegosource.com/how-to-build-html-forms-right-semantics/"
    );
  });
});
