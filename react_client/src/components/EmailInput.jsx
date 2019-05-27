import React from 'react 


class SignUpForm extends React.Component {
    constructor() {
      super();
      this.state = {
        email: '',
        password: '',
        touched: {
          email: false,
          password: false,
        },
      };
    }
  
    // ...
  
    handleBlur = (field) => (evt) => {
      this.setState({
        touched: { ...this.state.touched, [field]: true },
      });
    }
  
    render()
      const shouldMarkError = (field) => {
        const hasError = errors[field];
        const shouldShow = this.state.touched[field];
  
        return hasError ? shouldShow : false;
      };
  
      // ...
  
      <input
        className={shouldMarkError('email') ? "error" : ""}
        onBlur={this.handleBlur('email')}
  
        type="text"
        placeholder="Enter email"
        value={this.state.email}
        onChange={this.handleEmailChange}
      />
    }
}

function validate(email, password) {
    // true means invalid, so our conditions got reversed
    return {
      email: email.length === 0,
      password: password.length === 0
    };
  }