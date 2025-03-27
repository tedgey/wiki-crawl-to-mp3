import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CustomCard = styled.div`
  min-width: 25%;
  height: fit-content;
`;

const StyledListItem = styled.li<{ isSelected: boolean }>`
  a {
    color: ${(props) => (props.isSelected ? '#007bff' : 'inherit')};
    font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
    cursor: pointer;
    text-decoration: ${(props) => (props.isSelected ? 'underline' : 'none')};
  }

  a:hover {
    text-decoration: underline;
  }
`;

interface SecondaryNavProps {
  topic: string;
  onSubjectSelect: (subject: string) => void; // Callback function to emit the selected subject
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ topic, onSubjectSelect }) => {
  const [subjects, setSubjects] = useState<string[]>([]); // State to store the list of subjects
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // State to track the selected subject

  // Fetch subjects from the /list-files/:topic endpoint
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/list-files/${topic}`); // Replace with your endpoint URL
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data); // Assuming the endpoint returns an array of subject strings
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [topic]); // Re-run the effect when the topic changes

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject); // Update the selected subject
    onSubjectSelect(subject); // Emit the selected subject to the parent
  };

  return (
    <CustomCard className="card">
      <div className="d-flex justify-content-between">
        <h5>{topic}</h5>
      </div>

      <hr />
      <nav className="side-nav">
        <ul>
          {subjects.map((subject, index) => (
            <li
              key={index}
              className={selectedSubject === subject ? 'selected' : ''} // Apply 'selected' class if this subject is selected
            >
              <a
                className="clickable"
                onClick={() => handleSubjectClick(subject)} // Emit the subject when clicked
              >
                {subject}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </CustomCard>
  );
};

export default SecondaryNav;