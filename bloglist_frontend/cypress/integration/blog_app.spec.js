describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const user1 = {
      name: "Egor Kuchin",
      username: "Bpedley",
      password: "secret"
    };

    const user2 = {
      name: "Test user",
      username: "root",
      password: "secret"
    };

    cy.request("POST", "http://localhost:3001/api/users/", user1);
    cy.request("POST", "http://localhost:3001/api/users/", user2);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("[name='username']").type("Bpedley");
      cy.get("[name='password']").type("secret");
      cy.get("#login-btn").click();

      cy.contains("Egor Kuchin logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("[name='username']").type("Bpedley");
      cy.get("[name='password']").type("wrong");
      cy.get("#login-btn").click();

      cy.get(".notification")
        .should("contain", "Wrong username or password")
        .and("have.css", "backgroundColor", "rgb(255, 0, 0)");

      cy.get("html").should("not.contain", "Egor Kuchin logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "Bpedley", password: "secret" });
    });

    it("A blog can be created", function () {
      cy.get("#show-btn").click();
      cy.get("[name='title']").type("Test title");
      cy.get("[name='author']").type("Test user");
      cy.get("[name='url']").type("www.ya.ru");
      cy.get("#create-blog").click();

      cy.contains("a new blog Test title added");
      cy.get("#blogs").contains("Test title Test user");
    });

    describe("and a blogs exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Clipping and Masking in CSS",
          author: "Chris Coyier",
          url: "https://css-tricks.com/clipping-masking-css/",
          likes: 1
        });
        cy.createBlog({
          title: "React",
          author: "Dan Abramov",
          url: "https://reactjs.org/",
          likes: 3
        });
        cy.createBlog({
          title: "How to Build HTML Forms Right",
          author: "Austin",
          url:
            "https://stegosource.com/how-to-build-html-forms-right-semantics/",
          likes: 5
        });
      });

      it("new blog is added to the list of all blogs", function () {
        cy.contains("React Dan Abramov");
      });

      it("user can like a blog", function () {
        cy.contains("React Dan Abramov")
          .find("#showDetails")
          .click()
          .get("#addLike")
          .click()
          .parent()
          .contains("4 likes");
      });

      it("user can delete a blog", function () {
        cy.contains("React Dan Abramov")
          .find("#showDetails")
          .click()
          .get("#deleteBlog")
          .click()
          .get("html")
          .should("not.contain", "React Dan Abramov");
      });

      it("blogs are ordered according to likes", function () {
        cy.get("#blog")
          .first()
          .contains("How to Build HTML Forms Right Austin");

        cy.get("#blog").first().next().contains("React Dan Abramov");

        cy.get("#blog")
          .first()
          .next()
          .next()
          .contains("Clipping and Masking in CSS Chris Coyier");
      });

      describe("logged as a different user", function () {
        beforeEach(function () {
          cy.login({ username: "root", password: "secret" });
        });

        it("can't delete the blog and delete button is missing", function () {
          cy.contains("React Dan Abramov")
            .parent()
            .find("#showDetails")
            .click()
            .parent()
            .parent()
            .should("not.contain", "delete");
        });
      });
    });
  });
});
