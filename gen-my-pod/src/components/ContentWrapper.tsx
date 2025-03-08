// main content page that will consist of three sections- 
// a side nav for topics, a secondary nav for subjects, and a main content area for the content
import SideNav from './SideNav.tsx';
import SecondaryNav from './SecondaryNav.tsx';
import MediaWrapper from './MediaWrapper.tsx';

const ContentWrapper = () => {
  return (
    <div className="main d-flex bg-light">
      <SideNav />
      <SecondaryNav />
      <MediaWrapper />
    </div>
  );
};

export default ContentWrapper;

