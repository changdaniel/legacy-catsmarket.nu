import React from 'react'
import Searchbox from './Search/SearchBox'



class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			schools: [
				{'':''},
				{'McCormick': [
					{'EECS': ['100','101'],
					 'IEMS': ['200','201']}
					]},
				{'Weinberg':[
					{'BIO': ['300','301'],
					 'PHYS': ['400','401']}
					]},
				{'Bienen':[
					{'VIOLIN': ['500','501'],
					 'VIOLA': ['600','601']}
					]}],
			selectedschool: null,
			selecteddept: null,
			selectedcourse: null

		}
	
		this.handleSchoolChange = this.handleSchoolChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	  }

	handleSchoolChange(event){
		this.setState({selectedschool: event.target.value})
	}
	handleSchoolChange(event){
		this.setState({selecteddept: event.target.value})
	}

	handleSubmit(event){
		alert("The next thing you're going to say is:" + this.state.selectedschool)
		event.preventDefault()
	}

	/* componentDidMount() {
		const promise = fetch('http://localhost:7777/posts')
		promise.then((response) => {
			return response.json()
		}).then((posts) => {
			this.setState({
				'posts': posts
			})
		})
	} */

	render() {
		/* if (this.state.posts === null) {
			return <h2>Loading...</h2>
		}
		else {
			const postElements = this.state.posts.map((post) => {
				return (
					<div>
						<p>{post.body}</p>
						<h6>{post.date}</h6>
					</div>
				)
			})

			return (
				<div>{postElements}</div>
			)
		} */
		//const isschool = (this.state.selectedschool == null)
		const isschool = (this.state.selectedschool == null)
		const isdept = (this.state.selectedschool != null)
		const iscourse = (this.state.selecteddept != null)
		const issubmit = (this.state.selectcourse != null)


		
		/* if (isdept)
		{
			const schoolsElements = this.state.schools.map((school) => {
				
				return (
					
						<option value = {Object.keys(school)}>
						{Object.keys(school)}
						</option>
		
				)	
			}) */
			/* const deptElements = this.state.schools.map((school) => {
			if(Object.keys(school) == this.state.selectedschool){
				school.map((dept) => {
					return (
							<option value = {Object.keys(dept)}>
							{Object.keys(dept)}
							</option>
					)
				})	
				}
			} */
			/* return(
				<div>
				<Searchbox category = "School"
						selected = {this.state.selectedschool}
						elements = {schoolsElements}
						handleChange = {this.handleSchoolChange} 
						handleSubmit = {this.handleSubmit}/>

				<Searchbox category = "Department"
						selected = {this.state.selecteddept}
						elements = {deptElements}
						handleChange = {this.handleDeptChange} 
						handleSubmit = {this.handleSubmit}/>
			</div>
			)
		} */
		
		if(isschool)
		{
			const schoolsElements = this.state.schools.map((school) => {
				return (
						<option value = {Object.keys(school)}>
						{Object.keys(school)}
						</option>
				)
			})
			return(
			
				<Searchbox category = {this.state.selectedschool}
						selected = {this.state.selectedschool}
						elements = {schoolsElements}
						handleChange = {this.handleSchoolChange} 
						handleSubmit = {this.handleSubmit}/>
			)
			}
	}
/* 
		this.state.schools.forEach(function(school){

		});
		return (

			
				<Search category = "Department"
				onChange = {this.handleChange}
				name = {this.state.department.McCormick}
				/>
			
			
			
		);

		}
		
	} */

	/* onAddPost = () => {
		const promise = fetch('http:localhost:777/add-post')
		promise.then((result) => {
			
		})
	} */

}

export default App
