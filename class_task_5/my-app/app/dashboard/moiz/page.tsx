"use client";
import { useState, useEffect } from "react";
export default function ClientComponent() {
  const [data, setData] = useState("");
  useEffect(() => {
    // Simulate fetching data on the client
    setTimeout(() => {
      setData("Abdul Moiz (23i-0624)!");
    }, 5000);
  }, []);

  return (
    <div>
      <h1>Client Side Rendering Example</h1>
      {data ? <p>{data}</p> : <p>Loading...........................</p>}
      <h1>Client Side Rendering Example</h1>
    </div>
  );
}