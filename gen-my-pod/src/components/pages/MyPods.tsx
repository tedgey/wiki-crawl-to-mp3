import SideNav from '../SideNav.tsx';
import SecondaryNav from '../SecondaryNav.tsx';
import MediaCard from '../MediaCard.tsx';
import { useState } from 'react';

interface MyPodsProps {
  onMediaSourceUpdate: (topic: string, subject: string) => void; // Function to update MediaPlayer source
}

const MyPods: React.FC<MyPodsProps> = ({ onMediaSourceUpdate }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic); // Update the selected topic
    setSelectedSubject(null); // Reset the selected subject when a new topic is selected
    console.log(`Topic selected: ${topic}`);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject); // Update the selected subject
    console.log(`Subject selected: ${subject}, Topic: ${selectedTopic}`);

    // Update MediaPlayer source when both topic and subject are selected
    if (selectedTopic) {
      const formattedSubject = subject.replace(/\s/g, ''); // Remove spaces from the subject
      onMediaSourceUpdate(selectedTopic, formattedSubject);
    }
  };

  return (
    <div className="main d-flex bg-light">
      {/* Side Navigation for Topics */}
      <SideNav onTopicSelect={handleTopicSelect} />

      {/* Secondary Navigation for Subjects */}
      {selectedTopic && (
        <SecondaryNav topic={selectedTopic} onSubjectSelect={handleSubjectSelect} />
      )}

      {/* Media Wrapper for Content */}
      {selectedTopic && selectedSubject && (
        <MediaCard topic={selectedTopic} subject={selectedSubject} />
      )}
    </div>
  );
};

export default MyPods;