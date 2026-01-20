"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpForm() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Create account</h1>
            <p>Start your writing journey today</p>
          </div>

          <div className="auth-form-wrapper">
            <SignUp signInUrl="/sign-in" />
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <a href="/sign-in" className="auth-link">
                Sign in
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
