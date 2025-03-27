import React, { useState, useEffect } from 'react';

const Generate = () => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === 'success') {
        setLoading(false);
        setSuccess('Success! Redirecting...');
        console.log('Files generated successfully:', data);

        // Redirect to /my_pods after a short delay
        setTimeout(() => {
          window.location.href = '/my_pods';
        }, 2000);
      } else if (data.status === 'error') {
        setLoading(false);
        setError(`Error: ${data.error}`);
        console.error('Error generating files:', data.error);
      }
    };

    eventSource.onerror = () => {
      setLoading(false);
      setError('Error with SSE connection.');
      console.error('Error with SSE connection.');
      eventSource.close();
    };

    // Cleanup the EventSource when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Name:', name); // Debugging: Log the `name` state
    console.log('Topic:', topic); // Debugging: Log the `topic` state

    try {
      const response = await fetch('http://localhost:3000/generate-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, topic }),
      });

      console.log('response', response);

      if (response.status !== 200) {
        throw new Error('Failed to generate pod. Please try again.');
      }

      setSuccess('Generating...');
    } catch (err: unknown) {
      setError('An error occurred. Please try again.');
      console.log('Error generating pod:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Generate a Pod</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            type="text"
            className="form-control"
            id="topic"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)} // Correctly update `topic` state
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Correctly update `name` state
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Pod'}
        </button>
      </form>
      {error && <p className="text-danger mt-2">{error}</p>}
      {success && <p className="text-success mt-2">{success}</p>}
    </div>
  );
};

export default Generate;