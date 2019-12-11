import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Auth from '../../lib/auth'

import ListName from '../Components/ListName'
import ListEvent from '../Components/ListEvent'
import ListSavedItems from '../Components/ListSavedItems'
import Breadcrumbs from '../Breadcrumbs'

const ListSingle = (props) => {

  //===== VARIABLES =====
  const [data, setData] = useState({})

  //get the userId from token
  const userId = Auth.getUserId()
  //get the userId from URL (useful for future feature where we show a limited version of this page if not logged in)
  // const userUrlId = props.match.params.userId
  //get the listId from URL
  const listId = props.match.params.listId


  const onMount = () => {
    axios.get(`http://localhost:8000/api/lists/${userId}/${listId}`)
      .then(response => {
        setData(response.data)
      })
  }

  console.log(data)

  useEffect(onMount, [])

  return (

    <div className='page'>

      <div className='breadcrumb-container'>
        <Breadcrumbs />
      </div>

      <section className='section columns'>
      <div className='container'>
        <ListName listName={data.listName} listRecipient={data.giftRecipient} />
        <ListEvent listEventName={data.eventName} listEventDate={data.eventDate} listEventReminder={data.eventReminder} />
      </div>
        
      <div className='container'>
        <ListSavedItems  listItemsSaved={data.itemsSaved} />
      </div>
      </section>

    </div>


  )

}

export default ListSingle