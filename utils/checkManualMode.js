export const checkManualMode = async () => {
    try {
      const serverUrl = "https://brkr-server.onrender.com"; // ← 형님 서버 주소로 바꾸세요  
      const res = await fetch(`${serverUrl}/api/check-manual-mode`);
      const { manual } = await res.json();
      return manual;
    } catch (err) {
      console.error('🔌 서버 연결 실패 (manual mode 확인)', err);
      return false;
    }
  };
  