var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
    handleInfoClick: function() {
        this.props.hideRegistrant();
    },
    render: function() {
        if(this.props.lastRegistrant.number != -1)
        {
            var title = "Successful Registration";
        }
        else
        {
            var title = "Unsuccessful Registration";
        }
        return (   
            <section className='last-registrant' onClick={this.handleInfoClick}>
                <h3>{title}</h3>
                {function() {
                    if(this.props.lastRegistrant.number != -1)
                    {
                        return (
                            
                            <dl>
                                <dt>Name:</dt>
                                <dd>{this.props.lastRegistrant.name}</dd>
                                <dt>Number:</dt>
                                <dd>{this.props.lastRegistrant.number}</dd>
                            </dl>
                        );
                    }
                    else
                    {
                        return (
                            
                            <p>Registrant already exists!</p>
                        );
                    }
                }.call(this)}
            </section>
        );
    }
});