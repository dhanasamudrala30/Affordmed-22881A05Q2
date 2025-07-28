const API_URL = "http://20.244.56.144/log";

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYWlkaGFuYWxha3NobWkzMDExMjAwM0BnbWFpbC5jb20iLCJleHAiOjE3NTM2ODQxMDgsImlhdCI6MTc1MzY4MzIwOCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjgwYWI1NjFhLWFlMDYtNDQ4ZC05MGMxLWZhM2RjY2NlZmY5NCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNhaSBkaGFuYSBsYWtzaG1pIiwic3ViIjoiZTZkZTU1MjEtMmI3Zi00ZTlmLWE4MGQtNWQ4OTI4NjgxYmFlIn0sImVtYWlsIjoic2FpZGhhbmFsYWtzaG1pMzAxMTIwMDNAZ21haWwuY29tIiwibmFtZSI6InNhaSBkaGFuYSBsYWtzaG1pIiwicm9sbE5vIjoiMjI4ODFhMDVxMiIsImFjY2Vzc0NvZGUiOiJ3UEVmR1oiLCJjbGllbnRJRCI6ImU2ZGU1NTIxLTJiN2YtNGU5Zi1hODBkLTVkODkyODY4MWJhZSIsImNsaWVudFNlY3JldCI6IkdVZEFmUnlNRlZlVVpzYUsifQ.RuuHNPEm1fVCRmevRhoPRrZABgM4N4iD_Cw4Y9L_BJY";

export async function Log(stack, level, pkg, message) {
  const logData = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      console.error("❌ Failed to send log:", await response.text());
    } else {
      console.log("✅ Log sent successfully");
    }
  } catch (err) {
    console.error("🚨 Logging error:", err);
  }
}
