import React from 'react';
// import logo from './logo.svg';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import './App.css';
import axios from 'axios';
import Search from './components/users/Search';
import {Alert} from './components/layout/Alert';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import {About} from './components/pages/About';
import {User} from  './components/users/User';

class  App extends React.Component {

  state={
    users:[],
    user:{},
    loading:false,
    alert:null,
    repos:[]
  }


  searchUsers=(text)=>{

    this.setState({loading:true})
    axios.get(`https://api.github.com/search/users?q=${text}&clientid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    .then(resp=>{
      console.log(resp.data);
      this.setState({users:[...resp.data.items],loading:false})
    
    })


   
  }

  clearUsers=()=>{

    this.setState({users:[],loading:false});
  }

  setAlert=(msg,typ)=>{

    if(msg==="good"){
      this.setState({alert:null})
    }
    else 
    this.setState({alert:{message:msg,type:typ}})


  }

  getUser=async (username)=>{

    this.setState({loading:true})
    axios.get(`https://api.github.com/users/${username}?clientid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    .then(resp=>{
      console.log(resp.data);
      this.setState({user:resp.data,loading:false})
    
    })

  }


  getUserRepo=async (username)=>{

    this.setState({loading:true})
    axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&clientid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    .then(resp=>{
      console.log(resp.data);
      this.setState({repos:resp.data,loading:false})
    
    })

  }

  // componentDidMount(){
  //   this.setState({loading:true})
  //   axios.get(`https://api.github.com/users?clientid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
  //   .then(resp=>{
  //     console.log(resp.data);
  //     this.setState({users:[...resp.data],loading:false})
    
  //   })

  //   console.log(process.env.REACT_APP_GITHUB_CLIENT_ID);
   
  // }
  
  render(){
  return (
    <BrowserRouter>
    <React.Fragment>
      
    <nav className="navbar bg-primary">
      <Navbar ></Navbar>
    </nav>
   
    <div className='container'>
      <Alert alert={this.state.alert}></Alert>

    <Switch>

    <Route 
           path="/"
            exact
            render={(props)=>{
                               return <React.Fragment>
                                      <Search 
                                       searchUsers={this.searchUsers}
                                       clearUsers={this.clearUsers} 
                                       showClear={this.state.users.length>0}
                                       setAlert={this.setAlert}/>
                                      <Users loading={this.state.loading} users={this.state.users}/>
    

      </React.Fragment>
     
    }}/>

 <Route path="/about" exact component={About}></Route>
 <Route path="/user/:username" render={(props)=>{

  return <User {...props} repos={this.state.repos} getUserRepo={this.getUserRepo}getUser={this.getUser} loading={this.state.loading} user={this.state.user} />
}}/>
    </Switch>

    

      </div>
    
    </React.Fragment>
    </BrowserRouter>
    
  );
}
}
export default App;
