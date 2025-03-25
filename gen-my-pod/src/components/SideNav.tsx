//this component will be used to display the side navigation bar for the topics
//it will consist of a list of topics that will be displayed in the side nav
//each topic will be a link that will take the user to the respective topic page

import { Link } from 'react-router-dom';
import styled from 'styled-components'

const CustomCard = styled.div`
    min-width: 10%;
    height: fit-content;
`;

const SideNav = () => {
  return (
    <CustomCard className="card">
        <h5>Topics</h5>
        <hr />
        <nav className="side-nav">
            <ul>
                <li>
                    <Link to="/topic1">Topic 1</Link>
                </li>
                <li>
                    <Link to="/topic2">Topic 2</Link>
                </li>
                <li>
                    <Link to="/topic3">Topic 3</Link>
                </li>
            </ul>
        </nav>
    </CustomCard>
  );
};

export default SideNav;