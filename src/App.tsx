import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import { FaLightbulb,FaSearch } from 'react-icons/fa'
import  Location from './assets/icon-location.svg'
import  twitter from './assets/icon-twitter.svg'
import  website from './assets/icon-website.svg'
import  company from './assets/icon-company.svg'
import  moon from './assets/icon-moon.svg'
import  sun from './assets/icon-sun.svg'
import  search from './assets/icon-search.svg'
import axios from 'axios';
import Colors from './Colors';

const initialState:state = {
  data:[],
  loading:false,
  error:'',
}
type state = {
  data:any[]
  loading:boolean
  error:string
}



type reducerAction = {
  type:string
  payload:any
}

type response = {
  data:any[]
}

type date = {
  year:string
  month:string
  day:string
}

function App() {

  const reducer = (state:state=initialState , action:reducerAction) => {
      switch (action.type) {
        case "FETCH_SUCCESSFUL":
          return {
            ...state,
            data:action.payload,
            loading:false,
            error:''
          };
        case "FETCH_ERROR":
          return {
            ...state,
            data:[],
            loading:false,
            error:action.payload
          }  

      
        default:
          return state
      }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
 const [ep, setep] = useState('')

  const fetchDetails = async(endpoint:string) => {
     await axios.get(`https://api.github.com/users/${endpoint}`).then((res:response) => {
            dispatch({type:"FETCH_SUCCESSFUL", payload:res.data});
            setep('')
       
      }).catch((error) => {
        dispatch({type:"FETCH_ERROR",payload:error})
      });
      
      console.log(state.data);
      
  }

  function destructureDate(date:string){
      var newDate = new Date(date);
      console.log(newDate);
      
      return ` ${newDate.getDay()<10?`0${newDate.getDay()}`:newDate.getDay()}  ${newDate.toString().substring(3,8)} ${newDate.getFullYear()} `
  }
   
  const [darkmode, setDarkmode] = useState(true);
  const theme = darkmode?Colors.dark:Colors.light;

  return (
    <div className="App" style={{backgroundColor:theme.background}}>
      <div className="content">
        <div className="header">
          <span className="title" style={{color:theme.textcolor,fontSize:window.innerWidth < 600?"6vw":"2vw"}}>devfinder</span>
          <div className="darkmode"  onClick={() =>setDarkmode(!darkmode)}>
            <span style={{color:theme.textcolor}} className="b_text">{darkmode?"LIGHT":"DARK"}</span>
            <img src={darkmode?sun:moon} alt="" className="dark_icon" />
          </div>
        </div>
        <div className="search_bar" style={{backgroundColor:theme.element}}>
          <div className='input-section'>
          <img src={search} alt="" className="search_icon" />
          <input onChange={(e) => setep(e.target.value)} type="text" placeholder='Search GitHub User..' className="input" />
          </div>
          <div className="search_button" style={{backgroundColor:theme.buttonColor,color:theme.color}} onClick={() => fetchDetails(ep)}>
            Search
          </div>
        </div>
        <div className="details" style={{backgroundColor:theme.element}}>
        { state.error?(
          <span style={{alignSelf:"center",marginTop:"10vh"}}> User Not found </span>
        ) : (
          <>
        <div className="first_row">
          <div className="inner_row">
          <img src={state.data.avatar_url != null?state.data.avatar_url:"https://avatars.githubusercontent.com/u/583231?v=4"} alt="" className="pic" />
          <div className="name_col">
            <span className="name" style={{color:theme.textcolor}}>{state.data.name?state.data.name:(state.data.login? state.data.login:"The Octocat")}</span>
            <span className="username" style={{color:"blue"}}>@{state.data.login ?? "octocat"}</span>
          </div>
          </div>
          <span className="date">Joined {state.data.created_at? destructureDate(state.data.created_at):"25 Jan 2011"}</span>
        </div>
        <p className="bio">{state.data.bio ?? "This profile has no bio"}</p>
        <div className="github_details" style={{backgroundColor:theme.element}}>
          <div className="social_status" style={{backgroundColor:theme.background}}>
            <div className="property">
              <span className="title" style={{color:theme.textcolor}}>Repos</span>
              <span className="value" style={{color:theme.textcolor}}>{state.data.public_repos ?? 8}</span>
            </div>
            <div className="property">
              <span className="title" style={{color:theme.textcolor}}>Followers</span>
              <span className="value" style={{color:theme.textcolor}}>{state.data.followers ?? 3938}</span>
            </div>
            <div className="property">
              <span className="title" style={{color:theme.textcolor}}>Following</span>
              <span className="value" style={{color:theme.textcolor}}>{state.data.following ?? 9}</span>
            </div>
          </div>
          <div className="persional_details">
            <div className="col1">
                <span style={{color:theme.textcolor}} className="location"><img src={Location} alt="" className="location_image" /> {state.data.location ?? "Not Available"}</span>
                <span style={{color:theme.textcolor}} className="blog"><img src={website} alt="" className="blog_image" /> {state.data.blog ==  "" ? state.data.blog?state.data.blog :"Not Available":"Not Available"}</span>
            </div>
            <div className="col2">
            <span style={{color:theme.textcolor}} className="twitter"><img src={twitter} alt="" className="twitter_image" /> { state.data.twitter_username ?? "Not Available"}</span>
            <span style={{color:theme.textcolor}} className="company"><img src={company} alt="" className="company_image" /> {state.data.company ?? "Not Available"}</span>
            </div>
          </div>
        </div>
        </>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
