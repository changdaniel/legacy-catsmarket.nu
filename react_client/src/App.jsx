import React from 'react'
import SelectBox from './Search/SelectBox'
import SelectBoxCourses from './Search/SelectBoxCourses'


var coursedata = require('../../python-data/Fall2019_PrunedCoursesDataV2.json');


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			path: coursedata,
			selectedterm:"2019 Fall",
			selectedschool:"",
			selecteddepartment:"",
			selectedcourse:"",
			catalog: null

		}
		this.handleSchoolChange = this.handleSchoolChange.bind(this);
		this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	  }

	handleSchoolChange(event){
		this.setState({
			selectedschool: event.target.value,
			selecteddepartment: "",
	 		selectedcourse: ""
			
		})
	}
	handleDepartmentChange(event){
		this.setState({
			selecteddepartment: event.target.value,
	 		selectedcourse: ""
		})

	}
	handleCourseChange(event){
		this.setState({
	 		selectedcourse: event.target.value
		})
	}
	
	handleSubmit(){
		
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
	
	render() {


		if(this.state.catalog != null){
			const catalog = this.state.catalog[0];
			return(
				<div> 
				<p>Title: {catalog.TITLE}</p>
				<p>Seller Email: {catalog.SELLEREMAIL}</p>
				<p>Price: {catalog.PRICE}</p>
				</div>
			)
		}
		if(this.state.selectedcourse != ""){
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
				<button onClick = {this.handleSubmit}>Submit</button>
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
			//For school box
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


export default App
