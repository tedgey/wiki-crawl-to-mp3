import { ReactNode } from 'react'

const ContentWrapper = ({ children }: { children: ReactNode }) => {
  return <div className='main d-flex bg-light'>{children}</div>
}

export default ContentWrapper
