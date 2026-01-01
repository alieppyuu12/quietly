import Link from 'next/link'
export function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-left">Quietly</div>
      <div className="nav-center">
        <span>Product</span>
        <span>How it works</span>
        <span>Request a demo</span>
      </div>
      <div className="nav-right">
        <Link href="/sign-in">
        <button>Log in</button>
        </Link>

        <Link href="/sign-up">
        <button>Get started</button>
        </Link>

      </div>
    </nav>
  )
}
