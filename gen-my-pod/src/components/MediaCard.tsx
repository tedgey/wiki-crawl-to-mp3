import { useEffect, useState } from 'react'
import styled from 'styled-components'

// Styled component for the image
const StyledImage = styled.img`
  max-width: 100%; /* Ensure the image doesn't exceed its container's width */
  max-height: 50vh; /* Ensure the image doesn't exceed its container's height */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px; /* Optional: Add rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
`

interface MediaCardProps {
  topic: string // Add the 'topic' prop
  subject: string // Define the 'subject' prop
}

const MediaCard: React.FC<MediaCardProps> = ({ topic, subject }) => {
  const [text, setText] = useState<string>('Loading...') // State to store the fetched text
  const [imageSrc, setImageSrc] = useState<string>('') // State to store the image URL

  // Remove spaces in the topic and subject
  const formattedTopic = topic.replace(/\s/g, '')
  const formattedSubject = subject.replace(/\s/g, '')

  // Fetch text from the /get-text/:topic/:fileName endpoint
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get-text/${formattedTopic}/${formattedSubject}`
        ) // Replace with your endpoint URL
        if (!response.ok) {
          throw new Error('Failed to fetch text')
        }
        const data = await response.text() // Assuming the endpoint returns plain text
        setText(data) // Update the state with the fetched text
      } catch (error) {
        console.error('Error fetching text:', error)
        setText('Failed to load content.') // Fallback text in case of an error
      }
    }

    fetchText()
  }, [formattedTopic, formattedSubject]) // Re-run the effect when 'topic' or 'subject' changes

  // Fetch image from the /get-image/:topic/:fileName endpoint
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get-image/${formattedTopic}/${subject}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch image')
        }
        const imageBlob = await response.blob()
        const imageUrl = URL.createObjectURL(imageBlob) // Create a local URL for the image
        setImageSrc(imageUrl) // Update the state with the image URL
      } catch (error) {
        console.error('Error fetching image:', error)
        setImageSrc('') // Fallback to an empty string if the image fails to load
      }
    }

    fetchImage()
  }, [formattedTopic, subject]) // Re-run the effect when 'topic' or 'subject' changes

  return (
    <div className='card overflow-auto'>
      <div className='d-flex flex-column align-items-center'>
        <h2>{subject}</h2>
        <StyledImage
          src={imageSrc || 'https://placehold.co/400'} // Use a placeholder if the image fails to load
          alt={subject}
        />
        <div className='p-3'>
          {text} {/* Display the fetched text */}
        </div>
      </div>
    </div>
  )
}

export default MediaCard
