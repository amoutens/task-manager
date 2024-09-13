
import { useState } from 'react';
import deleteIcon from '../../assets/icons8-delete.svg';
import deleteIconHover from '../../assets/icons8-delete.hover.svg'
export const DeleteButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
  return (
    <img onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
     className='edit-delete-btn'
      src={isHovered ? deleteIconHover : deleteIcon}
       alt=''/>
  )
}
