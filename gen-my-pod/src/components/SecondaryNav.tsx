//secondary nav drills in to the topics and displays the subjects
//it will consist of a list of subjects that will be displayed in the secondary nav
// clicking on a subject will take the user to the respective subject page
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const CustomCard = styled.div`
    min-width: 10%;
    height: fit-content;
`;

const SecondaryNav = () => {
    return (
        <CustomCard className="card">
            <div className="d-flex justify-content-between">
                <h5>Subjects</h5>
                <a className='clickable'>x</a>
            </div>
            
            <hr />
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
        </CustomCard>
    );
};

export default SecondaryNav;