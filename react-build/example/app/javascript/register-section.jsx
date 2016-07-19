var React = require('react');
var ReactDOM = require('react-dom');

var RegistrationFeedback = require('registration-feedback');

module.exports = React.createClass({
    handleNameChange: function(event) {
        this.name = event.target.value;
    },
    handleSubmit: function(event) {
        //Sometimes, it's extra work to prevent built-in browser defaults (in this case, reloading the page), but 
        //I think using the right semantic html tags to describe gui structure makes the application easier to understand
        event.preventDefault();
        if(this.name != "")
        {
            this.props.addRegistrant(this.name);
            document.getElementById('registrationForm').reset();
            this.name = "";
        }
    },
    render: function() {
        if(this.props.winners === null)
        {
            return (
                <section className='register'>
                    {function() {
                        if(this.props.participants.length < this.props.balls)
                        {
                            return (
                                <form id='registrationForm' onSubmit={this.handleSubmit}>
                                    <h3>Registration Form</h3>
                                    <label>Name: </label>
                                    <input type='text' id='name' placeholder='Enter your name' maxlength='30' size='30' onChange={this.handleNameChange}/>
                                    <input type='submit' value='Registrer' />
                                </form>
                            );
    
                        }
                        else
                        {
                            return (<h3 className="full">Fully booked. No more registrations!</h3>);
                        }
                    }.call(this)}
                    {function() {
                        if(this.props.lastRegistrant && this.props.lastRegistrant.visible) 
                        {
                            return (
                                <RegistrationFeedback lastRegistrant={this.props.lastRegistrant} hideRegistrant={this.props.hideRegistrant}></RegistrationFeedback>
                            );
                        }
                    }.call(this)}
                </section>
            );
        }
        else
        {
            return false;
        }
    }
});