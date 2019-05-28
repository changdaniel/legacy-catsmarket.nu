import React from 'react'
import SelectBox from './components/SelectBox'
import SelectBoxCourses from './components/SelectBoxCourses'
import BuyCatalogLine from './components/BuyCatalogLine'
import SellCatalogLine from './components/SellCatalogLine'
import Confirm from './components/Confirm'
import SellByISBN from './components/SellByISBN'


var coursedata = require('../../python-data/Fall2019_PrunedCoursesDataV2.json');


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			path: coursedata,
			purposes:[
				{"symbol":"Buy"},
				{"symbol":"Sell"}],

			selectedterm:"2019 Fall",
			selectedschool:"",
			selecteddepartment:"",
			selectedcourse:"",
			selectedpurpose:"",

			submittedterm:"2019 Fall",
			submittedschool:"",
			submitteddepartment:"",
			submittedcourse:"",

			submittedpurpose:"",

			submittedorderid:"",
			submittedtitle:"",
			submittedisbn10:"",
			submittedprice:"",

			buymessages:{
				purpose:"Purchase",
				pricegrammar: "For: "
			},
			sellmessages:{
				purpose:"Listing",
				pricegrammar: "At: "
			},
			selectedemail:"",
			isemailvalid: false,

			submittedemail:"",

			selectedisbn10:"",
			isisbnvalid: false,

			catalog: null,
			selectedid: null,

			responsemessage:""
			

		}
		this.handleSchoolChange = this.handleSchoolChange.bind(this);
		this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
		this.handlePurposeChange = this.handlePurposeChange.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);

		this.handleBuy = this.handleBuy.bind(this);
		this.handleSell = this.handleSell.bind(this);
		this.handleISBNSubmit = this.handleISBNSubmit.bind(this);

		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleISBNChange = this.handleISBNChange.bind(this);

		this.handleBuySubmit = this.handleBuySubmit.bind(this);
		this.handleSellSubmit = this.handleSellSubmit.bind(this);

		this.renderSearch = this.renderSearch.bind(this);
		this.renderBuyCatalogList = this.renderBuyCatalogList.bind(this);
		this.renderSellCatalogList = this.renderSellCatalogList.bind(this);
	  }

	handleSchoolChange(event){
		this.setState({
			selectedschool: event.target.value,
			selecteddepartment: "",
			selectedcourse: "",
			selectedpurpose: ""
		})
	}
	handleDepartmentChange(event){
		this.setState({
			selecteddepartment: event.target.value,
			selectedcourse: "",
			selectedpurpose: ""
		})
	}
	handleCourseChange(event){
		this.setState({
	 		selectedcourse: event.target.value,
			selectedpurpose: ""
		})
	}
	handlePurposeChange(event){
		this.setState({
			selectedpurpose: event.target.value
		})
	}
	handleBuy = (price, title, isbn10) => (event) => {
		this.setState({
			submittedprice: price,
			submittedtitle: title,
			submittedisbn10: isbn10
		})
	
	}
	handleSell = (title, isbn10, price) => (event) => {
		this.setState({
			submittedprice: price,
			submittedtitle: title,
			submittedisbn10: isbn10
		})	
	}

	handleEmailChange(event){

		this.setState({
			selectedemail: event.target.value,
			isemailvalid: validateNorthwesternEmail(event.target.value),
			emailerrormessage: 
				validateNorthwesternEmail(event.target.value) ? null : 'Email must be an @u.northwestern.edu email'
		})
	}

	handleISBNChange(event){

		this.setState({
			selectedisbn10: event.target.value,
			isisbnvalid: validateISBN(event.target.value),
			isbnerrormessage: 
				validateISBN(event.target.value) ? null : 'Invalid ISBN10 or ISBN13 (10 or 13 characters)'
		})

	}

	handleISBNSubmit(){

		if(this.state.selectedisbn10.length == 13){

			this.setState({
				submittedisbn10: convertISBN13ToISBN10(this.state.selectedisbn10),
				submittedorderid:"",
				submittedprice:"",
				submittedtitle:"",
			})
			
		}
		else
		{
			this.setState({
				submittedisbn10: this.state.selectedisbn10,
				submittedorderid:"",
				submittedprice:"",
				submittedtitle:"",
				
			})

		}
		
	}

	handleBuySubmit(){

		this.setState({
			submittedemail:this.state.selectedemail
		}, () => {

			fetch('http://localhost:8080/buy', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
				price: this.state.submittedprice,
				isbn10: this.state.submittedisbn10,
				title: this.state.submittedtitle,
				buyeremail: this.state.submittedemail
			})
		}).then((response) => {
				return response.json()
			}).then((data) => {
				this.setState({
					responsemessage: data
				})
				
			})

		});

		
	}

	handleSellSubmit(){

		this.setState({
			submittedemail: this.state.selectedemail
		}, () => {

			fetch('http://localhost:8080/sell', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
				price: this.state.submittedprice,
				isbn10: this.state.submittedisbn10,
				title: this.state.submittedtitle,
				selleremail: this.state.submittedemail,

				term:this.state.selectedterm,
				school: this.state.selectedschool,
				department: this.state.selecteddepartment, 
				course: this.state.selectedcourse

			})
		}).then((response) => {
				return response.json()
			}).then((data) => {
				this.setState({
					responsemessage: data
				})
				
			})
		
		})

		
	}
	

	handleSearchSubmit(){

		this.setState({
			submittedterm:this.state.selectedterm,
			submittedschool:this.state.selectedschool,
			submitteddepartment:this.state.selecteddepartment,
			submittedcourse:this.state.selectedcourse,
			submittedpurpose:this.state.selectedpurpose,

			submittedisbn10:"",
			submittedorderid:"",
			submittedprice:"",
			submittedtitle:"",

			selectedemail:"",
			isemailvalid:false
		})
		
		fetch('http://localhost:8080/get-catalog', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
				term:this.state.selectedterm,
				school: this.state.selectedschool,
				department: this.state.selecteddepartment, 
				course: this.state.selectedcourse
			})
		}).then((response) => {
				return response.json()
			}).then((data) => {
				this.setState({
					catalog: data
				})
				
			})
	}

	renderBuyCatalogList(){
		
		const buyCatalogList = this.state.catalog.map((item) =>
			<BuyCatalogLine 
				key = {item.ORDERID} 
				price = {item.PRICE} 
				title = {item.TITLE}
				isbn10 = {item.ISBN10}
				handleBuy = {this.handleBuy(item.PRICE,item.TITLE,item.ISBN10)}/>
		);

		return buyCatalogList;

	}

	renderSellCatalogList(){

		const sellCatalogList = this.state.catalog.map((item) =>
			
			<SellCatalogLine 
				key = {item.ORDERID} 
				orderid = {item.ORDERID} 
				price = {item.PRICE} 
				title = {item.TITLE}
				isbn10 = {item.ISBN10}
				handleSell = {this.handleSell}/>
			);

		return sellCatalogList;

	}

	renderSearch(){
		if(this.state.selectedpurpose != ""){
			const departments = findDepartments(this.state.selectedschool, this.state.path)
			const courses = findCourses(this.state.selecteddepartment, departments.subjects)
	
			return (
				<div> 
				<SelectBox 
					category = "School"
					selected = {this.state.selectedschool}
					elements = {this.state.path}
					handleChange = {this.handleSchoolChange} 
				/>
				<SelectBox 
					category = "Department"
					selected = {this.state.selecteddepartment}
					elements = {departments.subjects}
					handleChange = {this.handleDepartmentChange} 
				/>
				<SelectBoxCourses
					category = "Courses"
					selected = {this.state.selectedcourse}
					elements = {courses.courses}
					handleChange = {this.handleCourseChange} 
				/>
				<SelectBox
					category = "Purpose"
					selected = {this.state.selectedpurpose}
					elements = {this.state.purposes}
					handleChange = {this.handlePurposeChange}
				/>
				<button onClick = {this.handleSearchSubmit}>Submit</button>
				</div>
			)
		}
		else if(this.state.selectedcourse != ""){
			const departments = findDepartments(this.state.selectedschool, this.state.path)
			const courses = findCourses(this.state.selecteddepartment, departments.subjects)
	
			return (
				<div> 
				<SelectBox 
					category = "School"
					selected = {this.state.selectedschool}
					elements = {this.state.path}
					handleChange = {this.handleSchoolChange} 
				/>
				<SelectBox 
					category = "Department"
					selected = {this.state.selecteddepartment}
					elements = {departments.subjects}
					handleChange = {this.handleDepartmentChange} 
				/>
				<SelectBoxCourses
					category = "Courses"
					selected = {this.state.selectedcourse}
					elements = {courses.courses}
					handleChange = {this.handleCourseChange} 
				/>
				<SelectBox
					category = "Purpose"
					selected = {this.state.selectedpurpose}
					elements = {this.state.purposes}
					handleChange = {this.handlePurposeChange}
				/>
				</div>
			)
		}
		else if(this.state.selecteddepartment != ""){
			const departments = findDepartments(this.state.selectedschool, this.state.path)
			const courses = findCourses(this.state.selecteddepartment, departments.subjects)
	
			return (
				<div> 
				<SelectBox 
					category = "School"
					selected = {this.state.selectedschool}
					elements = {this.state.path}
					handleChange = {this.handleSchoolChange} 
				/>
				<SelectBox 
					category = "Department"
					selected = {this.state.selecteddepartment}
					elements = {departments.subjects}
					handleChange = {this.handleDepartmentChange} 
				/>
				<SelectBoxCourses
					category = "Courses"
					selected = {this.state.selectedcourse}
					elements = {courses.courses}
					handleChange = {this.handleCourseChange} 
				/>
				</div>
			)	
		}
		else if(this.state.selectedschool != ""){
			const departments = findDepartments(this.state.selectedschool, this.state.path)
			return (
				<div> 
				<SelectBox 
					category = "School"
					selected = {this.state.selectedschool}
					elements = {this.state.path}
					handleChange = {this.handleSchoolChange} 
				/>
				<SelectBox
					category = "Department"
					selected = {this.state.selecteddepartment}
					elements = {departments.subjects}
					handleChange = {this.handleDepartmentChange}
				/>
				</div>
			)
		}
		else{
			return (	
			<SelectBox 
				category = "School"
				selected = {this.state.selectedschool}
				elements = {this.state.path}
				handleChange = {this.handleSchoolChange} 
			/>
			)
		}
	}
	
	
	render() {
		
		const search = this.renderSearch()

		if(this.state.submittedtitle != "" && this.state.submittedisbn10 != "" && this.state.submittedtprice != "" && this.state.submittedpurpose == "Buy"){
			
			return(
				<div>
				{search}
				<hr style={{border: "2px solid purple"}}></hr>
				<Confirm
					messages = {this.state.buymessages}
					title = {this.state.submittedtitle}
					isbn10 = {this.state.submittedisbn10}
					price = {this.state.submittedprice}
					handleEmailChange = {this.handleEmailChange}
					handleBuySellSubmit = {this.handleBuySubmit}
					isemailvalid = {this.state.isemailvalid}
					emailerrormessage = {this.state.emailerrormessage}
				/>
				</div>
			)

		}
		else if(
			//this.state.submittedtitle != "" && 
			this.state.submittedisbn10 != "" 
			//&& this.state.submittedtprice != "" 
			&& this.state.submittedpurpose == "Sell"){
			return(
				<div>
				{search}
				<hr style={{border: "2px solid purple"}}></hr>
				<Confirm
					messages = {this.state.sellmessages}
					title = {this.state.submittedtitle}
					isbn10 = {this.state.submittedisbn10}
					price = {this.state.submittedprice}
					handleEmailChange = {this.handleEmailChange}
					handleBuySellSubmit = {this.handleSellSubmit}
					isemailvalid = {this.state.isemailvalid}
					emailerrormessage = {this.state.emailerrormessage}
				/>
				</div>
			)

		}
		else if(this.state.catalog != null && this.state.catalog.length != 0 && this.state.submittedpurpose == "Buy"){
			
			const buyCatalogList = this.renderBuyCatalogList();

			return(
				<div>
				{search}
				<br></br>
				{buyCatalogList}
				</div>
			)
		}
		else if(this.state.catalog != null && this.state.submittedpurpose == "Sell"){
			
			const sellCatalogList = this.renderSellCatalogList();

			return(
				<div>
				{search}
				<br></br>
				<SellByISBN 
				isisbnvalid = {this.state.isisbnvalid}
				isbnerrormessage = {this.state.isbnerrormessage}
				handleISBNChange = {this.handleISBNChange}
				handleISBNSubmit = {this.handleISBNSubmit}
				/>
				{sellCatalogList}
				</div>		
			)
		}
		else{
			
			return(
				search
			)
		}
		
	}
}

