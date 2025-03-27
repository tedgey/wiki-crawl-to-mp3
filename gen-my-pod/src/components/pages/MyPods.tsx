import SideNav from '../SideNav.tsx';
import SecondaryNav from '../SecondaryNav.tsx';
import MediaCard from '../MediaCard.tsx';
import { useState } from 'react';

const MyPods = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic); // Update the selected topic
    setSelectedSubject(null); // Reset the selected subject when a new topic is selected
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject); // Update the selected subject
  };

  return (
    <div className="main d-flex bg-light">
      {/* Side Navigation for Topics */}
      <SideNav onTopicSelect={handleTopicSelect} />

      {/* Secondary Navigation for Subjects */}
      {selectedTopic && <SecondaryNav topic={selectedTopic} onSubjectSelect={handleSubjectSelect} />}

      {/* Media Wrapper for Content */}
      {selectedTopic && selectedSubject && (
        <MediaCard topic={selectedTopic} subject={selectedSubject} />
      )}
    </div>
  );
};

export default MyPods;