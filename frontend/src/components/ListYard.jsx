import React, { useContext } from 'react'
import { Context } from '../main';
import { HiSearch } from 'react-icons/hi';
import '../CSS/listYard.css'

const ListYard = () => {
  // const { topLinks } = useContext(Context);
  // const [title, setTitle] = useState();
  const { topLinks } = useContext(Context);
  const selectedLink = topLinks.find(link => link.selected);


  return (
    <div className='listYard'>
      <div className="container">
        {selectedLink && <h1>{ selectedLink.title }</h1> }

        <div className="search">
          <input type="text" id='search' />
          <label htmlFor="search">
            <HiSearch />
          </label>
        </div>
      </div>
    </div>
  )
}

export default ListYard;