function findDepartments(schoolsymbol, schools){

	var result;

	schools.forEach(function(school) {
		if(school.symbol == schoolsymbol)
		{
			result = school;
		}
	})
	return result;
}

function findCourses(departmentsymbol, departments){

	var result;

	departments.forEach(function(department) {
		if(department.symbol == departmentsymbol)
		{
			result = department;
		}
	})
	return result;
}

function validateNorthwesternEmail(email){

	const emaillength = email.length;
	const domain = "@u.northwestern.edu";
	const domainlength = domain.length;

	if(email.substring(emaillength-domainlength, emaillength) == domain){
		return true;
	}
	else{
		return false;
	}

}

function convertISBN13ToISBN10(str) {
    var s;
    var c;
    var checkDigit = 0;
    var result = "";

    s = str.substring(3,str.length);
    for (var i = 10; i > 1; i-- ) {
        c = s.charAt(10 - i);
        checkDigit += (c - 0) * i;
        result += c;
    }
    checkDigit = (11 - (checkDigit % 11)) % 11;
    result += checkDigit == 10 ? 'X' : (checkDigit + "");

    return ( result );
}

function validateISBN(str) {

    var sum,
        weight,
        digit,
        check,
        i;

    if (str.length != 10 && str.length != 13) {
        return false;
    }

    if (str.length == 13) {
        sum = 0;
        for (i = 0; i < 12; i++) {
            digit = parseInt(str[i]);
            if (i % 2 == 1) {
                sum += 3*digit;
            } else {
                sum += digit;
            }
        }
        check = (10 - (sum % 10)) % 10;
        return (check == str[str.length-1]);
    }

    if (str.length == 10) {
        weight = 10;
        sum = 0;
        for (i = 0; i < 9; i++) {
            digit = parseInt(str[i]);
            sum += weight*digit;
            weight--;
        }
        check = 11 - (sum % 11);
        if (check == 10) {
            check = 'X';
        }
        return (check == str[str.length-1].toUpperCase());
    }
}
export default App
