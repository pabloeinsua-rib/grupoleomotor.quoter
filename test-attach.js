async function testNotification() {
  const formData = new FormData();
  formData.append('to', 'pabloeinsua@gmail.com');
  formData.append('subject', 'Prueba Adjunto por Pablo');
  formData.append('body', 'Comprobando que el sistema de adjuntos no colapse en la conversión a base64.');
  
  // Dummy file buffer for form data (using Blob)
  const fileBlob = new Blob(['Hello World text file content'], { type: 'text/plain' });
  formData.append('files', fileBlob, 'adjunto.txt');

  try {
    const res = await fetch('http://localhost:3000/api/email/send-notification', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log("SUCCESS:", data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

testNotification();
