import Link from "next/link";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-left">Quietly</div>

      <div className="nav-right">
        <Link href="/sign-in">
          <button>Log in</button>
        </Link>

        <Link href="/sign-up">
          <button className="btn-nav-primary">Get started</button>
        </Link>
      </div>
    </nav>
  );
}
