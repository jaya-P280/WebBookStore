function showMessage(element, message, color = "black") {
  element.textContent = message;
  element.style.color = color;
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageBox = document.getElementById("message");
    showMessage(messageBox, "Login Successful!","Green");

    if (!username || !password) {
      showMessage(messageBox, "⚠️ Please enter both username and password.", "red");
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(messageBox, data.message || "❌ Invalid credentials.", "red");
        return;
      }

      localStorage.setItem("token", data.token);
      showMessage(messageBox, "✅ Login successful! Redirecting...", "green");
      setTimeout(() => (window.location.href = "books.html"), 1200);
    } catch (err) {
      console.error(err);
      showMessage(messageBox, "⚠️ Server error. Please try again later.", "red");
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageBox = document.getElementById("message");
    showMessage(messageBox, "User Registered Successful!","Green");

    if (!username || !password ||!email) {
      showMessage(messageBox, "⚠️ Please fill in all fields.", "red");
      return;
    }

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password ,email}),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(messageBox, data.message || "❌ Registration failed.", "red");
        return;
      }

      showMessage(messageBox, "✅ Registration successful! Redirecting...", "green");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } catch (err) {
      console.error(err);
      showMessage(messageBox, "⚠️ Server error. Please try again later.", "red");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logoutBtn");
  const bookContainer = document.getElementById("bookContainer");

  if (!bookContainer) return;

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function fetchBooks() {
    try {
      const res = await fetch("/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch books");

      const books = await res.json();
      if (!books.length) {
        bookContainer.innerHTML = `<p>No books available yet 📖</p>`;
        return;
      }

      bookContainer.innerHTML = books
        .map(
          (book) => `
          <div class="book-card">
          <img src="${book.cover || 'placeholder.jpg'}" alt="${book.title}" />
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Published:</strong> ${book.year || "Unknown"}</p>
            <a href="${book.url || '#'}" target="_blank">More Info</a> 
          </div>
        `
        )
        .join("");
    } catch (err) {
      console.error(err);
      bookContainer.innerHTML = `<p style="color:red;">⚠️ Error loading books. Please try again later.</p>`;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  fetchBooks();
});
