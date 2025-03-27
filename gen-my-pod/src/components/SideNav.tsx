import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CustomCard = styled.div`
  min-width: 25%;
  height: fit-content;
`;

interface SideNavProps {
  onTopicSelect: (topic: string) => void; // Callback function to emit the selected topic
}

const SideNav = ({ onTopicSelect }: SideNavProps) => {
  const [topics, setTopics] = useState<string[]>([]); // State to store the list of topics
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null); // State to track the selected topic

  // Fetch topics from the /list-files endpoint
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:3000/list-files'); // Replace with your endpoint URL
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        setTopics(data); // Assuming the endpoint returns an array of topic strings
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []); // Empty dependency array ensures this runs only once

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic); // Update the selected topic
    onTopicSelect(topic); // Emit the selected topic to the parent
  };

  return (
    <CustomCard className='card overflow-auto'>
      <h5>Your Library</h5>
      <hr />
      <nav className="side-nav">
        <ul>
          {topics.map((topic, index) => (
            <li
              key={index}
              className={selectedTopic === topic ? 'selected' : ''} // Apply 'selected' class if this topic is selected
            >
              <a
                className="clickable"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </CustomCard>
  );
};

export default SideNav;