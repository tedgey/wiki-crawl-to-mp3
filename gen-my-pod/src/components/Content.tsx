// main content page that will consist of three sections- 
// a side nav for topics, a secondary nav for subjects, and a main content area for the content
import SideNav from './SideNav.tsx';
import SecondaryNav from './SecondaryNav.tsx';

const Content = () => {
  return (
    <div className="main d-flex bg-light">
      <SideNav />
      <SecondaryNav />
      <div className="content w-50">
        <h2>Albert Pujols</h2>
        <p>
          Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et Porter destination Toto remarkable officia Helsinki excepteur Basset hound. Zürich sleepy perfect consectetur.
        </p>
      
      </div>
    </div>
  );
};

export default Content;

