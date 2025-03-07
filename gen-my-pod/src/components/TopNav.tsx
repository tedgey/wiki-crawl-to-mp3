//navbar that will be displayed on the top of the page
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

const TopNav = () => {
  return (
    <>
        <nav className="top-nav border bg-light d-flex justify-content-between align-items-center">
            <h3>Gen My Pod</h3>
            <ul className="d-flex justify-content-between align-items-center list-unstyled w-25"> 
                <li className="mr-2">
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
                <li>
                    <button className='bg-black rounded ml-2' onClick={() => googleLogout()}>Logout</button>
                </li>
            </ul>
        </nav>
        <nav className="top-nav border bg-light d-flex justify-content-between align-items-center">

        <ul className="d-flex justify-content-around align-items-center list-unstyled w-25 my-1"> 
            <li className="mr-2">
                <Link to="/">Generate</Link>
            </li>
            <li className="mr-2">
                {/* TODO: my pods should be based on user id */}
                <Link to="/my_pods/">My Pods</Link>
            </li>
            <li>
                <Link to="/global">Global Pods</Link>
            </li>
        </ul>
    </nav>
    </>
    
  );
};

export default TopNav;