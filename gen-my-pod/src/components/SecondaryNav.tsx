//secondary nav drills in to the topics and displays the subjects
//it will consist of a list of subjects that will be displayed in the secondary nav
// clicking on a subject will take the user to the respective subject page
import { Link } from 'react-router-dom';

const SecondaryNav = () => {
    return (
        <div className="card">
            <nav className="side-nav">
                <ul>
                    <li>
                        <Link to="/subject1">Subject 1</Link>
                    </li>
                    <li>
                        <Link to="/subject2">Subject 2</Link>
                    </li>
                    <li>
                        <Link to="/subject3">Subject 3</Link>
                    </li>
                </ul>
            </nav>
        </div>
      );
};

export default SecondaryNav;