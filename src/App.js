import React, {Component} from 'react';
import './App.css';
import axios from "axios";

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      playerName: null,
      playerInfo: {},
      playerStats: {}
    }
  }

handleSubmit = (e) => {
  e.preventDefault();
  this.getPlayerId()
  console.log(this.state.playerName)

}

handleChange = (event) => {
  const replace = event.target.value.split(" ").join("_");
  if(replace.length > 0){
    this.setState({playerName: replace})
  } else {
    alert("Please type players name!")
  }
}

  getPlayerId = () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
    .then(async res => {
       console.log(res.data.data)
      if(res.data.data[0] === undefined){
        alert("This player is either injured or hasn't played yet!")
      } else if(res.data.data.length > 1){
        alert("Pleases specify the name more!")
      } else{
        await this.getPlayerStats(res.data.data[0].id)
        await this.getPlayerName(res.data.data[0].first_name)
        await this.getPlayerName(res.data.data[0].last_name)

      }
    }).catch(err => {
      console.log(err)
    })
  }

  getPlayerName = () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
    .then(async res => {
      console.log(res.data.data)
      this.setState({ playerInfo: res.data.data[0]})
    }).catch(err => {
      console.log(err)
    })
  }



  getPlayerStats = (playerId) => {
    axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022&player_ids[]=${playerId}`)
    .then(async res => {
      console.log(res.data.data)
      this.setState({ playerStats: res.data.data[0]})
    }).catch(err => {
      console.log(err)
    })
  }
  
  render(){
  return (
    <div className="App">
     <form onSubmit={this.handleSubmit}>
       <label>
         <input 
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Please enter players name"
         />
       </label>
       <input type="submit" value="Submit"/>
     </form>
     <div className='player-card'>
        <h2>Name: <span>{this.state.playerInfo["first_name"]} {this.state.playerInfo["last_name"] }</span></h2>
        <h3>Games played: <span>{this.state.playerStats["games_played"]}</span></h3>
        <h3>Points per game: <span>{this.state.playerStats["pts"]}</span></h3>
        <h3>Rebounds per game: <span>{this.state.playerStats["reb"]}</span></h3>
        <h3>Assists per game: <span>{this.state.playerStats["ast"]}</span></h3>
        <h4>Shooting averages: <span>{this.state.playerStats["fg_pct"]} {this.state.playerStats["fg3_pct"]} {this.state.playerStats["ft_pct"]}</span></h4>
     </div>
    </div>
  );
}
}
export default App;