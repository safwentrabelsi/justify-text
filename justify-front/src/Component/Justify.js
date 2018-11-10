import React,{Component} from 'react';
import LogoTicTacTrip from './../assets/tictactrip.png';
import axios from 'axios';
class Justify extends Component {
    componentWillMount() {
        this.justifiedText = ''
        this.setState({
            email:''
        })
        if(localStorage.getItem("token")===null) this.notAuth=true;
    }
    handleChange = (e)=>{
        this.setState({
            email:this.refs.email.value,
        })
    }
    handleChangeJustify = (e)=>{
        this.setState({
            email:e.target.value,
        })
    }
    handeSubmitJustify =  (e)=>{
        e.preventDefault()
            axios.defaults.headers = {
              'Content-Type': 'text/plain',
              'x-access-token': localStorage.getItem('token')
            }
            axios.post('https://justification-text.herokuapp.com/api/justify',this.state.email).then(data=>{ 
                    this.justifiedText=(
                        <div className="container">
                            <div className="post card" >
                                <div className="card-content">
                                    <pre>{data.data}</pre>
                                </div>
                            </div>
                        </div>)
                    this.setState({
                        email:'',
                    },()=>{
                        //Hide Form and Show message on submit
                        document.getElementById("slider").classList.add("closed")
                        document.getElementById("oppositeSlider").classList.add("opened")
                        document.getElementById("showForm").classList.add("opened")
                    })
        })
    }
    
    handeSubmitEmail = (e)=>{
        e.preventDefault()
        
        axios.defaults.headers = {
            'Content-Type': 'application/json'
        }
        axios.post('https://justification-text.herokuapp.com/api/token',this.state).then(data=>{
            if(data.data.token){          
                localStorage.setItem("token",data.data.token)
            }
        })
        this.notAuth=false
        this.setState({
            email:'',
        })
    }
    showForm = ()=>{
        document.getElementById("slider").classList.remove("closed")
        document.getElementById("oppositeSlider").classList.remove("opened")
    }
    newEmail = (e)=>{
        this.notAuth=true;
        localStorage.clear();
        this.setState({
            email:'',
        },()=>{
            document.getElementById("slider").classList.remove("closed")
            document.getElementById("oppositeSlider").classList.remove("opened")
        })
    }
    render(){
        const form = this.notAuth ? (    
            <form  onSubmit={this.handeSubmitEmail} >
                <input type="text" 
                onChange={this.handleChange} 
                ref="email" 
                value={this.state.email} 
                placeholder="Your E-mail"
                pattern="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" 
                required>
                </input>
                <button type="submit" className="btn waves-effect black"  >submit</button>
                </form>): (   
                <form onSubmit={this.handeSubmitJustify} >
                    <textarea rows='1' 
                    className="materialize-textarea" 
                    type="text" 
                    onChange={this.handleChangeJustify} 
                    ref="content" 
                    value={this.state.email}    
                    placeholder="text to justify" required></textarea>
                    <button type="submit" className="btn waves-effect black"  disabled={this.notAuth} >submit</button>
                    <br></br><br></br>
                    <button onClick={this.newEmail} id="showEmail" className="btn waves-effect black"  >New email?</button>
                    
                </form>
                )
        return(
            <div>
            <img src = {LogoTicTacTrip} className="logo center" alt="logo"/>
                <div className="slider" id="slider">
                    {form}
                </div>
                <div className="oppositeSlider" id="oppositeSlider">
                    {this.justifiedText}
                    <br></br>
                    <button onClick={this.newEmail} id="showEmail" className="btn waves-effect black"  >New email?</button>
                    <br></br><br></br>
                    <button onClick={this.showForm} id="showForm" className="btn waves-effect black"  >New message?</button>
                </div>
            </div>
        )
    }
}
export default Justify;