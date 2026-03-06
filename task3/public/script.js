async function login() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const text = await res.text();
  if (text === "Login successful") {
    window.location.href = "/dashboard";
  } else {
    document.getElementById("msg").textContent = text;
  }
}

async function register() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const text = await res.text();
  const msg = document.getElementById("msg");
  
  msg.textContent = text;
  msg.style.color = text.toLowerCase().includes("success") ? "green" : "crimson";
}
