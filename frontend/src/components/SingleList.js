import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
// import { useHistory } from 'react-router-dom'
import Auth from '../lib/auth'
import Breadcrumbs from './Breadcrumbs'

require('dotenv').config()
// taken etsy key off so it's not committed to github



const SingleList = (props) => {

  //===== VARIABLES =====
  //variables for getting the list info
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const [cat, setCat] = useState([])
  const [etsy, setEtsy] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [customItems, setCustomItems] = useState([])
  const [editOff, setEditState] = useState(true) //set default to true so it's in non-edit mode
  const [editDate, setDateState] = useState()
  const [editStatus, setStatusState] = useState()
  const editList = {
    user: '',
    listName: '',
    giftRecipient: '',
    eventName: '',
    eventDate: '',
    eventReminder: false,
    budget: ''
  }


  const listHook = () => {
    const userID = props.match.params.userId
    const listID = props.match.params.listId
    axios.get(`http://localhost:8000/api/lists/${userID}/${listID}`)
      .then(response => {
        setData(response.data)
        setCat(response.data.subcategory)
        setStatusState(response.data.listStatus)
        etsyHook(response.data.subcategory[0])
        savedItemsHook(response.data.itemsSaved)
      })

      .catch(err => setErrors(err))
  }

  //This displays 10 of the first category
  //when the other categories are clicked, it then does those
  const etsyHook = (cat) => {
    axios.get(`http://localhost:8000/api/etsy/${cat}`)
      .then(response => {
        setEtsy(response.data.data)
      })
      .catch(err => setErrors(err))
  }

  //variables for editing

  //global variables 
  const userID = props.match.params.userId
  const listID = props.match.params.listId

  //===== POPULATE DATA FROM BACKEND =====
  //for getting the list info
  // const listHook = () => {
  //   axios.get(`http://localhost:8000/api/lists/${userID}/${listID}`)
  //     .then(response => {
  //       setData(response.data)
  //       setCat(response.data.subcategory)
  //       setStatusState(response.data.listStatus)
  //       // etsyHook(response.data.subcategory[0])
  //     })
  //     .catch(err => setErrors(err))
  // }

  const savedItemsHook = (items) => {
    let totalItems = []
    items.forEach((ele, i) => {
      axios.get(`http://localhost:8000/api/items/${ele}`)
        .then(response => {
          let newArray = totalItems.push(response.data)
          // console.log(totalItems)
          setSavedItems(totalItems)
        })
    })
  }

  const customItemHook = () => {
    const userID = props.match.params.userId
    const listID = props.match.params.listId
    axios.get(`http://localhost:8000/api/lists/${userID}/${listID}/customItems`)
      .then(response => setCustomItems(response.data))
      .catch(err => setErrors(err))
  }

  // show 5 
  // we want to spin off the cat into a different component.
  //call the picture as well.
  // console.log(savedItems)


  //===== USER CAN EDIT LIST DETAILS ======
  //the code in the form checks to see if editOff is true (which means the fields are not editable)
  //if it is true, then it calls this function to switch the state and thus display the input fields
  //the save button calls the PUT, then editField to save the changes and set fields back to 'edit'
  //the cancel button ignores any edits and sets fields back to 'non editable'
  function editField(e) {
    setEditState(!editOff)
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
    setErrors({})
  }
  //for putting the edited field back to our database
  function saveEdit(e) {
    e.preventDefault()
    axios.put(`http://localhost:8000/api/lists/${userID}/${listID}`, data, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(setEditState(!editOff))
      .catch(err => console.log(err))
  }
  //for clearing any changes made to the fields
  function cancelEdit(e) {
    e.preventDefault()
    listHook()
    setEditState(!editOff)
  }


  //===== USER CAN ARCHIVE LIST ======
  function archiveList(e) {
    e.preventDefault()
    console.log('archive called')
    axios.put(`http://localhost:8000/api/lists/${userID}/${listID}`, { listStatus: 'Archived' }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(setStatusState('Archived'))
      .catch(err => console.log(err))
  }



  //===============================================
  // need to find better way to handle there being no data in optional fields
  // {data.eventDate && <input className='input' type='date' value={data.eventDate} name='eventDate'  onChange={handleChange} />}
  // {!data.eventDate && <input className='input' type='date' name='eventDate'  onChange={handleChange} />}

  // show 5 

  // console.log(etsy)
  // console.log(cat)
  useEffect(listHook, [])
  useEffect(customItemHook, [])

  if (data === {} || etsy === {} || savedItems === []) return <div>Loading</div>
  return (
    <section className='section'>
      <div className='breadcrumb-container'>
        <Breadcrumbs />
      </div>
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <div className='container'>
              <div className='title'>
                <h1 name='listName' className={`${editOff ? '' : 'not-editable'}`}>{data.listName} <span className='edit-link' onClick={editField}>edit</span></h1>
                <div className={`${editOff ? 'not-editable' : ''}`}>
                  {data.listName && <input className='input' type='text' value={data.listName} name='listName' onChange={handleChange} />}
                  {!data.listName && <input className='input' type='text' name='listName' onChange={handleChange} />}
                </div>
              </div>
              <div className='subtitle'>
                <p className={`edit ${editOff ? '' : 'not-editable'}`}>{data.giftRecipient} <span className='edit-link' onClick={editField}>edit</span></p>
                <div className={`${editOff ? 'not-editable' : ''}`}>
                  {data.giftRecipient && <input className='input' type='text' value={data.giftRecipient} name='giftRecipient' onChange={handleChange} />}
                  {!data.giftRecipient && <input className='input' type='text' name='giftRecipient' onChange={handleChange} />}
                </div>
              </div>
              <div className='subtitle'>
                <p className={`edit ${editOff ? '' : 'not-editable'}`}>{moment(data.eventDate).format('DD-MM-YYYY')}  <span className='edit-link' onClick={editField}>edit</span></p>
                <div className={`${editOff ? 'not-editable' : ''}`}>
                  {data.eventDate && <input className='input' type='date' value={moment(data.eventDate).format('YYYY-MM-DD')} name='eventDate' onChange={handleChange} />}
                  {!data.eventDate && <input className='input' type='date' name='eventDate' onChange={handleChange} />}
                </div>
              </div>
              <div className='subtitle'>
                <p className={`edit ${editOff ? '' : 'not-editable'}`}>{data.eventName}  <span className='edit-link' onClick={editField}>edit</span></p>
                <div className={`${editOff ? 'not-editable' : ''}`}>
                  {data.eventName && <input className='input' type='text' value={data.eventName} name='eventName' onChange={handleChange} />}
                  {!data.eventName && <input className='input' type='text' name='eventName' onChange={handleChange} />}
                </div>
              </div>
            </div>
            <div className={`edit ${editOff ? 'not-editable' : ''}`}>
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
            {editStatus !== 'Archived' && <button className='is-active' onClick={archiveList}>Archive list</button>}
            {editStatus === 'Archived' && <p className='is-archived'>List is archived</p>}
            <div className='container'>
              {cat.map((ele, i) => {
                return (
                  <button key={i} onClick={() => etsyHook(ele)}>{ele}</button>
                )
              })}
            </div>

            <div className='container'>
              <div className='subtitle'>Suggested Gifts</div>
              {etsy.map((ele, i) => {
                return (
                  <p key={i}>{ele.title}</p>
                )
              })}
            </div>
          </div>
        <div className="column">
          <div className="container">
            <div className="subtitle">Saved gifts</div>
            {savedItems.map((ele, i) => {
              return (
                <p key={i}>{ele.productName}</p>
              )
            })}
          </div>
          <div className="container">
            <div className="subtitle">Cutstom Gifts</div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default SingleList