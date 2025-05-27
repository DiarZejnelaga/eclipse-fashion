// src/pages/_app.js or _app.tsx

import '../styles/globals.css'; // Or your global stylesheet
import { AuthProvider } from '../context/AuthContext'; // <<< VERIFY THIS PATH

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>  {/* AuthProvider wraps everything */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;