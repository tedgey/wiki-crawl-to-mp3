// main content page that will consist of three sections- 
// a side nav for topics, a secondary nav for subjects, and a main content area for the content
import SideNav from './SideNav';
import SecondaryNav from './SecondaryNav';

const Main = () => {
  return (
    <div className="main d-flex bg-light">
      <SideNav />
      <SecondaryNav />
      <div className="content">
        <h2>Content</h2>
        <p>
          This is the main content area. The content will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default Main;

