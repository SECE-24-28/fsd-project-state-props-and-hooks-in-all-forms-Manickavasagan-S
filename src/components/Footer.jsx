import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} CollegeHub. All rights reserved.</div>

        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <NavLink to="/privacy" style={{color:'#fff',textDecoration:'none'}}>Privacy</NavLink>
          <span style={{opacity:0.6}}>·</span>
          <NavLink to="/contact" style={{color:'#fff',textDecoration:'none'}}>Contact</NavLink>
          <span style={{opacity:0.6}}>·</span>
          <span>Email: info@collegehub.com</span>
        </div>
      </div>
    </footer>
  )
}
