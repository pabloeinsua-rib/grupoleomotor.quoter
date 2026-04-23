async function testEmail() {
  try {
    const res = await fetch('http://localhost:3000/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'pabloeinsua@gmail.com' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log("SUCCESS:", data);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

testEmail();
