
import { useState } from 'react';
import editIcon from '../../assets/icons8-edit.svg'
import editIconHover from '../../assets/icons8-edit.hover.svg'
export const EditButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
  return (
    <img onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='edit-delete-btn'
     src={isHovered? editIconHover : editIcon} alt=''/>
  )
}
