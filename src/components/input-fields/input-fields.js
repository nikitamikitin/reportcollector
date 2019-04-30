import React, {Component} from 'react';

import './input-fields.css';

export default class InputFields extends Component {

    URL_REGISTRATION = "https://reportscollector.herokuapp.com/createUser";
    URL_LOGIN = "https://reportscollector.herokuapp.com/login";
    userIdLogin = "";
    random = Math.round(Math.random() * 5);
    startTime = 0;
    timeBeforeReport = 0;
    duration = "";



    arr = [{image: (<img alt="img" src={require("../../static/pictures/cat1.jpg")}/>), name: "ca1.jpg"},
        {image: (<img alt="img" src={require("../../static/pictures/cat2.jpg")}/>), name: "cat2.jpg"},
        {image: (<img alt="img" src={require("../../static/pictures/cat3.jpg")}/>), name: "cat3.jpg"},
        {image: (<img alt="img" src={require("../../static/pictures/cat4.jpg")}/>), name: "cat4.jpg"},
        {image: (<img alt="img" src={require("../../static/pictures/cat5.jpg")}/>), name: "cat5.jpg"},
        {image: (<img alt="img" src={require("../../static/pictures/cat5.jpg")}/>), name: "cat5.jpg"}];

    state = {
        email: "",
        password: "",
        fromDateCal: "",
        toDateCal: "",
        dataList: [],
        timeList: [],
        login: false
    };

    constructor(props) {
        super(props);
        this.startTime = new Date().getTime();

    }

    emailCheck = (e) => {
        this.setState({
            email: e.target.value,
        })
    };
    passwordCheck = (e) => {
        this.setState({
            password: e.target.value
        })
    };


    registerUser = () => {
        if(this.state.email==="" &&this.state.password===""){
            alert("Please Enter email and password");
        }else {
            fetch(this.URL_REGISTRATION, {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({
                    "email": this.state.email,
                    "password": this.state.password
                })
            }).then((response) => {
                console.log("Got Response", response.status);
                if (response.status === 200) {
                    alert("Register");
                }

            })
        }
    };
    login = () => {
        if(this.state.email==="" &&this.state.password===""){
            alert("Please Enter email and password");
        }else {
            fetch(this.URL_LOGIN, {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({
                    "email": this.state.email,
                    "password": this.state.password
                })
            }).then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    alert("Login");
                }
                return response.json();
            }).then((body) => {
                this.userIdLogin = body.id;

                this.setState({
                    login: true
                })
            });
        }
    };
    sendReport = () => {
        this.setState({
            userIdLogin: this.props.userIdLogin
        });
        this.timeBeforeReport = new Date().getTime();
        this.duration = (((this.timeBeforeReport - this.startTime) / 1000).toFixed(2)).toString();
        console.log(this.userIdLogin)
        fetch(`https://reportscollector.herokuapp.com/${this.userIdLogin}/collector/report`, {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                "media_name": this.arr[this.random].name,
                "duration": this.duration,
                "displayed_at": this.startTime
            })
        }).then((response) => {
            if(response.status===200){
                alert("Sending Report");
            }
            console.log("Got Response", response.status);
            if (response && response.status === 200) {
                this.startTime = new Date().getTime();
            }
        })
    };
    getReports = () => {
        if(this.state.login ===true) {
            fetch(`https://reportscollector.herokuapp.com/${this.userIdLogin}/getAllReports`, {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
            }).then((response) => {
                return response.json()
            }).then((body) => {
                console.log(this.userIdLogin);
                this.setState({
                    dataList: body
                })
            })
        }
        else alert("Please Login First")
    };

    getReportsByTime = () => {
        if(this.state.fromDateCal==="" || this.state.toDateCal===""){
            alert("Please choose time")
        }else {
            fetch(`https://reportscollector.herokuapp.com/${this.state.fromDateCal}/${this.state.toDateCal}/getAllReportsByTime`, {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
            }).then((response) => {
                return response.json()
            }).then((body) => {
                this.setState({
                    timeList: body
                })
            })
        }
    };
    fromDateCal = (e) => {
        this.setState({
            fromDateCal: (new Date(e.target.value).getTime()).toString()
        });
    };
    toDateCal = (e) => {
        this.setState({
            toDateCal: (new Date(e.target.value).getTime()).toString()
        });
    };


    render() {
        return (
            <div>
                <div className="input-fields">
                    <input onChange={this.emailCheck} type="email" name="" placeholder="Enter your email"/>
                    <input onChange={this.passwordCheck} type="password" name="" placeholder="Enter your password"/>
                    <input onClick={this.registerUser} type="submit" name="" value="Registration"/>
                    <input onClick={this.login} type="submit" name="" value="Login"/>
                </div>
                <div className="image-report">
                    {this.arr[this.random].image}
                    <div className='buttons'>
                        <input onClick={this.sendReport} className="report" type="submit" name="" value="Send Report"/>
                    </div>
                </div>
                <div className="report-list">
                    <div className="time">
                        <span>From</span>
                        <input onChange={this.fromDateCal} type="datetime-local"/>
                        <span>To</span>
                        <input onChange={this.toDateCal} type="datetime-local"/>

                        <div>
                            <input onClick={this.getReports} className="" type="submit" name=""
                                   value="Get Reports By Id"/>
                            <input onClick={this.getReportsByTime} className="" type="submit" name=""
                                   value="Get Reports By Time"/>
                        </div>
                        <ul>
                            {this.state.dataList.map(data => <li key={Math.random() * 10}>
                                {data.media_name},{data.duration},{data.displayed_at}</li>)}
                        </ul>
                        <ul>
                            {this.state.timeList.map(time => <li key={Math.random() * 10}>
                                {time.media_name},{time.displayed_at}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }


};



