import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled component for the image
const StyledImage = styled.img`
  max-width: 100%; /* Ensure the image doesn't exceed its container's width */
  max-height: 50vh; /* Ensure the image doesn't exceed its container's height */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px; /* Optional: Add rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
`;

interface MediaCardProps {
  topic: string; // Add the 'topic' prop
  subject: string; // Define the 'subject' prop
}

const MediaCard: React.FC<MediaCardProps> = ({ topic, subject }) => {
  const [text, setText] = useState<string>('Loading...'); // State to store the fetched text

  // Remove spaces in the topic and subject
  topic = topic.replace(/\s/g, '');
  subject = subject.replace(/\s/g, '');

  // Fetch text from the /get-text/:topic/:fileName endpoint
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(`http://localhost:3000/get-text/${topic}/${subject}`); // Replace with your endpoint URL
        if (!response.ok) {
          throw new Error('Failed to fetch text');
        }
        const data = await response.text(); // Assuming the endpoint returns plain text
        setText(data); // Update the state with the fetched text
      } catch (error) {
        console.error('Error fetching text:', error);
        setText('Failed to load content.'); // Fallback text in case of an error
      }
    };

    fetchText();
  }, [topic, subject]); // Re-run the effect when 'topic' or 'subject' changes

  return (
    <div className='card'>
      <div className="d-flex flex-column align-items-center">
            <h2>{subject}</h2>
            <StyledImage
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Albert_Pujols_on_May_19%2C_2008.jpg/400px-Albert_Pujols_on_May_19%2C_2008.jpg"
            alt={subject}
            />
            <div className="p-3">
            {text} {/* Display the fetched text */}
            </div>
      </div>
    </div>
  );
};

export default MediaCard;