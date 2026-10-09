import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiLogOut, FiUser, FiLinkedin, FiGithub } from 'react-icons/fi';

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <footer className="bg-bg-surface border-t border-border-base pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light mb-4">
              TurfBook
            </h2>
            <p className="text-text-muted mb-6 max-w-md">
              India's premium sports venue booking platform. We connect sports enthusiasts with the best facilities in their city for a seamless playing experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/bollam-praveen/" className="text-text-muted hover:text-primary transition-colors">
                <FiLinkedin className="text-xl" />
              </a>
              <a href="https://github.com/praveen6235" className="text-text-muted hover:text-primary transition-colors">
                <FiGithub className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text-muted hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-text-muted hover:text-primary transition-colors">Find Turfs</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="text-text-muted hover:text-primary transition-colors text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-text-muted hover:text-primary transition-colors">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-text-muted hover:text-primary transition-colors">Sign up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiPhone className="text-primary mt-1 mr-3 shrink-0" />
                <span className="text-text-muted">+91 9391452521</span>
              </li>
              <li className="flex items-start">
                <FiMail className="text-primary mt-1 mr-3 shrink-0" />
                <span className="text-text-muted">praveenbollam9550@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-base pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} TurfBook. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-text-base transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text-base transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
