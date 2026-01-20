"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <div className="auth-form-wrapper">
            <SignIn />
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <a href="/sign-up" className="auth-link">
                Create one
              </a>
            </p>
          </div>
        </div>

        <div className="auth-background">
          <div className="auth-blob auth-blob-1"></div>
          <div className="auth-blob auth-blob-2"></div>
        </div>
      </div>
    </div>
  );
}
