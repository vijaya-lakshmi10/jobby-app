import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-header">
        <div className="navbar-sm-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="logo-img"
              alt="website logo"
            />
          </Link>

          <ul className="list-items">
            <li>
              <Link to="/">
                <AiFillHome className="home-icon" />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <BsFillBriefcaseFill className="job-icon" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={onClickLogout}
                className="sm-logout-btn"
              >
                <FiLogOut />
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-lg-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              className="logo-img"
              alt="website logo"
            />
          </Link>
          <ul className="nav-list">
            <li className="nav-list-items">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-list-items">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>
          <button
            type="button"
            onClick={onClickLogout}
            className="lg-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
export default withRouter(Header)
