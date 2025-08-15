import { createContext, useContext, useState, useEffect } from "react";

const ResetPasswordContext = createContext();

export function ResetPasswordProvider({ children }) {
    const [emailForReset, setEmailForResetState] = useState("");
    const [codeForReset, setCodeForResetState] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("emailForReset");
    const savedCode = localStorage.getItem("codeForReset");
    if (savedCode) {
        setCodeForResetState(savedCode);
    }
    if (savedEmail) {
      setEmailForResetState(savedEmail);
    }
  }, []);

  const setEmailForReset = (email) => {
    setEmailForResetState(email);
    if (email) {
      localStorage.setItem("emailForReset", email);
    } else {
      localStorage.removeItem("emailForReset");
    }
  };

  const setCodeForReset = (code) => {
    setCodeForResetState(code);
    if (code) {
      localStorage.setItem("codeForReset", code);
    } else {
      localStorage.removeItem("codeForReset");
    }
  };

  return (
    <ResetPasswordContext.Provider value={{ emailForReset, setEmailForReset, codeForReset, setCodeForReset }}>
      {children}
    </ResetPasswordContext.Provider>
  );
}

export function useResetPassword() {
  return useContext(ResetPasswordContext);
}
